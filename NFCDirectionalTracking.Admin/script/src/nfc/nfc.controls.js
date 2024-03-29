﻿var NFC;
(function (NFC) {
    (function (Controls) {
        var Container = (function () {
            function Container(options) {
                this.createModes();
                this.container = options.container;
                this.workspace = options.workspace;

                this.workspace._addControls(this);

                this.bindKeyCommands();
            }
            Container.prototype.createModes = function () {
                this.modes = {
                    navigation: 'navigate',
                    walls: 'walls'
                };
            };

            Container.prototype.generateControls = function () {
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

                this.container.appendChild(this.el);
            };

            Container.prototype.changeMode = function (mode) {
                NFC.Utility.RemoveClass(this[this.mode], 'selected');
                NFC.Utility.AddClass(this[mode], 'selected');
                this.mode = mode;
            };

            Container.prototype.initializeMode = function (mode) {
                this.mode = mode;
                NFC.Utility.AddClass(this[mode], 'selected');
                this.workspace.changeMode(mode);
            };

            Container.prototype.bindKeyCommands = function () {
                var escapeKey = 27;
                var enter = 13;
                var nKey = 78;
                var wKey = 87;

                (function (ctx) {
                    window.addEventListener("keydown", function (event) {
                        switch (event.keyCode) {
                            case escapeKey:
                                ctx.escapeKey();
                                break;
                            case enter:
                                ctx.enterKey();
                                break;
                            case nKey:
                                ctx.nKey();
                                break;
                            case wKey:
                                ctx.wKey();
                                break;
                            default:
                                break;
                        }
                    });
                })(this);
            };

            Container.prototype.escapeKey = function () {
                if (this.mode === this.modes.walls) {
                    this.workspace._wallContainer.stopPathing();
                }
            };

            Container.prototype.enterKey = function () {
            };

            Container.prototype.nKey = function () {
                var m = this.modes.navigation;
                if (this.mode !== m) {
                    this.changeMode(m);
                    this.workspace.changeMode(this.mode);
                }
            };

            Container.prototype.wKey = function () {
                var m = this.modes.walls;
                if (this.mode !== m) {
                    this.changeMode(m);
                    this.workspace.changeMode(this.mode);
                }
            };
            return Container;
        })();
        Controls.Container = Container;
    })(NFC.Controls || (NFC.Controls = {}));
    var Controls = NFC.Controls;
})(NFC || (NFC = {}));
//# sourceMappingURL=nfc.controls.js.map
