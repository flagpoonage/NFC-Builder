var NFCApp;
(function (NFCApp) {
    var Ajax = (function () {
        function Ajax() {
        }
        Ajax.fetchJSON = function (options) {
            if (typeof (options) === 'undefined' || options === null) {
                throw 'No options supplied to API';
            }

            if (typeof (options.url) === 'undefined' || options === null) {
                throw 'No URL supplied to API';
            }

            if (typeof (options.params) === 'undefined' || options === null) {
                options.params = [];
            }

            if (typeof (options.success) === 'undefined') {
                options.success = null;
            }
            if (typeof (options.failure) === 'undefined') {
                options.failure = null;
            }

            var pString = '?';
            for (var i = 0; i < options.params.length; i++) {
                if (i > 0) {
                    pString += '&';
                }
                pString += options.params[i].name + '=' + options.params[i].value;
            }

            if (pString.length > 1) {
                options.url += pString;
            }

            var http = new XMLHttpRequest();
            http.open("GET", options.url, true);

            //Send the proper header information along with the request
            http.setRequestHeader("Content-type", "application/json");

            http.onreadystatechange = function () {
                //Call a function when the state changes.
                if (http.readyState == 4) {
                    if (http.status == 200) {
                        if (options.success != null) {
                            options.success(JSON.parse(http.responseText));
                        }
                    } else {
                        if (options.failure != null) {
                            options.failure(http.responseText);
                        }
                    }
                }
            };

            http.send(options.params);
        };
        return Ajax;
    })();
    NFCApp.Ajax = Ajax;
})(NFCApp || (NFCApp = {}));
var NFCApp;
(function (NFCApp) {
    var Global = (function () {
        function Global() {
            this.events = _.extend(Backbone.Events);
        }
        Global.prototype.searchProduct = function (id) {
            var self = this;
            NFCApp.Ajax.fetchJSON({
                url: 'api/products/' + id,
                params: [
                    { name: 'qType', value: 'details' }
                ],
                success: function (data) {
                    self.parseProductDetails(data);
                }
            });
        };

        Global.prototype.selectProductMatrice = function (id, colourID, sizeID) {
            var self = this;
            NFCApp.Ajax.fetchJSON({
                url: 'api/matrixes/',
                params: [
                    { name: 'productId', value: id },
                    { name: 'colourId', value: colourID },
                    { name: 'sizeId', value: sizeID }
                ],
                success: function (data) {
                    self.setSelectedProduct(data);
                }
            });
        };

        Global.prototype.setSelectedProduct = function (data) {
        };

        Global.prototype.parseProductDetails = function (data) {
            if (_.isUndefined(data.Details) || _.isNull(data.Details)) {
                this.events.trigger('product-notfound');
            } else {
                var ls = [];
                for (var i = 0; i < data.Details.length; i++) {
                    ls.push(new NFCApp.ProductDetails(data.Details[i]));
                }

                this.productDetailsList = ls;
                this.events.trigger('product-found');
            }
        };

        Global.getCurrent = function () {
            return Global['__current'];
        };
        return Global;
    })();
    NFCApp.Global = Global;

    Global['__current'] = new Global();
})(NFCApp || (NFCApp = {}));
/// <reference path="../../global.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var NFCApp;
(function (NFCApp) {
    var ProductSearchPage = (function (_super) {
        __extends(ProductSearchPage, _super);
        function ProductSearchPage(options) {
            options = options || {};
            options.el = '#product-search';
            _super.call(this, options);
        }
        ProductSearchPage.prototype.initialize = function () {
            NFCApp.Global.getCurrent().events.on('product-found', this.hide, this);
            NFCApp.Global.getCurrent().events.on('product-notfound', this.noproduct, this);
        };

        ProductSearchPage.prototype.noproduct = function () {
        };

        ProductSearchPage.prototype.hide = function () {
            this.$el.hide();
        };

        ProductSearchPage.prototype.show = function () {
            this.$el.show();
        };

        ProductSearchPage.prototype.searchProduct = function (ev) {
            var text = $('#product-search-input').val();

            if (text.length > 0) {
                NFCApp.Global.getCurrent().searchProduct(text);
            }
        };
        return ProductSearchPage;
    })(Backbone.View);
    NFCApp.ProductSearchPage = ProductSearchPage;

    ProductSearchPage.prototype.events = {
        'click button#product-search-button': 'searchProduct'
    };
})(NFCApp || (NFCApp = {}));
/// <reference path="../../global.ts" />
var NFCApp;
(function (NFCApp) {
    var ProductMatrixPage = (function (_super) {
        __extends(ProductMatrixPage, _super);
        function ProductMatrixPage(options) {
            options = options || {};
            options.el = '#product-matrix-page';
            _super.call(this, options);
        }
        ProductMatrixPage.prototype.initialize = function () {
            NFCApp.Global.getCurrent().events.on('product-found', this.listProducts, this);
        };

        ProductMatrixPage.prototype.listProducts = function () {
            this.listings = [];
            var p = NFCApp.Global.getCurrent().productDetailsList;
            for (var i = 0; i < p.length; i++) {
                var sub = new NFCApp.ProductMatrixListing();
                sub.setData(p[i]);
                this.listings.push(sub);

                this.$el.append(sub.$el);
            }

            this.show();
        };

        ProductMatrixPage.prototype.show = function () {
            this.$el.show();
        };

        ProductMatrixPage.prototype.hide = function () {
            this.$el.hide();
        };
        return ProductMatrixPage;
    })(Backbone.View);
    NFCApp.ProductMatrixPage = ProductMatrixPage;
})(NFCApp || (NFCApp = {}));
/// <reference path="global.ts" />
/// <reference path="views/phone/ProductSearchPage.ts" />
/// <reference path="views/phone/ProductMatrixPage.ts" />
(function () {
    var search = new NFCApp.ProductSearchPage();
    var matrix = new NFCApp.ProductMatrixPage();
}).call(this);
var NFCApp;
(function (NFCApp) {
    var ProductDetails = (function () {
        function ProductDetails(data) {
            this.ID = data.ID;
            this.ColourID = data.ColourID;
            this.SizeID = data.SizeID;
            this.Name = data.Name;
            this.Colour = data.Colour;
            this.Size = data.Size;
        }
        return ProductDetails;
    })();
    NFCApp.ProductDetails = ProductDetails;
})(NFCApp || (NFCApp = {}));
var NFCApp;
(function (NFCApp) {
    var ProductMatrixListing = (function (_super) {
        __extends(ProductMatrixListing, _super);
        function ProductMatrixListing(options) {
            options = options || {};
            options.tagName = 'div';
            options.className = 'product-matrix-listing';
            _super.call(this, options);
        }
        ProductMatrixListing.prototype.setData = function (data) {
            this.data = data;
            this.render();
        };

        ProductMatrixListing.prototype.render = function () {
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
        };

        ProductMatrixListing.prototype.selectMatrice = function (ev) {
            NFCApp.Global.getCurrent().selectProductMatrice(this.data.ID, this.data.ColourID, this.data.SizeID);
        };
        return ProductMatrixListing;
    })(Backbone.View);
    NFCApp.ProductMatrixListing = ProductMatrixListing;

    ProductMatrixListing.prototype.events = {
        'click': 'selectMatrice'
    };
})(NFCApp || (NFCApp = {}));
//# sourceMappingURL=app.js.map
