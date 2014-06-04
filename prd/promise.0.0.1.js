/**
 * Created by an.han on 14-6-4.
 */
~function () {
    var Promise = function (fun) {
        var me = this;
        var resolve = function (val) {
            me.resolve(val);
        }
        var reject = function (val) {
            me.reject(val);
        }

        me.st = 'default';
        me.rsq = [];
        me.rjq = [];

        fun(resolve, reject);

    }
    Promise.fn = Promise.prototype;

    Promise.fn.then = function (resolve, reject) {
        this.rsq.push(resolve);
        this.rjq.push(reject);
        return this;
    }

    Promise.fn.resolve = function (val) {
        if (this.st === 'rejected') {
            return;
        }
        this.st = 'resolved';
        this.doQueue(val);
    }

    Promise.fn.reject = function (val) {
        if (this.st === 'resolved') {
            return;
        }
        this.st = 'rejected';
        this.doQueue(val);
    }

    Promise.fn.doQueue = function (val) {
        if (!this.rsq.length && !this.rjq.length) {
            return ;
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
        if (ret instanceof Promise) {
            ret.rsq = this.rsq;
            ret.rjq = this.rjq;
            this.rsq = [];
            this.rjq = [];
        }
        else {
            this.doQueue(ret);
        }
    }
}()


function async(value) {
    var pms = new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log(++value);
            resolve(value);
        }, 1000);
    })
    return pms;
}
function count(n) {
    var i = 0;
    var funStr = 'async(0)';
    while (++i < n) {
        funStr += '.then(async)';
    }
    eval(funStr);
}
count(5);

