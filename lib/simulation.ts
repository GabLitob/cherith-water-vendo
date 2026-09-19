/**
 * Client-side demo simulation ported from the Claude Design prototype
 * (design/project/Brook Cherith shadcn.dc.html). No backend — machines go
 * low/recover on a timed script so the UI has something to react to.
 */

export type MachineEvent = {
  day: string;
  time: string;
  label: string;
  kind: "ok" | "low";
};

export type Machine = {
  id: number;
  name: string;
  location: string;
  temp: number;
  low: boolean;
  reminder: number;
  updated: string | null;
  events: MachineEvent[];
};

export type NotifStatus = "active" | "acknowledged" | "snoozed" | "resolved";

export type Notification = {
  key: number;
  mid: number;
  name: string;
  time: string;
  status: NotifStatus;
  remindAt: number | null;
  resolvedAt?: string;
};

export type Screen =
  | "login"
  | "setup"
  | "dashboard"
  | "detail"
  | "settings"
  | "alerts"
  | "settingsList";

export type SetupState = {
  business: string;
  owner: string;
  phone: string;
  count: number;
  locations: string[];
  reminder: number;
  push: boolean;
};

export type FormState = { name: string; location: string; reminder: number };

export type AppState = {
  screen: Screen;
  sel: number;
  t: number;
  uid: number;
  now: Date;
  from: Screen;
  machines: Machine[];
  notifs: Notification[];
  banner: number | null;
  bannerAt: number;
  toast: string | null;
  form: FormState;
  step: number;
  setup: SetupState;
};

const SEED: Array<[string, string, number]> = [
  ["Machine #1", "School Building A", 8.1],
  ["Machine #2", "School Building B", 7.4],
  ["Machine #3", "Canteen Annex", 8.0],
  ["Machine #4", "Gym Lobby", 9.2],
  ["Machine #5", "Library Wing", 8.3],
  ["Machine #6", "Admin Wing", 7.8],
  ["Machine #7", "Covered Court", 8.6],
  ["Machine #8", "Building C Hall", 7.2],
];

const CYCLE = 90;

export function formatTime(d: Date): string {
  let h = d.getHours() % 12;
  if (h === 0) h = 12;
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m} ${d.getHours() < 12 ? "AM" : "PM"}`;
}

export function formatTemp(temp: number, fahrenheit: boolean): string {
  return fahrenheit ? `${((temp * 9) / 5 + 32).toFixed(1)}°F` : `${temp.toFixed(1)}°C`;
}

const scriptCache = new Map<number, { t: number; id: number; low: boolean }[]>();

/**
 * Demo event script scaled to the registered fleet: up to three machines
 * spread across the list each go low, then recover.
 */
function scriptFor(n: number) {
  const cached = scriptCache.get(n);
  if (cached) return cached;
  const picks = [
    ...new Set([
      Math.min(n, 3),
      Math.min(n, Math.max(1, Math.round(n * 0.62))),
      Math.min(n, Math.max(1, n - 1)),
    ]),
  ].slice(0, 3);
  const out: { t: number; id: number; low: boolean }[] = [];
  picks.forEach((id, k) => {
    out.push({ t: 6 + k * 12, id, low: true });
    out.push({ t: 34 + k * 14, id, low: false });
  });
  scriptCache.set(n, out);
  return out;
}

export function makeInitialState(): AppState {
  return {
    screen: "login",
    sel: 3,
    t: 0,
    uid: 1,
    now: new Date(),
    from: "detail",
    machines: SEED.map(([name, location, temp], i) => ({
      id: i + 1,
      name,
      location,
      temp,
      low: false,
      reminder: 30,
      updated: null,
      events:
        i === 2
          ? [
              { day: "Yesterday", time: "3:15 PM", label: "Water restored", kind: "ok" as const },
              { day: "Yesterday", time: "10:40 AM", label: "Low water detected", kind: "low" as const },
            ]
          : [],
    })),
    notifs: [],
    banner: null,
    bannerAt: 0,
    toast: null,
    form: { name: "", location: "", reminder: 30 },
    step: 1,
    setup: { business: "", owner: "", phone: "", count: 4, locations: [], reminder: 30, push: true },
  };
}

export function historyGroups(m: Machine, now: Date) {
  const groups: { day: string; items: { time: string; label: string; kind: "ok" | "low" | "neutral" }[] }[] = [];
  m.events.forEach((e) => {
    const g = groups[groups.length - 1];
    const item = { time: e.time, label: e.label, kind: e.kind as "ok" | "low" };
    if (g && g.day === e.day) g.items.push(item);
    else groups.push({ day: e.day, items: [item] });
  });
  if (!groups.length) {
    groups.push({ day: "Today", items: [{ time: formatTime(now), label: "Monitoring — no events", kind: "neutral" }] });
  }
  return groups;
}

function tick(state: AppState): AppState {
  const t = state.t + 1;
  const now = new Date();
  const cyc = t % CYCLE;
  let uid = state.uid;
  let banner = state.banner;
  let bannerAt = state.bannerAt;

  if (state.screen === "login" || state.screen === "setup") bannerAt = t;
  else if (banner !== null && t - bannerAt >= 7) banner = null;

  const machines = state.machines.map((m) => ({
    ...m,
    temp: Math.min(11, Math.max(5.5, m.temp + (Math.random() - 0.5) * 0.16)),
  }));
  let notifs = state.notifs;

  scriptFor(machines.length)
    .filter((e) => e.t === cyc)
    .forEach((e) => {
      const i = e.id - 1;
      if (!machines[i] || machines[i].low === e.low) return;
      const stamp = formatTime(now);
      machines[i] = {
        ...machines[i],
        low: e.low,
        updated: stamp,
        events: [
          { day: "Today", time: stamp, label: e.low ? "Low water detected" : "Water restored", kind: e.low ? "low" : "ok" },
          ...machines[i].events,
        ],
      };
      if (e.low) {
        const n: Notification = { key: uid++, mid: e.id, name: machines[i].name, time: stamp, status: "active", remindAt: null };
        notifs = [n, ...notifs];
        banner = n.key;
        bannerAt = t;
      } else {
        notifs = notifs.map((n) =>
          n.mid === e.id && n.status !== "resolved" ? { ...n, status: "resolved", resolvedAt: stamp } : n,
        );
        if (banner !== null && !notifs.some((n) => n.key === banner && n.status !== "resolved")) banner = null;
      }
    });

  notifs
    .filter((n) => n.status === "snoozed" && n.remindAt !== null && t >= n.remindAt)
    .forEach((n) => {
      notifs = notifs.map((x) => (x.key === n.key ? { ...x, status: "active" } : x));
      banner = n.key;
      bannerAt = t;
    });

  return { ...state, t, now, machines, notifs, banner, bannerAt, uid };
}

function ack(state: AppState, key: number): AppState {
  return {
    ...state,
    notifs: state.notifs.map((n) => (n.key === key ? { ...n, status: "acknowledged" } : n)),
    banner: state.banner === key ? null : state.banner,
  };
}

function snooze(state: AppState, key: number): AppState {
  const n = state.notifs.find((x) => x.key === key);
  const mins = n ? (state.machines[n.mid - 1]?.reminder ?? 30) : 30;
  return {
    ...state,
    notifs: state.notifs.map((x) => (x.key === key ? { ...x, status: "snoozed", remindAt: state.t + 14 } : x)),
    banner: state.banner === key ? null : state.banner,
    toast: `Reminder set — ${mins} min`,
  };
}

function finishSetup(state: AppState): AppState {
  const u = state.setup;
  const machines: Machine[] = Array.from({ length: u.count }, (_, i) => ({
    id: i + 1,
    name: `Machine #${i + 1}`,
    location: u.locations[i] || "Unassigned location",
    temp: 7.4 + Math.random() * 1.6,
    low: false,
    reminder: u.reminder,
    updated: null,
    events: [],
  }));
  return { ...state, screen: "dashboard", machines, sel: 1, notifs: [], banner: null, toast: "Setup complete" };
}

function save(state: AppState): AppState {
  return {
    ...state,
    screen: state.from || "detail",
    toast: "Changes saved",
    machines: state.machines.map((m) =>
      m.id === state.sel
        ? { ...m, name: state.form.name, location: state.form.location, reminder: state.form.reminder }
        : m,
    ),
  };
}

export type Action =
  | { type: "TICK" }
  | { type: "NAV"; screen: Screen }
  | { type: "SIGN_IN" }
  | { type: "GO_SETUP" }
  | { type: "SETUP_BACK" }
  | { type: "SETUP_NEXT" }
  | { type: "SET_SETUP_TEXT"; field: "business" | "owner" | "phone"; value: string }
  | { type: "SETUP_COUNT_DELTA"; delta: number }
  | { type: "SET_SETUP_LOCATION"; index: number; value: string }
  | { type: "SET_SETUP_REMINDER"; value: number }
  | { type: "TOGGLE_SETUP_PUSH" }
  | { type: "OPEN_MACHINE"; id: number }
  | { type: "GO_SETTINGS_FROM_DETAIL" }
  | { type: "CONFIGURE_MACHINE"; id: number }
  | { type: "BACK_FROM_SETTINGS" }
  | { type: "SET_FORM_TEXT"; field: "name" | "location"; value: string }
  | { type: "SET_FORM_REMINDER"; value: number }
  | { type: "SAVE" }
  | { type: "ACK"; key: number }
  | { type: "SNOOZE"; key: number }
  | { type: "DISMISS_TOAST" };

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "TICK":
      return tick(state);
    case "NAV":
      return { ...state, screen: action.screen };
    case "SIGN_IN":
      return { ...state, screen: "dashboard" };
    case "GO_SETUP":
      return { ...state, screen: "setup", step: 1 };
    case "SETUP_BACK":
      return state.step === 1 ? { ...state, screen: "login" } : { ...state, step: state.step - 1 };
    case "SETUP_NEXT":
      return state.step === 3 ? finishSetup(state) : { ...state, step: state.step + 1 };
    case "SET_SETUP_TEXT":
      return { ...state, setup: { ...state.setup, [action.field]: action.value } };
    case "SETUP_COUNT_DELTA":
      return { ...state, setup: { ...state.setup, count: Math.min(12, Math.max(1, state.setup.count + action.delta)) } };
    case "SET_SETUP_LOCATION": {
      const locations = state.setup.locations.slice();
      locations[action.index] = action.value;
      return { ...state, setup: { ...state.setup, locations } };
    }
    case "SET_SETUP_REMINDER":
      return { ...state, setup: { ...state.setup, reminder: action.value } };
    case "TOGGLE_SETUP_PUSH":
      return { ...state, setup: { ...state.setup, push: !state.setup.push } };
    case "OPEN_MACHINE":
      return { ...state, screen: "detail", sel: action.id };
    case "GO_SETTINGS_FROM_DETAIL": {
      const sel = state.machines[state.sel - 1];
      return {
        ...state,
        screen: "settings",
        from: "detail",
        form: { name: sel.name, location: sel.location, reminder: sel.reminder },
      };
    }
    case "CONFIGURE_MACHINE": {
      const m = state.machines.find((x) => x.id === action.id);
      if (!m) return state;
      return {
        ...state,
        screen: "settings",
        sel: action.id,
        from: "settingsList",
        form: { name: m.name, location: m.location, reminder: m.reminder },
      };
    }
    case "BACK_FROM_SETTINGS":
      return { ...state, screen: state.from || "detail" };
    case "SET_FORM_TEXT":
      return { ...state, form: { ...state.form, [action.field]: action.value } };
    case "SET_FORM_REMINDER":
      return { ...state, form: { ...state.form, reminder: action.value } };
    case "SAVE":
      return save(state);
    case "ACK":
      return ack(state, action.key);
    case "SNOOZE":
      return snooze(state, action.key);
    case "DISMISS_TOAST":
      return { ...state, toast: null };
    default:
      return state;
  }
}
