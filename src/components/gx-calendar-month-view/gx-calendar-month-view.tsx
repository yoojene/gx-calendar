import {
  Component,
  Prop,
  Event,
  EventEmitter,
  // State,
  Method,
} from '@stencil/core';

import {
  CalendarEvent,
  WeekDay,
  MonthViewDay,
  MonthView,
} from '../../model/gx-calendar';
import { GxCalendarUtils } from '../providers/gx-calendar-utils.provider';

@Component({
  tag: 'gx-calendar-month-view',
  styleUrl: 'gx-calendar-month-view.css',
  // shadow: true,
})
export class GxCalendarMonthView {
  /**
   * The current view date
   */
  @Prop() viewDate: Date;

  /**
   * An array of events to display on view
   */
  @Prop() events: CalendarEvent[] = [];

  /**
   * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
   */
  @Prop() excludeDays: number[] = [];

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
  @Prop() weekStartsOn: number;

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
  view: MonthView;

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

  constructor(private gmv: GxCalendarUtils) {}

  componentDidLoad() {
    console.log((this.viewDate = new Date()));
    this.refreshBody();
  }

  @Method()
  refreshBody(): void {
    console.log('refreshing body');
    this.view = this.gmv.getMonthView({
      events: this.events,
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
    });
    console.log(this.view);
    if (this.dayModifier) {
      this.view.days.forEach(day => this.dayModifier(day));
    }
  }

  render() {
    return (
      <div class="cal-days">
        Hello
        <div class="cal-cell-row">
          <gx-calendar-cell />
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
