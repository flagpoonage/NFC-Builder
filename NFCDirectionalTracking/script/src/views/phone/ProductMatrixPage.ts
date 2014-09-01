/// <reference path="../../global.ts" />

module NFCApp {
    export class ProductMatrixPage extends Backbone.View<any> {
        listings: ProductMatrixListing[];
        constructor(options?: Backbone.ViewOptions<any>) {
            options = options || {};
            options.el = '#product-matrix-page';
            super(options);
        }

        initialize(): void {
            Global.getCurrent().events.on('product-found', this.listProducts, this);
        }

        listProducts(): void {
            this.listings = [];
            var p = Global.getCurrent().productDetailsList;
            for (var i = 0; i < p.length; i++) {
                var sub = new ProductMatrixListing();
                sub.setData(p[i]);
                this.listings.push(sub);

                this.$el.append(sub.$el);
            }

            this.show();
        }

        show() {
            this.$el.show();
        }

        hide() {
            this.$el.hide();
        }
    }
} 