export type CalendarDay = {
  date: string;
  events: Array<{
    id: string;
    name: string;
    time: string;
    datetime: string;
    href: string;
  }>;
  isCurrentMonth: boolean;
  isToday?: boolean;
  isSelected?: boolean;
};
