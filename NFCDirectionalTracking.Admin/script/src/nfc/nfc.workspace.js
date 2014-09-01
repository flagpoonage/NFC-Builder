/// <reference path="nfc.utility.ts" />
/// <reference path="nfc.anchor.ts" />
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

            this._mode = 'navigate';

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
            this.width = parseInt(this._el.getAttribute('width'));
            this.height = parseInt(this._el.getAttribute('height'));

            this._wallContainer = new NFC.WallContainer({
                height: this.height,
                width: this.width,
                workspace: this
            });

            this._anchorContainer = new NFC.AnchorBlock({
                height: this.height,
                width: this.width,
                parent: this._el,
                verticalGeneration: false,
                anchorSize: 5
            });

            this._el.appendChild(this._anchorContainer.el);
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

            var self = this;

            var fn = function () {
                if (self.map.container.clientHeight > 0) {
                    self.controls.generateControls();
                    self.controls.initializeMode(self._mode);
                } else {
                    setTimeout(fn, 50);
                }
            };

            setTimeout(fn, 50);
        };

        Workspace.prototype.changeMode = function (mode) {
            switch (this._mode) {
                case 'navigate':
                    this.exitNavigationMode();
                    break;
                case 'walls':
                    this.exitWallsMode();
                    break;
            }

            this._mode = mode;

            switch (this._mode) {
                case 'navigate':
                    this.enterNavigationMode();
                    break;
                case 'walls':
                    this.enterWallsMode();
                    break;
            }
        };

        Workspace.prototype.exitNavigationMode = function () {
            this._el.style.cursor = '';
            this._anchorContainer.el.style.display = '';
            this._el.removeEventListener('mousedown', this.evHandlers.navigationMode.mousedown);
            window.removeEventListener('mouseup', this.evHandlers.navigationMode.mouseup);
            this._el.removeEventListener('mousemove', this.evHandlers.navigationMode.mousemove);
        };

        Workspace.prototype.enterNavigationMode = function () {
            this._anchorContainer.el.style.display = 'none';
            this._el.style.cursor = 'pointer';
            this._el.addEventListener('mousedown', this.evHandlers.navigationMode.mousedown);
            window.addEventListener('mouseup', this.evHandlers.navigationMode.mouseup);
            this._el.addEventListener('mousemove', this.evHandlers.navigationMode.mousemove);
        };

        Workspace.prototype.exitWallsMode = function () {
            this._el.style.cursor = '';
            this._el.removeEventListener('click', this.evHandlers.wallsMode.click);
            this._el.removeEventListener('mousemove', this.evHandlers.wallsMode.mousemove);
        };

        Workspace.prototype.enterWallsMode = function () {
            this._el.style.cursor = 'crosshair';
            this._el.addEventListener('click', this.evHandlers.wallsMode.click);
            this._el.addEventListener('mousemove', this.evHandlers.wallsMode.mousemove);
        };
        return Workspace;
    })();
    NFC.Workspace = Workspace;

    NFC.Workspace.prototype.evHandlers = {
        navigationMode: {
            mousedown: function (ctx) {
                return function (ev) {
                    ctx.movement.moving = true;
                    ctx.movement.moveStartX = ev.clientX;
                    ctx.movement.moveStartY = ev.clientY;
                };
            },
            mouseup: function (ctx) {
                return function (ev) {
                    ctx.movement.moving = false;
                };
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
                        } else if (-ctx.movement.currentX > ctx.width - w) {
                            ctx.movement.currentX = -(ctx.width - w);
                            ctx._el.style.left = (-(ctx.width - w)).toString();
                        }

                        if (ctx.movement.currentY > 0) {
                            ctx.movement.currentY = 0;
                        } else if (-ctx.movement.currentY > ctx.height - h) {
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
                };
            }
        },
        wallsMode: {
            click: function (ctx) {
                return function (ev) {
                    var d = document.elementFromPoint(ev.clientX, ev.clientY);
                    ev.target = d;
                    var t = ev.target;
                    ctx._wallContainer.anchorSelect(t);
                };
            },
            mousemove: function (ctx) {
                return function (ev) {
                    ctx._wallContainer.updatePosition(ev.clientX, ev.clientY);
                };
            }
        }
    };
})(NFC || (NFC = {}));
//# sourceMappingURL=nfc.workspace.js.map
