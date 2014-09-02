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
//# sourceMappingURL=nfc.wall.js.map
