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
  @Prop() day: any;

  @State() date: any;
  @State() badgeTotal: number;

  @Prop() openDay: MonthViewDay;
  @Prop() locale: string;
  @Prop() tooltipPlacement: string;

  @Event() highlightDay: EventEmitter;
  @Event() unhighlightDay: EventEmitter;
  @Event() eventClicked: EventEmitter;
  @Event() dayClicked: EventEmitter;

  // Lifecycle

  componentDidLoad() {
    // this.badgeTotal = 50;
  }

  // Public

  @Method()
  public onEventClick(
    mouseEvent: MouseEvent,
    calendarEvent: CalendarEvent
  ): void {
    console.log('clicked');
    if (mouseEvent.stopPropagation) {
      mouseEvent.stopPropagation();
    }
    this.eventClicked.emit({ event: calendarEvent });
  }

  @Method()
  public onDayClick(
    mouseEvent: MouseEvent,
    calendarEvent: CalendarEvent
  ): void {
    console.log('day clicked');
    if (mouseEvent.stopPropagation) {
      mouseEvent.stopPropagation();
    }
    this.dayClicked.emit({ event: calendarEvent });
  }

  public render() {
    return (
      <div>
        <div class="cal-cell-top" onClick={e => this.onDayClick(e, this.day)}>
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
        <div class="cal-events">
        {this.day.events ? (
          <div>
          {this.day.events.map(ev => (
            <div class="cal-event">
            {ev}
            </div>
            ))}
        </div>
          ) : (
          <div>
            </div>
          )}
            </div>
      </div>
  )}
}
