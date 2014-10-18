/**
 * Created by an.han on 14/10/18.
 */
var Promise = require('./src/promise.js');
function async(value) {
    var pms = new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log(++value);
            resolve(value);
        }, 1000);
    })
    return pms;
}

function async2(value) {
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

//        count(5);

Promise.all([async(1), async2(2)]).then(function (val) {
    console.log('ok ' + val);
}, function (val) {
    console.log('err ' + val);
}).then(function (val) {
    console.log('ok2 ' + val)
}, function (val) {
    console.log('err2 ' + val);
});

//        var p = Promise.resolve(1);
//        p.then(function (s){
//            console.log(s)
//        });

//        async(0).then(function (val) {
//            console.log(++val);
//            return val;
//        }).then(function (val) {
//            console.log(++val);
//            return val;
//        }).then(function (val) {
//            console.log(++val);
//            return val;
//        });

