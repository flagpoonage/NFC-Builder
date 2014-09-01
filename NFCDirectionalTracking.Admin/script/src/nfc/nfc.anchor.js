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
//# sourceMappingURL=nfc.anchor.js.map
