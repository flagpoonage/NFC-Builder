module NFC.Controls {
    export class Build {
        eventBindings: NFCEventBindings;
        eventListeners: NFCEventListeners;
        container: NFC.Controls.Container;
        workspace: NFC.Workspace;
        mode: string;
        constructor(options: NFCControlOptions) {
            this.workspace = options.workspace;
            this.container = options.container;

            this.createEventBindings();
        }

        activate(mode: string) {
            this.mode = mode;
            this.workspace._el.
        }

        createEventBindings() {
            this.eventBindings = {
                click: this.eventListeners.click(this.workspace),
                mousemove: this.eventBindings.mousemove(this.workspace)
            };
        }
    }

    Build.prototype.eventListeners = {
        click: (ctx: NFC.Workspace) => {
            return (ev) => {
                var x = -ctx.movement.currentX + ev.clientX;
                var y = -ctx.movement.currentY + ev.clientY;
                var sq = ctx._grid.getSquarePoints(x, y);
                ctx._wallContainer.selectSquare(sq);
            }
        },
        mousemove: (ctx: NFC.Workspace) => {
            return (ev) => {
                var x = -ctx.movement.currentX + ev.clientX;
                var y = -ctx.movement.currentY + ev.clientY;
                var sq = ctx._grid.getSquarePoints(x, y);
                ctx._wallContainer.updatePosition(sq);
            }
        }
    }
} 