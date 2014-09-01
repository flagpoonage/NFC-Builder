module NFCApp {
    export class Global {
        events: Backbone.Events;
        productDetailsList: ProductDetails[];
        constructor() {
            this.events = _.extend(Backbone.Events);
        }

        searchProduct(id: string) {
            var self = this;
            Ajax.fetchJSON({
                url: 'api/products/' + id,
                params: [
                    { name: 'qType', value: 'details' }
                ],
                success: function (data) {
                    self.parseProductDetails(data);
                }
            });
        }

        selectProductMatrice(id: number, colourID: number, sizeID: number) {
            var self = this;
            Ajax.fetchJSON({
                url: 'api/matrixes/',
                params: <URLParameter[]>[
                    { name: 'productId', value: id },
                    { name: 'colourId', value: colourID },
                    { name: 'sizeId', value: sizeID }
                ],
                success: function (data) {
                    self.setSelectedProduct(data);
                }
            });
        }

        setSelectedProduct(data: any) {

        }

        parseProductDetails(data: any) {
            if(_.isUndefined(data.Details) || _.isNull(data.Details)) {
                this.events.trigger('product-notfound');
            }
            else {
                var ls = [];
                for (var i = 0; i < data.Details.length; i++) {
                    ls.push(new ProductDetails(data.Details[i]));
                }

                this.productDetailsList = ls;
                this.events.trigger('product-found');
            }
        }

        static getCurrent(): Global {
            return Global['__current'];
        }
    }

    Global['__current'] = new Global();
}