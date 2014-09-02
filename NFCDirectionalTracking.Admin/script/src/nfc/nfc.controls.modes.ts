module NFC.Controls {
    export class Modes {
        container: NFC.Controls.Container;
        workspace: NFC.Workspace;
        el: HTMLElement;
        navigate: HTMLAnchorElement;
        walls: HTMLAnchorElement;
        mode: string;
        modes: any;
        constructor(options?: NFCControlOptions) {
            this.createModes();
            this.workspace = options.workspace;
            this.container = options.container;

            this.generateControls();
        }

        createModes() {
            this.modes = {
                navigation: 'navigate',
                walls: 'walls'
            }
        }

        generateControls() {
            this.el = document.createElement('div');
            this.el.setAttribute('class', 'workspace-controls');

            this.navigate = document.createElement('a');
            this.navigate.setAttribute('class', 'workspace-control');
            this.navigate.innerHTML = 'Navigate';

            var self = this;
            this.navigate.addEventListener('click', function (ev) {
                if (self.mode !== self.modes.navigation) {
                    self.changeMode(self.modes.navigation);
                    self.workspace.changeMode(self.mode);
                }
            });

            this.walls = document.createElement('a');
            this.walls.setAttribute('class', 'workspace-control');
            this.walls.innerHTML = 'Walls';

            this.walls.addEventListener('click', function (ev) {
                if (self.mode !== self.modes.walls) {
                    self.changeMode(self.modes.walls);
                    self.workspace.changeMode(self.mode);
                }
            });

            this.el.appendChild(this.navigate);
            this.el.appendChild(this.walls);

            this.container.container.appendChild(this.el);
        }

        setListenMode() {
            switch (this.mode) {
                case this.modes.walls:
                    this.container.activateBuildMode(this.mode);
                    break;
                case this.modes.naviation:
                    this.container.activateNavigationMode();
                    break;
            }
        }

        unsetListenMode(mode: string) {
            switch (mode) {
                case this.modes.walls: 
                    this.container.deactivateBuildMode();
                    break;
                case this.modes.naviation:
                    this.container.deactivateNavigationMode();
                    break;
            }
        }

        changeMode(mode: string) {
            NFC.Utility.RemoveClass(this[this.mode], 'selected');
            NFC.Utility.AddClass(this[mode], 'selected');
            this.mode = mode;
        }

        initialize() {
            this.generateControls();
            this.workspace._initializeMode();
        }

        initializeMode(mode: string) {
            this.mode = mode;
            NFC.Utility.AddClass(this[mode], 'selected');
            this.workspace.changeMode(mode);
        }

        escapeKey() {
            if (this.mode === this.modes.walls) {
                this.workspace._wallContainer.stopPathing();
            }
        }

        enterKey() {

        }

        nKey() {
            var m = this.modes.navigation;
            if (this.mode !== m) {
                this.changeMode(m);
                this.workspace.changeMode(this.mode);
            }
        }

        wKey() {
            var m = this.modes.walls;
            if (this.mode !== m) {
                this.changeMode(m);
                this.workspace.changeMode(this.mode);
            }
        } 
    }
}
