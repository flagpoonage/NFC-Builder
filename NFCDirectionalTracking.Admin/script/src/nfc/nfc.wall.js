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
//# sourceMappingURL=nfc.wall.js.map
