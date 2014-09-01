interface NFCWorkspaceMapOptions {
    container: HTMLElement;
    workspace: NFC.Workspace;
}

module NFC {
    export class WorkspaceMap {
        container: HTMLElement;
        el: HTMLElement;
        map: HTMLElement;
        viewport: HTMLElement;
        workspace: NFC.Workspace;
        movement: IMovement;
        wRatio: number;
        hRatio: number;
        vwRatio: number;
        vhRatio: number;
        px: string;
        constructor(options?: NFCWorkspaceMapOptions) {
            this.container = options.container;
            this.workspace = options.workspace;

            this.workspace._addMap(this);
            this.px = 'px';
        }

        generateMap() {
            this.el = document.createElement('div');
            this.el.setAttribute('class', 'map-control');

            this.map = document.createElement('div');
            this.map.setAttribute('class', 'map-container');

            this.viewport = document.createElement('div');
            this.viewport.setAttribute('class', 'viewport-outline');

            var mapRatio = this.workspace.height / this.workspace.width;

            this.wRatio = this.container.clientWidth / this.workspace.width;
            this.hRatio = this.container.clientHeight / this.workspace.height;

            var w = 180;
            var h = (180 * mapRatio)

            this.map.style.width = w + this.px;
            this.map.style.height = h + this.px;

            this.viewport.style.width = (w * this.wRatio) + this.px;
            this.viewport.style.height = (h * this.hRatio) + this.px;

            this.vwRatio = (w * this.wRatio) / this.container.clientWidth;
            this.vhRatio = (h * this.hRatio) / this.container.clientHeight;

            this.map.appendChild(this.viewport);
            this.el.appendChild(this.map);

            this.el.style.position = 'fixed';

            this.map.style.position = 'relative';
            this.viewport.style.position = 'absolute';

            this.container.appendChild(this.el);
        }

        realign() {
            var self = this;
            setTimeout(function () {
                var mapRatio = self.workspace.height / self.workspace.width;

                self.wRatio = self.container.clientWidth / self.workspace.width;
                self.hRatio = self.container.clientHeight / self.workspace.height;

                var w = 180;
                var h = (180 * mapRatio)

                self.map.style.width = w + self.px;
                self.map.style.height = h + self.px;

                self.viewport.style.width = (w * self.wRatio) + self.px;
                self.viewport.style.height = (h * self.hRatio) + self.px;

                self.vwRatio = (w * self.wRatio) / self.container.clientWidth;
                self.vhRatio = (h * self.hRatio) / self.container.clientHeight;
            }, 100);
        }

        setPosition() {
            this.viewport.style.left = (-this.movement.currentX * this.vwRatio) + this.px;
            this.viewport.style.top = (-this.movement.currentY * this.vhRatio) + this.px;
        }
    }
} 