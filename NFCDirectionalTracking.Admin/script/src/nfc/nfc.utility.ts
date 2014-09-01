module NFC {
    export class Utility {
        constructor() {
        }

        static GetSVGNS() {
            return "http://www.w3.org/2000/svg";
        }

        static GetClasses(el: Element): string[]{
            var classes = el.getAttribute('class');
            if (classes) {
                return classes.split(' ');
            }
            return [];
        }

        static RemoveClass(el: Element, className: string) {
            var classes = NFC.Utility.GetClasses(el);
            var i = classes.indexOf(className);
            if (i !== -1) {
                classes.splice(i, 1);
            }
            el.setAttribute('class', classes.join(' '));
        }

        static AddClass(el: Element, className: string) {
            var classes = NFC.Utility.GetClasses(el);
            var i = classes.indexOf(className);
            if (i === -1) {
                classes.push(className);
            }
            el.setAttribute('class', classes.join(' '));
        }
    }
} 