import {
  getMonthView,
  GetMonthViewArgs,
  MonthView,
} from '../../model/gx-calendar';

export class GxCalendarUtils {
  getMonthView(args: GetMonthViewArgs): MonthView {
    return getMonthView(args);
  }

  // TODO

  // Calculate where this.viewDate is in current month, day of month

  // Calculate where this.viewDate is in current week, day of week
}
