var sp = require('../src/split');
var chai = require('chai');

var expect = chai.expect;

var equal = function (x) {
    return function (y) {
        return x === y;
    };
};

describe('Split', function () {

    describe('breakDelims', function () {
        it('all break in the middle', function () {
            var src = sp.breakDelims([equal(',')], "ab,cd,ef"),
                dst = [
                    {t: "Text", s: "ab"},
                    {t: "Delim", s: ","},
                    {t: "Text", s: "cd"},
                    {t: "Delim", s: ","},
                    {t: "Text", s: "ef"}
                ];

            expect(src).to.eql(dst);
        });

        it('break at initial and last', function () {
            var src = sp.breakDelims([equal(',')], ",ab,cd,ef,"),
                dst = [
                    {t: "Text", s: ""},
                    {t: "Delim", s: ","},
                    {t: "Text", s: "ab"},
                    {t: "Delim", s: ","},
                    {t: "Text", s: "cd"},
                    {t: "Delim", s: ","},
                    {t: "Text", s: "ef"},
                    {t: "Delim", s: ","},
                    {t: "Text", s: ""}
                ];

            expect(src).to.eql(dst);
        });

        it('consecutive breaks', function () {
            var src = sp.breakDelims([equal(',')], "ab,,cd"),
                dst = [
                    {t: "Text", s: "ab"},
                    {t: "Delim", s: ","},
                    {t: "Delim", s: ","},
                    {t: "Text", s: "cd"},
                ];

            expect(src).to.eql(dst);
        });

        it('break by multiple predicates', function () {
            var src = sp.breakDelims([equal(','), equal('.')], "ab,cd,.ef"),
                dst = [
                    {t: "Text", s: "ab,cd"},
                    {t: "Delim", s: ",."},
                    {t: "Text", s: "ef"},
                ];

            expect(src).to.eql(dst);
        });
    });

    describe('dropInitialBlank', function () {
        it('with initial Blank', function () {
            var src = sp.dropInitialBlank(sp.breakDelims([equal(',')], ",ab,cd")),
                dst = [
                    {t: "Delim", s: ","},
                    {t: "Text", s: "ab"},
                    {t: "Delim", s: ","},
                    {t: "Text", s: "cd"},
                ];
            expect(src).to.eql(dst); 
        });

        it('without initial Blank', function () {
            var src = sp.dropInitialBlank(sp.breakDelims([equal(',')], "ab,cd")),
                dst = [
                    {t: "Text", s: "ab"},
                    {t: "Delim", s: ","},
                    {t: "Text", s: "cd"},
                ];
            expect(src).to.eql(dst); 
        });
    });

    describe('dropFinalBlank', function () {
        it('with final Blank', function () {
            var src = sp.dropFinalBlank(sp.breakDelims([equal(',')], "ab,cd,")),
                dst = [
                    {t: "Text", s: "ab"},
                    {t: "Delim", s: ","},
                    {t: "Text", s: "cd"},
                    {t: "Delim", s: ","},
                ];
            expect(src).to.eql(dst); 
        });

        it('without final Blank', function () {
            var src = sp.dropFinalBlank(sp.breakDelims([equal(',')], "ab,cd")),
                dst = [
                    {t: "Text", s: "ab"},
                    {t: "Delim", s: ","},
                    {t: "Text", s: "cd"},
                ];
            expect(src).to.eql(dst); 
        });
    });

    describe('insertBlanks', function () {
        it('three consecutive delims', function () {
            var src = sp.insertBlanks(sp.breakDelims([equal(',')], "ab,,,cd,,ef")),
                dst = [
                    {t: "Text", s: "ab"},
                    {t: "Delim", s: ","},
                    {t: "Text", s: ""},
                    {t: "Delim", s: ","},
                    {t: "Text", s: ""},
                    {t: "Delim", s: ","},
                    {t: "Text", s: "cd"},
                    {t: "Delim", s: ","},
                    {t: "Text", s: ""},
                    {t: "Delim", s: ","},
                    {t: "Text", s: "ef"},
                ];
            expect(src).to.eql(dst); 
        });
    });

    describe('dropDelims', function () {
        it('delims with blanks', function () {
            var src = sp.dropDelims(sp.breakDelims([equal(',')], ",ab,,cd,")),
                dst = [
                    {t: "Text", s: ""},
                    {t: "Text", s: "ab"},
                    {t: "Text", s: "cd"},
                    {t: "Text", s: ""},
                ];
            expect(src).to.eql(dst); 
        });
    });

    describe('when', function () {
        it('three possible seperater', function () {
            var src = sp.breakDelims(sp.when(x => x % 3 === 0), [1,2,3,4,5,6,7,8]),
                dst = [
                    {t: "Text", s: [1,2]},
                    {t: "Delim", s: [3]},
                    {t: "Text", s: [4,5]},
                    {t: "Delim", s: [6]},
                    {t: "Text", s: [7,8]},
                ];
            expect(src).to.eql(dst); 
        });
    });

    describe('oneOf', function () {
        it('three possible seperater', function () {
            var src = sp.breakDelims(sp.oneOf(",.;"), "ab.cd,ef;gh"),
                dst = [
                    {t: "Text", s: "ab"},
                    {t: "Delim", s: "."},
                    {t: "Text", s: "cd"},
                    {t: "Delim", s: ","},
                    {t: "Text", s: "ef"},
                    {t: "Delim", s: ";"},
                    {t: "Text", s: "gh"},
                ];
            expect(src).to.eql(dst); 
        });
    });

    describe('onSubList', function () {
        it('multi element delim', function () {
            var src = sp.breakDelims(sp.onSubList("<|>"), "ab<|>cd<|>ef"),
                dst = [
                    {t: "Text", s: "ab"},
                    {t: "Delim", s: "<|>"},
                    {t: "Text", s: "cd"},
                    {t: "Delim", s: "<|>"},
                    {t: "Text", s: "ef"},
                ];
            expect(src).to.eql(dst); 
        });
    });

    describe('condense', function () {
        it('consecutive delims', function () {
            var src = sp.condense(sp.breakDelims(sp.oneOf(",.;"), "ab.,;cd;;ef")),
                dst = [
                    {t: "Text", s: "ab"},
                    {t: "Delim", s: ".,;"},
                    {t: "Text", s: "cd"},
                    {t: "Delim", s: ";;"},
                    {t: "Text", s: "ef"},
                ];
            expect(src).to.eql(dst); 
        });
    });

    describe('mergeDelimsLeft', function () {
        it('semicolons merged to left', function () {
            var src = sp.mergeDelimsLeft(sp.breakDelims(sp.oneOf(";"), "ab;cd;;ef")),
                dst = [
                    {t: "Text", s: "ab;"},
                    {t: "Text", s: "cd;"},
                    {t: "Delim", s: ";"},
                    {t: "Text", s: "ef"},
                ];
            expect(src).to.eql(dst); 
        });
    });

    describe('mergeDelimsRight', function () {
        it('semicolons merged to right', function () {
            var isUpper = function (c) {
                    var code = c.charCodeAt(0);
                    return code >= 65 && code <= 90;
                },
                src = sp.mergeDelimsRight(sp.breakDelims(sp.when(isUpper), "fooBarTUpper")),
                dst = [
                    {t: "Text", s: "foo"},
                    {t: "Text", s: "Bar"},
                    {t: "Delim", s: "T"},
                    {t: "Text", s: "Upper"},
                ];
            expect(src).to.eql(dst); 
        });
    });

    describe('splitOneOf', function () {
        it('-', function () {
            var src = sp.splitOneOf(",.", "ab,cd.ef"),
                dst = ["ab", "cd", "ef"];
            expect(src).to.eql(dst); 
        });
    });

    describe('splitOn', function () {
        it('-', function () {
            var src = sp.splitOneOf("<>", "ab<>cd<>ef"),
                dst = ["ab", "cd", "ef"];
            expect(src).to.eql(dst); 
        });
    });

    describe('splitWhen', function () {
        it('-', function () {
            var src = sp.splitWhen(x => x % 3 === 0, [1,2,3,4,5,6,7,8]),
                dst = [[1,2], [4,5], [7,8]];
            expect(src).to.eql(dst); 
        });
    });
});
