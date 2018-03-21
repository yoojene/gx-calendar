import {
  Component,
  Prop,
  Event,
  EventEmitter,
  Method,
  State,
  Listen,
} from '@stencil/core';

import {
  CalendarEvent,
  MonthViewDay,
  EVENTS,
  MonthView,
  // GetMonthViewArgs,
} from '../../model/gx-calendar';

// import { startOfDay, addDays } from 'date-fns';
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
  @State() viewDate: Moment = moment();

  /**
   * The first date visible on a given month
   *
   * @type {Moment}
   * @memberof GxCalendarMonthView
   */
  @State() firstVisibleDate: Moment;

  // @State() monthDays: any[] = [];

  /**
   * An array of events to display on view
   * TBC
   */
  events: CalendarEvent[] = EVENTS;

  /**
   * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
   */
  excludeDays: number[] = [];

  /**
   * The locale used to format dates
   */
  @Prop() locale: string;

  /**
   * Visibility of previous and next month buttons
   *
   * @type {boolean}
   * @memberof GxCalendarMonthView
   */
  @Prop() shownavbuttons: boolean;

  /**
   * The start number of the week
   */
  weekStartsOn: number = 1;

  /**
   * Called when the month day cell is clicked
   */
  @Event() monthDayClicked: EventEmitter;
  /**
   *
   * Called when the day cell is pressed
   */
  @Event() dayPressed: EventEmitter;

  /**
   * Called when the event title is clicked
   */
  @Event() eventClicked: EventEmitter;

  /**
   * Called when an event is dragged and dropped
   */
  @Event() eventTimesChanged: EventEmitter;

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

  // Lifecycle

  componentWillLoad() {
    console.log('component will Load');
    console.log(this.events);
    this.refreshHeader();
    this.refreshBody();
  }

  componentDidLoad() {
    console.log(this.shownavbuttons);
    this.setUpGestures();
  }

  // Listeners

  @Listen('dayClicked')
  dayClickedHandler(day: any) {
    console.log(day.detail.event);

    this.monthDayClicked.emit(day.detail);
  }

  // Private

  @Method()
  private setUpGestures(): void {
    const calendar = new Hammer(document.getElementById('calMonthView'));

    calendar.on('swiperight', () => {
      document.getElementById('calPrevMonthButton').click();
    });

    calendar.on('swipeleft', () => {
      document.getElementById('calNextMonthButton').click();
    });
  }

  @Method()
  private refreshHeader(): void {
    let monthHeader = [];
    console.log(moment(this.viewDate).day());

    let fom = moment(this.viewDate).startOf('month');

    let dowIdx = moment(fom).day(); // Get weekday index for first of month;

    this.firstVisibleDate = moment(fom).subtract(dowIdx - 1, 'd'); // should be a Monday

    monthHeader.push({ date: this.firstVisibleDate }); // TODO Need to conform to MonthDayView IF
    console.log(monthHeader);

    for (let x = 1; x < 7; x++) {
      monthHeader.push({
        date: moment(this.firstVisibleDate).add(x, 'd'),
        isPast: true,
        isToday:
          moment(this.viewDate).date() === moment(this.firstVisibleDate).date()
            ? true
            : false,
        isFuture: false,
        inMonth: true,
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
    console.log(monthHeader);

    this.columnHeaders = monthHeader;
  }

  @Method()
  private refreshBody(date?: Moment): void {
    if (!date) {
      date = moment();
    }
    let monthDays = [];

    this.columnHeaders.forEach(el => {
      monthDays.push(el); // First 7 days.
    });

    // Need total 35 days shown, 5 rows of 7 days
    console.log(this.firstVisibleDate);

    let headerLast = this.columnHeaders[6].date; // Last day of the first week

    // Days before today
    for (let x = 1; x < moment(this.viewDate).daysInMonth(); x++) {
      monthDays.push({
        date: moment(headerLast).add(x, 'd'),
        isPast: moment(this.viewDate).date() - x > 4 ? true : false,
        isToday:
          moment(this.viewDate).date() - x === 4 &&
          date.format('YYYY MM DD') === moment().format('YYYY MM DD')
            ? true
            : false,
        isFuture: moment(this.viewDate).date() - x < 4 ? true : false,
        inMonth: true,
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

    this.refreshEvents();
  }

  @Method()
  private refreshEvents(): void {
    // console.log(this.events);
    // console.log(this.view.days);

    for (let x = 0; x < this.view.days.length; x++) {
      this.events.forEach(ev => {

        if (moment(ev.start).isSame(this.view.days[x].date.startOf('day'))) {
          console.log('match');
          this.view.days[x].events = [];
          this.view.days[x].events = [...this.view.days[x].events, ev];  // TODO need to spread this?  Also need to account for when more than 1 event per day
        }
      })
    }

    console.log(this.view.days)
  }

  // Public

  @Method()
  public prevMonth() {
    this.viewDate = moment(this.viewDate).subtract(1, 'M');
    this.refreshHeader();
    this.refreshBody(this.viewDate);
  }

  @Method()
  public nextMonth() {
    this.viewDate = moment(this.viewDate).add(1, 'M');
    this.refreshHeader();
    this.refreshBody(this.viewDate);
  }

  public render() {
    return (
      <div class="cal-month-view">
        <div class="cal-month-view--container">
          <div hidden={this.shownavbuttons}>
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
          <div hidden={this.shownavbuttons}>
            <div class="cal-next-month">
              <button id="calNextMonthButton" onClick={() => this.nextMonth()}>
                {' '}
                Next Month{' '}
              </button>
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
