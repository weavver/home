

class CookieHelper {
/**
 * Receives an array of headers and extract the value from the cookie header
 * @param  {String}   errors List of errors
 * @return {Object}
 */
public getCookiesFromHeader(headers : any) {

    if (headers === null || headers === undefined || headers.Cookie === undefined) {
        return {};
    }

    // Split a cookie string in an array (Originally found http://stackoverflow.com/a/3409200/1427439)
    var list : any = {},
        rc : any = headers.Cookie;

    rc && rc.split(';').forEach(function( cookie : any ) {
        var parts = cookie.split('=');
        var key = parts.shift().trim()
        var value = decodeURI(parts.join('='));
        if (key != '') {
            list[key] = value
        }
    });

    return list;
};



/**
 * Build a string appropriate for a `Set-Cookie` header.
 * @param {string} key     Key-name for the cookie.
 * @param {string} value   Value to assign to the cookie.
 * @param {object} options Optional parameter that can be use to define additional option for the cookie.
 * ```
 * {
 *     secure: boolean // Watever to output the secure flag. Defaults to true.
 *     httpOnly: boolean // Watever to ouput the HttpOnly flag. Defaults to true.
 *     domain: string // Domain to which the limit the cookie. Default to not being outputted.
 *     path: string // Path to which to limit the cookie. Defaults to '/'
 *     expires: UTC string or Date // When this cookie should expire.  Default to not being outputted.
 *     maxAge: integer // Max age of the cookie in seconds. For compatibility with IE, this will be converted to a
*          `expires` flag. If both the expires and maxAge flags are set, maxAge will be ignores. Default to not being
*           outputted.
 * }
 * ```
 * @return string
 */
 public setCookieString(key : String, value : String, options : any) {
    var defaults = {
        secure: true,
        httpOnly: true,
        domain: false,
        path: '/',
        expires: false,
        maxAge: false
    }
    if (typeof options == 'object') {
        options = Object.assign({}, defaults, options);
    } else {
        options = defaults;
    }

    var cookie = key + '=' + value;

    if (options.domain) {
        cookie = cookie + '; domain=' + options.domain;
    }

    if (options.path) {
        cookie = cookie + '; path=' + options.path;
    }

    if (!options.expires && options.maxAge) {
        options.expires = new Date(new Date().getTime() + parseInt(options.maxAge) * 1000); // JS operate in Milli-seconds
    }

    if (typeof options.expires == "object" && typeof options.expires.toUTCString) {
        options.expires = options.expires.toUTCString();
    }

    if (options.expires) {
        cookie = cookie + '; expires=' + options.expires.toString();
    }

    if (options.secure) {
        cookie = cookie + '; Secure';
    }

    if (options.httpOnly) {
        cookie = cookie + '; HttpOnly';
    }

    return cookie;
}
}

export = CookieHelper;