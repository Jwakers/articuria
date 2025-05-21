export function SubscriptionWrapper({ children }: React.PropsWithChildren) {
  return (
    <div className="to-highlight/5 w-full overflow-hidden rounded-lg border bg-linear-to-r from-background shadow-xs">
      <div className="from-highlight to-highlight-secondary h-1 bg-linear-to-r" />
      {children}
    </div>
  );
}
