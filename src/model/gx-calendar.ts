// import { startOfDay, endOfDay, subDays } from 'date-fns';
import moment, {Moment} from 'moment';

export interface EventColor {
  primary: string;
  secondary: string;
}

export interface EventAction {
  label: string;
  cssClass?: string;
  onClick({ event }: { event: CalendarEvent }): any;
}

export interface CalendarEvent<MetaType = any> {
  start: Moment;
  end?: Moment;
  title: string;
  color: EventColor;
  actions?: EventAction[];
  allDay?: boolean;
  cssClass?: string;
  resizable?: {
    beforeStart?: boolean;
    afterEnd?: boolean;
  };
  draggable?: boolean;
  meta?: MetaType;
}

export interface WeekDay {
  date: Moment;
  isPast: boolean;
  isToday: boolean;
  isFuture: boolean;
  isWeekend: boolean;
}

export interface MonthViewDay extends WeekDay {
  inMonth: boolean;
  events?: CalendarEvent[];
  backgroundColor?: string;
  cssClass?: string;
  badgeTotal: number;
}

export interface MonthView {
  rowOffsets: number[];
  days?: MonthViewDay[];
  totalDaysVisibleInWeek?: number;
  events?: CalendarEvent[];
  viewDate: Moment;

  weekStartsOn: number;
  excluded?: number[];
}

export interface GetMonthViewArgs {
  events?: CalendarEvent[];
  viewDate: Date;
  weekStartsOn: number;
  excluded?: number[];
  viewStart?: Date;
  viewEnd?: Date;
}
// export declare function getMonthView({
//   events,
//   viewDate,
//   weekStartsOn,
//   excluded,
//   viewStart,
//   viewEnd,
// }: GetMonthViewArgs): MonthView;

const colors: any = {
  mauve: {
    primary: '#d0576e',
    secondary: '#FAE3E3',
  },
  green: {
    primary: '#32db64',
    secondary: '#FAE3E3',
  },
  white: {
    primary: '#FFFFFF',
    secondary: '#FAE3E3',
  },
  black: {
    primary: '#000000',
    secondary: '#FAE3E3',
  },
  grey: {
    primary: '#C0C0C0',
    secondary: '#FAE3E3',
  },
};

// Dummy calendar events
export const EVENTS: CalendarEvent[] = [
  {
    start: moment().startOf('day'),
    end: moment().endOf('day'),
    title: '435 Pasos',
    color: colors.black,
    actions: null,
    meta: {
      type: 'activity',
      icon: 'walk',
    },
  },
  {
    start: moment().startOf('day').subtract(4, 'd'),
    end: moment().endOf('day').subtract(4, 'd'),
    title: '3 pastillas de Advil',
    color: colors.green,
    actions: null,
    meta: {
      type: 'medicines',
      class: 'newton-icon-pill',
    },
  },
  {
    start: moment().startOf('day').subtract(4, 'd'),
    end: moment().endOf('day').subtract(4, 'd'),
    title: 'Me siento desesperada',
    color: colors.black,
    actions: null,
    meta: {
      type: 'emotions',
      icon: 'happy',
    },
  },
];
