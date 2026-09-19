"use client";

import { useEffect, useReducer } from "react";

import { appReducer, formatTime, makeInitialState } from "@/lib/simulation";
import { LoginScreen } from "@/components/screens/login-screen";
import { SetupScreen } from "@/components/screens/setup-screen";
import { DashboardScreen } from "@/components/screens/dashboard-screen";
import { DetailScreen } from "@/components/screens/detail-screen";
import { ConfigureScreen } from "@/components/screens/configure-screen";
import { AlertsScreen } from "@/components/screens/alerts-screen";
import { SettingsListScreen } from "@/components/screens/settings-list-screen";
import { BottomNav } from "@/components/bottom-nav";
import { PushBanner } from "@/components/push-banner";
import { Toast } from "@/components/toast";

const FAHRENHEIT = false;

export function AppShell() {
  const [state, dispatch] = useReducer(appReducer, undefined, makeInitialState);

  useEffect(() => {
    const iv = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: "DISMISS_TOAST" }), 2600);
    return () => clearTimeout(t);
  }, [state.toast]);

  const live = state.notifs.filter((n) => n.status !== "resolved");
  const banner =
    state.screen === "login" || state.screen === "setup"
      ? null
      : (state.notifs.find((n) => n.key === state.banner && n.status === "active") ?? null);
  const sel = state.machines.find((m) => m.id === state.sel) ?? state.machines[0];
  const showNav = state.screen === "dashboard" || state.screen === "alerts" || state.screen === "settingsList";

  return (
    <div className="flex min-h-screen justify-center bg-sidebar">
      <div className="relative flex h-[880px] w-full max-w-[412px] flex-col overflow-hidden bg-app">
        <div className="font-heading flex items-center justify-between px-[18px] pt-3 text-[11px] font-medium text-muted-foreground">
          <span>{formatTime(state.now)}</span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-ok" />
            LIVE
          </span>
        </div>

        {state.screen === "login" && (
          <LoginScreen
            onSignIn={() => dispatch({ type: "SIGN_IN" })}
            onGoSetup={() => dispatch({ type: "GO_SETUP" })}
          />
        )}

        {state.screen === "setup" && (
          <SetupScreen
            step={state.step}
            setup={state.setup}
            onBack={() => dispatch({ type: "SETUP_BACK" })}
            onNext={() => dispatch({ type: "SETUP_NEXT" })}
            onSetText={(field, value) => dispatch({ type: "SET_SETUP_TEXT", field, value })}
            onCountDelta={(delta) => dispatch({ type: "SETUP_COUNT_DELTA", delta })}
            onSetLocation={(index, value) => dispatch({ type: "SET_SETUP_LOCATION", index, value })}
            onSetReminder={(value) => dispatch({ type: "SET_SETUP_REMINDER", value })}
            onTogglePush={() => dispatch({ type: "TOGGLE_SETUP_PUSH" })}
          />
        )}

        {state.screen === "dashboard" && (
          <DashboardScreen
            machines={state.machines}
            now={state.now}
            fahrenheit={FAHRENHEIT}
            activeCount={live.length}
            onOpenMachine={(id) => dispatch({ type: "OPEN_MACHINE", id })}
            onGoAlerts={() => dispatch({ type: "NAV", screen: "alerts" })}
          />
        )}

        {state.screen === "detail" && sel && (
          <DetailScreen
            machine={sel}
            now={state.now}
            fahrenheit={FAHRENHEIT}
            onBack={() => dispatch({ type: "NAV", screen: "dashboard" })}
            onConfigure={() => dispatch({ type: "GO_SETTINGS_FROM_DETAIL" })}
          />
        )}

        {state.screen === "settings" && (
          <ConfigureScreen
            form={state.form}
            onBack={() => dispatch({ type: "BACK_FROM_SETTINGS" })}
            onSetName={(v) => dispatch({ type: "SET_FORM_TEXT", field: "name", value: v })}
            onSetLocation={(v) => dispatch({ type: "SET_FORM_TEXT", field: "location", value: v })}
            onSetReminder={(v) => dispatch({ type: "SET_FORM_REMINDER", value: v })}
            onSave={() => dispatch({ type: "SAVE" })}
          />
        )}

        {state.screen === "alerts" && (
          <AlertsScreen
            notifs={state.notifs}
            onAck={(key) => dispatch({ type: "ACK", key })}
            onSnooze={(key) => dispatch({ type: "SNOOZE", key })}
          />
        )}

        {state.screen === "settingsList" && (
          <SettingsListScreen
            machines={state.machines}
            onConfigure={(id) => dispatch({ type: "CONFIGURE_MACHINE", id })}
          />
        )}

        {showNav && (
          <BottomNav
            screen={state.screen}
            hasActive={live.length > 0}
            onMachines={() => dispatch({ type: "NAV", screen: "dashboard" })}
            onAlerts={() => dispatch({ type: "NAV", screen: "alerts" })}
            onSettings={() => dispatch({ type: "NAV", screen: "settingsList" })}
          />
        )}

        {banner && (
          <PushBanner
            name={banner.name}
            onAck={() => dispatch({ type: "ACK", key: banner.key })}
            onSnooze={() => dispatch({ type: "SNOOZE", key: banner.key })}
          />
        )}

        {state.toast && <Toast message={state.toast} />}
      </div>
    </div>
  );
}
