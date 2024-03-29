import {ObjDeleted, ObjDiff} from '@mowses/ObjDiff';
import Events from '@mowses/Events';

const ObserverCore = function () {
    let self = this,
        data = {},
        data_old = {},
        watching_callbacks = [];

    this.events = new Events([
        'update data'
    ]);

    function check_changes(old_data, new_data) {
        let data_diff = ObjDiff(new_data, old_data),
            data_deleted = ObjDeleted(data, old_data);

        if (!ObjDiff.prototype.utils.isEmptyObject(data_diff) || !ObjDiff.prototype.utils.isEmptyObject(data_deleted)) {
            self.events.trigger('update data', {
                old: old_data,
                new: new_data,
                diff: data_diff,
                deleted: data_deleted
            });
        }
    }

    function init() {
        self.events.on('update data.__watching_data__', function (updated_data) {
            let utils = self.utils;

            watching_callbacks.forEach(function (watching) {
                let diff = (function () {
                        let _diff = undefined,
                            inArray = ObjDiff.prototype.utils.inArray,
                            isArray = Array.isArray;

                        watching.params.forEach(function (param) {
                            let result = param(),
                                prop,
                                old_prop;

                            if (result[0] == 'delete') return;

                            prop = utils.getProp(updated_data, 'diff.' + result[1]);

                            if (prop === undefined) return;

                            old_prop = utils.getProp(updated_data, 'old.' + result[1]);

                            /**
                             * listening to "add" events, make sure to trigger only when adding the property
                             * for this, check for the previously value inside "old" property
                             *
                             * exception for array values:
                             *
                             */
                            if (result[0] == 'add') {
                                if (isArray(prop)) {
                                    if (isArray(old_prop) && prop.length <= old_prop.length) return;  // not added new item to array

                                    // trigger callback even if prop is array and old_prop not

                                    // probably old_prop is not an array
                                    // or old_prop is an array but length < prop
                                    // then its ok to carry on

                                } else if (utils.isset(old_prop)) return;
                            }

                            /**
                             * listening to "change" events, make sure to trigger only when changed the property
                             * for this, check for the previously value inside "old" property (should be previously set)
                             */
                            if (result[0] == 'change' && !utils.isset(old_prop)) return;

                            _diff = prop;
                            return false;
                        });

                        return _diff;
                    })(),

                    deleted = (function () {
                        let _deleted = undefined,
                            inArray = ObjDiff.prototype.utils.inArray,
                            isArray = Array.isArray;

                        watching.params.forEach(function (param) {
                            let result = param(),
                                prop = utils.getProp(updated_data, 'deleted.' + result[1]);

                            if (!utils.isset(prop)) return;

                            if (inArray(result[0], ['add', 'change']) >= 0) return;

                            /**
                             * if listening to "delete", make sure to trigger only watches that where explicit bound to.
                             * ex:
                             * - listening to "delete:lorem.ipsum" should trigger watch only if lorem.ipsum was deleted
                             *     and should not trigger when some of its children was deleted
                             *
                             * - if you were bound "delete:lorem.ipsum.dolor" and you have delete "lorem.ipsum", the callback
                             *     wont be triggered because it will only trigger for that explicit property
                             *
                             * - exceptions: if you bound "delete:lorem.ipsum" which were an array then should trigger
                             */
                            if (inArray(result[0], ['delete']) >= 0) {
                                if (!isArray(prop) && prop !== true) return;
                            }

                            _deleted = prop;
                            return false;
                        });

                        return _deleted;
                    })();

                if (diff === undefined && deleted === undefined) return;

                // run the callback
                watching.callback.call(watching.scope, updated_data);
            })
        });

    }

    this.setData = function (prop, new_data) {
        let utils = self.utils;

        if (new_data !== null && !utils.isset(new_data)) {
            new_data = prop;
            prop = undefined;
        }
        if (!utils.isset(prop)) {
            data = new_data;
            cycles.register(self);
            return this;
        }

        let props = utils.propToArray(prop),
            last_prop = props.pop(),
            _data = self.utils.getProp(data, props);

        if (ObjDiff.prototype.utils.isPlainObject(_data) || Array.isArray(_data)) {
            _data[last_prop] = new_data;
        } else {
            ObjDiff.prototype.utils.extend(true, data, self.utils.object(prop, new_data));
        }

        cycles.register(self);

        return this;
    };

    this.extendData = function (prop, new_data) {
        let utils = self.utils;
        if (!utils.isset(new_data)) {
            new_data = prop;
            prop = undefined;
        }
        if (!utils.isset(prop)) {
            ObjDiff.prototype.utils.extend(true, data, new_data);
            cycles.register(self);
            return this;
        }

        let props = utils.propToArray(prop),
            last_prop = props.pop(),
            _data = self.utils.getProp(data, props);

        if (Array.isArray(_data)) {
            if (_data[last_prop] === undefined) {
                _data[last_prop] = new_data;
            } else {
                ObjDiff.prototype.utils.extend(true, _data[last_prop], new_data);
            }
        } else {
            ObjDiff.prototype.utils.extend(true, data, self.utils.object(prop, new_data));
        }

        cycles.register(self);
        return this;
    };

    this.apply = function () {
        let old_data = data_old;

        data_old = ObjDiff.prototype.utils.extend(true, {}, data);
        check_changes(old_data, data);

        cycles.removeCycle(self);

        return this;
    };

    this.restoreData = function () {
        data = ObjDiff.prototype.utils.extend(true, {}, data_old);
        cycles.removeCycle(self);

        return this;
    };

    /**
     * watch for changes in your data
     * @param  {string, array, callback}   prop   params to watch for
     * @param  {Function} callback callback to run when your param changes
     * @return {Object}            return itself for method chaining
     */
    this.watch = function (prop, callback) {

        let params = Array.isArray(prop) ? prop : [prop];
        params = params.length ? params : [''];

        watching_callbacks.push({
            params: params.map(function (p) {
                // for each param, wraps it with a function and should return an array containing:
                // index[0]: the watch type: ex: add, create, delete, etc... or undefined
                // index[1]: the path to the object property
                return function () {
                    let result = ObjDiff.prototype.utils.isFunction(p) ? p() : p,
                        split = result.split(':');

                    return (split.length > 1 ? split : [undefined, split[0]]);
                };
            }),
            callback: callback,
            scope: this
        });

        return this;
    };

    this.getData = function (prop) {
        let _data = data;
        if (prop === false) return _data;  // prevent calling cycle when false is passed

        if (ObjDiff.prototype.utils.isString(prop)) {
            _data = self.utils.getProp(data, prop);
        }

        if (ObjDiff.prototype.utils.isPlainObject(_data) || Array.isArray(_data)) {
            // only start timeout if _data is either an object or array
            // if returned _data is a primitive value, it doesnt need to start timeout
            // since you cannot change the value of returned _data outside this scope
            cycles.register(self);
        }

        return _data;
    };

    init();

}

ObserverCore.prototype.utils = {
    propToArray: function (s) {
        s = s.replace(/(')(?=(?:(?:[^"]*"){2})*[^"]*$)/g, '"'); // replace single by double quotes but not the ones quoted already
        s = s.replace(/[\[\]]/g, '.'); // convert indexes to properties
        s = s.replace(/^[.\s]+|[.\s]+$/g, ''); // strip a leading dot
        let a = s.match(/(?:[^."]+|"[^"]*")+/g);

        return a.map(function (item) {
            let first = item.substr(0, 1),
                last = item.substr(-1),
                single_quoted = (first === '\'' && last === '\''),
                double_quoted = (first === '"' && last === '"');

            if (!single_quoted && !double_quoted) return item;
            return item.substr(1, item.length - 2);
        });
    },

    /**
     * create and return javascript nested objects with dynamic keys
     */
    object: function (indexes, value) {
        let object = {},
            arr_indexes = Array.isArray(indexes) ? indexes : ObserverCore.prototype.utils.propToArray(indexes),
            inner_object = object,
            indexes_length = arr_indexes.length - 1;

        for (let i in arr_indexes) {
            /**
             * continue for non own properties
             * should not create keys for non own properties
             * ex: if you pass an simple array, it could have its inherited foreach, max, min methods
             */
            if (!arr_indexes.hasOwnProperty(i)) continue;

            let key = arr_indexes[i];

            if (i < indexes_length) {
                inner_object[key] = {};
                inner_object = inner_object[key];
            } else {
                inner_object[key] = value;
            }
        }

        return object;
    },

    isset: function () {
        let a = arguments,
            l = a.length,
            i = 0,
            undef = undefined;

        while (i !== l) {
            if (a[i] === undef || a[i] === null) return false;
            i++;
        }
        return true;
    },

    getProp: function (o, s) {
        let a = Array.isArray(s) ? s : ObserverCore.prototype.utils.propToArray(s);
        while (a.length) {
            let n = a.shift();
            // getProp should interact over __proto__ properties too
            // $.isPlainObject returns false if object has a __proto__ property
            // that's why I am no longer using it
            if (typeof o != 'object' && !Array.isArray(o)) {
                return;
            } else if (n in o) {
                o = o[n];
            } else {
                return;
            }
        }
        return o;
    },

    ...ObjDiff.prototype.utils,
};

// run ObserverCore apply() methods
// this time, using cycles:
// - register only one instance and will always be appended to the end
// - order does not matter
// - will run the first item in the array and continue running until time spent in the
//   process runs out 'maxTime'
// - when maxTime reached break the cycle and start timeout, running a new cycle sequence again
let cycles = {
    cycles: [],
    timeout: null,
    maxTime: 700,  // milliseconds
    startTimeout: function () {
        if (this.timeout !== null) return;

        this.timeout = setTimeout(this.runCycle.bind(this), 0);
    },
    runCycle: function () {
        let instance;
        let started_at = new Date().getTime();
        let current_time = started_at;
        let time_spent = 0;
        let max_time = this.maxTime;

        while ((instance = this.cycles[0]) && time_spent < max_time) {
            this.cycles.splice(0, 1);
            instance.apply();
            current_time = new Date().getTime();
            time_spent = current_time - started_at;
        }
        this.timeout = null;

        // start next cycle
        if (this.cycles[0]) {
            this.startTimeout();
        }
    },
    register: function (instance) {
        this.removeCycle(instance);
        this.cycles.push(instance);
        this.startTimeout();
    },
    removeCycle: function (instance) {
        let indexOf = this.cycles.indexOf(instance);
        if (indexOf != -1) {
            this.cycles.splice(indexOf, 1);
        }
    }
};

export default ObserverCore;