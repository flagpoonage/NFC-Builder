interface APIFetchJSONOptions {
    url: string;
    params?: URLParameter[];
    success?: (responseBody: any) => void;
    failure?: (responseBody: any) => void;
}

interface URLParameter {
    name: string;
    value: string;
}

module NFCApp {
    export class Ajax {
        static fetchJSON(options?: APIFetchJSONOptions) {
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
                    }
                    else {
                        if (options.failure != null) {
                            options.failure(http.responseText);
                        }
                    }
                }
            }

            http.send(options.params);
        }
    }
}