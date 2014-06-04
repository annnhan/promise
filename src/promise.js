~function (win) {
    function Promise(fun) {
        var me = this,
            resolve = function (val) {
                me.resolve(val);
            },
            reject = function (val) {
                me.reject(val);
            }
        me.st = 'default';
        me.rsq = [];
        me.rjq = [];
        (typeof fun === 'function') && fun(resolve, reject);
    }

    Promise.fn = Promise.prototype;

    Promise.fn.then = function (resolve, reject) {
        this.rsq.push(resolve);
        this.rjq.push(reject);
        return this;
    }

    Promise.fn.catch = function (reject) {
        return this.then(null, reject);
    }

    Promise.fn.resolve = function (val) {
        if (this.st === 'resolved' || this.st === 'default') {
            this.st = 'resolved';
            this._doQ(val);
        }

    }

    Promise.fn.reject = function (val) {
        if (this.st === 'rejected' || this.st === 'default') {
            this.st = 'rejected';
            this._doQ(val);
        }
    }

    Promise.fn._doQ = function (val) {
        if (!this.rsq.length && !this.rjq.length) {
            return;
        }

        var resolve = this.rsq.shift(),
            reject = this.rjq.shift(),
            ret;

        if (this.st === 'resolved' && typeof resolve === 'function') {
            ret = resolve(val);
        }
        if (this.st === 'rejected' && typeof reject === 'function') {
            ret = reject(val);
        }
        if (!(ret instanceof Promise)) {
            var _ret = ret;
            ret = new Promise(function (resolve) {
                setTimeout(function () {
                    resolve(_ret);
                }, 0);
            });
        }
        ret.rsq = this.rsq.splice(0);
        ret.rjq = this.rjq.splice(0);
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

    win.Promise = Promise;

}(window);

