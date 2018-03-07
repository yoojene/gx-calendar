import {
  Component,
  Prop,
  Event,
  EventEmitter,
  State,
  Method,
} from '@stencil/core';
import moment from 'moment';

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
  start: Date;
  end?: Date;
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
  date: Date;
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

@Component({
  tag: 'gx-calendar-cell',
  styleUrl: 'gx-calendar-cell.css',
  // shadow: true,
})
export class GxCalendarCell {
  // @State() day: MonthViewDay;
  @Prop() day: any;

  @State() date: any;
  @State() badgeTotal: number;

  @Prop() openDay: MonthViewDay;
  @Prop() locale: string;
  @Prop() tooltipPlacement: string;

  // @Prop() customTemplate: TemplateRef<any>;

  @Event() highlightDay: EventEmitter;
  @Event() unhighlightDay: EventEmitter;
  @Event() eventClicked: EventEmitter;

  componentDidLoad() {
    console.log(this.day);
    console.log(this.day.date);

    this.day.date = this.day.date.toDateString(); // Wouldn't render PODO

    this.badgeTotal = 50;
    // TODO Find out if can render object props in JSX/TSX
    // this.day = {
    //   date: new Date(),
    //   isPast: false,
    //   isToday: true,
    //   isFuture: false,
    //   isWeekend: true,
    //   inMonth: true,
    //   badgeTotal: 10,
    // };

    // this.day.badgeTotal = 10;
    // this.day.date = new Date();
  }

  @Method()
  onEventClick(mouseEvent: MouseEvent, calendarEvent: CalendarEvent): void {
    console.log('clicked');
    if (mouseEvent.stopPropagation) {
      mouseEvent.stopPropagation();
    }
    this.eventClicked.emit({ event: calendarEvent });
  }

  render() {
    return (
      <div class="cal-cell-top">
        {this.badgeTotal ? (
          <div>
            <span
              class="cal-day-badge"
              onClick={e => this.onEventClick(e, this.day.date)}
            >
              {this.day.badgeTotal}
            </span>{' '}
            <span class="cal-day-number">
              {moment(this.day.date).format('D')}
            </span>
          </div>
        ) : (
          <span class="cal-day-number">
            {moment(this.day.date).format('D')}
          </span>
        )}
      </div>
    );
  }
}
