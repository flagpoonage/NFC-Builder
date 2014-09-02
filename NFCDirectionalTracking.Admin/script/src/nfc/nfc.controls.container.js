/// <reference path="nfc.controls.modes.ts" />

var NFC;
(function (NFC) {
    (function (Controls) {
        var Container = (function () {
            function Container(options) {
                this.container = options.container;
                this.workspace = options.workspace;

                this.controlParts = {};
                this.controlParts.modes = new NFC.Controls.Modes({
                    container: this,
                    workspace: this.workspace
                });

                this.bindKeyCommands();

                this.workspace._addControls(this);
            }
            Container.prototype.initialize = function () {
                this.controlParts.modes.initialize();
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
                this.controlParts.modes.escapeKey();
            };

            Container.prototype.enterKey = function () {
            };

            Container.prototype.nKey = function () {
                this.controlParts.modes.nKey();
            };

            Container.prototype.wKey = function () {
                this.controlParts.modes.wKey();
            };

            Container.prototype.activateNavigationMode = function () {
                this.controlParts.navigation.activate();
            };

            Container.prototype.activateBuildMode = function (mode) {
                this.controlParts.build.activate(mode);
            };

            Container.prototype.deactivateNavigationMode = function () {
                this.controlParts.navigation.deactivate();
            };

            Container.prototype.deactivateBuildMode = function () {
                this.controlParts.build.deactivate();
            };
            return Container;
        })();
        Controls.Container = Container;
    })(NFC.Controls || (NFC.Controls = {}));
    var Controls = NFC.Controls;
})(NFC || (NFC = {}));
//# sourceMappingURL=nfc.controls.container.js.map
