import {
  getMonthView,
  GetMonthViewArgs,
  MonthView,
} from '../../model/gx-calendar';

export class GxCalendarUtils {
  getMonthView(args: GetMonthViewArgs): MonthView {
    return getMonthView(args);
  }
}
