export function SubscriptionWrapper({ children }: React.PropsWithChildren) {
  return (
    <div className="to-highlight/5 w-full overflow-hidden rounded-lg border bg-gradient-to-r from-background shadow-sm">
      <div className="from-highlight to-highlight-secondary h-1 bg-gradient-to-r" />
      {children}
    </div>
  );
}
