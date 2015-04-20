~function (global) {

    // status
    var PENDING = 0,
        FULFILLED = 1,
        REJECTED = 2;

    var Promise = function (fun) {

        if(typeof fun !== 'function') {
            throw 'Promise resolver undefined is not a function';
            return;
        }

        var me = this,
            resolve = function (val) {
                me.resolve(val);
            },
            reject = function (val) {
                me.reject(val);
            }
        me._status = PENDING;
        me._onFulfilled = [];
        me._onRejected = [];
        fun(resolve, reject);
    }

    var fn = Promise.prototype;

    fn.then = function (onFulfilled, onRejected) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self._onFulfilled.push(function (val) {
                var ret = onFulfilled ? onFulfilled(val) : val;
                if (Promise.isPromise(ret)) {
                    ret.then(function (val) {
                        resolve(val);
                    });
                }
                else {
                    resolve(ret);
                }
            });
            self._onRejected.push(function (val) {
                var ret = onRejected ? onRejected(val) : val;
                reject(ret);
            });
        });

    }

    fn.catch = function (onRejected) {
        return this.then(null, onRejected);
    }

    fn.resolve = function (val) {
        if (this._status === PENDING) {
            this._status = FULFILLED;
            for (var i = 0, len = this._onFulfilled.length; i < len; i++) {
                this._onFulfilled[i](val);
            }
        }
    }

    fn.reject = function (val) {
        if (this._status === PENDING) {
            this._status = REJECTED;
            for (var i = 0, len = this._onRejected.length; i < len; i++) {
                this._onRejected[i](val);
            }
        }
    }

    Promise.all = function (arr) {
        return Promise(function (resolve, reject) {
            var len = arr.length,
                i = -1,
                count = 0,
                results = [];
            while (++i < len) {
                ~function (i) {
                    arr[i].then(
                        function (val) {
                            results[i] = val;
                            if (++count === len) {
                                resolve(results);
                            }
                        },
                        function (val) {
                            reject(val);
                        }
                    );
                }(i);
            }
        });
    }

    Promise.race = function (arr) {
        return new Promise(function (resolve, reject) {
            var len = arr.length,
                i = -1;
            while (++i < len) {
                arr[i].then(
                    function (val) {
                        resolve(val);
                    },
                    function (val) {
                        reject(val);
                    }
                );
            }
        });
    }

    Promise.resolve = function (obj) {
        if (Promise.isPromise(obj)) {
            return obj;
        }
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            });
        });
    }

    Promise.reject = function (obj) {
        if (Promise.isPromise(obj)) {
            return obj;
        }
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                reject(ret);
            });
        });
    }

    Promise.isPromise = function (obj) {
        return obj instanceof Promise;
    }

    global.Promise = global.Promise || Promise;

    try{
        module.exports = Promise;
    }
    catch (e){}

}(this);