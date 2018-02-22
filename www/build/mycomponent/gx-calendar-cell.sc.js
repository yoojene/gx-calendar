/*! Built with http://stenciljs.com */
const { h, Context } = window.mycomponent;

class GxCalendarCell {
    componentDidLoad() {
        this.date = new Date();
        // this.badgeTotal = 50;
        console.log(this.date);
        // this.day = {
        //   date: new Date(),
        //   isPast: false,
        //   isToday: true,
        //   isFuture: false,
        //   isWeekend: true,
        //   inMonth: true,
        //   badgeTotal: 10,
        // };
        // this.day.badgeTotal = 10;
        // this.day.date = new Date();
    }
    render() {
        return (h("div", { class: "cal-cell-top" }, this.badgeTotal ? (h("span", { class: "cal-day-badge" }, this.badgeTotal)) : (h("span", { class: "cal-day-number" }, this.date))));
    }
    static get is() { return "gx-calendar-cell"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return { "badgeTotal": { "state": true }, "date": { "state": true }, "day": { "state": true }, "locale": { "type": String, "attr": "locale" }, "openDay": { "type": "Any", "attr": "open-day" }, "tooltipPlacement": { "type": String, "attr": "tooltip-placement" } }; }
    static get events() { return [{ "name": "highlightDay", "method": "highlightDay", "bubbles": true, "cancelable": true, "composed": true }, { "name": "unhighlightDay", "method": "unhighlightDay", "bubbles": true, "cancelable": true, "composed": true }, { "name": "eventClicked", "method": "eventClicked", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return ""; }
}

export { GxCalendarCell };
