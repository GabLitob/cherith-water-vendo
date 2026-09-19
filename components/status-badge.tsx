import { Badge } from "@/components/ui/badge";

export function StatusBadge({ low }: { low: boolean }) {
  return (
    <Badge variant={low ? "destructive" : "ok"}>{low ? "Low water" : "Normal"}</Badge>
  );
}
