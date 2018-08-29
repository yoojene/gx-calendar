import moment from 'moment';
import { CalendarEvent } from '../model/gx-calendar'

// Calendar

// Colors - maybe to be deprecated

const colors: any = {
  mauve: {
    primary: '#d0576e',
    secondary: '#FAE3E3',
  },
  green: {
    primary: '#32db64',
    secondary: '#FAE3E3',
  },
  white: {
    primary: '#FFFFFF',
    secondary: '#FAE3E3',
  },
  black: {
    primary: '#000000',
    secondary: '#FAE3E3',
  },
  grey: {
    primary: '#C0C0C0',
    secondary: '#FAE3E3',
  },
};
// Events
const calendarEventsConfig: CalendarEvent[] = [
  {
    start: moment().startOf('day'),
    end: moment().endOf('day'),
    title: 'Blood Appointment',
    color: colors.black,
    actions: null,
    meta: {
      type: 'appointment',
      icon: 'walk',
    },
  },
  {
    start: moment()
      .startOf('day')
      .subtract(4, 'd'),
    end: moment()
      .endOf('day')
      .subtract(4, 'd'),
    title: 'Reminder',
    color: colors.green,
    actions: null,
    meta: {
      type: 'reminder',
      class: 'newton-icon-pill',
    },
  },
  {
    start: moment()
      .startOf('day')
      .subtract(4, 'd'),
    end: moment()
      .endOf('day')
      .subtract(4, 'd'),
    title: 'Forgotton Ibrance',
    color: colors.black,
    actions: null,
    meta: {
      type: 'medication',
      icon: 'happy',
    },
  },
  {
    start: moment()
      .startOf('day')
      .subtract(5, 'd'),
    end: moment()
      .endOf('day')
      .subtract(5, 'd'),
    title: 'Forgotton AI',
    color: colors.black,
    actions: null,
    meta: {
      type: 'medication',
      icon: 'happy',
    },
  },
];


export { calendarEventsConfig };
