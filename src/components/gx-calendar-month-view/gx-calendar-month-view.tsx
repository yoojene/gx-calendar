import {
  Component,
  Prop,
  Event,
  EventEmitter,
  Method,
  State,
  Listen,
  Watch,
} from '@stencil/core';

import {
  CalendarEvent,
  MonthViewDay,
  MonthView,
  // EVENTS,
} from '../../model/gx-calendar';

import moment, { Moment } from 'moment';
import Hammer from 'hammerjs';

@Component({
  tag: 'gx-calendar-month-view',
  styleUrl: 'gx-calendar-month-view.css',
  // shadow: true,
})
export class GxCalendarMonthView {
  /**
   * The current view date
   */
  @State()
  viewDate: Moment = moment();

  @Prop({ mutable: true })
  public setViewDate: any = null;

  /**
   * The first date visible on a given month
   *
   * @type {Moment}
   * @memberof GxCalendarMonthView
   */
  @State()
  firstVisibleDate: Moment;

  // @State() monthDays: any[] = [];

  /**
   * An array of events to display on view
   * TBC
   */
  @Prop()
  events: CalendarEvent[]; // = EVENTS;

  /**
   *
   * V or H to toggle vertical or horizontal scroll for calendar months
   */
  @Prop()
  public scrolldir: any;

  /**
   * 4, 6, 7 or 8 to control number of rows (weeks) shown per month.  Default is 5
   */
  @Prop()
  public weeksToShow: number;

  /**
   * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
   */
  excludeDays: number[] = [];

  /**
   * The locale used to format dates
   */
  @Prop()
  locale: string;

  /**
   * Visibility of previous and next month buttons
   *
   * @type {boolean}
   * @memberof GxCalendarMonthView
   */
  @Prop()
  shownavbuttons: boolean;

  /**
   * Visibility of previous and next month buttons
   */
  @Prop()
  public customHeader: boolean;

  /**
   * The start number of the week
   */
  weekStartsOn: number = 1;

  /**
   * Called when the month day cell is clicked
   */
  @Event()
  monthDayClicked: EventEmitter;
  /**
   *
   * Called when the day cell is pressed
   */
  @Event()
  dayPressed: EventEmitter;

  /**
   * Called when the event title is clicked
   */
  @Event()
  eventClicked: EventEmitter;

  /**
   * Called when an event is dragged and dropped
   */
  @Event()
  eventTimesChanged: EventEmitter;

  /**
   * Called when month is moved forward in time
   */
  @Event()
  public monthChangeFuture: EventEmitter;

  /**
   * Called when month is moved back in time
   */
  @Event()
  public monthChangePast: EventEmitter;

  /**
   * Displays current days' events
   */
  @Event()
  public todaysCalendarEvents: EventEmitter;

  /**
   * @hidden
   */
  columnHeaders: MonthViewDay[];

  /**
   * @hidden
   */
  @State()
  view: MonthView = (this.view = {
    rowOffsets: [0, 7, 14, 21, 28],
    events: this.events,
    viewDate: this.viewDate,
    weekStartsOn: this.weekStartsOn,
    excluded: this.excludeDays,
    days: [],
  });

  /**
   * @hidden
   */
  openRowIndex: number;

  /**
   * @hidden
   */
  openDay: MonthViewDay;

  /**
   * @hidden
   */
  // refreshSubscription: Subscription;

  // Watches

  @Watch('events')
  eventWatchHandler(newValue: CalendarEvent, oldValue: CalendarEvent) {
    console.log(oldValue);
    console.log(newValue);
  }

  // Lifecycle
  public componentWillLoad() {
    moment.locale(this.locale);

    if (this.setViewDate) {
      this.setViewDate = moment(this.setViewDate);
      this.viewDate = this.setViewDate;
    } else {
      this.viewDate = moment();
    }
    if (this.weeksToShow) {
      this.setupWeeksToShow();
    }
    this.refreshHeader();
    this.refreshBody();
  }

  public componentDidLoad() {
    this.setUpGestures();
  }

  public componentWillUpdate() {
    this.refreshHeader();
    this.refreshBody();
  }

  // Listeners

  @Listen('dayClicked')
  dayClickedHandler(day: any) {
    console.log(day.detail.event);

    this.monthDayClicked.emit(day.detail);
  }

  @Listen('showTodaysEvents')
  public todaysEventsHandler(calendarDay: CustomEvent) {
    this.todaysCalendarEvents.emit(calendarDay);
  }

  // Private
  @Method()
  private setUpGestures(): void {
    const calendar = new Hammer(document.getElementById('calMonthView'));

    calendar.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

    switch (this.scrolldir) {
      case 'H':
        calendar.on('swiperight', () => {
          document.getElementById('calPrevMonthButton').click();
        });

        calendar.on('swipeleft', () => {
          document.getElementById('calNextMonthButton').click();
        });
        break;

      case 'V':
        calendar.on('swipedown', () => {
          document.getElementById('calPrevMonthButton').click();
        });

        calendar.on('swipeup', () => {
          document.getElementById('calNextMonthButton').click();
        });
        break;

      default:
        calendar.on('swiperight', () => {
          document.getElementById('calPrevMonthButton').click();
        });

        calendar.on('swipeleft', () => {
          document.getElementById('calNextMonthButton').click();
        });
    }
  }

  @Method()
  private refreshHeader(): void {
    const monthHeader = [];

    const fom = moment(this.viewDate).startOf('month');
    const dowIdx = moment(fom).day(); // Get weekday index for first of month;
    this.firstVisibleDate = moment(fom).subtract(dowIdx - 1, 'd');

    if (dowIdx === 0) {
      this.firstVisibleDate = moment(this.viewDate).startOf('month');
    }

    monthHeader.push({
      date: this.firstVisibleDate,
      isPast:
        this.firstVisibleDate.dayOfYear() < moment(this.viewDate).dayOfYear()
          ? true
          : false,
      isToday:
        this.firstVisibleDate.dayOfYear() === moment(this.viewDate).dayOfYear()
          ? true
          : false,
      isFuture:
        this.firstVisibleDate.dayOfYear() > this.viewDate.dayOfYear()
          ? true
          : false,
      inMonth:
        this.firstVisibleDate.month() === this.viewDate.month() ? true : false,
      outMonth:
        this.firstVisibleDate.month() === this.viewDate.month() ? false : true,
      isWeekend:
        // tslint:disable-next-line:cyclomatic-complexity
        this.firstVisibleDate.day() === 0 || this.firstVisibleDate.day() === 6
          ? true
          : false,
    });

    for (let x = 1; x < 7; x++) {
      monthHeader.push({
        date: moment(this.firstVisibleDate).add(x, 'd'),
        isPast:
          moment(this.firstVisibleDate)
            .add(x, 'd')
            .dayOfYear() < moment(this.viewDate).dayOfYear()
            ? true
            : false,
        isToday:
          moment(this.viewDate).dayOfYear() ===
          moment(this.firstVisibleDate)
            .add(x, 'd')
            .dayOfYear()
            ? true
            : false,
        isFuture:
          moment(this.firstVisibleDate)
            .add(x, 'd')
            .dayOfYear() > this.viewDate.dayOfYear()
            ? true
            : false,
        inMonth:
          moment(this.firstVisibleDate)
            .add(x, 'd')
            .month() === moment(this.viewDate).month()
            ? true
            : false,
        outMonth:
          moment(this.firstVisibleDate)
            .add(x, 'd')
            .month() === moment(this.viewDate).month()
            ? false
            : true,
        isWeekend:
          moment(this.firstVisibleDate)
            .add(x, 'd')
            .day() === 0 ||
          moment(this.firstVisibleDate)
            .add(x, 'd')
            .day() === 6
            ? true
            : false,
      });
    }
    this.columnHeaders = monthHeader;
  }

  @Method()
  private setupWeeksToShow() {
    switch (this.weeksToShow) {
      case 4:
        this.view.rowOffsets.pop();
        break;
      case 6:
        this.view.rowOffsets.push(35);
        break;
      case 7:
        this.view.rowOffsets.push(35, 42);
        break;
      case 8:
        this.view.rowOffsets.push(35, 42, 49);
        break;
      default:
    }
  }

  @Method()
  private refreshBody(date?: any): void {
    if (!date) {
      // tslint:disable-next-line:no-parameter-reassignment
      date = this.viewDate;
    }
    const monthDays = [];

    this.columnHeaders.forEach(el => {
      monthDays.push(el); // First 7 days.
    });

    // Need total 35 days shown, 5 rows of 7 days
    const headerLast = this.columnHeaders[6].date; // Last day of the first week

    // Days before today
    for (let x = 1; x < 50; x++) {
      // Never more than 50 days shown per month
      monthDays.push({
        date: moment(headerLast).add(x, 'd'),
        isPast: moment(this.viewDate).date() - x > 4 ? true : false, // TODO does not work when you go forward / back a month
        isDateSetted:
          moment(this.setViewDate)
            .startOf('day')
            .unix() ===
          moment(headerLast)
            .add(x, 'd')
            .startOf('day')
            .unix()
            ? true
            : false,
        isToday:
          moment(this.viewDate)
            .startOf('day')
            .unix() ===
            moment(headerLast)
              .add(x, 'd')
              .startOf('day')
              .unix() &&
          moment(this.viewDate)
            .startOf('day')
            .unix() ===
            moment()
              .startOf('day')
              .unix()
            ? true
            : false,
        isFuture:
          moment(this.viewDate).date() - x < 4 // TODO does not work when you go forward / back a month
            ? true
            : false,
        inMonth:
          moment(headerLast)
            .add(x, 'd')
            .month() === moment(this.viewDate).month()
            ? true
            : false,
        // tslint:disable-next-line:cyclomatic-complexity
        outMonth:
          moment(headerLast)
            .add(x, 'd')
            .month() === moment(this.viewDate).month()
            ? false
            : true,
        isWeekend:
          moment(headerLast)
            .add(x, 'd')
            .day() === 0 ||
          moment(headerLast)
            .add(x, 'd')
            .day() === 6
            ? true
            : false,
      });
    }

    this.view.days = monthDays;

    if (this.events) {
      this.refreshEvents();
    }
  }

  @Method()
  private refreshEvents(): void {
    for (let x = 0; x < this.view.days.length; x++) {
      this.events.forEach(ev => {
        if (this.view.days[x].date.isBetween(ev.start, ev.end, null, '[]')) {
          if (!this.view.days[x].events) {
            this.view.days[x].events = [];
          }

          this.events.sort((a, b) => a.meta.order - b.meta.order);
          this.view.days[x].events = [...this.view.days[x].events, ev];
        }
      });
    }
    console.log(this.view.days);
  }

  // Public

  @Method()
  public prevMonth() {
    this.viewDate = moment(this.viewDate).subtract(1, 'M');
    this.monthChangePast.emit(this.viewDate);
  }

  @Method()
  public nextMonth() {
    this.viewDate = moment(this.viewDate).add(1, 'M');
    this.monthChangeFuture.emit(this.viewDate);
  }

  public render() {
    return (
      <div class="cal-month-view">
        <div class="cal-month-view--container">
          <div hidden={!this.shownavbuttons}>
            <div class="cal-prev-month">
              <button id="calPrevMonthButton" onClick={() => this.prevMonth()}>
                {' '}
                Previous Month{' '}
              </button>
            </div>
          </div>
          <div class="cal-header">
            {moment(this.viewDate).format('MMM GGGG')}
          </div>
          <div hidden={!this.shownavbuttons}>
            <div class="cal-next-month">
              <button id="calNextMonthButton" onClick={() => this.nextMonth()}>
                {' '}
                Next Month{' '}
              </button>
            </div>
          </div>
        </div>
        <div hidden={!this.customHeader} class="cal-month-view--container">
          <div hidden={!this.shownavbuttons}>
            <div onClick={() => this.prevMonth()}>
              <slot name="prev-month-button" />
            </div>
          </div>
          <div class="cal-header">
            {moment(this.viewDate).format('MMM GGGG')}
          </div>
          <div hidden={!this.shownavbuttons}>
            <div onClick={() => this.nextMonth()}>
              <slot name="next-month-button" />
            </div>
          </div>
        </div>
        <div class="cal-cell-row cal-header">
          {this.columnHeaders.map(day => (
            <div class="cal-cell">
              {moment(day.date).format('ddd')}
              <div hidden>{moment(day.date).format('d')}</div>
            </div>
          ))}
        </div>
        <div id="calMonthView">
          <div class="cal-days">
            {this.view.rowOffsets.map(rowIdx => (
              <div class="cal-cell-row">
                {this.view.days
                  .map(day => (
                    <div
                      class={`
                    cal-cell
                    ${day.isPast ? ' cal-past' : ''}
                    ${day.inMonth ? ' cal-in-month' : ''}
                    ${day.outMonth ? ' cal-out-month' : ''}
                    ${day.isToday ? ' cal-today' : ''}
                    ${day.isFuture ? ' cal-future' : ''}
                    ${day.isWeekend ? ' cal-weekend' : ''}
                  `}
                    >
                      <gx-calendar-cell day={day} />
                    </div>
                  ))
                  .slice(rowIdx, rowIdx + 7)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
