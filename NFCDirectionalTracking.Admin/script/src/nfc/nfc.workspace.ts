/// <reference path="nfc.utility.ts" />
/// <reference path="nfc.anchor.ts" />
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
        _anchorContainer: NFC.AnchorBlock;
        _wallContainer: NFC.WallContainer;
        _ns: string;
        _mode: string;
        width: number;
        height: number;
        movement: IMovement;
        evHandlers: any;
        map: NFC.WorkspaceMap;
        controls: NFC.Controls;
        constructor(id: string) {
            this._ns = NFC.Utility.GetSVGNS();
            var el = <any>document.getElementById(id);

            if (el.tagName.toLowerCase() === 'svg') {
                this._el = <SVGSVGElement>el;
            }
            else {
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
                anchorSize: 5,
            });

            this._el.appendChild(this._anchorContainer.el);
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

        _addControls(controls: NFC.Controls) {
            this.controls = controls;

            var self = this;

            var fn = function () {
                if (self.map.container.clientHeight > 0) {
                    self.controls.generateControls();
                    self.controls.initializeMode(self._mode);
                }
                else {
                    setTimeout(fn, 50);
                }
            }

            setTimeout(fn, 50);

        }

        changeMode(mode: string) {
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
        }

        exitNavigationMode() {
            this._el.style.cursor = '';
            this._anchorContainer.el.style.display = '';
            this._el.removeEventListener('mousedown', this.evHandlers.navigationMode.mousedown);
            window.removeEventListener('mouseup', this.evHandlers.navigationMode.mouseup);
            this._el.removeEventListener('mousemove', this.evHandlers.navigationMode.mousemove);
        }

        enterNavigationMode() {
            this._anchorContainer.el.style.display = 'none';
            this._el.style.cursor = 'pointer';
            this._el.addEventListener('mousedown', this.evHandlers.navigationMode.mousedown);
            window.addEventListener('mouseup', this.evHandlers.navigationMode.mouseup);
            this._el.addEventListener('mousemove', this.evHandlers.navigationMode.mousemove);
        }

        exitWallsMode() {
            this._el.style.cursor = '';
            this._el.removeEventListener('click', this.evHandlers.wallsMode.click);
            this._el.removeEventListener('mousemove', this.evHandlers.wallsMode.mousemove);
        }

        enterWallsMode() {
            this._el.style.cursor = 'crosshair';
            this._el.addEventListener('click', this.evHandlers.wallsMode.click);
            this._el.addEventListener('mousemove', this.evHandlers.wallsMode.mousemove);
        }
    }

    NFC.Workspace.prototype.evHandlers = <any>{
        navigationMode: {
            mousedown: function (ctx) {
                return function (ev) {
                    ctx.movement.moving = true;
                    ctx.movement.moveStartX = ev.clientX;
                    ctx.movement.moveStartY = ev.clientY;
                }
            },
            mouseup: function (ctx) {
                return function (ev) {
                    ctx.movement.moving = false;
                }
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
                        }
                        else if (-ctx.movement.currentX > ctx.width - w) {
                            ctx.movement.currentX = -(ctx.width - w);
                            ctx._el.style.left = (-(ctx.width - w)).toString();
                        }

                        if (ctx.movement.currentY > 0) {
                            ctx.movement.currentY = 0;
                        }
                        else if (-ctx.movement.currentY > ctx.height - h) {
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
                }
            }
        },
        wallsMode:
        {
            click: function (ctx: NFC.Workspace) {
                return function (ev) {
                    var d = document.elementFromPoint(ev.clientX, ev.clientY);
                    ev.target = d;
                    var t = <SVGRectElement>ev.target;
                    ctx._wallContainer.anchorSelect(t);
                }
            },
            mousemove: function (ctx: NFC.Workspace) {
                return function (ev) {
                    ctx._wallContainer.updatePosition(ev.clientX, ev.clientY);
                }
            }
        }
    }
}