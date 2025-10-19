import { Bell, FileText, Award, Calendar } from "lucide-react";

export const toDate = (d: string | Date): Date =>
  d instanceof Date ? d : new Date(d);

export const IconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  bell: Bell,
  file: FileText,
  award: Award,
  calendar: Calendar,
};
