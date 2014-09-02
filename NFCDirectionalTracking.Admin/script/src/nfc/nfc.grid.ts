interface GridOptions {
    size: number;
    workspace: NFC.Workspace;
    colours: GridColours;
}

interface GridColours {
    standard: string;
    alternate: string;
}

interface Coordinate {
    x: number;
    y: number;
}

interface ISquarePoints {
    square: Coordinate;
    topLeft: Coordinate;
    topRight: Coordinate;
    bottomLeft: Coordinate;
    bottomRight: Coordinate;
}

module NFC {
    export class Grid {
        size: number;
        workspace: NFC.Workspace;
        colours: GridColours;
        pattern: SVGPatternElement;
        display: SVGRectElement;
        constructor(options: GridOptions) {
            this.size = options.size;
            this.workspace = options.workspace;
            this.colours = options.colours || {
                standard: '#FFF',
                alternate: '#EEE'
            }

            this.generateGrid();
        }

        generateGrid(): void {
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

            this.display = <SVGRectElement>document.createElementNS(NFC.Utility.GetSVGNS(), 'rect');

            this.display.setAttribute('id', 'grid-display');
            this.display.setAttribute('width', this.workspace.width.toString());
            this.display.setAttribute('height', this.workspace.height.toString());
            this.display.setAttributeNS(null, 'x', '0');
            this.display.setAttributeNS(null, 'y', '0');
            this.display.setAttributeNS(null, 'fill', 'url(#' + this.pattern.id + ')');

            this.workspace._el.appendChild(this.display);
        }

        generatePattern(): void {
            var szStr = this.size.toString();

            this.pattern = <SVGPatternElement>document.createElementNS(NFC.Utility.GetSVGNS(), 'pattern');

            this.pattern.setAttribute('id', 'grid-pattern');
            this.pattern.setAttributeNS(null, 'patternUnits', 'userSpaceOnUse');

            this.pattern.setAttributeNS(null, 'x', '0');
            this.pattern.setAttributeNS(null, 'y', '0');
            this.pattern.setAttributeNS(null, 'width', (this.size * 2).toString());
            this.pattern.setAttributeNS(null, 'height', (this.size * 2).toString());

            var rectStandard1 = <SVGRectElement>document.createElementNS(NFC.Utility.GetSVGNS(), 'rect');
            var rectStandard2 = <SVGRectElement>document.createElementNS(NFC.Utility.GetSVGNS(), 'rect');
            var rectAlternate1 = <SVGRectElement>document.createElementNS(NFC.Utility.GetSVGNS(), 'rect');
            var rectAlternate2 = <SVGRectElement>document.createElementNS(NFC.Utility.GetSVGNS(), 'rect');

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
        }

        getSquarePoints(x, y): ISquarePoints {

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
                    y: (yCoord * this.size) + this.size,
                },
                topRight: {
                    x: (xCoord * this.size) + this.size,
                    y: yCoord * this.size
                },
                bottomRight: {
                    x: (xCoord * this.size) + this.size,
                    y: (yCoord * this.size) + this.size
                },
            }
        }
    }
}