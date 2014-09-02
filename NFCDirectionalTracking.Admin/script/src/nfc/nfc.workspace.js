/// <reference path="nfc.utility.ts" />
/// <reference path="nfc.grid.ts" />
/// <reference path="nfc.wall.ts" />

var NFC;
(function (NFC) {
    var Workspace = (function () {
        function Workspace(id) {
            this._ns = NFC.Utility.GetSVGNS();
            var el = document.getElementById(id);

            if (el.tagName.toLowerCase() === 'svg') {
                this._el = el;
            } else {
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
        Workspace.prototype.createModes = function () {
            this.modes = {
                navigation: 'navigate',
                walls: 'walls'
            };
        };

        Workspace.prototype._bindEventListeners = function () {
            this.evHandlers.navigationMode.mousedown = this.evHandlers.navigationMode.mousedown(this);
            this.evHandlers.navigationMode.mouseup = this.evHandlers.navigationMode.mouseup(this);
            this.evHandlers.navigationMode.mousemove = this.evHandlers.navigationMode.mousemove(this);
            this.evHandlers.wallsMode.click = this.evHandlers.wallsMode.click(this);
            this.evHandlers.wallsMode.mousemove = this.evHandlers.wallsMode.mousemove(this);
        };

        Workspace.prototype._bindResize = function () {
            var self = this;
            window.addEventListener('resize', function (ev) {
                self.map.realign();
            });
        };

        Workspace.prototype._bindDragMovement = function () {
            var self = this;
        };

        Workspace.prototype._initializeWorkspace = function () {
            this._defsArea = document.createElementNS(NFC.Utility.GetSVGNS(), 'defs');

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
        };

        Workspace.prototype._addMap = function (map) {
            this.map = map;
            this.map.movement = this.movement;

            var self = this;

            // Wait until the workspace is initialized before initializing the map
            var fn = function () {
                if (self.map.container.clientHeight > 0) {
                    self.map.generateMap();
                } else {
                    setTimeout(fn, 50);
                }
            };

            setTimeout(fn, 50);
        };

        Workspace.prototype._addControls = function (controls) {
            this.controls = controls;

            this.controlParts = this.controls.controlParts;

            this.controls.initialize();
        };

        Workspace.prototype._initializeMode = function () {
            this._mode = this.modes.navigation;

            this.controlParts.modes.initializeMode(this._mode);
        };

        Workspace.prototype.changeMode = function (mode) {
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
        };

        Workspace.prototype.enterNavigationMode = function () {
            this._el.style.cursor = 'pointer';
        };

        Workspace.prototype.enterWallsMode = function () {
            this._el.style.cursor = 'crosshair';
        };
        return Workspace;
    })();
    NFC.Workspace = Workspace;

    NFC.Workspace.prototype.evHandlers = {
        navigationMode: {},
        wallsMode: {
            click: function (ctx) {
                return function (ev) {
                    var x = -ctx.movement.currentX + ev.clientX;
                    var y = -ctx.movement.currentY + ev.clientY;
                    var sq = ctx._grid.getSquarePoints(x, y);
                    ctx._wallContainer.selectSquare(sq);
                };
            },
            mousemove: function (ctx) {
                return function (ev) {
                    var x = -ctx.movement.currentX + ev.clientX;
                    var y = -ctx.movement.currentY + ev.clientY;
                    var sq = ctx._grid.getSquarePoints(x, y);
                    ctx._wallContainer.updatePosition(sq);
                };
            }
        }
    };
})(NFC || (NFC = {}));
//# sourceMappingURL=nfc.workspace.js.map
