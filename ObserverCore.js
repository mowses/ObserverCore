;
(function($, Events, ObjDiff, ObjDeleted) {

    function ObserverCore() {
        var self = this,
            data = {},
            data_old = {},
            timeout = undefined,
            watching_callbacks = [];

        this.events = new Events([
            'update data'
        ]);

        this.utils = {
            /**
             * create and return javascript nested objects with dinamic keys
             */
            object: function(indexes, value) {
                var object = {},
                    inner_object = object,
                    indexes_length = indexes.length - 1;

                for (i in indexes) {
                    var key = indexes[i];

                    if (i < indexes_length) {
                        inner_object[key] = {};
                        inner_object = inner_object[key];
                    } else {
                        inner_object[key] = value;
                    }
                }

                return object;
            },

            isset: function() {
                var a = arguments,
                    l = a.length,
                    i = 0,
                    undef;

                while (i !== l) {
                    if (a[i] === undef || a[i] === null) return false;
                    i++;
                }
                return true;
            },

            getProp: function(o, s) {
                var a = propToArray(s);
                while (a.length) {
                    var n = a.shift();
                    if (!$.isPlainObject(o) && !$.isArray(o)) {
                        return;
                    } else if (n in o) {
                        o = o[n];
                    } else {
                        return;
                    }
                }
                return o;
            }
        };

        function propToArray(s) {
            s = s.replace(/["']/g, ''); // replace single and double quotes
            s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            s = s.replace(/^[.\s]+|[.\s]+$/g, ''); // strip a leading dot
            var a = s.split('.');

            return a;
        }

        function check_changes(old_data, new_data) {
            var data_diff = ObjDiff(new_data, old_data),
                data_deleted = ObjDeleted(data, old_data);

            if (!$.isEmptyObject(data_diff) || !$.isEmptyObject(data_deleted)) {
                self.events.trigger('update data', {
                    old: old_data,
                    new: new_data,
                    diff: data_diff,
                    deleted: data_deleted
                });
            }
        }

        function stopTimeout() {
            clearTimeout(timeout);
            timeout = undefined;
        }

        function startTimeout() {
            if (timeout !== undefined) return;

            stopTimeout();

            timeout = setTimeout(function() {
                self.apply();
            });
        }

        function init() {
            self.events.on('update data.__watching_data__', function(updated_data) {
                var utils = self.utils;

                $.each(watching_callbacks, function(i, watching) {
                    var diff = (function() {
                            var _diff;

                            $.each(watching.params, function(i, param) {
                                param = $.isFunction(param) ? param() : param;
                                var prop = utils.getProp(updated_data, 'diff.' + param);

                                if (utils.isset(prop)) {
                                    _diff = prop;
                                    return false;
                                }
                            });

                            return _diff;
                        })(),

                        deleted = (function() {
                            var _deleted;

                            $.each(watching.params, function(i, param) {
                                param = $.isFunction(param) ? param() : param;
                                var prop = utils.getProp(updated_data, 'deleted.' + param);

                                if (utils.isset(prop)) {
                                    _deleted = prop;
                                    return false;
                                }
                            });

                            return _deleted;
                        })();

                    if (!utils.isset(diff) && !utils.isset(deleted)) return;

                    // run the callback
                    watching.callback.call(watching.scope, updated_data);

                });
            });

        }

        this.setData = function(new_data, replace) {
            if (replace) {
                $.each(new_data, function(k, val) {
                    data[k] = val;
                });
            } else {
                data = new_data;
            }

            startTimeout();

            return this;
        };

        this.extendData = function(new_data) {
            $.extend(true, data, new_data);

            startTimeout();

            return this;
        };

        this.apply = function() {
            var old_data = data_old;

            data_old = $.extend(true, {}, data);
            check_changes(old_data, data);

            stopTimeout();

            return this;
        };

        this.restoreParams = function() {
            data = $.extend(true, {}, data_old);
            stopTimeout();

            return this;
        };

        /**
         * watch for changes in your data
         * @param  {string, array, callback}   params   params to watch for
         * @param  {Function} callback callback to run when your param changes
         * @return {Object}            return itself for method chaining
         */
        this.watch = function(params, callback) {

            params = $.makeArray(params);
            params = params.length ? params : [''];

            watching_callbacks.push({
                params: params,
                callback: callback,
                scope: this
            });

            return this;
        };

        this.getData = function(prop) {
            var _data = data;

            if ($.type(prop) === 'string') {
                _data = this.utils.getProp(data, prop);
            }

            if ($.isPlainObject(_data) || $.isArray(_data)) {
                // only start timeout if _data is either an object or array
                // if returned _data is a primitive value, it doesnt need to start timeout
                // since you cannot change the value of returned _data outside this scope
                startTimeout();
            }

            return _data;
        };

        init();

    }

    // Node: Export function
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.ObserverCore = ObserverCore;
    }
    // AMD/requirejs: Define the module
    else if (typeof define === 'function' && define.amd) {
        define(function() {
            return ObserverCore;
        });
    }
    // Browser: Expose to window
    else {
        window.ObserverCore = ObserverCore;
    }

})(jQuery, Events, ObjDiff, ObjDeleted);