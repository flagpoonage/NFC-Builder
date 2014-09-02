var NFC;
(function (NFC) {
    (function (Controls) {
        var Modes = (function () {
            function Modes(options) {
                this.createModes();
                this.workspace = options.workspace;
                this.container = options.container;

                this.generateControls();
            }
            Modes.prototype.createModes = function () {
                this.modes = {
                    navigation: 'navigate',
                    walls: 'walls'
                };
            };

            Modes.prototype.generateControls = function () {
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
            };

            Modes.prototype.setListenMode = function () {
                switch (this.mode) {
                    case this.modes.walls:
                        this.container.activateBuildMode(this.mode);
                        break;
                    case this.modes.naviation:
                        this.container.activateNavigationMode();
                        break;
                }
            };

            Modes.prototype.unsetListenMode = function (mode) {
                switch (mode) {
                    case this.modes.walls:
                        this.container.deactivateBuildMode();
                        break;
                    case this.modes.naviation:
                        this.container.deactivateNavigationMode();
                        break;
                }
            };

            Modes.prototype.changeMode = function (mode) {
                NFC.Utility.RemoveClass(this[this.mode], 'selected');
                NFC.Utility.AddClass(this[mode], 'selected');
                this.mode = mode;
            };

            Modes.prototype.initialize = function () {
                this.generateControls();
                this.workspace._initializeMode();
            };

            Modes.prototype.initializeMode = function (mode) {
                this.mode = mode;
                NFC.Utility.AddClass(this[mode], 'selected');
                this.workspace.changeMode(mode);
            };

            Modes.prototype.escapeKey = function () {
                if (this.mode === this.modes.walls) {
                    this.workspace._wallContainer.stopPathing();
                }
            };

            Modes.prototype.enterKey = function () {
            };

            Modes.prototype.nKey = function () {
                var m = this.modes.navigation;
                if (this.mode !== m) {
                    this.changeMode(m);
                    this.workspace.changeMode(this.mode);
                }
            };

            Modes.prototype.wKey = function () {
                var m = this.modes.walls;
                if (this.mode !== m) {
                    this.changeMode(m);
                    this.workspace.changeMode(this.mode);
                }
            };
            return Modes;
        })();
        Controls.Modes = Modes;
    })(NFC.Controls || (NFC.Controls = {}));
    var Controls = NFC.Controls;
})(NFC || (NFC = {}));
//# sourceMappingURL=nfc.controls.modes.js.map
