/// <reference path="nfc.controls.modes.ts" />

interface NFCControlsContainerOptions {
    workspace: NFC.Workspace;
    container: HTMLElement;
}

interface NFCControls {
    modes: NFC.Controls.Modes;
    build: NFC.Controls.Build;
    navigate: NFC.Controls.Navigate;
}

interface NFCControlOptions {
    workspace: NFC.Workspace;
    container: NFC.Controls.Container;
}

interface NFCEventListeners {
    mousedown?: (ctx: NFC.Workspace) => (ev) => void;
    mouseup?: (ctx: NFC.Workspace) => (ev) => void;
    mousemove?: (ctx: NFC.Workspace) => (ev) => void;
    click?: (ctx: NFC.Workspace) => (ev) => void;
}

interface NFCEventBindings {
    mousedown?: (ev) => void;
    mouseup?: (ev) => void;
    mousemove?: (ev) => void;
    click?: (ev) => void;
}

module NFC.Controls {
    export class Container {
        workspace: NFC.Workspace;
        container: HTMLElement;
        controlParts: NFCControls;
        constructor(options: NFCControlsContainerOptions) {
            this.container = options.container;
            this.workspace = options.workspace;

            this.controlParts = <any>{};
            this.controlParts.modes = new NFC.Controls.Modes({
                container: this,
                workspace: this.workspace
            });

            this.bindKeyCommands();

            this.workspace._addControls(this);
        }

        initialize() {
            this.controlParts.modes.initialize();
        }

        bindKeyCommands() {
            var escapeKey = 27;
            var enter = 13;
            var nKey = 78;
            var wKey = 87;

            (function (ctx: NFC.Controls.Container) {
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
        }

        escapeKey() {
            this.controlParts.modes.escapeKey();
        }

        enterKey() {
        }

        nKey() {
            this.controlParts.modes.nKey();
        }

        wKey() {
            this.controlParts.modes.wKey();
        }

        activateNavigationMode() {
            this.controlParts.navigation.activate();
        }

        activateBuildMode(mode: string) {
            this.controlParts.build.activate(mode);
        }

        deactivateNavigationMode() {
            this.controlParts.navigation.deactivate();
        }

        deactivateBuildMode() {
            this.controlParts.build.deactivate();
        }
    }
} 