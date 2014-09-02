interface NFCWallOptions {
    square: ISquarePoints;
    width: number;
}

interface NFCWallContainerOptions {
    workspace: NFC.Workspace;
    width: number;
    height: number;
}

module NFC {
    export class Wall {
        segments: ISquarePoints[];
        _currentSegment: ISquarePoints;
        _pathCommand: string;
        width: number;
        el: SVGPathElement;
        constructor(options: NFCWallOptions) {

            var w2 = options.width / 2;

            this.segments = [options.square];
            this.width = options.width;

            this._currentSegment = {
                square: options.square.square,
                bottomLeft: options.square.bottomLeft,
                bottomRight: options.square.bottomRight,
                topLeft: options.square.topLeft,
                topRight: options.square.topRight
            }

            this.generateSelf();

            this.generatePath(this.segments[0], this.segments[0]);
        }

        generateSelf() {
            this.el = <SVGPathElement>document.createElementNS(NFC.Utility.GetSVGNS(), 'path');

            this.el.setAttributeNS(null, 'stroke', 'black');
            this.el.setAttributeNS(null, 'stroke-width', '1');
            this.el.setAttributeNS(null, 'fill', '#AAA');
        }

        updateSegment(sq: ISquarePoints) {
            var cSeg = this.segments[this.segments.length - 1];
            if ((sq.square.x !== cSeg.square.x || sq.square.y !== cSeg.square.y) &&
                (sq.square.x !== this._currentSegment.square.x || sq.square.y !== this._currentSegment.square.y)) {

                if (this.segments.length === 1) {
                    this.generatePath(this.segments[0], sq);
                }
            }
        }

        _lt(c: Coordinate) {
            return 'L ' + c.x + ' ' + c.y + ' ';
        }

        _mt(c: Coordinate) {
            return 'M' + c.x + ' ' + c.y + ' ';
        }

        generatePath(start: ISquarePoints, next: ISquarePoints) {
            if (next.square.x > start.square.x) {
                if (next.square.y > start.square.y) {
                    this._pathCommand = this._mt(start.topLeft)
                    + this._lt(start.topRight)
                    + this._lt(next.topRight)
                    + this._lt(next.bottomRight)
                    + this._lt(next.bottomLeft)
                    + this._lt(start.bottomLeft)
                    + this._lt(start.topLeft);
                }
                else if (next.square.y < start.square.y) {
                    this._pathCommand = this._mt(start.topLeft)
                    + this._lt(next.topLeft)
                    + this._lt(next.topRight)
                    + this._lt(next.bottomRight)
                    + this._lt(start.bottomRight)
                    + this._lt(start.bottomLeft)
                    + this._lt(start.topLeft);
                }
                else {
                    this._pathCommand = this._mt(start.topLeft)
                    + this._lt(next.topRight)
                    + this._lt(next.bottomRight)
                    + this._lt(start.bottomLeft)
                    + this._lt(start.topLeft);
                }
            }
            else if (next.square.x < start.square.x) {
                if (next.square.y > start.square.y) {
                    this._pathCommand = this._mt(start.topLeft)
                    + this._lt(start.topRight)
                    + this._lt(start.bottomRight)
                    + this._lt(next.bottomRight)
                    + this._lt(next.bottomLeft)
                    + this._lt(next.topLeft)
                    + this._lt(start.topLeft);
                }
                else if (next.square.y < start.square.y) {
                    this._pathCommand = this._mt(start.topRight)
                    + this._lt(start.bottomRight)
                    + this._lt(start.bottomLeft)
                    + this._lt(next.bottomLeft)
                    + this._lt(next.topLeft)
                    + this._lt(next.topRight)
                    + this._lt(start.topRight);
                }
                else {
                    this._pathCommand = this._mt(start.topRight)
                    + this._lt(start.bottomRight)
                    + this._lt(next.bottomLeft)
                    + this._lt(next.topLeft)
                    + this._lt(start.topRight);
                }
            }
            else {
                if (next.square.y > start.square.y) {
                    this._pathCommand = this._mt(start.topLeft)
                    + this._lt(start.topRight)
                    + this._lt(next.bottomRight)
                    + this._lt(next.bottomLeft)
                    + this._lt(start.topLeft);
                }
                else if (next.square.y < start.square.y) {
                    this._pathCommand = this._mt(start.bottomRight)
                    + this._lt(start.bottomLeft)
                    + this._lt(next.topLeft)
                    + this._lt(next.topRight)
                    + this._lt(start.bottomRight)
                }
                else {
                    this._pathCommand = this._mt(this.segments[0].topLeft)
                    + this._lt(this.segments[0].topRight)
                    + this._lt(this.segments[0].bottomRight)
                    + this._lt(this.segments[0].bottomLeft)
                    + this._lt(this.segments[0].topLeft);
                }
            }

            this.el.setAttributeNS(null, 'd', this._pathCommand);
        }

        completeSegment(sq: ISquarePoints) {
            this.segments.push(sq);
            this.generatePath(this.segments[0], this.segments[1]);
        }
    }

    export class WallContainer {
        _walls: NFC.Wall[];
        workspace: NFC.Workspace;
        _inPath: boolean;
        _currentPath: NFC.Wall;
        el: SVGGElement;
        width: number;
        height: number;
        constructor(options: NFCWallContainerOptions) {
            this.workspace = options.workspace;
            this.width = options.width;
            this.height = options.height;

            this.generateSelf();
        }

        generateSelf() {
            var ns = NFC.Utility.GetSVGNS();

            var el = <SVGGElement>document.createElementNS(ns, 'g');

            el.setAttributeNS(null, 'x', '0');
            el.setAttributeNS(null, 'y', '0');

            el.setAttributeNS(null, 'width', this.width.toString());
            el.setAttributeNS(null, 'height', this.height.toString());

            this.el = el;

            this._walls = [];
        }

        selectSquare(sq: ISquarePoints) {
            var sz = sq.topRight.x - sq.topLeft.x;
            var mid = sz / 2;
            if (!this._inPath) {
                this._currentPath = new NFC.Wall({
                    square: sq,
                    width: sz,
                });

                this.el.appendChild(this._currentPath.el);

                this._inPath = true;
            }
            else {
                this._currentPath.completeSegment(sq);

                this._walls.push(this._currentPath);

                this._currentPath = new NFC.Wall({
                    square: sq,
                    width: sz,
                });

                this._walls.push(this._currentPath);

                this.el.appendChild(this._currentPath.el);
            }
        }

        updatePosition(sq) {
            if (this._inPath) {
                this._currentPath.updateSegment(sq);
            }
        }

        stopPathing() {
            if (this._inPath) {
                this.el.removeChild(this._currentPath.el);
                this._currentPath = null;
                this._inPath = false;
            }
        }
    }
} 