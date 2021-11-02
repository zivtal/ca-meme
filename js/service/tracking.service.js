const gTracking = {
    offset: { start: null, end: null },
    shift: { x: 0, y: 0 },
    radius: null,
    isActive: false,
    isPinch: false,
    change() {
        if (!this.offset.end) return { x: 0, y: 0 }
        return {
            x: this.offset.end.x - (this.offset.start.x - this.shift.x),
            y: this.offset.end.y - (this.offset.start.y - this.shift.y),
        }
    },
    direction(min = (this.radius) ? this.radius.x * 1.5 : 20) {
        const directions = {};
        if (!this.isPinch) {
            if (this.change().x && Math.abs(this.change().x) > min)
                directions.pan = (this.change.x > 0) ? 'right' : 'left';
            if (this.change().y && Math.abs(this.change().y) > min)
                directions.tilt = (this.change().y > 0) ? 'down' : 'up';
            return directions
        }
    },
    isTouch() {
        return ('ontouchstart' in window);
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
            x: ev.pageX - ev.target.offsetLeft - this.shift.x,
            y: ev.pageY - ev.target.offsetTop - this.shift.y,
        };
    },
    start(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.isActive = true;
        this.radius = null;
        this.offset.start = null;
        this.offset.end = null;
        this.shift = { x: 0, y: 0 }
        this.isPinch = (ev.touches) ? (ev.touches.length === 2) : false;
        if (ev.touches) this.radius = {
            x: ev.touches[0].radiusX,
            y: ev.touches[0].radiusY,
        };
        if (this.isPinch) {
            this.offset = this.getPosition(ev);
        } else {
            this.offset.start = this.getPosition(ev);
        }
    },
    move(ev) {
        if (this.isActive) {
            if (this.isPinch) {
                this.offset = this.getPosition(ev);
            } else {
                this.offset.end = this.getPosition(ev);
            }
        }
    },
    stop() {
        this.isActive = false;
    },
}
