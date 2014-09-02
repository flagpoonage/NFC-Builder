
module NFC.Controls {
    export class Navigate {
        container: NFC.Controls.Container;
        workspace: NFC.Workspace;
        eventListeners: NFCEventListeners;
        constructor(options: NFCControlOptions) {
            this.container = options.container;
            this.workspace = options.workspace;
        }

        bindEventListeners() {
            
        }
    }

    Navigate.prototype.eventListeners = <NFCEventListeners>{
        mousedown: function (ctx) {
                return function (ev) {
                ctx.movement.moving = true;
                ctx.movement.moveStartX = ev.clientX;
                ctx.movement.moveStartY = ev.clientY;
            }
        }
    }

    Navigate.prototype.eventListeners = <any>
            mousedown: function (ctx) {
                return function (ev) {
            ctx.movement.moving = true;
            ctx.movement.moveStartX = ev.clientX;
            ctx.movement.moveStartY = ev.clientY;
        }
            },
    mouseup: function (ctx) {
                return function (ev) {
            ctx.movement.moving = false;
        }
            },
    mousemove: function (ctx) {
                return function (ev) {
            if (ctx.movement.moving) {
                var w = window.innerWidth;
                var h = window.innerHeight;

                var difX = ctx.movement.moveStartX - ev.clientX;
                var difY = ctx.movement.moveStartY - ev.clientY;

                ctx.movement.currentX = ctx.movement.currentX - difX;
                ctx.movement.currentY = ctx.movement.currentY - difY;

                if (ctx.movement.currentX > 0) {
                    ctx.movement.currentX = 0;
                }
                else if (-ctx.movement.currentX > ctx.width - w) {
                    ctx.movement.currentX = -(ctx.width - w);
                    ctx._el.style.left = (-(ctx.width - w)).toString();
                }

                if (ctx.movement.currentY > 0) {
                    ctx.movement.currentY = 0;
                }
                else if (-ctx.movement.currentY > ctx.height - h) {
                    ctx.movement.currentY = -(ctx.height - h);
                    ctx._el.style.top = (-(ctx.height - h)).toString();
                }

                ctx._el.style.top = ctx.movement.currentY + 'px';
                ctx._el.style.left = ctx.movement.currentX + 'px';

                ctx.movement.moveStartX = ev.clientX;
                ctx.movement.moveStartY = ev.clientY;

                if (ctx.map) {
                    ctx.map.setPosition();
                }
            }
        }
            }
} 