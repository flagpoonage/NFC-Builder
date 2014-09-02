var NFC;
(function (NFC) {
    (function (Controls) {
        var Build = (function () {
            function Build(options) {
                this.workspace = options.workspace;
                this.container = options.container;
            }
            return Build;
        })();
        Controls.Build = Build;
    })(NFC.Controls || (NFC.Controls = {}));
    var Controls = NFC.Controls;
})(NFC || (NFC = {}));
//# sourceMappingURL=nfc.controls.build.js.map
