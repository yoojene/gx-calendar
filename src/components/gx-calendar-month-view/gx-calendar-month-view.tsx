import {
  Component,
  Prop,
  Event,
  EventEmitter,
  // State,
  Method,
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

import { startOfDay, addDays } from 'date-fns';
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
  // @Prop()
  viewDate: Date = new Date();

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
  view: MonthView = (this.view = {
    events: this.events,
    viewDate: this.viewDate,
    weekStartsOn: this.weekStartsOn,
    excluded: this.excludeDays,
    days: [
      {
        date: addDays(startOfDay(new Date()), 1),
        isPast: false,
        isToday: false,
        isFuture: true,
        inMonth: true,
        isWeekend: false,
        badgeTotal: 1,
      },
      {
        date: addDays(startOfDay(new Date()), 2),
        isPast: false,
        isToday: false,
        isFuture: true,
        inMonth: true,
        isWeekend: false,
        badgeTotal: 1,
      },
      {
        date: addDays(startOfDay(new Date()), 3),
        isPast: false,
        isToday: false,
        isFuture: true,
        inMonth: true,
        isWeekend: false,
        badgeTotal: 1,
      },
    ],
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

  componentDidLoad() {
    console.log((this.viewDate = new Date()));
    // this.view;
    this.refreshBody();
  }

  @Method()
  refreshBody(): void {
    console.log('refreshing body');

    console.log(this.view);
    // console.log(this.dayModifier);
    // if (this.dayModifier) {
    //   console.log('here');
    //   this.view.days.forEach(day => this.dayModifier(day));
    // }
  }

  // getMonthView(args: GetMonthViewArgs): MonthView {
  //   console.log(args);
  //   for (let x = 0; x < 2; x++) {
  //     return this.getMonthView(args);
  //   }
  // }

  render() {
    return (
      <div class="cal-month-view">
        <div class="cal-cell-row cal-header">
          {this.view.days.map(day => (
            <div class="cal-cell">
              {/* // *ngFor="let day of days" // [class.cal-past]="day.isPast" //
              [class.cal-today]="day.isToday" //
              [class.cal-future]="day.isFuture" //
              [class.cal-weekend]="day.isWeekend"> */}
              {day.date}
            </div>
          ))}
        </div>
        <div class="cal-days">
          Hello
          <div class="cal-cell-row">
            {this.view.days.map(day => (
              <div>
                {/* {day} */}
                <gx-calendar-cell day={day} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
    //   {this.view.rowOffsets.map(() => <div class="cal-cell-row">
    //       <gx-calendar-cell />
    //       )});
    //     </div>)}
    // </div>;
  }
}
