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
            me._rsq = [];
            me._rjq = [];
            (typeof fun === 'function') && fun(resolve, reject);
        },
        fn = Promise.prototype;

    fn.then = function (resolve, reject) {
        this._rsq.push(resolve);
        this._rjq.push(reject);
        return this;
    }

    fn.catch = function (reject) {
        return this.then(null, reject);
    }

    fn.resolve = function (val) {
        if (this._st === 'resolved' || this._st === 'pending') {
            this._st = 'resolved';
            this._doQ(val);
        }
    }

    fn.reject = function (val) {
        if (this._st === 'rejected' || this._st === 'pending') {
            this._st = 'rejected';
            this._doQ(val);
        }
    }

    fn._doQ = function (val) {
        if (!this._rsq.length && !this._rjq.length) {
            return;
        }

        var resolve = this._rsq.shift(),
            reject = this._rjq.shift(),
            ret;

        if (this._st === 'resolved' && typeof resolve === 'function') {
            ret = resolve(val);
        }
        if (this._st === 'rejected' && typeof reject === 'function') {
            ret = reject(val);
        }
        if (!(ret instanceof Promise)) {
            var _ret = ret;
            ret = new Promise(function (resolve) {
                setTimeout(function () {
                    resolve(_ret);
                });
            });
        }
        ret._rsq = this._rsq.splice(0);
        ret._rjq = this._rjq.splice(0);
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