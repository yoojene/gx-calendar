import {
  Component,
  Prop,
  Event,
  EventEmitter,
  State,
  Method,
} from '@stencil/core';

import {
  CalendarEvent,
  MonthViewDay
} from '../../model/gx-calendar';

import moment from 'moment';


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
