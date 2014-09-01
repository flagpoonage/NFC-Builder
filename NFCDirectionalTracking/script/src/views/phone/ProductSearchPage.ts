/// <reference path="../../global.ts" />

module NFCApp {
    export class ProductSearchPage extends Backbone.View<any> {
        constructor(options?: Backbone.ViewOptions<any>) {
            options = options || {};
            options.el =  '#product-search';
            super(options);
        }

        initialize() {

            Global.getCurrent().events.on('product-found', this.hide, this);
            Global.getCurrent().events.on('product-notfound', this.noproduct, this);
        }

        noproduct() {

        }

        hide() {
            this.$el.hide();
        }

        show() {
            this.$el.show();
        }

        searchProduct(ev: JQueryEventObject) {
            var text = $('#product-search-input').val();

            if (text.length > 0) {
                Global.getCurrent().searchProduct(text);
            }
        }
    }

    ProductSearchPage.prototype.events = <any>{
        'click button#product-search-button': 'searchProduct'
    };
} 