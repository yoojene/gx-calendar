/**
 * This is an autogenerated file created by the Stencil build process.
 * It contains typing information for all components that exist in this project
 * and imports for stencil collections that might be configured in your stencil.config.js file
 */

import {
  MonthViewDay,
} from './components/gx-calendar-cell/gx-calendar-cell';

declare global {
  interface HTMLStencilElement extends HTMLElement {
    componentOnReady(): Promise<this>;
    componentOnReady(done: (ele?: this) => void): void;
  }
}



import {
  GxCalendarCell as GxCalendarCell
} from './components/gx-calendar-cell/gx-calendar-cell';

declare global {
  interface HTMLGxCalendarCellElement extends GxCalendarCell, HTMLStencilElement {
  }
  var HTMLGxCalendarCellElement: {
    prototype: HTMLGxCalendarCellElement;
    new (): HTMLGxCalendarCellElement;
  };
  interface HTMLElementTagNameMap {
    "gx-calendar-cell": HTMLGxCalendarCellElement;
  }
  interface ElementTagNameMap {
    "gx-calendar-cell": HTMLGxCalendarCellElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "gx-calendar-cell": JSXElements.GxCalendarCellAttributes;
    }
  }
  namespace JSXElements {
    export interface GxCalendarCellAttributes extends HTMLAttributes {
      day?: any;
      locale?: string;
      openDay?: MonthViewDay;
      tooltipPlacement?: string;
    }
  }
}


import {
  GxCalendarMonthView as GxCalendarMonthView
} from './components/gx-calendar-month-view/gx-calendar-month-view';

declare global {
  interface HTMLGxCalendarMonthViewElement extends GxCalendarMonthView, HTMLStencilElement {
  }
  var HTMLGxCalendarMonthViewElement: {
    prototype: HTMLGxCalendarMonthViewElement;
    new (): HTMLGxCalendarMonthViewElement;
  };
  interface HTMLElementTagNameMap {
    "gx-calendar-month-view": HTMLGxCalendarMonthViewElement;
  }
  interface ElementTagNameMap {
    "gx-calendar-month-view": HTMLGxCalendarMonthViewElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "gx-calendar-month-view": JSXElements.GxCalendarMonthViewAttributes;
    }
  }
  namespace JSXElements {
    export interface GxCalendarMonthViewAttributes extends HTMLAttributes {
      locale?: string;
      shownavbuttons?: boolean;
    }
  }
}


import {
  MyComponent as MyComponent
} from './components/my-component/my-component';

declare global {
  interface HTMLMyComponentElement extends MyComponent, HTMLStencilElement {
  }
  var HTMLMyComponentElement: {
    prototype: HTMLMyComponentElement;
    new (): HTMLMyComponentElement;
  };
  interface HTMLElementTagNameMap {
    "my-component": HTMLMyComponentElement;
  }
  interface ElementTagNameMap {
    "my-component": HTMLMyComponentElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "my-component": JSXElements.MyComponentAttributes;
    }
  }
  namespace JSXElements {
    export interface MyComponentAttributes extends HTMLAttributes {
      first?: string;
      last?: string;
    }
  }
}

declare global { namespace JSX { interface StencilJSX {} } }
