import type { LucideIcon } from "lucide-react";

// One layout for every empty state in the app: centered icon → headline → one line of body → one action.
export function EmptyState({
  icon: Icon,
  headline,
  body,
  action,
  className = "",
}: {
  icon: LucideIcon;
  headline: string;
  body?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center ${className}`}>
      <Icon className="size-11 text-muted-foreground/60" strokeWidth={1.5} />
      <div className="flex flex-col gap-1">
        <p className="font-medium">{headline}</p>
        {body && <p className="max-w-sm text-sm text-muted-foreground">{body}</p>}
      </div>
      {action}
    </div>
  );
}
