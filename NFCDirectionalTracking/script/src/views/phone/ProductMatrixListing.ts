module NFCApp {
    export class ProductMatrixListing extends Backbone.View<any> {
        data: ProductDetails;
        constructor(options?: Backbone.ViewOptions<any>) {
            options = options || {};
            options.tagName = 'div';
            options.className = 'product-matrix-listing';
            super(options);
        }

        setData(data: ProductDetails) {
            this.data = data;
            this.render();
        }

        render(): ProductMatrixListing {
            this.$el.empty();

            var name = $('<span>');
            var colour = $('<span>');
            var size = $('<span>');

            this.$el.attr('data-id', this.data.ID);

            name.html(this.data.Name);
            colour.html(this.data.Colour);
            size.html(this.data.Size);

            colour.attr('data-id', this.data.ColourID);
            size.attr('data-id', this.data.SizeID);

            this.$el.append(name, colour, size);

            return this;
        }

        selectMatrice(ev: JQueryEventObject) {
            Global.getCurrent().selectProductMatrice(this.data.ID, this.data.ColourID, this.data.SizeID);
        }
    }

    ProductMatrixListing.prototype.events = <any>{
        'click': 'selectMatrice'
    };
}