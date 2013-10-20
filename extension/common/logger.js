/**
 * Logger for backround page.
 * It will collect messages from popup/app js and stream it to backgoudn page console
 */
var logger = (function() {
    /**
     * Emit message
     * @param {Object} type Type of log (log,debug,warn,error)
     * @param {Object} args arguments
     */
    var emit = function(type, args) {
        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({
                logger : type,
                args : args
            });
        }
    };
    /**
     * Collect messages
     */
    var collect = function() {
        if (chrome && chrome.runtime && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                if (request.logger) {
                    var arr = [];
                    for (item in request.args) {
                        arr.push(request.args[item]);
                    }
                    console[request.logger].apply(console, arr);
                }
            });
        }
    };
    /**
     * console.log
     */
    var log = function() {
        emit('log', arguments);
    };
    /**
     * console.debug
     */
    var debug = function() {
        emit('debug', arguments);
    };
    /**
     * console.warn
     */
    var warn = function() {
        emit('warn', arguments);
    };
    /**
     * console.error
     */
    var error = function() {
        emit('error', arguments);
    };

    /**
     * Public methods
     */
    return {
        collect : collect,
        log : log,
        debug : debug,
        warn : warn,
        error : error
    };
})();
