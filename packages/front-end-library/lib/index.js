"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _class;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function sleepAble(Clazz) {
    var SleepSome = function (_Clazz) {
        _inherits(SleepSome, _Clazz);

        function SleepSome() {
            _classCallCheck(this, SleepSome);

            return _possibleConstructorReturn(this, (SleepSome.__proto__ || Object.getPrototypeOf(SleepSome)).apply(this, arguments));
        }

        _createClass(SleepSome, [{
            key: "sleep",
            value: function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.next = 2;
                                    return new Promise(function (resolve) {
                                        setTimeout(resolve, t);
                                    });

                                case 2:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));

                function sleep(_x) {
                    return _ref.apply(this, arguments);
                }

                return sleep;
            }()
        }]);

        return SleepSome;
    }(Clazz);
}

var Caculator = sleepAble(_class = function () {
    function Caculator() {
        _classCallCheck(this, Caculator);

        this.value = 0;
    }

    _createClass(Caculator, [{
        key: "add",
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(y) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return new Promise(function (resolve) {
                                    setTimeout(resolve, 1000);
                                });

                            case 2:
                                this.value += y;
                                return _context2.abrupt("return", this.value);

                            case 4:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function add(_x2) {
                return _ref2.apply(this, arguments);
            }

            return add;
        }()
    }, {
        key: "clear",
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(x) {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                this.value = x;

                            case 1:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function clear(_x3) {
                return _ref3.apply(this, arguments);
            }

            return clear;
        }()
    }], [{
        key: "add",
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(x, y) {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return new Promise(function (resolve) {
                                    setTimeout(resolve, 500);
                                });

                            case 2:
                                return _context4.abrupt("return", x + y);

                            case 3:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function add(_x4, _x5) {
                return _ref4.apply(this, arguments);
            }

            return add;
        }()
    }]);

    return Caculator;
}()) || _class;

exports.default = Caculator;
module.exports = exports["default"];