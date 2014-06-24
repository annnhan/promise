~function (win) {
    var Promise = function (fun) {
            var me = this,
                resolve = function (val) {
                    me.resolve(val);
                },
                reject = function (val) {
                    me.reject(val);
                }
            me._st = 'pending';
            me._rsq = null;
            me._rjq = null;
            (typeof fun === 'function') && fun(resolve, reject);
        },
        fn = Promise.prototype;

    fn.then = function (resolve, reject) {
        var pms = new Promise();
        this._rsq = function (val) {
            var ret = resolve ? resolve(val) : val;
            if (ret instanceof Promise) {
                ret.then(function (val) {
                    pms.resolve(val);
                });
            }
            else{
                pms.resolve(ret);
            }
        };
        this._rjq = function (val) {
            pms.reject(reject(val));
        };
        return pms;
    }

    fn.catch = function (reject) {
        return this.then(null, reject);
    }

    fn.resolve = function (val) {
        if (this._st === 'resolved' || this._st === 'pending') {
            this._st = 'resolved';
            this._rsq && this._rsq(val);
        }
    }

    fn.reject = function (val) {
        if (this._st === 'rejected' || this._st === 'pending') {
            this._st = 'rejected';
            this._rsq && this._rjq(val);
        }
    }

    Promise.all = function (arr) {
        var pms = new Promise();
        var len = arr.length,
            i = 0,
            res = 0;
        while (i < len) {
            arr[i].then(
                function () {
                    if (++res === len) {
                        pms.resolve();
                    }
                },
                function (val) {
                    pms.reject(val);
                }
            );
            i++;
        }
        return pms;
    }

    Promise.resolve = function (obj) {
        var pms = new Promise();
        if (obj && typeof obj.then === 'function') {
            for (var i in pms) {
                obj[i] = pms[i];
            }
            return obj;
        }
        else {
            setTimeout(function () {
                pms.resolve(obj);
            });
            return pms;
        }
    }

    win.Promise = Promise;

}(window);