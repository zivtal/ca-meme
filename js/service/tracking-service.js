const gTracking = {
    offset: {
        start: null,
        end: null,
    },
    radius: null,
    isActive: false,
    change: function () {
        if (!this.offset.end) return {
            x: 0,
            y: 0,
        }
        return {
            x: this.offset.end.x - this.offset.start.x,
            y: this.offset.end.y - this.offset.start.y,
        }
    },
    direction(min = (this.radius) ? this.radius.x * 1.5 : 20) {
        const directions = {};
        if (!this.isPinch) {
            const change = this.change();
            if (change.x && Math.abs(change.x) > min)
                directions.pan = (change.x > 0) ? 'right' : 'left';
            if (change.y && Math.abs(change.y) > min)
                directions.tilt = (change.y > 0) ? 'down' : 'up';
            console.log(directions);
            return directions
        }
    },
    isTouch() {
        return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || navigator.msMaxTouchPoints > 0);
    },
    getPosition(ev) {
        if (this.isPinch) return {
            start: {
                x: ev.touches[0].pageX,
                y: ev.touches[0].pageY,
            },
            end: {
                x: ev.touches[1].pageX,
                y: ev.touches[1].pageY,
            }
        }
        if (!ev.type.includes('mouse')) ev = ev.changedTouches[0];
        return {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop,
        };
    },
    start(ev, _this = gTracking) {
        ev.preventDefault();
        ev.stopPropagation();
        _this.isActive = true;
        _this.radius = null;
        _this.isPinch = (ev.touches) ? (ev.touches.length === 2) : false;
        if (ev.touches) _this.radius = {
            x: ev.touches[0].radiusX,
            y: ev.touches[0].radiusY,
        };
        _this.offset.end = null;
        _this.offset
        _this.offset.start = _this.getPosition(ev);
    },
    move(ev, _this = gTracking) {
        if (_this.isActive) _this.offset.end = _this.getPosition(ev);
    },
    stop(_this = gTracking) {
        _this.isActive = false;
        _this.offset.start = null;
        _this.offset.end = null;
    },
}
