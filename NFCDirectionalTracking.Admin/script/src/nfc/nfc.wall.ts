interface NFCWallOptions {
    x: number;
    y: number;
    width: number;
}

interface NFCWallContainerOptions {
    workspace: NFC.Workspace;
    width: number;
    height: number;
}

module NFC {
    export class Wall {
        segments: any[];
        _currentSegment: any;
        _pathCommand: string;
        width: number;
        el: SVGPathElement;
        constructor(options: NFCWallOptions) {

            var w2 = options.width / 2;

            options.x = w2 + options.x;
            options.y = w2 + options.y;

            this.segments = [{ x: options.x, y: options.y }];
            this.width = options.width;

            this._currentSegment = { x: options.x, y: options.y };

            this._pathCommand = 'M' + this.segments[0].x + ' ' + this.segments[0].y + ' ';

            this.generateSelf();
        }

        generateSelf() {
            this.el = <SVGPathElement>document.createElementNS(NFC.Utility.GetSVGNS(), 'path');

            this.el.setAttributeNS(null, 'stroke', 'black');
            this.el.setAttributeNS(null, 'stroke-width', this.width.toString());
            this.el.setAttributeNS(null, 'd', this._pathCommand);
        }

        drawLine() {
            var cmd = 'L ' + this._currentSegment.x + ' ' + this._currentSegment.y;
            this.el.setAttributeNS(null, 'd', this._pathCommand + cmd);
        }

        updateSegment(x, y) {
            this._currentSegment.x = x;
            this._currentSegment.y = y;

            this.drawLine();
        }

        completeSegment(x ,y) {
            this.segments.push({ x: x, y: y });
            this._pathCommand += 'L ' + x + ' ' + y + ' ';
            this._currentSegment = { x: x, y: y };
            this.drawLine();
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

        anchorSelect(rect: SVGRectElement) {
            if (!this._inPath) {
                this._currentPath = new NFC.Wall({
                    x: parseInt(rect.getAttributeNS(null, 'x')),
                    y: parseInt(rect.getAttributeNS(null, 'y')),
                    width: parseInt(rect.getAttributeNS(null, 'width')),
                });

                this._walls.push(this._currentPath);

                this.el.appendChild(this._currentPath.el);

                this._inPath = true;
            }
            else {
                this._currentPath.completeSegment(
                    parseInt(rect.getAttributeNS(null, 'x')),
                    parseInt(rect.getAttributeNS(null, 'y')));
            }
        }

        updatePosition(x, y) {
            if (this._inPath) {
                this._currentPath.updateSegment(x, y);
            }
        }
    }
} 