module NFCApp {
    export class ProductDetails {
        ID: number;
        ColourID: number;
        SizeID: number;
        Name: string;
        Colour: string;
        Size: string;
        constructor(data: any) {
            this.ID = data.ID;
            this.ColourID = data.ColourID;
            this.SizeID = data.SizeID;
            this.Name = data.Name;
            this.Colour = data.Colour;
            this.Size = data.Size;
        }
    }
} 