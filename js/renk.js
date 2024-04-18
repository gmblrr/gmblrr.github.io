var renk = (function() {
    function atrk(s) {
        var a = '';
        for (var i = 0; i < s.length; i++) {
            var charCode = s.charCodeAt(i);
            var offset = i + 1; 
            a += String.fromCharCode(charCode + offset); 
            a += String.fromCharCode(Math.floor(Math.random() * (126 - 33 + 1)) + 33);
        }
        return a;
    }

    function rkta(r) {
        var x = '';
        for (var jkl = 0; jkl < r.length; jkl += 2) {
            var charCode = r.charCodeAt(jkl);
            var e = (jkl / 2) + 1; 
            x += String.fromCharCode(charCode - e);
        }
        return x;
    }

    return {
        e: function(input) {
            return atrk(input);
        },
        d: function(input) {
            return rkta(input);
        }
    };
})();