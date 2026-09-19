export function Toast({ message }: { message: string }) {
  return (
    <div className="animate-sc-fade absolute right-[18px] bottom-[92px] left-[18px] z-[15] rounded-alert bg-primary px-4 py-3 text-center text-[13px] font-medium text-primary-foreground shadow-lg">
      {message}
    </div>
  );
}
