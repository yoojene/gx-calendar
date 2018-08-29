import {
  Component,
  Prop,
  Event,
  EventEmitter,
  State,
  Method,
  Element,
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
  @Event() public showTodaysEvents: EventEmitter;

  @Element() public cell: HTMLElement;

  @State() private events: any;
  private showClass: boolean;
  private cssClass: any;

  // Lifecycle

  public componentDidLoad() {
    if (this.day.isDateSetted) {
      this.cell.classList.add('start-date');
    }
  }

  public componentDidUpdate() {
    if (this.day.isDateSetted) {
      this.cell.classList.add('start-date');
    } else {
      this.cell.classList.remove('start-date');
    }

    if (moment(this.day.date).isSame(moment().startOf('day'))) {
      this.showTodaysEvents.emit({ calendarDay: this.day });
    }
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

  /**
   * Sets the CalendarEvent.cssClass on the host component <newton-calendar-month-view>
   * To allow specific styles to be passed in
   */
  public hostData() {
    if (this.day.events) {
      this.events = this.day.events.filter(ev => {
        if (moment(this.day.date).isBetween(ev.start, ev.end, null, '[]')) {
          return ev.cssClass;
        } else {
          return '';
        }
      });
    }
    if (this.events) {
      this.events.forEach(mt => {
        if (moment(this.day.date).isBetween(mt.start, mt.end, null, '[]')) {
          this.cssClass = mt.cssClass;
          this.showClass = true;
        } else {
          this.cssClass = '';
          this.showClass = false;
        }
      });

      return { class: { [this.cssClass]: this.showClass } };
    }
  }

  public render() {
    return (
      <div>
        <div class='cal-events'>
          {this.day.events ? <div>
            {this.day.events.map(ev => <span class={`cal-event ${ev.meta.class}`} />)}
          </div> : <div />}
        </div>
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
                <div
                  class={`cal-event
                 ${ev.meta.type === `${ev.title}` ? `${ev.meta.class}` : ''}`}
                />
              ))}
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
}
