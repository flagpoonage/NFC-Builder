var NFC;
(function (NFC) {
    var Utility = (function () {
        function Utility() {
        }
        Utility.GetSVGNS = function () {
            return "http://www.w3.org/2000/svg";
        };

        Utility.GetClasses = function (el) {
            var classes = el.getAttribute('class');
            if (classes) {
                return classes.split(' ');
            }
            return [];
        };

        Utility.RemoveClass = function (el, className) {
            var classes = NFC.Utility.GetClasses(el);
            var i = classes.indexOf(className);
            if (i !== -1) {
                classes.splice(i, 1);
            }
            el.setAttribute('class', classes.join(' '));
        };

        Utility.AddClass = function (el, className) {
            var classes = NFC.Utility.GetClasses(el);
            var i = classes.indexOf(className);
            if (i === -1) {
                classes.push(className);
            }
            el.setAttribute('class', classes.join(' '));
        };
        return Utility;
    })();
    NFC.Utility = Utility;
})(NFC || (NFC = {}));
//# sourceMappingURL=nfc.utility.js.map
