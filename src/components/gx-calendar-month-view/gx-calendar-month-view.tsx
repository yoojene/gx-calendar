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
  WeekDay,
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
  columnHeaders: WeekDay[];

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
    this.refreshBody();
  }

  @Method()
  refreshHeader(): void {}

  @Method()
  refreshBody(): void {
    let monthDays = [];

    for (let x = 0; x < moment(this.viewDate).date(); x++) {
      monthDays.push({
        date: moment(this.viewDate)
          .startOf('month')
          .add(x, 'd'),
        isPast: false,
        isToday: moment(this.viewDate).date() - x === 1 ? true : false,
        isFuture: true,
        inMonth: true,
        isWeekend: false,
        badgeTotal: 100,
      });
    }

    for (
      let x = moment(this.viewDate).date();
      x < moment(this.viewDate).daysInMonth();
      x++
    ) {
      monthDays.push({
        date: moment(this.viewDate)
          .startOf('month')
          .add(x, 'd'),
        isPast: false,
        isToday: false,
        isFuture: true,
        inMonth: true,
        isWeekend:
          moment(this.viewDate)
            .startOf('month')
            .add(x, 'd')
            .day() === 0 ||
          moment(this.viewDate)
            .startOf('month')
            .add(x, 'd')
            .day() === 6
            ? true
            : false,
        badgeTotal: 100,
      });
    }

    this.view.days = monthDays;
  }

  @Method()
  prevMonth() {
    this.viewDate = moment(this.viewDate).subtract(1, 'M');
    this.refreshBody();
  }

  @Method()
  nextMonth() {
    this.viewDate = moment(this.viewDate).add(1, 'M');
    this.refreshBody();
  }

  render() {
    return (
      <div class="cal-month-view">
        <div class="cal-month-view--container">
          <div class="cal-prev-month">
            <button onClick={() => this.prevMonth()}> Previous Month </button>
          </div>
          <div class="cal-header">
            {moment(this.viewDate).format('MMM GGGG')}
          </div>
          <div class="cal-next-month">
            <button onClick={() => this.nextMonth()}> Next Month </button>
          </div>
        </div>
        <div class="cal-cell-row cal-header">
          {this.view.days
            .map(day => (
              <div
                class={{
                  'cal-cell': true,
                  'cal-past': day.isPast,
                  'cal-today': day.isToday,
                  'cal-future': day.isFuture,
                  'cal-weekend': day.isWeekend,
                }}
              >
                {moment(day.date).format('ddd')}
                <div hidden>{moment(day.date).format('d')}</div>
              </div>
              // <div>
              //
              //   </div>
            ))
            .slice(0, 7)
          // .sort((a: any, b: any) => {
          //   return (
          //     a.vchildren[1].vchildren[0].vtext -
          //     b.vchildren[1].vchildren[0].vtext
          //   );
          // })
          }
        </div>
        <div class="cal-days">
          {this.view.rowOffsets.map(rowIdx => (
            <div class="cal-cell-row">
              {this.view.days
                .map(day => (
                  <div>
                    <gx-calendar-cell day={day} />
                  </div>
                ))
                .slice(rowIdx, rowIdx + 7)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
