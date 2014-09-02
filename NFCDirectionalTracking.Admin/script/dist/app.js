var NFC;
(function (NFC) {
    var Utility = (function () {
        function Utility() {
        }
        Utility.GetSVGNS = function () {
            return "http://www.w3.org/2000/svg";
        };

        Utility.GetClasses = function (el) {
            var classes = el.getAttribute('class');
            if (classes) {
                return classes.split(' ');
            }
            return [];
        };

        Utility.RemoveClass = function (el, className) {
            var classes = NFC.Utility.GetClasses(el);
            var i = classes.indexOf(className);
            if (i !== -1) {
                classes.splice(i, 1);
            }
            el.setAttribute('class', classes.join(' '));
        };

        Utility.AddClass = function (el, className) {
            var classes = NFC.Utility.GetClasses(el);
            var i = classes.indexOf(className);
            if (i === -1) {
                classes.push(className);
            }
            el.setAttribute('class', classes.join(' '));
        };
        return Utility;
    })();
    NFC.Utility = Utility;

    Utility.prototype.NavMode = 'navigate';
    Utility.prototype.WallMode = 'walls';
})(NFC || (NFC = {}));
var NFC;
(function (NFC) {
    var Grid = (function () {
        function Grid(options) {
            this.size = options.size;
            this.workspace = options.workspace;
            this.colours = options.colours || {
                standard: '#FFF',
                alternate: '#EEE'
            };

            this.generateGrid();
        }
        Grid.prototype.generateGrid = function () {
            this.generatePattern();
            var xW = Math.ceil(this.workspace.width / this.size);
            var yH = Math.ceil(this.workspace.height / this.size);

            if (xW * this.size > this.workspace.width) {
                this.workspace.width = xW * this.size;
                this.workspace._el.setAttribute('width', (xW * this.size).toString());
            }

            if (yH * this.size > this.workspace.height) {
                this.workspace.height = yH * this.size;
                this.workspace._el.setAttribute('height', (yH * this.size).toString());
            }

            this.display = document.createElementNS(NFC.Utility.GetSVGNS(), 'rect');

            this.display.setAttribute('id', 'grid-display');
            this.display.setAttribute('width', this.workspace.width.toString());
            this.display.setAttribute('height', this.workspace.height.toString());
            this.display.setAttributeNS(null, 'x', '0');
            this.display.setAttributeNS(null, 'y', '0');
            this.display.setAttributeNS(null, 'fill', 'url(#' + this.pattern.id + ')');

            this.workspace._el.appendChild(this.display);
        };

        Grid.prototype.generatePattern = function () {
            var szStr = this.size.toString();

            this.pattern = document.createElementNS(NFC.Utility.GetSVGNS(), 'pattern');

            this.pattern.setAttribute('id', 'grid-pattern');
            this.pattern.setAttributeNS(null, 'patternUnits', 'userSpaceOnUse');

            this.pattern.setAttributeNS(null, 'x', '0');
            this.pattern.setAttributeNS(null, 'y', '0');
            this.pattern.setAttributeNS(null, 'width', (this.size * 2).toString());
            this.pattern.setAttributeNS(null, 'height', (this.size * 2).toString());

            var rectStandard1 = document.createElementNS(NFC.Utility.GetSVGNS(), 'rect');
            var rectStandard2 = document.createElementNS(NFC.Utility.GetSVGNS(), 'rect');
            var rectAlternate1 = document.createElementNS(NFC.Utility.GetSVGNS(), 'rect');
            var rectAlternate2 = document.createElementNS(NFC.Utility.GetSVGNS(), 'rect');

            rectStandard1.setAttributeNS(null, 'x', '0');
            rectStandard1.setAttributeNS(null, 'y', '0');
            rectStandard1.setAttributeNS(null, 'width', szStr);
            rectStandard1.setAttributeNS(null, 'height', szStr);
            rectStandard1.setAttributeNS(null, 'fill', this.colours.standard);

            rectAlternate1.setAttributeNS(null, 'x', szStr);
            rectAlternate1.setAttributeNS(null, 'y', '0');
            rectAlternate1.setAttributeNS(null, 'width', szStr);
            rectAlternate1.setAttributeNS(null, 'height', szStr);
            rectAlternate1.setAttributeNS(null, 'fill', this.colours.alternate);

            rectStandard2.setAttributeNS(null, 'x', szStr);
            rectStandard2.setAttributeNS(null, 'y', szStr);
            rectStandard2.setAttributeNS(null, 'width', szStr);
            rectStandard2.setAttributeNS(null, 'height', szStr);
            rectStandard2.setAttributeNS(null, 'fill', this.colours.standard);

            rectAlternate2.setAttributeNS(null, 'x', '0');
            rectAlternate2.setAttributeNS(null, 'y', szStr);
            rectAlternate2.setAttributeNS(null, 'width', szStr);
            rectAlternate2.setAttributeNS(null, 'height', szStr);
            rectAlternate2.setAttributeNS(null, 'fill', this.colours.alternate);

            this.pattern.appendChild(rectStandard1);
            this.pattern.appendChild(rectAlternate1);
            this.pattern.appendChild(rectStandard2);
            this.pattern.appendChild(rectAlternate2);

            this.workspace._defsArea.appendChild(this.pattern);
        };

        Grid.prototype.getSquarePoints = function (x, y) {
            var xCoord = Math.floor(x / this.size);
            var yCoord = Math.floor(y / this.size);

            return {
                square: {
                    x: xCoord,
                    y: yCoord
                },
                topLeft: {
                    x: xCoord * this.size,
                    y: yCoord * this.size
                },
                bottomLeft: {
                    x: xCoord * this.size,
                    y: (yCoord * this.size) + this.size
                },
                topRight: {
                    x: (xCoord * this.size) + this.size,
                    y: yCoord * this.size
                },
                bottomRight: {
                    x: (xCoord * this.size) + this.size,
                    y: (yCoord * this.size) + this.size
                }
            };
        };
        return Grid;
    })();
    NFC.Grid = Grid;
})(NFC || (NFC = {}));
var NFC;
(function (NFC) {
    var Wall = (function () {
        function Wall(options) {
            var w2 = options.width / 2;

            this.segments = [options.square];
            this.width = options.width;

            this._currentSegment = {
                square: options.square.square,
                bottomLeft: options.square.bottomLeft,
                bottomRight: options.square.bottomRight,
                topLeft: options.square.topLeft,
                topRight: options.square.topRight
            };

            this.generateSelf();

            this.generatePath(this.segments[0], this.segments[0]);
        }
        Wall.prototype.generateSelf = function () {
            this.el = document.createElementNS(NFC.Utility.GetSVGNS(), 'path');

            this.el.setAttributeNS(null, 'stroke', 'black');
            this.el.setAttributeNS(null, 'stroke-width', '1');
            this.el.setAttributeNS(null, 'fill', '#AAA');
        };

        Wall.prototype.updateSegment = function (sq) {
            var cSeg = this.segments[this.segments.length - 1];
            if ((sq.square.x !== cSeg.square.x || sq.square.y !== cSeg.square.y) && (sq.square.x !== this._currentSegment.square.x || sq.square.y !== this._currentSegment.square.y)) {
                if (this.segments.length === 1) {
                    this.generatePath(this.segments[0], sq);
                }
            }
        };

        Wall.prototype._lt = function (c) {
            return 'L ' + c.x + ' ' + c.y + ' ';
        };

        Wall.prototype._mt = function (c) {
            return 'M' + c.x + ' ' + c.y + ' ';
        };

        Wall.prototype.generatePath = function (start, next) {
            if (next.square.x > start.square.x) {
                if (next.square.y > start.square.y) {
                    this._pathCommand = this._mt(start.topLeft) + this._lt(start.topRight) + this._lt(next.topRight) + this._lt(next.bottomRight) + this._lt(next.bottomLeft) + this._lt(start.bottomLeft) + this._lt(start.topLeft);
                } else if (next.square.y < start.square.y) {
                    this._pathCommand = this._mt(start.topLeft) + this._lt(next.topLeft) + this._lt(next.topRight) + this._lt(next.bottomRight) + this._lt(start.bottomRight) + this._lt(start.bottomLeft) + this._lt(start.topLeft);
                } else {
                    this._pathCommand = this._mt(start.topLeft) + this._lt(next.topRight) + this._lt(next.bottomRight) + this._lt(start.bottomLeft) + this._lt(start.topLeft);
                }
            } else if (next.square.x < start.square.x) {
                if (next.square.y > start.square.y) {
                    this._pathCommand = this._mt(start.topLeft) + this._lt(start.topRight) + this._lt(start.bottomRight) + this._lt(next.bottomRight) + this._lt(next.bottomLeft) + this._lt(next.topLeft) + this._lt(start.topLeft);
                } else if (next.square.y < start.square.y) {
                    this._pathCommand = this._mt(start.topRight) + this._lt(start.bottomRight) + this._lt(start.bottomLeft) + this._lt(next.bottomLeft) + this._lt(next.topLeft) + this._lt(next.topRight) + this._lt(start.topRight);
                } else {
                    this._pathCommand = this._mt(start.topRight) + this._lt(start.bottomRight) + this._lt(next.bottomLeft) + this._lt(next.topLeft) + this._lt(start.topRight);
                }
            } else {
                if (next.square.y > start.square.y) {
                    this._pathCommand = this._mt(start.topLeft) + this._lt(start.topRight) + this._lt(next.bottomRight) + this._lt(next.bottomLeft) + this._lt(start.topLeft);
                } else if (next.square.y < start.square.y) {
                    this._pathCommand = this._mt(start.bottomRight) + this._lt(start.bottomLeft) + this._lt(next.topLeft) + this._lt(next.topRight) + this._lt(start.bottomRight);
                } else {
                    this._pathCommand = this._mt(this.segments[0].topLeft) + this._lt(this.segments[0].topRight) + this._lt(this.segments[0].bottomRight) + this._lt(this.segments[0].bottomLeft) + this._lt(this.segments[0].topLeft);
                }
            }

            this.el.setAttributeNS(null, 'd', this._pathCommand);
        };

        Wall.prototype.completeSegment = function (sq) {
            this.segments.push(sq);
            this.generatePath(this.segments[0], this.segments[1]);
        };
        return Wall;
    })();
    NFC.Wall = Wall;

    var WallContainer = (function () {
        function WallContainer(options) {
            this.workspace = options.workspace;
            this.width = options.width;
            this.height = options.height;

            this.generateSelf();
        }
        WallContainer.prototype.generateSelf = function () {
            var ns = NFC.Utility.GetSVGNS();

            var el = document.createElementNS(ns, 'g');

            el.setAttributeNS(null, 'x', '0');
            el.setAttributeNS(null, 'y', '0');

            el.setAttributeNS(null, 'width', this.width.toString());
            el.setAttributeNS(null, 'height', this.height.toString());

            this.el = el;

            this._walls = [];
        };

        WallContainer.prototype.selectSquare = function (sq) {
            var sz = sq.topRight.x - sq.topLeft.x;
            var mid = sz / 2;
            if (!this._inPath) {
                this._currentPath = new NFC.Wall({
                    square: sq,
                    width: sz
                });

                this.el.appendChild(this._currentPath.el);

                this._inPath = true;
            } else {
                this._currentPath.completeSegment(sq);

                this._walls.push(this._currentPath);

                this._currentPath = new NFC.Wall({
                    square: sq,
                    width: sz
                });

                this._walls.push(this._currentPath);

                this.el.appendChild(this._currentPath.el);
            }
        };

        WallContainer.prototype.updatePosition = function (sq) {
            if (this._inPath) {
                this._currentPath.updateSegment(sq);
            }
        };

        WallContainer.prototype.stopPathing = function () {
            if (this._inPath) {
                this.el.removeChild(this._currentPath.el);
                this._currentPath = null;
                this._inPath = false;
            }
        };
        return WallContainer;
    })();
    NFC.WallContainer = WallContainer;
})(NFC || (NFC = {}));

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
            switch (this._mode) {
                case this.modes.navigation:
                    this.exitNavigationMode();
                    break;
                case this.modes.walls:
                    this.exitWallsMode();
                    break;
            }

            this._mode = mode;

            switch (this._mode) {
                case this.modes.navigation:
                    this.enterNavigationMode();
                    break;
                case this.modes.walls:
                    this.enterWallsMode();
                    break;
            }
        };

        Workspace.prototype.exitNavigationMode = function () {
            this._el.style.cursor = '';
            this._el.removeEventListener('mousedown', this.evHandlers.navigationMode.mousedown);
            window.removeEventListener('mouseup', this.evHandlers.navigationMode.mouseup);
            this._el.removeEventListener('mousemove', this.evHandlers.navigationMode.mousemove);
        };

        Workspace.prototype.enterNavigationMode = function () {
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
var NFC;
(function (NFC) {
    var WorkspaceMap = (function () {
        function WorkspaceMap(options) {
            this.container = options.container;
            this.workspace = options.workspace;

            this.workspace._addMap(this);
            this.px = 'px';
        }
        WorkspaceMap.prototype.generateMap = function () {
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
            var h = (180 * mapRatio);

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
        };

        WorkspaceMap.prototype.realign = function () {
            var self = this;
            setTimeout(function () {
                var mapRatio = self.workspace.height / self.workspace.width;

                self.wRatio = self.container.clientWidth / self.workspace.width;
                self.hRatio = self.container.clientHeight / self.workspace.height;

                var w = 180;
                var h = (180 * mapRatio);

                self.map.style.width = w + self.px;
                self.map.style.height = h + self.px;

                self.viewport.style.width = (w * self.wRatio) + self.px;
                self.viewport.style.height = (h * self.hRatio) + self.px;

                self.vwRatio = (w * self.wRatio) / self.container.clientWidth;
                self.vhRatio = (h * self.hRatio) / self.container.clientHeight;
            }, 100);
        };

        WorkspaceMap.prototype.setPosition = function () {
            this.viewport.style.left = (-this.movement.currentX * this.vwRatio) + this.px;
            this.viewport.style.top = (-this.movement.currentY * this.vhRatio) + this.px;
        };
        return WorkspaceMap;
    })();
    NFC.WorkspaceMap = WorkspaceMap;
})(NFC || (NFC = {}));
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
            return Container;
        })();
        Controls.Container = Container;
    })(NFC.Controls || (NFC.Controls = {}));
    var Controls = NFC.Controls;
})(NFC || (NFC = {}));
(function () {
    window['workspace'] = new NFC.Workspace('drawing');

    window['workspaceMap'] = new NFC.WorkspaceMap({
        container: document.getElementById('workspace'),
        workspace: window['workspace']
    });

    window['workspaceControls'] = new NFC.Controls.Container({
        container: document.getElementById('workspace'),
        workspace: window['workspace']
    });

    var rszFn = function () {
        var d = document.getElementById('workspace');
        var h = window.innerHeight;

        d.style.height = h + 'px';
    };

    window.addEventListener('resize', rszFn);

    rszFn();
}).call(this);
//# sourceMappingURL=app.js.map
