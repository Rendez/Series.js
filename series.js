function callback(result) {
    console.log(result);
};

var o = {
    fn1: function(a, b, c){
       this.next(a + b + c);
    },
    fn2: function(sum, c, d) {
        callback(sum + c + d);
    }
};

function Series() {
    var args = Array.prototype.slice.call(arguments);
    var _self = this;
    this.$callbacks = [];
    this.$counter = 0;
    for (var i=0; i<args.length; i++) {
        for (var x in args[i]) {
            Series.prototype.add(x, args[i][x], _self);
        }
    }
}

Series.prototype.add = function(name, fn, context) {
    var _self = context || this;
    this[name] = function() {
        _self.$callbacks.push([fn, arguments]);
        return _self;
    }
};

Series.prototype.next = function(result) {
    if (!this.$callbacks[this.$counter]) {
        return;
    }
    var fn = this.$callbacks[this.$counter][0];
    var args = Array.prototype.slice.call(this.$callbacks[this.$counter][1]);
    if (result) {
        args.unshift(result);
    }
    this.$counter++;
    fn.apply(this, args);
};

new Series(o).fn1(1, 2, 3).fn2(4, 5).next();
