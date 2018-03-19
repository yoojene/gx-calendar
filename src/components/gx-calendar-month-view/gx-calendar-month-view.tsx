import {
  Component,
  Prop,
  Event,
  EventEmitter,
  // State,
  Method,
  State,
  // State,
} from '@stencil/core';

import {
  CalendarEvent,
  MonthViewDay,
  // MonthView,
  EVENTS,
  MonthView,
  // GetMonthViewArgs,
} from '../../model/gx-calendar';

// import { startOfDay, addDays } from 'date-fns';
import moment, { Moment } from 'moment';
// import { GxCalendarUtils } from '../providers/gx-calendar-utils.provider';

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
   */
  // @Prop()
  // events: CalendarEvent[] = [];
  events: CalendarEvent[] = EVENTS;

  /**
   * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
   */
  //@Prop()
  excludeDays: number[] = [];

  /**
   * Whether the events list for the day of the `viewDate` option is visible or not
   */
  @Prop() activeDayIsOpen: boolean = false;

  /**
   * A function that will be called before each cell is rendered. The first argument will contain the calendar cell.
   * If you add the `cssClass` property to the cell it will add that class to the cell in the template
   */
  @Prop() dayModifier: Function;

  /**
   * An observable that when emitted on will re-render the current view
   */
  // @Prop() refresh: Subject<any>;

  /**
   * The locale used to format dates
   */
  @Prop() locale: string;

  /**
   * The placement of the event tooltip
   */
  @Prop() tooltipPlacement: string = 'top';

  /**
   * The start number of the week
   */
  //@Prop()
  weekStartsOn: number = 1;

  /**
   * Called when the day cell is clicked
   */
  @Event() dayClicked: EventEmitter;
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
  columnHeaders: any[];

  /**
   * @hidden
   */
  // @State()
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

  // constructor(private gmv: GxCalendarUtils) {}

  componentWillLoad() {
    this.refreshHeader();
    this.refreshBody();
  }

  @Method()
  refreshHeader(): void {
    let monthHeader = [];
    console.log(moment(this.viewDate).day());

    let fom = moment(this.viewDate).startOf('month');

    let dowIdx = moment(fom).day(); // Get weekday index for first of month;

    // console.log(dowIdx);

    this.firstVisibleDate = moment(fom).subtract(dowIdx - 1, 'd'); // should be a Monday

    // console.log(firstHeader.format('ddd')); // should be Sunday
    // console.log(firstHeader.format('YYYY-MM-DD')); // should be 25th Feb

    monthHeader.push({ date: this.firstVisibleDate });
    console.log(monthHeader);

    for (let x = 1; x < 7; x++) {
      monthHeader.push({
        date: moment(this.firstVisibleDate).add(x, 'd'),
        isPast: true,
        isToday: moment(this.viewDate).date() === moment(this.firstVisibleDate).date() ? true : false,
        isFuture: false,
        inMonth: true,
        isWeekend: moment(this.firstVisibleDate).add(x, 'd')
          .day() === 0 ||
          moment(this.firstVisibleDate).add(x, 'd')
            .day() === 6
          ? true
          : false,
      });
    }
    console.log(monthHeader);

    this.columnHeaders = monthHeader;
  }

  @Method()
  refreshBody(): void {
    let monthDays = [];

    this.columnHeaders.forEach(el => {
      // const merged = Object.assign({}, el, {badgeTotal: 100});
      monthDays.push(el);  // First 7 days.
    })

    // Need total 35 days shown, 5 rows of 7 days
    console.log(this.firstVisibleDate);

    let headerLast = this.columnHeaders[6].date; // Last day of the first week

    // Days before today
    for (let x = 1; x < moment(this.viewDate).daysInMonth(); x++) {
      monthDays.push({
        date: moment(headerLast).add(x, 'd'),
        isPast: moment(this.viewDate).date() - x > 4 ? true : false,
        isToday: moment(this.viewDate).date() - x === 4 ? true : false,
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
    console.log(monthDays)
    this.view.days = monthDays;
  }

  @Method()
  prevMonth() {
    this.viewDate = moment(this.viewDate).subtract(1, 'M');
    this.refreshHeader();
    this.refreshBody();
  }

  @Method()
  nextMonth() {
    this.viewDate = moment(this.viewDate).add(1, 'M');
    this.refreshHeader();
    this.refreshBody();
  }

  render() {
    return <div class="cal-month-view">
        <div class="cal-month-view--container">
          <div class="cal-prev-month">
            <button onClick={() => this.prevMonth()}>
              {' '}
              Previous Month{' '}
            </button>
          </div>
          <div class="cal-header">
            {moment(this.viewDate).format('MMM GGGG')}
          </div>
          <div class="cal-next-month">
            <button onClick={() => this.nextMonth()}> Next Month </button>
          </div>
        </div>
        {/* <div class="cal-cell-row cal-header">
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
                {moment(day.date).format('ddd')}
                <div hidden>{moment(day.date).format('d')}</div>
              </div>
            ))
            .slice(0, 7)}
        </div> */}
        <div class="cal-cell-row cal-header">
          {this.columnHeaders.map(day => <div class="cal-cell">
              {moment(day.date).format('ddd')}
              <div hidden>{moment(day.date).format('d')}</div>
            </div>)}
        </div>
        <div class="cal-days">
          {this.view.rowOffsets.map(rowIdx => <div class="cal-cell-row">
              {this.view.days
                .map(day => <div class={`
                   cal-cell
                   ${day.isPast ? ' cal-past' : ''}
                   ${day.isToday ? ' cal-today' : ''}
                   ${day.isFuture ? ' cal-future' : ''}
                   ${day.isWeekend ? ' cal-weekend' : ''}
                 `}>
                    <gx-calendar-cell day={day} />
                  </div>)
                .slice(rowIdx, rowIdx + 7)}
            </div>)}
        </div>
      </div>;
  }
}
