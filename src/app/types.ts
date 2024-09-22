import { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

export type ITailwindIcon = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & RefAttributes<SVGSVGElement>
>;

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export type RecurrencePattern = {
  weeklyDays: Array<DayOfWeek>;
  period: number;
  recurrenceType: "weekly" | "monthly";
  startDate: Date;
  endDate: Date;
  includeSelectedDate: boolean;
};
