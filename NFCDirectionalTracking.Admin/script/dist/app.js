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
})(NFC || (NFC = {}));
var NFC;
(function (NFC) {
    var Anchor = (function () {
        function Anchor(options) {
            this.edge = options.edge;
            this.x = options.index[0];
            this.y = options.index[1];
            this.parent = options.parent;
            this.visible = options.visible || true;
            this.stroke = options.stroke;
            this.size = options.size;
            this.fill = options.fill;
            this.vgen = options.verticalGen;
            this.space = options.space;

            this._generateSvgTag();
        }
        Anchor.prototype._generateSvgTag = function () {
            var svgNS = NFC.Utility.GetSVGNS();
            var anchor = document.createElementNS(svgNS, "rect");

            if (!this.vgen) {
                this.index = this.x + (this.y + 1);
            } else {
                this.index = this.y + (this.x + 1);
            }

            this.id = this.x + '_' + this.y + '_workspace_anchor';

            var t = this.space + this.edge;

            var stroke = 2;

            var radius = this.size / (stroke * 2);

            anchor.setAttributeNS(null, 'id', this.id);
            anchor.setAttributeNS(null, "x", (this.x * t).toString());
            anchor.setAttributeNS(null, "y", (this.y * t).toString());
            anchor.setAttributeNS(null, "width", (this.space + this.size).toString());
            anchor.setAttributeNS(null, "height", (this.space + this.size).toString());
            anchor.setAttributeNS(null, 'fill', 'White');
            anchor.setAttributeNS(null, 'stroke', this.stroke);
            anchor.setAttributeNS(null, 'stroke-width', '0.5');

            NFC.Utility.AddClass(anchor, 'workspace-anchor');

            this.el = anchor;
        };
        return Anchor;
    })();
    NFC.Anchor = Anchor;

    var AnchorBlock = (function () {
        function AnchorBlock(options) {
            this.parent = options.parent;
            this.width = options.width;
            this.height = options.height;
            this.verticalGeneration = options.verticalGeneration;
            this.anchorSize = options.anchorSize;
            if (this.verticalGeneration) {
                this._generateVertical();
            } else {
                this._generateHorizontal();
            }
        }
        AnchorBlock.prototype._selfGenerate = function () {
            var ns = NFC.Utility.GetSVGNS();

            var el = document.createElementNS(ns, 'g');

            el.setAttributeNS(null, 'x', '0');
            el.setAttributeNS(null, 'y', '0');

            el.setAttributeNS(null, 'width', this.width.toString());
            el.setAttributeNS(null, 'height', this.height.toString());

            this.el = el;

            this._anchors = [];
        };

        AnchorBlock.prototype._generateHorizontal = function () {
            var spaceSize = this.anchorSize * 2;

            var edgeSize = this.anchorSize;

            var total = spaceSize + this.anchorSize;
            var xCount = Math.ceil(this.width / total);
            var yCount = Math.ceil(this.height / total);

            this.width = xCount * total;
            this.height = yCount * total;

            this._selfGenerate();

            for (var y = 0; y < yCount; y++) {
                for (var x = 0; x < xCount; x++) {
                    var anc = new NFC.Anchor({
                        fill: '#FFF',
                        stroke: '#EEE',
                        index: [x, y],
                        size: this.anchorSize,
                        visible: true,
                        parent: this.el,
                        verticalGen: this.verticalGeneration,
                        edge: edgeSize,
                        space: spaceSize
                    });

                    this.el.appendChild(anc.el);

                    this._anchors.push(anc);
                }
            }
        };

        AnchorBlock.prototype._generateVertical = function () {
            var spaceSize = this.anchorSize * 2;

            var edgeSize = this.anchorSize;

            var total = spaceSize + this.anchorSize;
            var xCount = Math.ceil(this.width / total);
            var yCount = Math.ceil(this.height / total);

            this.width = xCount * total;
            this.height = yCount * total;

            this._selfGenerate();

            for (var x = 0; x < xCount; x++) {
                for (var y = 0; y < yCount; y++) {
                    var anc = new NFC.Anchor({
                        fill: '#FFF',
                        stroke: '#CCC',
                        index: [x, y],
                        size: this.anchorSize,
                        visible: true,
                        parent: this.el,
                        verticalGen: this.verticalGeneration,
                        edge: edgeSize,
                        space: spaceSize
                    });

                    this.el.appendChild(anc.el);

                    this._anchors.push(anc);
                }
            }
        };
        return AnchorBlock;
    })();
    NFC.AnchorBlock = AnchorBlock;

    var SVGAnchorCollection = (function () {
        function SVGAnchorCollection() {
        }
        return SVGAnchorCollection;
    })();
    NFC.SVGAnchorCollection = SVGAnchorCollection;
})(NFC || (NFC = {}));
var NFC;
(function (NFC) {
    var Wall = (function () {
        function Wall(options) {
            var w2 = options.width / 2;

            options.x = w2 + options.x;
            options.y = w2 + options.y;

            this.segments = [{ x: options.x, y: options.y }];
            this.width = options.width;

            this._currentSegment = { x: options.x, y: options.y };

            this._pathCommand = 'M' + this.segments[0].x + ' ' + this.segments[0].y + ' ';

            this.generateSelf();
        }
        Wall.prototype.generateSelf = function () {
            this.el = document.createElementNS(NFC.Utility.GetSVGNS(), 'path');

            this.el.setAttributeNS(null, 'stroke', 'black');
            this.el.setAttributeNS(null, 'stroke-width', this.width.toString());
            this.el.setAttributeNS(null, 'd', this._pathCommand);
        };

        Wall.prototype.drawLine = function () {
            var cmd = 'L ' + this._currentSegment.x + ' ' + this._currentSegment.y;
            this.el.setAttributeNS(null, 'd', this._pathCommand + cmd);
        };

        Wall.prototype.updateSegment = function (x, y) {
            this._currentSegment.x = x;
            this._currentSegment.y = y;

            this.drawLine();
        };

        Wall.prototype.completeSegment = function (x, y) {
            this.segments.push({ x: x, y: y });
            this._pathCommand += 'L ' + x + ' ' + y + ' ';
            this._currentSegment = { x: x, y: y };
            this.drawLine();
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

        WallContainer.prototype.anchorSelect = function (rect) {
            if (!this._inPath) {
                this._currentPath = new NFC.Wall({
                    x: parseInt(rect.getAttributeNS(null, 'x')),
                    y: parseInt(rect.getAttributeNS(null, 'y')),
                    width: parseInt(rect.getAttributeNS(null, 'width'))
                });

                this._walls.push(this._currentPath);

                this.el.appendChild(this._currentPath.el);

                this._inPath = true;
            } else {
                this._currentPath.completeSegment(parseInt(rect.getAttributeNS(null, 'x')), parseInt(rect.getAttributeNS(null, 'y')));
            }
        };

        WallContainer.prototype.updatePosition = function (x, y) {
            if (this._inPath) {
                this._currentPath.updateSegment(x, y);
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
    var Controls = (function () {
        function Controls(options) {
            this.container = options.container;
            this.workspace = options.workspace;

            this.workspace._addControls(this);
        }
        Controls.prototype.generateControls = function () {
            this.el = document.createElement('div');
            this.el.setAttribute('class', 'workspace-controls');

            this.navigate = document.createElement('a');
            this.navigate.setAttribute('class', 'workspace-control');
            this.navigate.innerHTML = 'Navigate';

            var self = this;
            this.navigate.addEventListener('click', function (ev) {
                var m = 'navigate';
                if (self.mode !== m) {
                    self.changeMode(m);
                    self.workspace.changeMode(self.mode);
                }
            });

            this.walls = document.createElement('a');
            this.walls.setAttribute('class', 'workspace-control');
            this.walls.innerHTML = 'Walls';

            this.walls.addEventListener('click', function (ev) {
                var m = 'walls';
                if (self.mode !== m) {
                    self.changeMode(m);
                    self.workspace.changeMode(self.mode);
                }
            });

            this.el.appendChild(this.navigate);
            this.el.appendChild(this.walls);

            this.container.appendChild(this.el);
        };

        Controls.prototype.changeMode = function (mode) {
            NFC.Utility.RemoveClass(this[this.mode], 'selected');
            NFC.Utility.AddClass(this[mode], 'selected');
            this.mode = mode;
        };

        Controls.prototype.initializeMode = function (mode) {
            this.mode = mode;
            NFC.Utility.AddClass(this[mode], 'selected');
            this.workspace.changeMode(mode);
        };
        return Controls;
    })();
    NFC.Controls = Controls;
})(NFC || (NFC = {}));
(function () {
    window['workspace'] = new NFC.Workspace('drawing');

    window['workspaceMap'] = new NFC.WorkspaceMap({
        container: document.getElementById('workspace'),
        workspace: window['workspace']
    });

    window['workspaceControls'] = new NFC.Controls({
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
