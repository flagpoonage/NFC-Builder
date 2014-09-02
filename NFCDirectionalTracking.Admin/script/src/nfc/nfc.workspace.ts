/// <reference path="nfc.utility.ts" />
/// <reference path="nfc.grid.ts" />
/// <reference path="nfc.wall.ts" />

interface IMovement {
    currentX: number;
    currentY: number;
    moveStartX: number;
    moveStartY: number;
    moving: boolean;
    animationTimer: number;
    animationIterator: number;
    animationIterations: number;
}

module NFC {
    export class Workspace {
        _el: SVGSVGElement;
        _grid: NFC.Grid;
        _wallContainer: NFC.WallContainer;
        _defsArea: SVGDefsElement;
        _ns: string;
        _mode: string;
        width: number;
        height: number;
        movement: IMovement;
        eventListeners: NFCEventListeners;
        evHandlers: any;
        map: NFC.WorkspaceMap;
        controls: NFC.Controls.Container;
        controlParts: NFCControls;
        modes: any;
        constructor(id: string) {
            this._ns = NFC.Utility.GetSVGNS();
            var el = <any>document.getElementById(id);

            if (el.tagName.toLowerCase() === 'svg') {
                this._el = <SVGSVGElement>el;
            }
            else {
                throw '"' + id + '" is not an SVG element.';
            }

            this.createModes();

            this._mode = this.modes.navigation;

            this.movement = {
                moving: false,
                moveStartX: 0,
                currentX: 0,
                moveStartY: 0,
                currentY: 0,
                animationIterations: 50,
                animationIterator: 0,
                animationTimer: 0
            };

            this._initializeWorkspace();

            this._bindResize();

            this._bindEventListeners();
        }

        createModes() {
            this.modes = {
                navigation: 'navigate',
                walls: 'walls'
            };
        }

        _bindEventListeners() {
            this.evHandlers.navigationMode.mousedown = this.evHandlers.navigationMode.mousedown(this);
            this.evHandlers.navigationMode.mouseup = this.evHandlers.navigationMode.mouseup(this);
            this.evHandlers.navigationMode.mousemove = this.evHandlers.navigationMode.mousemove(this);
            this.evHandlers.wallsMode.click = this.evHandlers.wallsMode.click(this);
            this.evHandlers.wallsMode.mousemove = this.evHandlers.wallsMode.mousemove(this);
        }

        _bindResize() {
            var self = this;
            window.addEventListener('resize', (ev) => {
                self.map.realign();
            });
        }

        _bindDragMovement() {
            var self = this;
        }

        _initializeWorkspace(): void {
            this._defsArea = <SVGDefsElement>document.createElementNS(NFC.Utility.GetSVGNS(), 'defs');

            this.width = parseInt(this._el.getAttribute('width'));
            this.height = parseInt(this._el.getAttribute('height'));

            this._wallContainer = new NFC.WallContainer({
                height: this.height,
                width: this.width,
                workspace: this
            });

            this._grid = new NFC.Grid({
                workspace: this,
                colours: {
                    standard: '#FFF',
                    alternate: '#F2F2F2'
                },
                size: 10
            });

            this._el.appendChild(this._defsArea);

            this._el.appendChild(this._wallContainer.el);
        }



        _addMap(map: NFC.WorkspaceMap) {
            this.map = map;
            this.map.movement = this.movement;

            var self = this;

            // Wait until the workspace is initialized before initializing the map
            var fn = function () {
                if (self.map.container.clientHeight > 0) {
                    self.map.generateMap();
                }
                else {
                    setTimeout(fn, 50);
                }
            }

            setTimeout(fn, 50);
        }

        _addControls(controls: NFC.Controls.Container) {
            this.controls = controls;

            this.controlParts = this.controls.controlParts;

            this.controls.initialize();
        }

        _initializeMode() {
            this._mode = this.modes.navigation;

            this.controlParts.modes.initializeMode(this._mode);
        }

        changeMode(mode: string) {
            this.controlParts.modes.unsetListenMode(this._mode);

            this._mode = mode;

            this.controlParts.modes.setListenMode(this._mode);

            switch (this._mode) {
                case this.modes.navigation:
                    this.enterNavigationMode();
                    break;
                case this.modes.walls:
                    this.enterWallsMode();
                    break;
            }
        }

        enterNavigationMode() {
            this._el.style.cursor = 'pointer';
        }

        enterWallsMode() {
            this._el.style.cursor = 'crosshair';
        }
    }

    NFC.Workspace.prototype.evHandlers = <any>{
        navigationMode: {
        },
        wallsMode:
        {
            click: function (ctx: NFC.Workspace) {
                return function (ev) {
                    var x = -ctx.movement.currentX + ev.clientX;
                    var y = -ctx.movement.currentY + ev.clientY;
                    var sq = ctx._grid.getSquarePoints(x, y);
                    ctx._wallContainer.selectSquare(sq);
                }
            },
            mousemove: function (ctx: NFC.Workspace) {
                return function (ev) {
                    var x = -ctx.movement.currentX + ev.clientX;
                    var y = -ctx.movement.currentY + ev.clientY;
                    var sq = ctx._grid.getSquarePoints(x, y);
                    ctx._wallContainer.updatePosition(sq);
                }
            }
        }
    }
}