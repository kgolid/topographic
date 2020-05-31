(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  /**
   * dat-gui JavaScript Controller Library
   * http://code.google.com/p/dat-gui
   *
   * Copyright 2011 Data Arts Team, Google Creative Lab
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   */

  function ___$insertStyle(css) {
    if (!css) {
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }

    var style = document.createElement('style');

    style.setAttribute('type', 'text/css');
    style.innerHTML = css;
    document.head.appendChild(style);

    return css;
  }

  function colorToString (color, forceCSSHex) {
    var colorFormat = color.__state.conversionName.toString();
    var r = Math.round(color.r);
    var g = Math.round(color.g);
    var b = Math.round(color.b);
    var a = color.a;
    var h = Math.round(color.h);
    var s = color.s.toFixed(1);
    var v = color.v.toFixed(1);
    if (forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX') {
      var str = color.hex.toString(16);
      while (str.length < 6) {
        str = '0' + str;
      }
      return '#' + str;
    } else if (colorFormat === 'CSS_RGB') {
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    } else if (colorFormat === 'CSS_RGBA') {
      return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    } else if (colorFormat === 'HEX') {
      return '0x' + color.hex.toString(16);
    } else if (colorFormat === 'RGB_ARRAY') {
      return '[' + r + ',' + g + ',' + b + ']';
    } else if (colorFormat === 'RGBA_ARRAY') {
      return '[' + r + ',' + g + ',' + b + ',' + a + ']';
    } else if (colorFormat === 'RGB_OBJ') {
      return '{r:' + r + ',g:' + g + ',b:' + b + '}';
    } else if (colorFormat === 'RGBA_OBJ') {
      return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';
    } else if (colorFormat === 'HSV_OBJ') {
      return '{h:' + h + ',s:' + s + ',v:' + v + '}';
    } else if (colorFormat === 'HSVA_OBJ') {
      return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';
    }
    return 'unknown format';
  }

  var ARR_EACH = Array.prototype.forEach;
  var ARR_SLICE = Array.prototype.slice;
  var Common = {
    BREAK: {},
    extend: function extend(target) {
      this.each(ARR_SLICE.call(arguments, 1), function (obj) {
        var keys = this.isObject(obj) ? Object.keys(obj) : [];
        keys.forEach(function (key) {
          if (!this.isUndefined(obj[key])) {
            target[key] = obj[key];
          }
        }.bind(this));
      }, this);
      return target;
    },
    defaults: function defaults(target) {
      this.each(ARR_SLICE.call(arguments, 1), function (obj) {
        var keys = this.isObject(obj) ? Object.keys(obj) : [];
        keys.forEach(function (key) {
          if (this.isUndefined(target[key])) {
            target[key] = obj[key];
          }
        }.bind(this));
      }, this);
      return target;
    },
    compose: function compose() {
      var toCall = ARR_SLICE.call(arguments);
      return function () {
        var args = ARR_SLICE.call(arguments);
        for (var i = toCall.length - 1; i >= 0; i--) {
          args = [toCall[i].apply(this, args)];
        }
        return args[0];
      };
    },
    each: function each(obj, itr, scope) {
      if (!obj) {
        return;
      }
      if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
        obj.forEach(itr, scope);
      } else if (obj.length === obj.length + 0) {
        var key = void 0;
        var l = void 0;
        for (key = 0, l = obj.length; key < l; key++) {
          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
            return;
          }
        }
      } else {
        for (var _key in obj) {
          if (itr.call(scope, obj[_key], _key) === this.BREAK) {
            return;
          }
        }
      }
    },
    defer: function defer(fnc) {
      setTimeout(fnc, 0);
    },
    debounce: function debounce(func, threshold, callImmediately) {
      var timeout = void 0;
      return function () {
        var obj = this;
        var args = arguments;
        function delayed() {
          timeout = null;
          if (!callImmediately) func.apply(obj, args);
        }
        var callNow = callImmediately || !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(delayed, threshold);
        if (callNow) {
          func.apply(obj, args);
        }
      };
    },
    toArray: function toArray(obj) {
      if (obj.toArray) return obj.toArray();
      return ARR_SLICE.call(obj);
    },
    isUndefined: function isUndefined(obj) {
      return obj === undefined;
    },
    isNull: function isNull(obj) {
      return obj === null;
    },
    isNaN: function (_isNaN) {
      function isNaN(_x) {
        return _isNaN.apply(this, arguments);
      }
      isNaN.toString = function () {
        return _isNaN.toString();
      };
      return isNaN;
    }(function (obj) {
      return isNaN(obj);
    }),
    isArray: Array.isArray || function (obj) {
      return obj.constructor === Array;
    },
    isObject: function isObject(obj) {
      return obj === Object(obj);
    },
    isNumber: function isNumber(obj) {
      return obj === obj + 0;
    },
    isString: function isString(obj) {
      return obj === obj + '';
    },
    isBoolean: function isBoolean(obj) {
      return obj === false || obj === true;
    },
    isFunction: function isFunction(obj) {
      return obj instanceof Function;
    }
  };

  var INTERPRETATIONS = [
  {
    litmus: Common.isString,
    conversions: {
      THREE_CHAR_HEX: {
        read: function read(original) {
          var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
          if (test === null) {
            return false;
          }
          return {
            space: 'HEX',
            hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
          };
        },
        write: colorToString
      },
      SIX_CHAR_HEX: {
        read: function read(original) {
          var test = original.match(/^#([A-F0-9]{6})$/i);
          if (test === null) {
            return false;
          }
          return {
            space: 'HEX',
            hex: parseInt('0x' + test[1].toString(), 0)
          };
        },
        write: colorToString
      },
      CSS_RGB: {
        read: function read(original) {
          var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
          if (test === null) {
            return false;
          }
          return {
            space: 'RGB',
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3])
          };
        },
        write: colorToString
      },
      CSS_RGBA: {
        read: function read(original) {
          var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
          if (test === null) {
            return false;
          }
          return {
            space: 'RGB',
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3]),
            a: parseFloat(test[4])
          };
        },
        write: colorToString
      }
    }
  },
  {
    litmus: Common.isNumber,
    conversions: {
      HEX: {
        read: function read(original) {
          return {
            space: 'HEX',
            hex: original,
            conversionName: 'HEX'
          };
        },
        write: function write(color) {
          return color.hex;
        }
      }
    }
  },
  {
    litmus: Common.isArray,
    conversions: {
      RGB_ARRAY: {
        read: function read(original) {
          if (original.length !== 3) {
            return false;
          }
          return {
            space: 'RGB',
            r: original[0],
            g: original[1],
            b: original[2]
          };
        },
        write: function write(color) {
          return [color.r, color.g, color.b];
        }
      },
      RGBA_ARRAY: {
        read: function read(original) {
          if (original.length !== 4) return false;
          return {
            space: 'RGB',
            r: original[0],
            g: original[1],
            b: original[2],
            a: original[3]
          };
        },
        write: function write(color) {
          return [color.r, color.g, color.b, color.a];
        }
      }
    }
  },
  {
    litmus: Common.isObject,
    conversions: {
      RGBA_OBJ: {
        read: function read(original) {
          if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b) && Common.isNumber(original.a)) {
            return {
              space: 'RGB',
              r: original.r,
              g: original.g,
              b: original.b,
              a: original.a
            };
          }
          return false;
        },
        write: function write(color) {
          return {
            r: color.r,
            g: color.g,
            b: color.b,
            a: color.a
          };
        }
      },
      RGB_OBJ: {
        read: function read(original) {
          if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b)) {
            return {
              space: 'RGB',
              r: original.r,
              g: original.g,
              b: original.b
            };
          }
          return false;
        },
        write: function write(color) {
          return {
            r: color.r,
            g: color.g,
            b: color.b
          };
        }
      },
      HSVA_OBJ: {
        read: function read(original) {
          if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v) && Common.isNumber(original.a)) {
            return {
              space: 'HSV',
              h: original.h,
              s: original.s,
              v: original.v,
              a: original.a
            };
          }
          return false;
        },
        write: function write(color) {
          return {
            h: color.h,
            s: color.s,
            v: color.v,
            a: color.a
          };
        }
      },
      HSV_OBJ: {
        read: function read(original) {
          if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v)) {
            return {
              space: 'HSV',
              h: original.h,
              s: original.s,
              v: original.v
            };
          }
          return false;
        },
        write: function write(color) {
          return {
            h: color.h,
            s: color.s,
            v: color.v
          };
        }
      }
    }
  }];
  var result = void 0;
  var toReturn = void 0;
  var interpret = function interpret() {
    toReturn = false;
    var original = arguments.length > 1 ? Common.toArray(arguments) : arguments[0];
    Common.each(INTERPRETATIONS, function (family) {
      if (family.litmus(original)) {
        Common.each(family.conversions, function (conversion, conversionName) {
          result = conversion.read(original);
          if (toReturn === false && result !== false) {
            toReturn = result;
            result.conversionName = conversionName;
            result.conversion = conversion;
            return Common.BREAK;
          }
        });
        return Common.BREAK;
      }
    });
    return toReturn;
  };

  var tmpComponent = void 0;
  var ColorMath = {
    hsv_to_rgb: function hsv_to_rgb(h, s, v) {
      var hi = Math.floor(h / 60) % 6;
      var f = h / 60 - Math.floor(h / 60);
      var p = v * (1.0 - s);
      var q = v * (1.0 - f * s);
      var t = v * (1.0 - (1.0 - f) * s);
      var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
      return {
        r: c[0] * 255,
        g: c[1] * 255,
        b: c[2] * 255
      };
    },
    rgb_to_hsv: function rgb_to_hsv(r, g, b) {
      var min = Math.min(r, g, b);
      var max = Math.max(r, g, b);
      var delta = max - min;
      var h = void 0;
      var s = void 0;
      if (max !== 0) {
        s = delta / max;
      } else {
        return {
          h: NaN,
          s: 0,
          v: 0
        };
      }
      if (r === max) {
        h = (g - b) / delta;
      } else if (g === max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }
      h /= 6;
      if (h < 0) {
        h += 1;
      }
      return {
        h: h * 360,
        s: s,
        v: max / 255
      };
    },
    rgb_to_hex: function rgb_to_hex(r, g, b) {
      var hex = this.hex_with_component(0, 2, r);
      hex = this.hex_with_component(hex, 1, g);
      hex = this.hex_with_component(hex, 0, b);
      return hex;
    },
    component_from_hex: function component_from_hex(hex, componentIndex) {
      return hex >> componentIndex * 8 & 0xFF;
    },
    hex_with_component: function hex_with_component(hex, componentIndex, value) {
      return value << (tmpComponent = componentIndex * 8) | hex & ~(0xFF << tmpComponent);
    }
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };











  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();







  var get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };











  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var Color = function () {
    function Color() {
      classCallCheck(this, Color);
      this.__state = interpret.apply(this, arguments);
      if (this.__state === false) {
        throw new Error('Failed to interpret color arguments');
      }
      this.__state.a = this.__state.a || 1;
    }
    createClass(Color, [{
      key: 'toString',
      value: function toString() {
        return colorToString(this);
      }
    }, {
      key: 'toHexString',
      value: function toHexString() {
        return colorToString(this, true);
      }
    }, {
      key: 'toOriginal',
      value: function toOriginal() {
        return this.__state.conversion.write(this);
      }
    }]);
    return Color;
  }();
  function defineRGBComponent(target, component, componentHexIndex) {
    Object.defineProperty(target, component, {
      get: function get$$1() {
        if (this.__state.space === 'RGB') {
          return this.__state[component];
        }
        Color.recalculateRGB(this, component, componentHexIndex);
        return this.__state[component];
      },
      set: function set$$1(v) {
        if (this.__state.space !== 'RGB') {
          Color.recalculateRGB(this, component, componentHexIndex);
          this.__state.space = 'RGB';
        }
        this.__state[component] = v;
      }
    });
  }
  function defineHSVComponent(target, component) {
    Object.defineProperty(target, component, {
      get: function get$$1() {
        if (this.__state.space === 'HSV') {
          return this.__state[component];
        }
        Color.recalculateHSV(this);
        return this.__state[component];
      },
      set: function set$$1(v) {
        if (this.__state.space !== 'HSV') {
          Color.recalculateHSV(this);
          this.__state.space = 'HSV';
        }
        this.__state[component] = v;
      }
    });
  }
  Color.recalculateRGB = function (color, component, componentHexIndex) {
    if (color.__state.space === 'HEX') {
      color.__state[component] = ColorMath.component_from_hex(color.__state.hex, componentHexIndex);
    } else if (color.__state.space === 'HSV') {
      Common.extend(color.__state, ColorMath.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
    } else {
      throw new Error('Corrupted color state');
    }
  };
  Color.recalculateHSV = function (color) {
    var result = ColorMath.rgb_to_hsv(color.r, color.g, color.b);
    Common.extend(color.__state, {
      s: result.s,
      v: result.v
    });
    if (!Common.isNaN(result.h)) {
      color.__state.h = result.h;
    } else if (Common.isUndefined(color.__state.h)) {
      color.__state.h = 0;
    }
  };
  Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
  defineRGBComponent(Color.prototype, 'r', 2);
  defineRGBComponent(Color.prototype, 'g', 1);
  defineRGBComponent(Color.prototype, 'b', 0);
  defineHSVComponent(Color.prototype, 'h');
  defineHSVComponent(Color.prototype, 's');
  defineHSVComponent(Color.prototype, 'v');
  Object.defineProperty(Color.prototype, 'a', {
    get: function get$$1() {
      return this.__state.a;
    },
    set: function set$$1(v) {
      this.__state.a = v;
    }
  });
  Object.defineProperty(Color.prototype, 'hex', {
    get: function get$$1() {
      if (this.__state.space !== 'HEX') {
        this.__state.hex = ColorMath.rgb_to_hex(this.r, this.g, this.b);
        this.__state.space = 'HEX';
      }
      return this.__state.hex;
    },
    set: function set$$1(v) {
      this.__state.space = 'HEX';
      this.__state.hex = v;
    }
  });

  var Controller = function () {
    function Controller(object, property) {
      classCallCheck(this, Controller);
      this.initialValue = object[property];
      this.domElement = document.createElement('div');
      this.object = object;
      this.property = property;
      this.__onChange = undefined;
      this.__onFinishChange = undefined;
    }
    createClass(Controller, [{
      key: 'onChange',
      value: function onChange(fnc) {
        this.__onChange = fnc;
        return this;
      }
    }, {
      key: 'onFinishChange',
      value: function onFinishChange(fnc) {
        this.__onFinishChange = fnc;
        return this;
      }
    }, {
      key: 'setValue',
      value: function setValue(newValue) {
        this.object[this.property] = newValue;
        if (this.__onChange) {
          this.__onChange.call(this, newValue);
        }
        this.updateDisplay();
        return this;
      }
    }, {
      key: 'getValue',
      value: function getValue() {
        return this.object[this.property];
      }
    }, {
      key: 'updateDisplay',
      value: function updateDisplay() {
        return this;
      }
    }, {
      key: 'isModified',
      value: function isModified() {
        return this.initialValue !== this.getValue();
      }
    }]);
    return Controller;
  }();

  var EVENT_MAP = {
    HTMLEvents: ['change'],
    MouseEvents: ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
    KeyboardEvents: ['keydown']
  };
  var EVENT_MAP_INV = {};
  Common.each(EVENT_MAP, function (v, k) {
    Common.each(v, function (e) {
      EVENT_MAP_INV[e] = k;
    });
  });
  var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;
  function cssValueToPixels(val) {
    if (val === '0' || Common.isUndefined(val)) {
      return 0;
    }
    var match = val.match(CSS_VALUE_PIXELS);
    if (!Common.isNull(match)) {
      return parseFloat(match[1]);
    }
    return 0;
  }
  var dom = {
    makeSelectable: function makeSelectable(elem, selectable) {
      if (elem === undefined || elem.style === undefined) return;
      elem.onselectstart = selectable ? function () {
        return false;
      } : function () {};
      elem.style.MozUserSelect = selectable ? 'auto' : 'none';
      elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
      elem.unselectable = selectable ? 'on' : 'off';
    },
    makeFullscreen: function makeFullscreen(elem, hor, vert) {
      var vertical = vert;
      var horizontal = hor;
      if (Common.isUndefined(horizontal)) {
        horizontal = true;
      }
      if (Common.isUndefined(vertical)) {
        vertical = true;
      }
      elem.style.position = 'absolute';
      if (horizontal) {
        elem.style.left = 0;
        elem.style.right = 0;
      }
      if (vertical) {
        elem.style.top = 0;
        elem.style.bottom = 0;
      }
    },
    fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
      var params = pars || {};
      var className = EVENT_MAP_INV[eventType];
      if (!className) {
        throw new Error('Event type ' + eventType + ' not supported.');
      }
      var evt = document.createEvent(className);
      switch (className) {
        case 'MouseEvents':
          {
            var clientX = params.x || params.clientX || 0;
            var clientY = params.y || params.clientY || 0;
            evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0,
            0,
            clientX,
            clientY,
            false, false, false, false, 0, null);
            break;
          }
        case 'KeyboardEvents':
          {
            var init = evt.initKeyboardEvent || evt.initKeyEvent;
            Common.defaults(params, {
              cancelable: true,
              ctrlKey: false,
              altKey: false,
              shiftKey: false,
              metaKey: false,
              keyCode: undefined,
              charCode: undefined
            });
            init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
            break;
          }
        default:
          {
            evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
            break;
          }
      }
      Common.defaults(evt, aux);
      elem.dispatchEvent(evt);
    },
    bind: function bind(elem, event, func, newBool) {
      var bool = newBool || false;
      if (elem.addEventListener) {
        elem.addEventListener(event, func, bool);
      } else if (elem.attachEvent) {
        elem.attachEvent('on' + event, func);
      }
      return dom;
    },
    unbind: function unbind(elem, event, func, newBool) {
      var bool = newBool || false;
      if (elem.removeEventListener) {
        elem.removeEventListener(event, func, bool);
      } else if (elem.detachEvent) {
        elem.detachEvent('on' + event, func);
      }
      return dom;
    },
    addClass: function addClass(elem, className) {
      if (elem.className === undefined) {
        elem.className = className;
      } else if (elem.className !== className) {
        var classes = elem.className.split(/ +/);
        if (classes.indexOf(className) === -1) {
          classes.push(className);
          elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
        }
      }
      return dom;
    },
    removeClass: function removeClass(elem, className) {
      if (className) {
        if (elem.className === className) {
          elem.removeAttribute('class');
        } else {
          var classes = elem.className.split(/ +/);
          var index = classes.indexOf(className);
          if (index !== -1) {
            classes.splice(index, 1);
            elem.className = classes.join(' ');
          }
        }
      } else {
        elem.className = undefined;
      }
      return dom;
    },
    hasClass: function hasClass(elem, className) {
      return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
    },
    getWidth: function getWidth(elem) {
      var style = getComputedStyle(elem);
      return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style.width);
    },
    getHeight: function getHeight(elem) {
      var style = getComputedStyle(elem);
      return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style.height);
    },
    getOffset: function getOffset(el) {
      var elem = el;
      var offset = { left: 0, top: 0 };
      if (elem.offsetParent) {
        do {
          offset.left += elem.offsetLeft;
          offset.top += elem.offsetTop;
          elem = elem.offsetParent;
        } while (elem);
      }
      return offset;
    },
    isActive: function isActive(elem) {
      return elem === document.activeElement && (elem.type || elem.href);
    }
  };

  var BooleanController = function (_Controller) {
    inherits(BooleanController, _Controller);
    function BooleanController(object, property) {
      classCallCheck(this, BooleanController);
      var _this2 = possibleConstructorReturn(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));
      var _this = _this2;
      _this2.__prev = _this2.getValue();
      _this2.__checkbox = document.createElement('input');
      _this2.__checkbox.setAttribute('type', 'checkbox');
      function onChange() {
        _this.setValue(!_this.__prev);
      }
      dom.bind(_this2.__checkbox, 'change', onChange, false);
      _this2.domElement.appendChild(_this2.__checkbox);
      _this2.updateDisplay();
      return _this2;
    }
    createClass(BooleanController, [{
      key: 'setValue',
      value: function setValue(v) {
        var toReturn = get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);
        if (this.__onFinishChange) {
          this.__onFinishChange.call(this, this.getValue());
        }
        this.__prev = this.getValue();
        return toReturn;
      }
    }, {
      key: 'updateDisplay',
      value: function updateDisplay() {
        if (this.getValue() === true) {
          this.__checkbox.setAttribute('checked', 'checked');
          this.__checkbox.checked = true;
          this.__prev = true;
        } else {
          this.__checkbox.checked = false;
          this.__prev = false;
        }
        return get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
      }
    }]);
    return BooleanController;
  }(Controller);

  var OptionController = function (_Controller) {
    inherits(OptionController, _Controller);
    function OptionController(object, property, opts) {
      classCallCheck(this, OptionController);
      var _this2 = possibleConstructorReturn(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));
      var options = opts;
      var _this = _this2;
      _this2.__select = document.createElement('select');
      if (Common.isArray(options)) {
        var map = {};
        Common.each(options, function (element) {
          map[element] = element;
        });
        options = map;
      }
      Common.each(options, function (value, key) {
        var opt = document.createElement('option');
        opt.innerHTML = key;
        opt.setAttribute('value', value);
        _this.__select.appendChild(opt);
      });
      _this2.updateDisplay();
      dom.bind(_this2.__select, 'change', function () {
        var desiredValue = this.options[this.selectedIndex].value;
        _this.setValue(desiredValue);
      });
      _this2.domElement.appendChild(_this2.__select);
      return _this2;
    }
    createClass(OptionController, [{
      key: 'setValue',
      value: function setValue(v) {
        var toReturn = get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);
        if (this.__onFinishChange) {
          this.__onFinishChange.call(this, this.getValue());
        }
        return toReturn;
      }
    }, {
      key: 'updateDisplay',
      value: function updateDisplay() {
        if (dom.isActive(this.__select)) return this;
        this.__select.value = this.getValue();
        return get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
      }
    }]);
    return OptionController;
  }(Controller);

  var StringController = function (_Controller) {
    inherits(StringController, _Controller);
    function StringController(object, property) {
      classCallCheck(this, StringController);
      var _this2 = possibleConstructorReturn(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));
      var _this = _this2;
      function onChange() {
        _this.setValue(_this.__input.value);
      }
      function onBlur() {
        if (_this.__onFinishChange) {
          _this.__onFinishChange.call(_this, _this.getValue());
        }
      }
      _this2.__input = document.createElement('input');
      _this2.__input.setAttribute('type', 'text');
      dom.bind(_this2.__input, 'keyup', onChange);
      dom.bind(_this2.__input, 'change', onChange);
      dom.bind(_this2.__input, 'blur', onBlur);
      dom.bind(_this2.__input, 'keydown', function (e) {
        if (e.keyCode === 13) {
          this.blur();
        }
      });
      _this2.updateDisplay();
      _this2.domElement.appendChild(_this2.__input);
      return _this2;
    }
    createClass(StringController, [{
      key: 'updateDisplay',
      value: function updateDisplay() {
        if (!dom.isActive(this.__input)) {
          this.__input.value = this.getValue();
        }
        return get(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
      }
    }]);
    return StringController;
  }(Controller);

  function numDecimals(x) {
    var _x = x.toString();
    if (_x.indexOf('.') > -1) {
      return _x.length - _x.indexOf('.') - 1;
    }
    return 0;
  }
  var NumberController = function (_Controller) {
    inherits(NumberController, _Controller);
    function NumberController(object, property, params) {
      classCallCheck(this, NumberController);
      var _this = possibleConstructorReturn(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));
      var _params = params || {};
      _this.__min = _params.min;
      _this.__max = _params.max;
      _this.__step = _params.step;
      if (Common.isUndefined(_this.__step)) {
        if (_this.initialValue === 0) {
          _this.__impliedStep = 1;
        } else {
          _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
        }
      } else {
        _this.__impliedStep = _this.__step;
      }
      _this.__precision = numDecimals(_this.__impliedStep);
      return _this;
    }
    createClass(NumberController, [{
      key: 'setValue',
      value: function setValue(v) {
        var _v = v;
        if (this.__min !== undefined && _v < this.__min) {
          _v = this.__min;
        } else if (this.__max !== undefined && _v > this.__max) {
          _v = this.__max;
        }
        if (this.__step !== undefined && _v % this.__step !== 0) {
          _v = Math.round(_v / this.__step) * this.__step;
        }
        return get(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
      }
    }, {
      key: 'min',
      value: function min(minValue) {
        this.__min = minValue;
        return this;
      }
    }, {
      key: 'max',
      value: function max(maxValue) {
        this.__max = maxValue;
        return this;
      }
    }, {
      key: 'step',
      value: function step(stepValue) {
        this.__step = stepValue;
        this.__impliedStep = stepValue;
        this.__precision = numDecimals(stepValue);
        return this;
      }
    }]);
    return NumberController;
  }(Controller);

  function roundToDecimal(value, decimals) {
    var tenTo = Math.pow(10, decimals);
    return Math.round(value * tenTo) / tenTo;
  }
  var NumberControllerBox = function (_NumberController) {
    inherits(NumberControllerBox, _NumberController);
    function NumberControllerBox(object, property, params) {
      classCallCheck(this, NumberControllerBox);
      var _this2 = possibleConstructorReturn(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));
      _this2.__truncationSuspended = false;
      var _this = _this2;
      var prevY = void 0;
      function onChange() {
        var attempted = parseFloat(_this.__input.value);
        if (!Common.isNaN(attempted)) {
          _this.setValue(attempted);
        }
      }
      function onFinish() {
        if (_this.__onFinishChange) {
          _this.__onFinishChange.call(_this, _this.getValue());
        }
      }
      function onBlur() {
        onFinish();
      }
      function onMouseDrag(e) {
        var diff = prevY - e.clientY;
        _this.setValue(_this.getValue() + diff * _this.__impliedStep);
        prevY = e.clientY;
      }
      function onMouseUp() {
        dom.unbind(window, 'mousemove', onMouseDrag);
        dom.unbind(window, 'mouseup', onMouseUp);
        onFinish();
      }
      function onMouseDown(e) {
        dom.bind(window, 'mousemove', onMouseDrag);
        dom.bind(window, 'mouseup', onMouseUp);
        prevY = e.clientY;
      }
      _this2.__input = document.createElement('input');
      _this2.__input.setAttribute('type', 'text');
      dom.bind(_this2.__input, 'change', onChange);
      dom.bind(_this2.__input, 'blur', onBlur);
      dom.bind(_this2.__input, 'mousedown', onMouseDown);
      dom.bind(_this2.__input, 'keydown', function (e) {
        if (e.keyCode === 13) {
          _this.__truncationSuspended = true;
          this.blur();
          _this.__truncationSuspended = false;
          onFinish();
        }
      });
      _this2.updateDisplay();
      _this2.domElement.appendChild(_this2.__input);
      return _this2;
    }
    createClass(NumberControllerBox, [{
      key: 'updateDisplay',
      value: function updateDisplay() {
        this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
        return get(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
      }
    }]);
    return NumberControllerBox;
  }(NumberController);

  function map(v, i1, i2, o1, o2) {
    return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
  }
  var NumberControllerSlider = function (_NumberController) {
    inherits(NumberControllerSlider, _NumberController);
    function NumberControllerSlider(object, property, min, max, step) {
      classCallCheck(this, NumberControllerSlider);
      var _this2 = possibleConstructorReturn(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
      var _this = _this2;
      _this2.__background = document.createElement('div');
      _this2.__foreground = document.createElement('div');
      dom.bind(_this2.__background, 'mousedown', onMouseDown);
      dom.bind(_this2.__background, 'touchstart', onTouchStart);
      dom.addClass(_this2.__background, 'slider');
      dom.addClass(_this2.__foreground, 'slider-fg');
      function onMouseDown(e) {
        document.activeElement.blur();
        dom.bind(window, 'mousemove', onMouseDrag);
        dom.bind(window, 'mouseup', onMouseUp);
        onMouseDrag(e);
      }
      function onMouseDrag(e) {
        e.preventDefault();
        var bgRect = _this.__background.getBoundingClientRect();
        _this.setValue(map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
        return false;
      }
      function onMouseUp() {
        dom.unbind(window, 'mousemove', onMouseDrag);
        dom.unbind(window, 'mouseup', onMouseUp);
        if (_this.__onFinishChange) {
          _this.__onFinishChange.call(_this, _this.getValue());
        }
      }
      function onTouchStart(e) {
        if (e.touches.length !== 1) {
          return;
        }
        dom.bind(window, 'touchmove', onTouchMove);
        dom.bind(window, 'touchend', onTouchEnd);
        onTouchMove(e);
      }
      function onTouchMove(e) {
        var clientX = e.touches[0].clientX;
        var bgRect = _this.__background.getBoundingClientRect();
        _this.setValue(map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
      }
      function onTouchEnd() {
        dom.unbind(window, 'touchmove', onTouchMove);
        dom.unbind(window, 'touchend', onTouchEnd);
        if (_this.__onFinishChange) {
          _this.__onFinishChange.call(_this, _this.getValue());
        }
      }
      _this2.updateDisplay();
      _this2.__background.appendChild(_this2.__foreground);
      _this2.domElement.appendChild(_this2.__background);
      return _this2;
    }
    createClass(NumberControllerSlider, [{
      key: 'updateDisplay',
      value: function updateDisplay() {
        var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
        this.__foreground.style.width = pct * 100 + '%';
        return get(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
      }
    }]);
    return NumberControllerSlider;
  }(NumberController);

  var FunctionController = function (_Controller) {
    inherits(FunctionController, _Controller);
    function FunctionController(object, property, text) {
      classCallCheck(this, FunctionController);
      var _this2 = possibleConstructorReturn(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));
      var _this = _this2;
      _this2.__button = document.createElement('div');
      _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
      dom.bind(_this2.__button, 'click', function (e) {
        e.preventDefault();
        _this.fire();
        return false;
      });
      dom.addClass(_this2.__button, 'button');
      _this2.domElement.appendChild(_this2.__button);
      return _this2;
    }
    createClass(FunctionController, [{
      key: 'fire',
      value: function fire() {
        if (this.__onChange) {
          this.__onChange.call(this);
        }
        this.getValue().call(this.object);
        if (this.__onFinishChange) {
          this.__onFinishChange.call(this, this.getValue());
        }
      }
    }]);
    return FunctionController;
  }(Controller);

  var ColorController = function (_Controller) {
    inherits(ColorController, _Controller);
    function ColorController(object, property) {
      classCallCheck(this, ColorController);
      var _this2 = possibleConstructorReturn(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));
      _this2.__color = new Color(_this2.getValue());
      _this2.__temp = new Color(0);
      var _this = _this2;
      _this2.domElement = document.createElement('div');
      dom.makeSelectable(_this2.domElement, false);
      _this2.__selector = document.createElement('div');
      _this2.__selector.className = 'selector';
      _this2.__saturation_field = document.createElement('div');
      _this2.__saturation_field.className = 'saturation-field';
      _this2.__field_knob = document.createElement('div');
      _this2.__field_knob.className = 'field-knob';
      _this2.__field_knob_border = '2px solid ';
      _this2.__hue_knob = document.createElement('div');
      _this2.__hue_knob.className = 'hue-knob';
      _this2.__hue_field = document.createElement('div');
      _this2.__hue_field.className = 'hue-field';
      _this2.__input = document.createElement('input');
      _this2.__input.type = 'text';
      _this2.__input_textShadow = '0 1px 1px ';
      dom.bind(_this2.__input, 'keydown', function (e) {
        if (e.keyCode === 13) {
          onBlur.call(this);
        }
      });
      dom.bind(_this2.__input, 'blur', onBlur);
      dom.bind(_this2.__selector, 'mousedown', function ()        {
        dom.addClass(this, 'drag').bind(window, 'mouseup', function ()        {
          dom.removeClass(_this.__selector, 'drag');
        });
      });
      dom.bind(_this2.__selector, 'touchstart', function ()        {
        dom.addClass(this, 'drag').bind(window, 'touchend', function ()        {
          dom.removeClass(_this.__selector, 'drag');
        });
      });
      var valueField = document.createElement('div');
      Common.extend(_this2.__selector.style, {
        width: '122px',
        height: '102px',
        padding: '3px',
        backgroundColor: '#222',
        boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
      });
      Common.extend(_this2.__field_knob.style, {
        position: 'absolute',
        width: '12px',
        height: '12px',
        border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? '#fff' : '#000'),
        boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
        borderRadius: '12px',
        zIndex: 1
      });
      Common.extend(_this2.__hue_knob.style, {
        position: 'absolute',
        width: '15px',
        height: '2px',
        borderRight: '4px solid #fff',
        zIndex: 1
      });
      Common.extend(_this2.__saturation_field.style, {
        width: '100px',
        height: '100px',
        border: '1px solid #555',
        marginRight: '3px',
        display: 'inline-block',
        cursor: 'pointer'
      });
      Common.extend(valueField.style, {
        width: '100%',
        height: '100%',
        background: 'none'
      });
      linearGradient(valueField, 'top', 'rgba(0,0,0,0)', '#000');
      Common.extend(_this2.__hue_field.style, {
        width: '15px',
        height: '100px',
        border: '1px solid #555',
        cursor: 'ns-resize',
        position: 'absolute',
        top: '3px',
        right: '3px'
      });
      hueGradient(_this2.__hue_field);
      Common.extend(_this2.__input.style, {
        outline: 'none',
        textAlign: 'center',
        color: '#fff',
        border: 0,
        fontWeight: 'bold',
        textShadow: _this2.__input_textShadow + 'rgba(0,0,0,0.7)'
      });
      dom.bind(_this2.__saturation_field, 'mousedown', fieldDown);
      dom.bind(_this2.__saturation_field, 'touchstart', fieldDown);
      dom.bind(_this2.__field_knob, 'mousedown', fieldDown);
      dom.bind(_this2.__field_knob, 'touchstart', fieldDown);
      dom.bind(_this2.__hue_field, 'mousedown', fieldDownH);
      dom.bind(_this2.__hue_field, 'touchstart', fieldDownH);
      function fieldDown(e) {
        setSV(e);
        dom.bind(window, 'mousemove', setSV);
        dom.bind(window, 'touchmove', setSV);
        dom.bind(window, 'mouseup', fieldUpSV);
        dom.bind(window, 'touchend', fieldUpSV);
      }
      function fieldDownH(e) {
        setH(e);
        dom.bind(window, 'mousemove', setH);
        dom.bind(window, 'touchmove', setH);
        dom.bind(window, 'mouseup', fieldUpH);
        dom.bind(window, 'touchend', fieldUpH);
      }
      function fieldUpSV() {
        dom.unbind(window, 'mousemove', setSV);
        dom.unbind(window, 'touchmove', setSV);
        dom.unbind(window, 'mouseup', fieldUpSV);
        dom.unbind(window, 'touchend', fieldUpSV);
        onFinish();
      }
      function fieldUpH() {
        dom.unbind(window, 'mousemove', setH);
        dom.unbind(window, 'touchmove', setH);
        dom.unbind(window, 'mouseup', fieldUpH);
        dom.unbind(window, 'touchend', fieldUpH);
        onFinish();
      }
      function onBlur() {
        var i = interpret(this.value);
        if (i !== false) {
          _this.__color.__state = i;
          _this.setValue(_this.__color.toOriginal());
        } else {
          this.value = _this.__color.toString();
        }
      }
      function onFinish() {
        if (_this.__onFinishChange) {
          _this.__onFinishChange.call(_this, _this.__color.toOriginal());
        }
      }
      _this2.__saturation_field.appendChild(valueField);
      _this2.__selector.appendChild(_this2.__field_knob);
      _this2.__selector.appendChild(_this2.__saturation_field);
      _this2.__selector.appendChild(_this2.__hue_field);
      _this2.__hue_field.appendChild(_this2.__hue_knob);
      _this2.domElement.appendChild(_this2.__input);
      _this2.domElement.appendChild(_this2.__selector);
      _this2.updateDisplay();
      function setSV(e) {
        if (e.type.indexOf('touch') === -1) {
          e.preventDefault();
        }
        var fieldRect = _this.__saturation_field.getBoundingClientRect();
        var _ref = e.touches && e.touches[0] || e,
            clientX = _ref.clientX,
            clientY = _ref.clientY;
        var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
        var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
        if (v > 1) {
          v = 1;
        } else if (v < 0) {
          v = 0;
        }
        if (s > 1) {
          s = 1;
        } else if (s < 0) {
          s = 0;
        }
        _this.__color.v = v;
        _this.__color.s = s;
        _this.setValue(_this.__color.toOriginal());
        return false;
      }
      function setH(e) {
        if (e.type.indexOf('touch') === -1) {
          e.preventDefault();
        }
        var fieldRect = _this.__hue_field.getBoundingClientRect();
        var _ref2 = e.touches && e.touches[0] || e,
            clientY = _ref2.clientY;
        var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
        if (h > 1) {
          h = 1;
        } else if (h < 0) {
          h = 0;
        }
        _this.__color.h = h * 360;
        _this.setValue(_this.__color.toOriginal());
        return false;
      }
      return _this2;
    }
    createClass(ColorController, [{
      key: 'updateDisplay',
      value: function updateDisplay() {
        var i = interpret(this.getValue());
        if (i !== false) {
          var mismatch = false;
          Common.each(Color.COMPONENTS, function (component) {
            if (!Common.isUndefined(i[component]) && !Common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
              mismatch = true;
              return {};
            }
          }, this);
          if (mismatch) {
            Common.extend(this.__color.__state, i);
          }
        }
        Common.extend(this.__temp.__state, this.__color.__state);
        this.__temp.a = 1;
        var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;
        var _flip = 255 - flip;
        Common.extend(this.__field_knob.style, {
          marginLeft: 100 * this.__color.s - 7 + 'px',
          marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
          backgroundColor: this.__temp.toHexString(),
          border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
        });
        this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
        this.__temp.s = 1;
        this.__temp.v = 1;
        linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
        this.__input.value = this.__color.toString();
        Common.extend(this.__input.style, {
          backgroundColor: this.__color.toHexString(),
          color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
          textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
        });
      }
    }]);
    return ColorController;
  }(Controller);
  var vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];
  function linearGradient(elem, x, a, b) {
    elem.style.background = '';
    Common.each(vendors, function (vendor) {
      elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
    });
  }
  function hueGradient(elem) {
    elem.style.background = '';
    elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
    elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  }

  var css = {
    load: function load(url, indoc) {
      var doc = indoc || document;
      var link = doc.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      doc.getElementsByTagName('head')[0].appendChild(link);
    },
    inject: function inject(cssContent, indoc) {
      var doc = indoc || document;
      var injected = document.createElement('style');
      injected.type = 'text/css';
      injected.innerHTML = cssContent;
      var head = doc.getElementsByTagName('head')[0];
      try {
        head.appendChild(injected);
      } catch (e) {
      }
    }
  };

  var saveDialogContents = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

  var ControllerFactory = function ControllerFactory(object, property) {
    var initialValue = object[property];
    if (Common.isArray(arguments[2]) || Common.isObject(arguments[2])) {
      return new OptionController(object, property, arguments[2]);
    }
    if (Common.isNumber(initialValue)) {
      if (Common.isNumber(arguments[2]) && Common.isNumber(arguments[3])) {
        if (Common.isNumber(arguments[4])) {
          return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4]);
        }
        return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
      }
      if (Common.isNumber(arguments[4])) {
        return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3], step: arguments[4] });
      }
      return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });
    }
    if (Common.isString(initialValue)) {
      return new StringController(object, property);
    }
    if (Common.isFunction(initialValue)) {
      return new FunctionController(object, property, '');
    }
    if (Common.isBoolean(initialValue)) {
      return new BooleanController(object, property);
    }
    return null;
  };

  function requestAnimationFrame(callback) {
    setTimeout(callback, 1000 / 60);
  }
  var requestAnimationFrame$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;

  var CenteredDiv = function () {
    function CenteredDiv() {
      classCallCheck(this, CenteredDiv);
      this.backgroundElement = document.createElement('div');
      Common.extend(this.backgroundElement.style, {
        backgroundColor: 'rgba(0,0,0,0.8)',
        top: 0,
        left: 0,
        display: 'none',
        zIndex: '1000',
        opacity: 0,
        WebkitTransition: 'opacity 0.2s linear',
        transition: 'opacity 0.2s linear'
      });
      dom.makeFullscreen(this.backgroundElement);
      this.backgroundElement.style.position = 'fixed';
      this.domElement = document.createElement('div');
      Common.extend(this.domElement.style, {
        position: 'fixed',
        display: 'none',
        zIndex: '1001',
        opacity: 0,
        WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
        transition: 'transform 0.2s ease-out, opacity 0.2s linear'
      });
      document.body.appendChild(this.backgroundElement);
      document.body.appendChild(this.domElement);
      var _this = this;
      dom.bind(this.backgroundElement, 'click', function () {
        _this.hide();
      });
    }
    createClass(CenteredDiv, [{
      key: 'show',
      value: function show() {
        var _this = this;
        this.backgroundElement.style.display = 'block';
        this.domElement.style.display = 'block';
        this.domElement.style.opacity = 0;
        this.domElement.style.webkitTransform = 'scale(1.1)';
        this.layout();
        Common.defer(function () {
          _this.backgroundElement.style.opacity = 1;
          _this.domElement.style.opacity = 1;
          _this.domElement.style.webkitTransform = 'scale(1)';
        });
      }
    }, {
      key: 'hide',
      value: function hide() {
        var _this = this;
        var hide = function hide() {
          _this.domElement.style.display = 'none';
          _this.backgroundElement.style.display = 'none';
          dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
          dom.unbind(_this.domElement, 'transitionend', hide);
          dom.unbind(_this.domElement, 'oTransitionEnd', hide);
        };
        dom.bind(this.domElement, 'webkitTransitionEnd', hide);
        dom.bind(this.domElement, 'transitionend', hide);
        dom.bind(this.domElement, 'oTransitionEnd', hide);
        this.backgroundElement.style.opacity = 0;
        this.domElement.style.opacity = 0;
        this.domElement.style.webkitTransform = 'scale(1.1)';
      }
    }, {
      key: 'layout',
      value: function layout() {
        this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + 'px';
        this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + 'px';
      }
    }]);
    return CenteredDiv;
  }();

  var styleSheet = ___$insertStyle(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");

  css.inject(styleSheet);
  var CSS_NAMESPACE = 'dg';
  var HIDE_KEY_CODE = 72;
  var CLOSE_BUTTON_HEIGHT = 20;
  var DEFAULT_DEFAULT_PRESET_NAME = 'Default';
  var SUPPORTS_LOCAL_STORAGE = function () {
    try {
      return !!window.localStorage;
    } catch (e) {
      return false;
    }
  }();
  var SAVE_DIALOGUE = void 0;
  var autoPlaceVirgin = true;
  var autoPlaceContainer = void 0;
  var hide = false;
  var hideableGuis = [];
  var GUI = function GUI(pars) {
    var _this = this;
    var params = pars || {};
    this.domElement = document.createElement('div');
    this.__ul = document.createElement('ul');
    this.domElement.appendChild(this.__ul);
    dom.addClass(this.domElement, CSS_NAMESPACE);
    this.__folders = {};
    this.__controllers = [];
    this.__rememberedObjects = [];
    this.__rememberedObjectIndecesToControllers = [];
    this.__listening = [];
    params = Common.defaults(params, {
      closeOnTop: false,
      autoPlace: true,
      width: GUI.DEFAULT_WIDTH
    });
    params = Common.defaults(params, {
      resizable: params.autoPlace,
      hideable: params.autoPlace
    });
    if (!Common.isUndefined(params.load)) {
      if (params.preset) {
        params.load.preset = params.preset;
      }
    } else {
      params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
    }
    if (Common.isUndefined(params.parent) && params.hideable) {
      hideableGuis.push(this);
    }
    params.resizable = Common.isUndefined(params.parent) && params.resizable;
    if (params.autoPlace && Common.isUndefined(params.scrollable)) {
      params.scrollable = true;
    }
    var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
    var saveToLocalStorage = void 0;
    var titleRow = void 0;
    Object.defineProperties(this,
    {
      parent: {
        get: function get$$1() {
          return params.parent;
        }
      },
      scrollable: {
        get: function get$$1() {
          return params.scrollable;
        }
      },
      autoPlace: {
        get: function get$$1() {
          return params.autoPlace;
        }
      },
      closeOnTop: {
        get: function get$$1() {
          return params.closeOnTop;
        }
      },
      preset: {
        get: function get$$1() {
          if (_this.parent) {
            return _this.getRoot().preset;
          }
          return params.load.preset;
        },
        set: function set$$1(v) {
          if (_this.parent) {
            _this.getRoot().preset = v;
          } else {
            params.load.preset = v;
          }
          setPresetSelectIndex(this);
          _this.revert();
        }
      },
      width: {
        get: function get$$1() {
          return params.width;
        },
        set: function set$$1(v) {
          params.width = v;
          setWidth(_this, v);
        }
      },
      name: {
        get: function get$$1() {
          return params.name;
        },
        set: function set$$1(v) {
          params.name = v;
          if (titleRow) {
            titleRow.innerHTML = params.name;
          }
        }
      },
      closed: {
        get: function get$$1() {
          return params.closed;
        },
        set: function set$$1(v) {
          params.closed = v;
          if (params.closed) {
            dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
          } else {
            dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
          }
          this.onResize();
          if (_this.__closeButton) {
            _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
          }
        }
      },
      load: {
        get: function get$$1() {
          return params.load;
        }
      },
      useLocalStorage: {
        get: function get$$1() {
          return useLocalStorage;
        },
        set: function set$$1(bool) {
          if (SUPPORTS_LOCAL_STORAGE) {
            useLocalStorage = bool;
            if (bool) {
              dom.bind(window, 'unload', saveToLocalStorage);
            } else {
              dom.unbind(window, 'unload', saveToLocalStorage);
            }
            localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
          }
        }
      }
    });
    if (Common.isUndefined(params.parent)) {
      this.closed = params.closed || false;
      dom.addClass(this.domElement, GUI.CLASS_MAIN);
      dom.makeSelectable(this.domElement, false);
      if (SUPPORTS_LOCAL_STORAGE) {
        if (useLocalStorage) {
          _this.useLocalStorage = true;
          var savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));
          if (savedGui) {
            params.load = JSON.parse(savedGui);
          }
        }
      }
      this.__closeButton = document.createElement('div');
      this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
      if (params.closeOnTop) {
        dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
        this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
      } else {
        dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
        this.domElement.appendChild(this.__closeButton);
      }
      dom.bind(this.__closeButton, 'click', function () {
        _this.closed = !_this.closed;
      });
    } else {
      if (params.closed === undefined) {
        params.closed = true;
      }
      var titleRowName = document.createTextNode(params.name);
      dom.addClass(titleRowName, 'controller-name');
      titleRow = addRow(_this, titleRowName);
      var onClickTitle = function onClickTitle(e) {
        e.preventDefault();
        _this.closed = !_this.closed;
        return false;
      };
      dom.addClass(this.__ul, GUI.CLASS_CLOSED);
      dom.addClass(titleRow, 'title');
      dom.bind(titleRow, 'click', onClickTitle);
      if (!params.closed) {
        this.closed = false;
      }
    }
    if (params.autoPlace) {
      if (Common.isUndefined(params.parent)) {
        if (autoPlaceVirgin) {
          autoPlaceContainer = document.createElement('div');
          dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
          dom.addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
          document.body.appendChild(autoPlaceContainer);
          autoPlaceVirgin = false;
        }
        autoPlaceContainer.appendChild(this.domElement);
        dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
      }
      if (!this.parent) {
        setWidth(_this, params.width);
      }
    }
    this.__resizeHandler = function () {
      _this.onResizeDebounced();
    };
    dom.bind(window, 'resize', this.__resizeHandler);
    dom.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
    dom.bind(this.__ul, 'transitionend', this.__resizeHandler);
    dom.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
    this.onResize();
    if (params.resizable) {
      addResizeHandle(this);
    }
    saveToLocalStorage = function saveToLocalStorage() {
      if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
        localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
      }
    };
    this.saveToLocalStorageIfPossible = saveToLocalStorage;
    function resetWidth() {
      var root = _this.getRoot();
      root.width += 1;
      Common.defer(function () {
        root.width -= 1;
      });
    }
    if (!params.parent) {
      resetWidth();
    }
  };
  GUI.toggleHide = function () {
    hide = !hide;
    Common.each(hideableGuis, function (gui) {
      gui.domElement.style.display = hide ? 'none' : '';
    });
  };
  GUI.CLASS_AUTO_PLACE = 'a';
  GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
  GUI.CLASS_MAIN = 'main';
  GUI.CLASS_CONTROLLER_ROW = 'cr';
  GUI.CLASS_TOO_TALL = 'taller-than-window';
  GUI.CLASS_CLOSED = 'closed';
  GUI.CLASS_CLOSE_BUTTON = 'close-button';
  GUI.CLASS_CLOSE_TOP = 'close-top';
  GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
  GUI.CLASS_DRAG = 'drag';
  GUI.DEFAULT_WIDTH = 245;
  GUI.TEXT_CLOSED = 'Close Controls';
  GUI.TEXT_OPEN = 'Open Controls';
  GUI._keydownHandler = function (e) {
    if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
      GUI.toggleHide();
    }
  };
  dom.bind(window, 'keydown', GUI._keydownHandler, false);
  Common.extend(GUI.prototype,
  {
    add: function add(object, property) {
      return _add(this, object, property, {
        factoryArgs: Array.prototype.slice.call(arguments, 2)
      });
    },
    addColor: function addColor(object, property) {
      return _add(this, object, property, {
        color: true
      });
    },
    remove: function remove(controller) {
      this.__ul.removeChild(controller.__li);
      this.__controllers.splice(this.__controllers.indexOf(controller), 1);
      var _this = this;
      Common.defer(function () {
        _this.onResize();
      });
    },
    destroy: function destroy() {
      if (this.parent) {
        throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
      }
      if (this.autoPlace) {
        autoPlaceContainer.removeChild(this.domElement);
      }
      var _this = this;
      Common.each(this.__folders, function (subfolder) {
        _this.removeFolder(subfolder);
      });
      dom.unbind(window, 'keydown', GUI._keydownHandler, false);
      removeListeners(this);
    },
    addFolder: function addFolder(name) {
      if (this.__folders[name] !== undefined) {
        throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
      }
      var newGuiParams = { name: name, parent: this };
      newGuiParams.autoPlace = this.autoPlace;
      if (this.load &&
      this.load.folders &&
      this.load.folders[name]) {
        newGuiParams.closed = this.load.folders[name].closed;
        newGuiParams.load = this.load.folders[name];
      }
      var gui = new GUI(newGuiParams);
      this.__folders[name] = gui;
      var li = addRow(this, gui.domElement);
      dom.addClass(li, 'folder');
      return gui;
    },
    removeFolder: function removeFolder(folder) {
      this.__ul.removeChild(folder.domElement.parentElement);
      delete this.__folders[folder.name];
      if (this.load &&
      this.load.folders &&
      this.load.folders[folder.name]) {
        delete this.load.folders[folder.name];
      }
      removeListeners(folder);
      var _this = this;
      Common.each(folder.__folders, function (subfolder) {
        folder.removeFolder(subfolder);
      });
      Common.defer(function () {
        _this.onResize();
      });
    },
    open: function open() {
      this.closed = false;
    },
    close: function close() {
      this.closed = true;
    },
    hide: function hide() {
      this.domElement.style.display = 'none';
    },
    show: function show() {
      this.domElement.style.display = '';
    },
    onResize: function onResize() {
      var root = this.getRoot();
      if (root.scrollable) {
        var top = dom.getOffset(root.__ul).top;
        var h = 0;
        Common.each(root.__ul.childNodes, function (node) {
          if (!(root.autoPlace && node === root.__save_row)) {
            h += dom.getHeight(node);
          }
        });
        if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
          dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
          root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
        } else {
          dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
          root.__ul.style.height = 'auto';
        }
      }
      if (root.__resize_handle) {
        Common.defer(function () {
          root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
        });
      }
      if (root.__closeButton) {
        root.__closeButton.style.width = root.width + 'px';
      }
    },
    onResizeDebounced: Common.debounce(function () {
      this.onResize();
    }, 50),
    remember: function remember() {
      if (Common.isUndefined(SAVE_DIALOGUE)) {
        SAVE_DIALOGUE = new CenteredDiv();
        SAVE_DIALOGUE.domElement.innerHTML = saveDialogContents;
      }
      if (this.parent) {
        throw new Error('You can only call remember on a top level GUI.');
      }
      var _this = this;
      Common.each(Array.prototype.slice.call(arguments), function (object) {
        if (_this.__rememberedObjects.length === 0) {
          addSaveMenu(_this);
        }
        if (_this.__rememberedObjects.indexOf(object) === -1) {
          _this.__rememberedObjects.push(object);
        }
      });
      if (this.autoPlace) {
        setWidth(this, this.width);
      }
    },
    getRoot: function getRoot() {
      var gui = this;
      while (gui.parent) {
        gui = gui.parent;
      }
      return gui;
    },
    getSaveObject: function getSaveObject() {
      var toReturn = this.load;
      toReturn.closed = this.closed;
      if (this.__rememberedObjects.length > 0) {
        toReturn.preset = this.preset;
        if (!toReturn.remembered) {
          toReturn.remembered = {};
        }
        toReturn.remembered[this.preset] = getCurrentPreset(this);
      }
      toReturn.folders = {};
      Common.each(this.__folders, function (element, key) {
        toReturn.folders[key] = element.getSaveObject();
      });
      return toReturn;
    },
    save: function save() {
      if (!this.load.remembered) {
        this.load.remembered = {};
      }
      this.load.remembered[this.preset] = getCurrentPreset(this);
      markPresetModified(this, false);
      this.saveToLocalStorageIfPossible();
    },
    saveAs: function saveAs(presetName) {
      if (!this.load.remembered) {
        this.load.remembered = {};
        this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
      }
      this.load.remembered[presetName] = getCurrentPreset(this);
      this.preset = presetName;
      addPresetOption(this, presetName, true);
      this.saveToLocalStorageIfPossible();
    },
    revert: function revert(gui) {
      Common.each(this.__controllers, function (controller) {
        if (!this.getRoot().load.remembered) {
          controller.setValue(controller.initialValue);
        } else {
          recallSavedValue(gui || this.getRoot(), controller);
        }
        if (controller.__onFinishChange) {
          controller.__onFinishChange.call(controller, controller.getValue());
        }
      }, this);
      Common.each(this.__folders, function (folder) {
        folder.revert(folder);
      });
      if (!gui) {
        markPresetModified(this.getRoot(), false);
      }
    },
    listen: function listen(controller) {
      var init = this.__listening.length === 0;
      this.__listening.push(controller);
      if (init) {
        updateDisplays(this.__listening);
      }
    },
    updateDisplay: function updateDisplay() {
      Common.each(this.__controllers, function (controller) {
        controller.updateDisplay();
      });
      Common.each(this.__folders, function (folder) {
        folder.updateDisplay();
      });
    }
  });
  function addRow(gui, newDom, liBefore) {
    var li = document.createElement('li');
    if (newDom) {
      li.appendChild(newDom);
    }
    if (liBefore) {
      gui.__ul.insertBefore(li, liBefore);
    } else {
      gui.__ul.appendChild(li);
    }
    gui.onResize();
    return li;
  }
  function removeListeners(gui) {
    dom.unbind(window, 'resize', gui.__resizeHandler);
    if (gui.saveToLocalStorageIfPossible) {
      dom.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
    }
  }
  function markPresetModified(gui, modified) {
    var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
    if (modified) {
      opt.innerHTML = opt.value + '*';
    } else {
      opt.innerHTML = opt.value;
    }
  }
  function augmentController(gui, li, controller) {
    controller.__li = li;
    controller.__gui = gui;
    Common.extend(controller,                                   {
      options: function options(_options) {
        if (arguments.length > 1) {
          var nextSibling = controller.__li.nextElementSibling;
          controller.remove();
          return _add(gui, controller.object, controller.property, {
            before: nextSibling,
            factoryArgs: [Common.toArray(arguments)]
          });
        }
        if (Common.isArray(_options) || Common.isObject(_options)) {
          var _nextSibling = controller.__li.nextElementSibling;
          controller.remove();
          return _add(gui, controller.object, controller.property, {
            before: _nextSibling,
            factoryArgs: [_options]
          });
        }
      },
      name: function name(_name) {
        controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
        return controller;
      },
      listen: function listen() {
        controller.__gui.listen(controller);
        return controller;
      },
      remove: function remove() {
        controller.__gui.remove(controller);
        return controller;
      }
    });
    if (controller instanceof NumberControllerSlider) {
      var box = new NumberControllerBox(controller.object, controller.property, { min: controller.__min, max: controller.__max, step: controller.__step });
      Common.each(['updateDisplay', 'onChange', 'onFinishChange', 'step', 'min', 'max'], function (method) {
        var pc = controller[method];
        var pb = box[method];
        controller[method] = box[method] = function () {
          var args = Array.prototype.slice.call(arguments);
          pb.apply(box, args);
          return pc.apply(controller, args);
        };
      });
      dom.addClass(li, 'has-slider');
      controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
    } else if (controller instanceof NumberControllerBox) {
      var r = function r(returned) {
        if (Common.isNumber(controller.__min) && Common.isNumber(controller.__max)) {
          var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
          var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
          controller.remove();
          var newController = _add(gui, controller.object, controller.property, {
            before: controller.__li.nextElementSibling,
            factoryArgs: [controller.__min, controller.__max, controller.__step]
          });
          newController.name(oldName);
          if (wasListening) newController.listen();
          return newController;
        }
        return returned;
      };
      controller.min = Common.compose(r, controller.min);
      controller.max = Common.compose(r, controller.max);
    } else if (controller instanceof BooleanController) {
      dom.bind(li, 'click', function () {
        dom.fakeEvent(controller.__checkbox, 'click');
      });
      dom.bind(controller.__checkbox, 'click', function (e) {
        e.stopPropagation();
      });
    } else if (controller instanceof FunctionController) {
      dom.bind(li, 'click', function () {
        dom.fakeEvent(controller.__button, 'click');
      });
      dom.bind(li, 'mouseover', function () {
        dom.addClass(controller.__button, 'hover');
      });
      dom.bind(li, 'mouseout', function () {
        dom.removeClass(controller.__button, 'hover');
      });
    } else if (controller instanceof ColorController) {
      dom.addClass(li, 'color');
      controller.updateDisplay = Common.compose(function (val) {
        li.style.borderLeftColor = controller.__color.toString();
        return val;
      }, controller.updateDisplay);
      controller.updateDisplay();
    }
    controller.setValue = Common.compose(function (val) {
      if (gui.getRoot().__preset_select && controller.isModified()) {
        markPresetModified(gui.getRoot(), true);
      }
      return val;
    }, controller.setValue);
  }
  function recallSavedValue(gui, controller) {
    var root = gui.getRoot();
    var matchedIndex = root.__rememberedObjects.indexOf(controller.object);
    if (matchedIndex !== -1) {
      var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];
      if (controllerMap === undefined) {
        controllerMap = {};
        root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
      }
      controllerMap[controller.property] = controller;
      if (root.load && root.load.remembered) {
        var presetMap = root.load.remembered;
        var preset = void 0;
        if (presetMap[gui.preset]) {
          preset = presetMap[gui.preset];
        } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
          preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
        } else {
          return;
        }
        if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
          var value = preset[matchedIndex][controller.property];
          controller.initialValue = value;
          controller.setValue(value);
        }
      }
    }
  }
  function _add(gui, object, property, params) {
    if (object[property] === undefined) {
      throw new Error('Object "' + object + '" has no property "' + property + '"');
    }
    var controller = void 0;
    if (params.color) {
      controller = new ColorController(object, property);
    } else {
      var factoryArgs = [object, property].concat(params.factoryArgs);
      controller = ControllerFactory.apply(gui, factoryArgs);
    }
    if (params.before instanceof Controller) {
      params.before = params.before.__li;
    }
    recallSavedValue(gui, controller);
    dom.addClass(controller.domElement, 'c');
    var name = document.createElement('span');
    dom.addClass(name, 'property-name');
    name.innerHTML = controller.property;
    var container = document.createElement('div');
    container.appendChild(name);
    container.appendChild(controller.domElement);
    var li = addRow(gui, container, params.before);
    dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
    if (controller instanceof ColorController) {
      dom.addClass(li, 'color');
    } else {
      dom.addClass(li, _typeof(controller.getValue()));
    }
    augmentController(gui, li, controller);
    gui.__controllers.push(controller);
    return controller;
  }
  function getLocalStorageHash(gui, key) {
    return document.location.href + '.' + key;
  }
  function addPresetOption(gui, name, setSelected) {
    var opt = document.createElement('option');
    opt.innerHTML = name;
    opt.value = name;
    gui.__preset_select.appendChild(opt);
    if (setSelected) {
      gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
    }
  }
  function showHideExplain(gui, explain) {
    explain.style.display = gui.useLocalStorage ? 'block' : 'none';
  }
  function addSaveMenu(gui) {
    var div = gui.__save_row = document.createElement('li');
    dom.addClass(gui.domElement, 'has-save');
    gui.__ul.insertBefore(div, gui.__ul.firstChild);
    dom.addClass(div, 'save-row');
    var gears = document.createElement('span');
    gears.innerHTML = '&nbsp;';
    dom.addClass(gears, 'button gears');
    var button = document.createElement('span');
    button.innerHTML = 'Save';
    dom.addClass(button, 'button');
    dom.addClass(button, 'save');
    var button2 = document.createElement('span');
    button2.innerHTML = 'New';
    dom.addClass(button2, 'button');
    dom.addClass(button2, 'save-as');
    var button3 = document.createElement('span');
    button3.innerHTML = 'Revert';
    dom.addClass(button3, 'button');
    dom.addClass(button3, 'revert');
    var select = gui.__preset_select = document.createElement('select');
    if (gui.load && gui.load.remembered) {
      Common.each(gui.load.remembered, function (value, key) {
        addPresetOption(gui, key, key === gui.preset);
      });
    } else {
      addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
    }
    dom.bind(select, 'change', function () {
      for (var index = 0; index < gui.__preset_select.length; index++) {
        gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
      }
      gui.preset = this.value;
    });
    div.appendChild(select);
    div.appendChild(gears);
    div.appendChild(button);
    div.appendChild(button2);
    div.appendChild(button3);
    if (SUPPORTS_LOCAL_STORAGE) {
      var explain = document.getElementById('dg-local-explain');
      var localStorageCheckBox = document.getElementById('dg-local-storage');
      var saveLocally = document.getElementById('dg-save-locally');
      saveLocally.style.display = 'block';
      if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
        localStorageCheckBox.setAttribute('checked', 'checked');
      }
      showHideExplain(gui, explain);
      dom.bind(localStorageCheckBox, 'change', function () {
        gui.useLocalStorage = !gui.useLocalStorage;
        showHideExplain(gui, explain);
      });
    }
    var newConstructorTextArea = document.getElementById('dg-new-constructor');
    dom.bind(newConstructorTextArea, 'keydown', function (e) {
      if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
        SAVE_DIALOGUE.hide();
      }
    });
    dom.bind(gears, 'click', function () {
      newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
      SAVE_DIALOGUE.show();
      newConstructorTextArea.focus();
      newConstructorTextArea.select();
    });
    dom.bind(button, 'click', function () {
      gui.save();
    });
    dom.bind(button2, 'click', function () {
      var presetName = prompt('Enter a new preset name.');
      if (presetName) {
        gui.saveAs(presetName);
      }
    });
    dom.bind(button3, 'click', function () {
      gui.revert();
    });
  }
  function addResizeHandle(gui) {
    var pmouseX = void 0;
    gui.__resize_handle = document.createElement('div');
    Common.extend(gui.__resize_handle.style, {
      width: '6px',
      marginLeft: '-3px',
      height: '200px',
      cursor: 'ew-resize',
      position: 'absolute'
    });
    function drag(e) {
      e.preventDefault();
      gui.width += pmouseX - e.clientX;
      gui.onResize();
      pmouseX = e.clientX;
      return false;
    }
    function dragStop() {
      dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.unbind(window, 'mousemove', drag);
      dom.unbind(window, 'mouseup', dragStop);
    }
    function dragStart(e) {
      e.preventDefault();
      pmouseX = e.clientX;
      dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.bind(window, 'mousemove', drag);
      dom.bind(window, 'mouseup', dragStop);
      return false;
    }
    dom.bind(gui.__resize_handle, 'mousedown', dragStart);
    dom.bind(gui.__closeButton, 'mousedown', dragStart);
    gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
  }
  function setWidth(gui, w) {
    gui.domElement.style.width = w + 'px';
    if (gui.__save_row && gui.autoPlace) {
      gui.__save_row.style.width = w + 'px';
    }
    if (gui.__closeButton) {
      gui.__closeButton.style.width = w + 'px';
    }
  }
  function getCurrentPreset(gui, useInitialValues) {
    var toReturn = {};
    Common.each(gui.__rememberedObjects, function (val, index) {
      var savedValues = {};
      var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
      Common.each(controllerMap, function (controller, property) {
        savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
      });
      toReturn[index] = savedValues;
    });
    return toReturn;
  }
  function setPresetSelectIndex(gui) {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      if (gui.__preset_select[index].value === gui.preset) {
        gui.__preset_select.selectedIndex = index;
      }
    }
  }
  function updateDisplays(controllerArray) {
    if (controllerArray.length !== 0) {
      requestAnimationFrame$1.call(window, function () {
        updateDisplays(controllerArray);
      });
    }
    Common.each(controllerArray, function (c) {
      c.updateDisplay();
    });
  }
  var GUI$1 = GUI;

  var misc = [
    {
      name: 'frozen-rose',
      colors: ['#29368f', '#e9697b', '#1b164d', '#f7d996'],
      background: '#f2e8e4',
    },
    {
      name: 'winter-night',
      colors: ['#122438', '#dd672e', '#87c7ca', '#ebebeb'],
      background: '#ebebeb',
    },
    {
      name: 'saami',
      colors: ['#eab700', '#e64818', '#2c6393', '#eecfca'],
      background: '#e7e6e4',
    },
    {
      name: 'knotberry1',
      colors: ['#20342a', '#f74713', '#686d2c', '#e9b4a6'],
      background: '#e5ded8',
    },
    {
      name: 'knotberry2',
      colors: ['#1d3b1a', '#eb4b11', '#e5bc00', '#f29881'],
      background: '#eae2d0',
    },
    {
      name: 'tricolor',
      colors: ['#ec643b', '#56b7ab', '#f8cb57', '#1f1e43'],
      background: '#f7f2df',
    },
    {
      name: 'foxshelter',
      colors: ['#ff3931', '#007861', '#311f27', '#bab9a4'],
      background: '#dddddd',
    },
    {
      name: 'hermes',
      colors: ['#253852', '#51222f', '#b53435', '#ecbb51'],
      background: '#eeccc2',
    },
    {
      name: 'olympia',
      colors: ['#ff3250', '#ffb33a', '#008c36', '#0085c6', '#4c4c4c'],
      stroke: '#0b0b0b',
      background: '#faf2e5',
    },
    {
      name: 'byrnes',
      colors: ['#c54514', '#dca215', '#23507f'],
      stroke: '#0b0b0b',
      background: '#e8e7d4',
    },
    {
      name: 'butterfly',
      colors: ['#f40104', '#f6c0b3', '#99673a', '#f0f1f4'],
      stroke: '#191e36',
      background: '#191e36',
    },
    {
      name: 'floratopia',
      colors: ['#bf4a2b', '#cd902a', '#4e4973', '#f5d4bc'],
      stroke: '#1e1a43',
      background: '#1e1a43',
    },
    {
      name: 'verena',
      colors: ['#f1594a', '#f5b50e', '#14a160', '#2969de', '#885fa4'],
      stroke: '#1a1a1a',
      background: '#e2e6e8',
    },
    {
      name: 'florida_citrus',
      colors: ['#ea7251', '#ebf7f0', '#02aca5'],
      stroke: '#050100',
      background: '#9ae2d3',
    },
    {
      name: 'lemon_citrus',
      colors: ['#e2d574', '#f1f4f7', '#69c5ab'],
      stroke: '#463231',
      background: '#f79eac',
    },
    {
      name: 'yuma_punk',
      colors: ['#f05e3b', '#ebdec4', '#ffdb00'],
      stroke: '#ebdec4',
      background: '#161616',
    },
    {
      name: 'moir',
      colors: ['#a49f4f', '#d4501e', '#f7c558', '#ebbaa6'],
      stroke: '#161716',
      background: '#f7f4ef',
    },
    {
      name: 'sprague',
      colors: ['#ec2f28', '#f8cd28', '#1e95bb', '#fbaab3', '#fcefdf'],
      stroke: '#221e1f',
      background: '#fcefdf',
    },
    {
      name: 'bloomberg',
      colors: ['#ff5500', '#f4c145', '#144714', '#2f04fc', '#e276af'],
      stroke: '#000',
      background: '#fff3dd',
    },
    {
      name: 'revolucion',
      colors: ['#ed555d', '#fffcc9', '#41b797', '#eda126', '#7b5770'],
      stroke: '#fffcc9',
      background: '#2d1922',
    },
    {
      name: 'sneaker',
      colors: ['#e8165b', '#401e38', '#66c3b4', '#ee7724', '#584098'],
      stroke: '#401e38',
      background: '#ffffff',
    },
    {
      name: 'miradors',
      colors: ['#ff6936', '#fddc3f', '#0075ca', '#00bb70'],
      stroke: '#ffffff',
      background: '#020202',
    },
    {
      name: 'kaffeprat',
      colors: ['#BCAA8C', '#D8CDBE', '#484A42', '#746B58', '#9A8C73'],
      stroke: '#000',
      background: '#fff',
    },
  ];

  var colourscafe = [
    {
      name: 'cc239',
      colors: ['#e3dd34', '#78496b', '#f0527f', '#a7e0e2'],
      background: '#e0eff0'
    },
    {
      name: 'cc234',
      colors: ['#ffce49', '#ede8dc', '#ff5736', '#ff99b4'],
      background: '#f7f4ed'
    },
    {
      name: 'cc232',
      colors: ['#5c5f46', '#ff7044', '#ffce39', '#66aeaa'],
      background: '#e9ecde'
    },
    {
      name: 'cc238',
      colors: ['#553c60', '#ffb0a0', '#ff6749', '#fbe090'],
      background: '#f5e9de'
    },
    {
      name: 'cc242',
      colors: ['#bbd444', '#fcd744', '#fa7b53', '#423c6f'],
      background: '#faf4e4'
    },
    {
      name: 'cc245',
      colors: ['#0d4a4e', '#ff947b', '#ead3a2', '#5284ab'],
      background: '#f6f4ed'
    },
    {
      name: 'cc273',
      colors: ['#363d4a', '#7b8a56', '#ff9369', '#f4c172'],
      background: '#f0efe2'
    }
  ];

  var ranganath = [
    {
      name: 'rag-mysore',
      colors: ['#ec6c26', '#613a53', '#e8ac52', '#639aa0'],
      background: '#d5cda1'
    },
    {
      name: 'rag-gol',
      colors: ['#d3693e', '#803528', '#f1b156', '#90a798'],
      background: '#f0e0a4'
    },
    {
      name: 'rag-belur',
      colors: ['#f46e26', '#68485f', '#3d273a', '#535d55'],
      background: '#dcd4a6'
    },
    {
      name: 'rag-bangalore',
      colors: ['#ea720e', '#ca5130', '#e9c25a', '#52534f'],
      background: '#f9ecd3'
    },
    {
      name: 'rag-taj',
      colors: ['#ce565e', '#8e1752', '#f8a100', '#3ac1a6'],
      background: '#efdea2'
    },
    {
      name: 'rag-virupaksha',
      colors: ['#f5736a', '#925951', '#feba4c', '#9d9b9d'],
      background: '#eedfa2'
    }
  ];

  var roygbivs = [
    {
      name: 'retro',
      colors: [
        '#69766f',
        '#9ed6cb',
        '#f7e5cc',
        '#9d8f7f',
        '#936454',
        '#bf5c32',
        '#efad57'
      ]
    },
    {
      name: 'retro-washedout',
      colors: [
        '#878a87',
        '#cbdbc8',
        '#e8e0d4',
        '#b29e91',
        '#9f736c',
        '#b76254',
        '#dfa372'
      ]
    },
    {
      name: 'roygbiv-warm',
      colors: [
        '#705f84',
        '#687d99',
        '#6c843e',
        '#fc9a1a',
        '#dc383a',
        '#aa3a33',
        '#9c4257'
      ]
    },
    {
      name: 'roygbiv-toned',
      colors: [
        '#817c77',
        '#396c68',
        '#89e3b7',
        '#f59647',
        '#d63644',
        '#893f49',
        '#4d3240'
      ]
    },
    {
      name: 'present-correct',
      colors: [
        '#fd3741',
        '#fe4f11',
        '#ff6800',
        '#ffa61a',
        '#ffc219',
        '#ffd114',
        '#fcd82e',
        '#f4d730',
        '#ced562',
        '#8ac38f',
        '#79b7a0',
        '#72b5b1',
        '#5b9bae',
        '#6ba1b7',
        '#49619d',
        '#604791',
        '#721e7f',
        '#9b2b77',
        '#ab2562',
        '#ca2847'
      ]
    }
  ];

  var tundra = [
    {
      name: 'tundra1',
      colors: ['#40708c', '#8e998c', '#5d3f37', '#ed6954', '#f2e9e2']
    },
    {
      name: 'tundra2',
      colors: ['#5f9e93', '#3d3638', '#733632', '#b66239', '#b0a1a4', '#e3dad2']
    },
    {
      name: 'tundra3',
      colors: [
        '#87c3ca',
        '#7b7377',
        '#b2475d',
        '#7d3e3e',
        '#eb7f64',
        '#d9c67a',
        '#f3f2f2'
      ]
    },
    {
      name: 'tundra4',
      colors: [
        '#d53939',
        '#b6754d',
        '#a88d5f',
        '#524643',
        '#3c5a53',
        '#7d8c7c',
        '#dad6cd'
      ]
    }
  ];

  var rohlfs = [
    {
      name: 'rohlfs_1R',
      colors: ['#004996', '#567bae', '#ff4c48', '#ffbcb3'],
      stroke: '#004996',
      background: '#fff8e7'
    },
    {
      name: 'rohlfs_1Y',
      colors: ['#004996', '#567bae', '#ffc000', '#ffdca4'],
      stroke: '#004996',
      background: '#fff8e7'
    },
    {
      name: 'rohlfs_1G',
      colors: ['#004996', '#567bae', '#60bf3c', '#d2deb1'],
      stroke: '#004996',
      background: '#fff8e7'
    },
    {
      name: 'rohlfs_2',
      colors: ['#4d3d9a', '#f76975', '#ffffff', '#eff0dd'],
      stroke: '#211029',
      background: '#58bdbc'
    },
    {
      name: 'rohlfs_3',
      colors: ['#abdfdf', '#fde500', '#58bdbc', '#eff0dd'],
      stroke: '#211029',
      background: '#f76975'
    },
    {
      name: 'rohlfs_4',
      colors: ['#fde500', '#2f2043', '#f76975', '#eff0dd'],
      stroke: '#211029',
      background: '#fbbeca'
    }
  ];

  var ducci = [
    {
      name: 'ducci_jb',
      colors: ['#395e54', '#e77b4d', '#050006', '#e55486'],
      stroke: '#050006',
      background: '#efe0bc'
    },
    {
      name: 'ducci_a',
      colors: ['#809498', '#d3990e', '#000000', '#ecddc5'],
      stroke: '#ecddc5',
      background: '#863f52'
    },
    {
      name: 'ducci_b',
      colors: ['#ecddc5', '#79b27b', '#000000', '#ac6548'],
      stroke: '#ac6548',
      background: '#d5c08e'
    },
    {
      name: 'ducci_d',
      colors: ['#f3cb4d', '#f2f5e3', '#20191b', '#67875c'],
      stroke: '#67875c',
      background: '#433d5f'
    },
    {
      name: 'ducci_e',
      colors: ['#c37c2b', '#f6ecce', '#000000', '#386a7a'],
      stroke: '#386a7a',
      background: '#e3cd98'
    },
    {
      name: 'ducci_f',
      colors: ['#596f7e', '#eae6c7', '#463c21', '#f4cb4c'],
      stroke: '#f4cb4c',
      background: '#e67300'
    },
    {
      name: 'ducci_g',
      colors: ['#c75669', '#000000', '#11706a'],
      stroke: '#11706a',
      background: '#ecddc5'
    },
    {
      name: 'ducci_h',
      colors: ['#6b5c6e', '#4a2839', '#d9574a'],
      stroke: '#d9574a',
      background: '#ffc34b'
    },
    {
      name: 'ducci_i',
      colors: ['#e9dcad', '#143331', '#ffc000'],
      stroke: '#ffc000',
      background: '#a74c02'
    },
    {
      name: 'ducci_j',
      colors: ['#c47c2b', '#5f5726', '#000000', '#7e8a84'],
      stroke: '#7e8a84',
      background: '#ecddc5'
    },
    {
      name: 'ducci_o',
      colors: ['#c15e1f', '#e4a13a', '#000000', '#4d545a'],
      stroke: '#4d545a',
      background: '#dfc79b'
    },
    {
      name: 'ducci_q',
      colors: ['#4bae8c', '#d0c1a0', '#2d3538'],
      stroke: '#2d3538',
      background: '#d06440'
    },
    {
      name: 'ducci_u',
      colors: ['#f6d700', '#f2d692', '#000000', '#5d3552'],
      stroke: '#5d3552',
      background: '#ff7426'
    },
    {
      name: 'ducci_v',
      colors: ['#c65f75', '#d3990e', '#000000', '#597e7a'],
      stroke: '#597e7a',
      background: '#f6eccb'
    },
    {
      name: 'ducci_x',
      colors: ['#dd614a', '#f5cedb', '#1a1e4f'],
      stroke: '#1a1e4f',
      background: '#fbb900'
    }
  ];

  var judson = [
    {
      name: 'jud_playground',
      colors: ['#f04924', '#fcce09', '#408ac9'],
      stroke: '#2e2925',
      background: '#ffffff'
    },
    {
      name: 'jud_horizon',
      colors: ['#f8c3df', '#f2e420', '#28b3d0', '#648731', '#ef6a7d'],
      stroke: '#030305',
      background: '#f2f0e1'
    },
    {
      name: 'jud_mural',
      colors: ['#ca3122', '#e5af16', '#4a93a2', '#0e7e39', '#e2b9bd'],
      stroke: '#1c1616',
      background: '#e3ded8'
    },
    {
      name: 'jud_cabinet',
      colors: ['#f0afb7', '#f6bc12', '#1477bb', '#41bb9b'],
      stroke: '#020508',
      background: '#e3ded8'
    }
  ];

  var iivonen = [
    {
      name: 'iiso_zeitung',
      colors: ['#ee8067', '#f3df76', '#00a9c0', '#f7ab76'],
      stroke: '#111a17',
      background: '#f5efcb'
    },
    {
      name: 'iiso_curcuit',
      colors: ['#f0865c', '#f2b07b', '#6bc4d2', '#1a3643'],
      stroke: '#0f1417',
      background: '#f0f0e8'
    },
    {
      name: 'iiso_airlines',
      colors: ['#fe765a', '#ffb468', '#4b588f', '#faf1e0'],
      stroke: '#1c1616',
      background: '#fae5c8'
    },
    {
      name: 'iiso_daily',
      colors: ['#e76c4a', '#f0d967', '#7f8cb6', '#1daeb1', '#ef9640'],
      stroke: '#000100',
      background: '#e2ded2'
    }
  ];

  var kovecses = [
    {
      name: 'kov_01',
      colors: ['#d24c23', '#7ba6bc', '#f0c667', '#ede2b3', '#672b35', '#142a36'],
      stroke: '#132a37',
      background: '#108266'
    },
    {
      name: 'kov_02',
      colors: ['#e8dccc', '#e94641', '#eeaeae'],
      stroke: '#e8dccc',
      background: '#6c96be'
    },
    {
      name: 'kov_03',
      colors: ['#e3937b', '#d93f1d', '#090d15', '#e6cca7'],
      stroke: '#090d15',
      background: '#558947'
    },
    {
      name: 'kov_04',
      colors: ['#d03718', '#292b36', '#33762f', '#ead7c9', '#ce7028', '#689d8d'],
      stroke: '#292b36',
      background: '#deb330'
    },
    {
      name: 'kov_05',
      colors: ['#de3f1a', '#de9232', '#007158', '#e6cdaf', '#869679'],
      stroke: '#010006',
      background: '#7aa5a6'
    },
    {
      name: 'kov_06',
      colors: [
        '#a87c2a',
        '#bdc9b1',
        '#f14616',
        '#ecbfaf',
        '#017724',
        '#0e2733',
        '#2b9ae9'
      ],
      stroke: '#292319',
      background: '#dfd4c1'
    },
    {
      name: 'kov_06b',
      colors: [
        '#d57846',
        '#dfe0cc',
        '#de442f',
        '#e7d3c5',
        '#5ec227',
        '#302f35',
        '#63bdb3'
      ],
      stroke: '#292319',
      background: '#dfd4c1'
    },
    {
      name: 'kov_07',
      colors: ['#c91619', '#fdecd2', '#f4a000', '#4c2653'],
      stroke: '#111',
      background: '#89c2cd'
    }
  ];

  var tsuchimochi = [
    {
      name: 'tsu_arcade',
      colors: ['#4aad8b', '#e15147', '#f3b551', '#cec8b8', '#d1af84', '#544e47'],
      stroke: '#251c12',
      background: '#cfc7b9'
    },
    {
      name: 'tsu_harutan',
      colors: ['#75974a', '#c83e3c', '#f39140', '#e4ded2', '#f8c5a4', '#434f55'],
      stroke: '#251c12',
      background: '#cfc7b9'
    },
    {
      name: 'tsu_akasaka',
      colors: ['#687f72', '#cc7d6c', '#dec36f', '#dec7af', '#ad8470', '#424637'],
      stroke: '#251c12',
      background: '#cfc7b9'
    }
  ];

  var duotone = [
    {
      name: 'dt01',
      colors: ['#172a89', '#f7f7f3'],
      stroke: '#172a89',
      background: '#f3abb0'
    },
    {
      name: 'dt02',
      colors: ['#302956', '#f3c507'],
      stroke: '#302956',
      background: '#eee3d3'
    },
    {
      name: 'dt03',
      colors: ['#000000', '#a7a7a7'],
      stroke: '#000000',
      background: '#0a5e78'
    },
    {
      name: 'dt04',
      colors: ['#50978e', '#f7f0df'],
      stroke: '#000000',
      background: '#f7f0df'
    },
    {
      name: 'dt05',
      colors: ['#ee5d65', '#f0e5cb'],
      stroke: '#080708',
      background: '#f0e5cb'
    },
    {
      name: 'dt06',
      colors: ['#271f47', '#e7ceb5'],
      stroke: '#271f47',
      background: '#cc2b1c'
    },
    {
      name: 'dt07',
      colors: ['#6a98a5', '#d24c18'],
      stroke: '#efebda',
      background: '#efebda'
    },
    {
      name: 'dt08',
      colors: ['#5d9d88', '#ebb43b'],
      stroke: '#efebda',
      background: '#efebda'
    },
    {
      name: 'dt09',
      colors: ['#052e57', '#de8d80'],
      stroke: '#efebda',
      background: '#efebda'
    }
  ];

  var hilda = [
    {
      name: 'hilda01',
      colors: ['#ec5526', '#f4ac12', '#9ebbc1', '#f7f4e2'],
      stroke: '#1e1b1e',
      background: '#e7e8d4'
    },
    {
      name: 'hilda02',
      colors: ['#eb5627', '#eebb20', '#4e9eb8', '#f7f5d0'],
      stroke: '#201d13',
      background: '#77c1c0'
    },
    {
      name: 'hilda03',
      colors: ['#e95145', '#f8b917', '#b8bdc1', '#ffb2a2'],
      stroke: '#010101',
      background: '#6b7752'
    },
    {
      name: 'hilda04',
      colors: ['#e95145', '#f6bf7a', '#589da1', '#f5d9bc'],
      stroke: '#000001',
      background: '#f5ede1'
    },
    {
      name: 'hilda05',
      colors: ['#ff6555', '#ffb58f', '#d8eecf', '#8c4b47', '#bf7f93'],
      stroke: '#2b0404',
      background: '#ffda82'
    },
    {
      name: 'hilda06',
      colors: ['#f75952', '#ffce84', '#74b7b2', '#f6f6f6', '#b17d71'],
      stroke: '#0e0603',
      background: '#f6ecd4'
    }
  ];

  var spatial = [
    {
      name: 'spatial01',
      colors: ['#ff5937', '#f6f6f4', '#4169ff'],
      stroke: '#ff5937',
      background: '#f6f6f4'
    },
    {
      name: 'spatial02',
      colors: ['#ff5937', '#f6f6f4', '#f6f6f4'],
      stroke: '#ff5937',
      background: '#f6f6f4'
    },
    {
      name: 'spatial02i',
      colors: ['#f6f6f4', '#ff5937', '#ff5937'],
      stroke: '#f6f6f4',
      background: '#ff5937'
    },

    {
      name: 'spatial03',
      colors: ['#4169ff', '#f6f6f4', '#f6f6f4'],
      stroke: '#4169ff',
      background: '#f6f6f4'
    },
    {
      name: 'spatial03i',
      colors: ['#f6f6f4', '#4169ff', '#4169ff'],
      stroke: '#f6f6f4',
      background: '#4169ff'
    }
  ];

  var jung = [
    {
      name: 'jung_bird',
      colors: ['#fc3032', '#fed530', '#33c3fb', '#ff7bac', '#fda929'],
      stroke: '#000000',
      background: '#ffffff'
    },
    {
      name: 'jung_horse',
      colors: ['#e72e81', '#f0bf36', '#3056a2'],
      stroke: '#000000',
      background: '#ffffff'
    },
    {
      name: 'jung_croc',
      colors: ['#f13274', '#eed03e', '#405e7f', '#19a198'],
      stroke: '#000000',
      background: '#ffffff'
    },
    {
      name: 'jung_hippo',
      colors: ['#ff7bac', '#ff921e', '#3ea8f5', '#7ac943'],
      stroke: '#000000',
      background: '#ffffff'
    },
    {
      name: 'jung_wolf',
      colors: ['#e51c39', '#f1b844', '#36c4b7', '#666666'],
      stroke: '#000000',
      background: '#ffffff'
    }
  ];

  var system = [
    {
      name: 'system.#01',
      colors: ['#ff4242', '#fec101', '#1841fe', '#fcbdcc', '#82e9b5'],
      stroke: '#000',
      background: '#fff'
    },
    {
      name: 'system.#02',
      colors: ['#ff4242', '#ffd480', '#1e365d', '#edb14c', '#418dcd'],
      stroke: '#000',
      background: '#fff'
    },
    {
      name: 'system.#03',
      colors: ['#f73f4a', '#d3e5eb', '#002c3e', '#1aa1b1', '#ec6675'],
      stroke: '#110b09',
      background: '#fff'
    },
    {
      name: 'system.#04',
      colors: ['#e31f4f', '#f0ac3f', '#18acab', '#26265a', '#ea7d81', '#dcd9d0'],
      stroke: '#26265a',
      backgrund: '#dcd9d0'
    },
    {
      name: 'system.#05',
      colors: ['#db4549', '#d1e1e1', '#3e6a90', '#2e3853', '#a3c9d3'],
      stroke: '#000',
      background: '#fff'
    },
    {
      name: 'system.#06',
      colors: ['#e5475c', '#95b394', '#28343b', '#f7c6a3', '#eb8078'],
      stroke: '#000',
      background: '#fff'
    },
    {
      name: 'system.#07',
      colors: ['#d75c49', '#f0efea', '#509da4'],
      stroke: '#000',
      background: '#fff'
    },
    {
      name: 'system.#08',
      colors: ['#f6625a', '#92b29f', '#272c3f'],
      stroke: '#000',
      background: '#fff'
    }
  ];

  var flourish = [
    {
      name: 'empusa',
      colors: ['#c92a28', '#e69301', '#1f8793', '#13652b', '#e7d8b0', '#48233b', '#e3b3ac'],
      stroke: '#1a1a1a',
      background: '#f0f0f2',
    },
    {
      name: 'delphi',
      colors: ['#475b62', '#7a999c', '#2a1f1d', '#fbaf3c', '#df4a33', '#f0e0c6', '#af592c'],
      stroke: '#2a1f1d',
      background: '#f0e0c6',
    },
    {
      name: 'mably',
      colors: [
        '#13477b',
        '#2f1b10',
        '#d18529',
        '#d72a25',
        '#e42184',
        '#138898',
        '#9d2787',
        '#7f311b',
      ],
      stroke: '#2a1f1d',
      background: '#dfc792',
    },
    {
      name: 'nowak',
      colors: ['#e85b30', '#ef9e28', '#c6ac71', '#e0c191', '#3f6279', '#ee854e', '#180305'],
      stroke: '#180305',
      background: '#ede4cb',
    },
    {
      name: 'jupiter',
      colors: ['#c03a53', '#edd09e', '#aab5af', '#023629', '#eba735', '#8e9380', '#6c4127'],
      stroke: '#12110f',
      background: '#e6e2d6',
    },
    {
      name: 'hersche',
      colors: [
        '#df9f00',
        '#1f6f50',
        '#8e6d7f',
        '#da0607',
        '#a4a5a7',
        '#d3d1c3',
        '#42064f',
        '#25393a',
      ],
      stroke: '#0a0a0a',
      background: '#f0f5f6',
    },
    {
      name: 'cherfi',
      colors: ['#99cb9f', '#cfb610', '#d00701', '#dba78d', '#2e2c1d', '#bfbea2', '#d2cfaf'],
      stroke: '#332e22',
      background: '#e3e2c5',
    },
    {
      name: 'harvest',
      colors: [
        '#313a42',
        '#9aad2e',
        '#f0ae3c',
        '#df4822',
        '#8eac9b',
        '#cc3d3f',
        '#ec8b1c',
        '#1b9268',
      ],
      stroke: '#463930',
      background: '#e5e2cf',
    },
  ];

  const pals = misc.concat(
    ranganath,
    roygbivs,
    tundra,
    colourscafe,
    rohlfs,
    ducci,
    judson,
    iivonen,
    kovecses,
    tsuchimochi,
    duotone,
    hilda,
    spatial,
    jung,
    system,
    flourish
  );

  var palettes = pals.map((p) => {
    p.size = p.colors.length;
    return p;
  });

  function getRandom() {
    return palettes[Math.floor(Math.random() * palettes.length)];
  }

  function get$1(name) {
    if (name === undefined) return getRandom();
    return palettes.find(pal => pal.name == name);
  }

  function getNames() {
    return palettes.map(p => p.name);
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var simplexNoise = createCommonjsModule(function (module, exports) {
  /*
   * A fast javascript implementation of simplex noise by Jonas Wagner

  Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
  Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
  With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
  Better rank ordering method by Stefan Gustavson in 2012.


   Copyright (c) 2018 Jonas Wagner

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   SOFTWARE.
   */
  (function() {

    var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
    var F3 = 1.0 / 3.0;
    var G3 = 1.0 / 6.0;
    var F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
    var G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

    function SimplexNoise(randomOrSeed) {
      var random;
      if (typeof randomOrSeed == 'function') {
        random = randomOrSeed;
      }
      else if (randomOrSeed) {
        random = alea(randomOrSeed);
      } else {
        random = Math.random;
      }
      this.p = buildPermutationTable(random);
      this.perm = new Uint8Array(512);
      this.permMod12 = new Uint8Array(512);
      for (var i = 0; i < 512; i++) {
        this.perm[i] = this.p[i & 255];
        this.permMod12[i] = this.perm[i] % 12;
      }

    }
    SimplexNoise.prototype = {
      grad3: new Float32Array([1, 1, 0,
        -1, 1, 0,
        1, -1, 0,

        -1, -1, 0,
        1, 0, 1,
        -1, 0, 1,

        1, 0, -1,
        -1, 0, -1,
        0, 1, 1,

        0, -1, 1,
        0, 1, -1,
        0, -1, -1]),
      grad4: new Float32Array([0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1,
        0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1,
        1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1,
        -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1,
        1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1,
        -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1,
        1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0,
        -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0]),
      noise2D: function(xin, yin) {
        var permMod12 = this.permMod12;
        var perm = this.perm;
        var grad3 = this.grad3;
        var n0 = 0; // Noise contributions from the three corners
        var n1 = 0;
        var n2 = 0;
        // Skew the input space to determine which simplex cell we're in
        var s = (xin + yin) * F2; // Hairy factor for 2D
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var t = (i + j) * G2;
        var X0 = i - t; // Unskew the cell origin back to (x,y) space
        var Y0 = j - t;
        var x0 = xin - X0; // The x,y distances from the cell origin
        var y0 = yin - Y0;
        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.
        var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
        if (x0 > y0) {
          i1 = 1;
          j1 = 0;
        } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
        else {
          i1 = 0;
          j1 = 1;
        } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6
        var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
        var y1 = y0 - j1 + G2;
        var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
        var y2 = y0 - 1.0 + 2.0 * G2;
        // Work out the hashed gradient indices of the three simplex corners
        var ii = i & 255;
        var jj = j & 255;
        // Calculate the contribution from the three corners
        var t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
          var gi0 = permMod12[ii + perm[jj]] * 3;
          t0 *= t0;
          n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
        }
        var t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
          var gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
          t1 *= t1;
          n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
        }
        var t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
          var gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
          t2 *= t2;
          n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 70.0 * (n0 + n1 + n2);
      },
      // 3D simplex noise
      noise3D: function(xin, yin, zin) {
        var permMod12 = this.permMod12;
        var perm = this.perm;
        var grad3 = this.grad3;
        var n0, n1, n2, n3; // Noise contributions from the four corners
        // Skew the input space to determine which simplex cell we're in
        var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var k = Math.floor(zin + s);
        var t = (i + j + k) * G3;
        var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
        var Y0 = j - t;
        var Z0 = k - t;
        var x0 = xin - X0; // The x,y,z distances from the cell origin
        var y0 = yin - Y0;
        var z0 = zin - Z0;
        // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
        // Determine which simplex we are in.
        var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
        var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
        if (x0 >= y0) {
          if (y0 >= z0) {
            i1 = 1;
            j1 = 0;
            k1 = 0;
            i2 = 1;
            j2 = 1;
            k2 = 0;
          } // X Y Z order
          else if (x0 >= z0) {
            i1 = 1;
            j1 = 0;
            k1 = 0;
            i2 = 1;
            j2 = 0;
            k2 = 1;
          } // X Z Y order
          else {
            i1 = 0;
            j1 = 0;
            k1 = 1;
            i2 = 1;
            j2 = 0;
            k2 = 1;
          } // Z X Y order
        }
        else { // x0<y0
          if (y0 < z0) {
            i1 = 0;
            j1 = 0;
            k1 = 1;
            i2 = 0;
            j2 = 1;
            k2 = 1;
          } // Z Y X order
          else if (x0 < z0) {
            i1 = 0;
            j1 = 1;
            k1 = 0;
            i2 = 0;
            j2 = 1;
            k2 = 1;
          } // Y Z X order
          else {
            i1 = 0;
            j1 = 1;
            k1 = 0;
            i2 = 1;
            j2 = 1;
            k2 = 0;
          } // Y X Z order
        }
        // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
        // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
        // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
        // c = 1/6.
        var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
        var y1 = y0 - j1 + G3;
        var z1 = z0 - k1 + G3;
        var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
        var y2 = y0 - j2 + 2.0 * G3;
        var z2 = z0 - k2 + 2.0 * G3;
        var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
        var y3 = y0 - 1.0 + 3.0 * G3;
        var z3 = z0 - 1.0 + 3.0 * G3;
        // Work out the hashed gradient indices of the four simplex corners
        var ii = i & 255;
        var jj = j & 255;
        var kk = k & 255;
        // Calculate the contribution from the four corners
        var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0.0;
        else {
          var gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
          t0 *= t0;
          n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
        }
        var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0.0;
        else {
          var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
          t1 *= t1;
          n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
        }
        var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0.0;
        else {
          var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
          t2 *= t2;
          n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
        }
        var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0.0;
        else {
          var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
          t3 *= t3;
          n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to stay just inside [-1,1]
        return 32.0 * (n0 + n1 + n2 + n3);
      },
      // 4D simplex noise, better simplex rank ordering method 2012-03-09
      noise4D: function(x, y, z, w) {
        var perm = this.perm;
        var grad4 = this.grad4;

        var n0, n1, n2, n3, n4; // Noise contributions from the five corners
        // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
        var s = (x + y + z + w) * F4; // Factor for 4D skewing
        var i = Math.floor(x + s);
        var j = Math.floor(y + s);
        var k = Math.floor(z + s);
        var l = Math.floor(w + s);
        var t = (i + j + k + l) * G4; // Factor for 4D unskewing
        var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
        var Y0 = j - t;
        var Z0 = k - t;
        var W0 = l - t;
        var x0 = x - X0; // The x,y,z,w distances from the cell origin
        var y0 = y - Y0;
        var z0 = z - Z0;
        var w0 = w - W0;
        // For the 4D case, the simplex is a 4D shape I won't even try to describe.
        // To find out which of the 24 possible simplices we're in, we need to
        // determine the magnitude ordering of x0, y0, z0 and w0.
        // Six pair-wise comparisons are performed between each possible pair
        // of the four coordinates, and the results are used to rank the numbers.
        var rankx = 0;
        var ranky = 0;
        var rankz = 0;
        var rankw = 0;
        if (x0 > y0) rankx++;
        else ranky++;
        if (x0 > z0) rankx++;
        else rankz++;
        if (x0 > w0) rankx++;
        else rankw++;
        if (y0 > z0) ranky++;
        else rankz++;
        if (y0 > w0) ranky++;
        else rankw++;
        if (z0 > w0) rankz++;
        else rankw++;
        var i1, j1, k1, l1; // The integer offsets for the second simplex corner
        var i2, j2, k2, l2; // The integer offsets for the third simplex corner
        var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner
        // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
        // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
        // impossible. Only the 24 indices which have non-zero entries make any sense.
        // We use a thresholding to set the coordinates in turn from the largest magnitude.
        // Rank 3 denotes the largest coordinate.
        i1 = rankx >= 3 ? 1 : 0;
        j1 = ranky >= 3 ? 1 : 0;
        k1 = rankz >= 3 ? 1 : 0;
        l1 = rankw >= 3 ? 1 : 0;
        // Rank 2 denotes the second largest coordinate.
        i2 = rankx >= 2 ? 1 : 0;
        j2 = ranky >= 2 ? 1 : 0;
        k2 = rankz >= 2 ? 1 : 0;
        l2 = rankw >= 2 ? 1 : 0;
        // Rank 1 denotes the second smallest coordinate.
        i3 = rankx >= 1 ? 1 : 0;
        j3 = ranky >= 1 ? 1 : 0;
        k3 = rankz >= 1 ? 1 : 0;
        l3 = rankw >= 1 ? 1 : 0;
        // The fifth corner has all coordinate offsets = 1, so no need to compute that.
        var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
        var y1 = y0 - j1 + G4;
        var z1 = z0 - k1 + G4;
        var w1 = w0 - l1 + G4;
        var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords
        var y2 = y0 - j2 + 2.0 * G4;
        var z2 = z0 - k2 + 2.0 * G4;
        var w2 = w0 - l2 + 2.0 * G4;
        var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords
        var y3 = y0 - j3 + 3.0 * G4;
        var z3 = z0 - k3 + 3.0 * G4;
        var w3 = w0 - l3 + 3.0 * G4;
        var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords
        var y4 = y0 - 1.0 + 4.0 * G4;
        var z4 = z0 - 1.0 + 4.0 * G4;
        var w4 = w0 - 1.0 + 4.0 * G4;
        // Work out the hashed gradient indices of the five simplex corners
        var ii = i & 255;
        var jj = j & 255;
        var kk = k & 255;
        var ll = l & 255;
        // Calculate the contribution from the five corners
        var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
        if (t0 < 0) n0 = 0.0;
        else {
          var gi0 = (perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32) * 4;
          t0 *= t0;
          n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
        }
        var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
        if (t1 < 0) n1 = 0.0;
        else {
          var gi1 = (perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32) * 4;
          t1 *= t1;
          n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
        }
        var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
        if (t2 < 0) n2 = 0.0;
        else {
          var gi2 = (perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32) * 4;
          t2 *= t2;
          n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
        }
        var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
        if (t3 < 0) n3 = 0.0;
        else {
          var gi3 = (perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32) * 4;
          t3 *= t3;
          n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
        }
        var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
        if (t4 < 0) n4 = 0.0;
        else {
          var gi4 = (perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32) * 4;
          t4 *= t4;
          n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
        }
        // Sum up and scale the result to cover the range [-1,1]
        return 27.0 * (n0 + n1 + n2 + n3 + n4);
      }
    };

    function buildPermutationTable(random) {
      var i;
      var p = new Uint8Array(256);
      for (i = 0; i < 256; i++) {
        p[i] = i;
      }
      for (i = 0; i < 255; i++) {
        var r = i + ~~(random() * (256 - i));
        var aux = p[i];
        p[i] = p[r];
        p[r] = aux;
      }
      return p;
    }
    SimplexNoise._buildPermutationTable = buildPermutationTable;

    function alea() {
      // Johannes Baagøe <baagoe@baagoe.com>, 2010
      var s0 = 0;
      var s1 = 0;
      var s2 = 0;
      var c = 1;

      var mash = masher();
      s0 = mash(' ');
      s1 = mash(' ');
      s2 = mash(' ');

      for (var i = 0; i < arguments.length; i++) {
        s0 -= mash(arguments[i]);
        if (s0 < 0) {
          s0 += 1;
        }
        s1 -= mash(arguments[i]);
        if (s1 < 0) {
          s1 += 1;
        }
        s2 -= mash(arguments[i]);
        if (s2 < 0) {
          s2 += 1;
        }
      }
      mash = null;
      return function() {
        var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
        s0 = s1;
        s1 = s2;
        return s2 = t - (c = t | 0);
      };
    }
    function masher() {
      var n = 0xefc8249d;
      return function(data) {
        data = data.toString();
        for (var i = 0; i < data.length; i++) {
          n += data.charCodeAt(i);
          var h = 0.02519603282416938 * n;
          n = h >>> 0;
          h -= n;
          h *= n;
          n = h >>> 0;
          h -= n;
          n += h * 0x100000000; // 2^32
        }
        return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
      };
    }
    // common js
    exports.SimplexNoise = SimplexNoise;
    // nodejs
    {
      module.exports = SimplexNoise;
    }

  })();
  });
  var simplexNoise_1 = simplexNoise.SimplexNoise;

  function draw_poly(p, id, v1, v2, v3, v4, threshold, dim) {
    const n = [p.map(threshold, v1, v2, 0, dim), 0];
    const e = [dim, p.map(threshold, v2, v3, 0, dim)];
    const s = [p.map(threshold, v4, v3, 0, dim), dim];
    const w = [0, p.map(threshold, v1, v4, 0, dim)];
    const nw = [0, 0];
    const ne = [dim, 0];
    const se = [dim, dim];
    const sw = [0, dim];

    p.noStroke();
    p.beginShape();
    if (id === 1) {
      p.vertex(...s);
      p.vertex(...w);
      p.vertex(...sw);
    } else if (id === 2) {
      p.vertex(...e);
      p.vertex(...s);
      p.vertex(...se);
    } else if (id === 3) {
      p.vertex(...e);
      p.vertex(...w);
      p.vertex(...sw);
      p.vertex(...se);
    } else if (id === 4) {
      p.vertex(...n);
      p.vertex(...e);
      p.vertex(...ne);
    } else if (id === 5) {
      p.vertex(...e);
      p.vertex(...s);
      p.vertex(...sw);
      p.vertex(...w);
      p.vertex(...n);
      p.vertex(...ne);
    } else if (id === 6) {
      p.vertex(...n);
      p.vertex(...s);
      p.vertex(...se);
      p.vertex(...ne);
    } else if (id === 7) {
      p.vertex(...w);
      p.vertex(...n);
      p.vertex(...ne);
      p.vertex(...se);
      p.vertex(...sw);
    } else if (id === 15) {
      p.vertex(...nw);
      p.vertex(...ne);
      p.vertex(...se);
      p.vertex(...sw);
    } else if (id === 14) {
      p.vertex(...s);
      p.vertex(...w);
      p.vertex(...nw);
      p.vertex(...ne);
      p.vertex(...se);
    } else if (id === 13) {
      p.vertex(...e);
      p.vertex(...s);
      p.vertex(...sw);
      p.vertex(...nw);
      p.vertex(...ne);
    } else if (id === 12) {
      p.vertex(...e);
      p.vertex(...w);
      p.vertex(...nw);
      p.vertex(...ne);
    } else if (id === 11) {
      p.vertex(...n);
      p.vertex(...e);
      p.vertex(...se);
      p.vertex(...sw);
      p.vertex(...nw);
    } else if (id === 10) {
      p.vertex(...e);
      p.vertex(...se);
      p.vertex(...s);
      p.vertex(...w);
      p.vertex(...nw);
      p.vertex(...n);
    } else if (id === 9) {
      p.vertex(...n);
      p.vertex(...s);
      p.vertex(...sw);
      p.vertex(...nw);
    } else if (id === 8) {
      p.vertex(...w);
      p.vertex(...n);
      p.vertex(...nw);
    }
    p.endShape(p.CLOSE);
  }

  function tinyNDArrayOfInteger (gridShape) {
      var dimensions = gridShape.length,
          totalLength = 1,
          stride = new Array(dimensions),
          dimension;

      for (dimension = dimensions; dimension > 0; dimension--) {
          stride[dimension - 1] = totalLength;
          totalLength = totalLength * gridShape[dimension - 1];
      }

      return {
          stride: stride,
          data: new Uint32Array(totalLength)
      };
  }

  function tinyNDArrayOfArray (gridShape) {
      var dimensions = gridShape.length,
          totalLength = 1,
          stride = new Array(dimensions),
          data = [],
          dimension, index;

      for (dimension = dimensions; dimension > 0; dimension--) {
          stride[dimension - 1] = totalLength;
          totalLength = totalLength * gridShape[dimension - 1];
      }

      for (index = 0; index < totalLength; index++) {
          data.push([]);
      }

      return {
          stride: stride,
          data: data
      };
  }

  var tinyNdarray = {
      integer: tinyNDArrayOfInteger,
      array: tinyNDArrayOfArray
  };

  // sphere-random module by Mikola Lysenko under the MIT License
  // waiting for https://github.com/scijs/sphere-random/pull/1 to be merged

  var sphereRandom = sampleSphere;

  /**
   * @param {int} d Dimensions
   * @param {Function} rng
   * @returns {Array}
   */
  function sampleSphere(d, rng) {
      var v = new Array(d),
          d2 = Math.floor(d/2) << 1,
          r2 = 0.0,
          rr,
          r,
          theta,
          h,
          i;

      for (i = 0; i < d2; i += 2) {
          rr = -2.0 * Math.log(rng());
          r =  Math.sqrt(rr);
          theta = 2.0 * Math.PI * rng();

          r2+= rr;
          v[i] = r * Math.cos(theta);
          v[i+1] = r * Math.sin(theta);
      }

      if (d % 2) {
          var x = Math.sqrt(-2.0 * Math.log(rng())) * Math.cos(2.0 * Math.PI * rng());
          v[d - 1] = x;
          r2+= Math.pow(x, 2);
      }

      h = 1.0 / Math.sqrt(r2);

      for (i = 0; i < d; ++i) {
          v[i] *= h;
      }

      return v;
  }

  var moore = function moore(range, dimensions) {
    range = range || 1;
    dimensions = dimensions || 2;

    var size = range * 2 + 1;
    var length = Math.pow(size, dimensions) - 1;
    var neighbors = new Array(length);

    for (var i = 0; i < length; i++) {
      var neighbor = neighbors[i] = new Array(dimensions);
      var index = i < length / 2 ? i : i + 1;
      for (var dimension = 1; dimension <= dimensions; dimension++) {
        var value = index % Math.pow(size, dimension);
        neighbor[dimension - 1] = value / Math.pow(size, dimension - 1) - range;
        index -= value;
      }
    }

    return neighbors
  };

  /**
   * Get the neighbourhood ordered by distance, including the origin point
   * @param {int} dimensionNumber Number of dimensions
   * @returns {Array} Neighbourhood
   */
  function getNeighbourhood (dimensionNumber) {
      var neighbourhood = moore(2, dimensionNumber),
          origin = [],
          dimension;

      for (dimension = 0; dimension < dimensionNumber; dimension++) {
          origin.push(0);
      }

      neighbourhood.push(origin);

      // sort by ascending distance to optimize proximity checks
      // see point 5.1 in Parallel Poisson Disk Sampling by Li-Yi Wei, 2008
      // http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.460.3061&rank=1
      neighbourhood.sort(function (n1, n2) {
          var squareDist1 = 0,
              squareDist2 = 0,
              dimension;

          for (dimension = 0; dimension < dimensionNumber; dimension++) {
              squareDist1 += Math.pow(n1[dimension], 2);
              squareDist2 += Math.pow(n2[dimension], 2);
          }

          if (squareDist1 < squareDist2) {
              return -1;
          } else if(squareDist1 > squareDist2) {
              return 1;
          } else {
              return 0;
          }
      });

      return neighbourhood;
  }

  var neighbourhood = getNeighbourhood;

  var tinyNDArray = tinyNdarray.integer;

  /**
   * Get the squared euclidean distance from two points of arbitrary, but equal, dimensions
   * @param {Array} point1
   * @param {Array} point2
   * @returns {number} Squared euclidean distance
   */
  function squaredEuclideanDistance (point1, point2) {
      var result = 0,
          i = 0;

      for (; i < point1.length; i++) {
          result += Math.pow(point1[i] - point2[i], 2);
      }

      return result;
  }

  /**
   * FixedDensityPDS constructor
   * @param {object} options Options
   * @param {Array} options.shape Shape of the space
   * @param {float} options.minDistance Minimum distance between each points
   * @param {float} [options.maxDistance] Maximum distance between each points, defaults to minDistance * 2
   * @param {int} [options.tries] Number of times the algorithm will try to place a point in the neighbourhood of another points, defaults to 30
   * @param {function|null} [rng] RNG function, defaults to Math.random
   * @constructor
   */
  function FixedDensityPDS (options, rng) {
      if (typeof options.distanceFunction === 'function') {
          throw new Error('PoissonDiskSampling: Tried to instantiate the fixed density implementation with a distanceFunction');
      }

      this.shape = options.shape;
      this.minDistance = options.minDistance;
      this.maxDistance = options.maxDistance || options.minDistance * 2;
      this.maxTries = Math.ceil(Math.max(1, options.tries || 30));

      this.rng = rng || Math.random;

      this.dimension = this.shape.length;
      this.squaredMinDistance = this.minDistance * this.minDistance;
      this.deltaDistance = this.maxDistance - this.minDistance;
      this.cellSize = this.minDistance / Math.sqrt(this.dimension);

      this.neighbourhood = neighbourhood(this.dimension);

      this.currentPoint = null;
      this.processList = [];
      this.samplePoints = [];

      // cache grid

      this.gridShape = [];

      for (var i = 0; i < this.dimension; i++) {
          this.gridShape.push(Math.ceil(this.shape[i] / this.cellSize));
      }

      this.grid = tinyNDArray(this.gridShape); //will store references to samplePoints
  }

  FixedDensityPDS.prototype.shape = null;
  FixedDensityPDS.prototype.dimension = null;
  FixedDensityPDS.prototype.minDistance = null;
  FixedDensityPDS.prototype.maxDistance = null;
  FixedDensityPDS.prototype.squaredMinDistance = null;
  FixedDensityPDS.prototype.deltaDistance = null;
  FixedDensityPDS.prototype.cellSize = null;
  FixedDensityPDS.prototype.maxTries = null;
  FixedDensityPDS.prototype.rng = null;
  FixedDensityPDS.prototype.neighbourhood = null;

  FixedDensityPDS.prototype.currentPoint = null;
  FixedDensityPDS.prototype.processList = null;
  FixedDensityPDS.prototype.samplePoints = null;
  FixedDensityPDS.prototype.gridShape = null;
  FixedDensityPDS.prototype.grid = null;

  /**
   * Add a totally random point in the grid
   * @returns {Array} The point added to the grid
   */
  FixedDensityPDS.prototype.addRandomPoint = function () {
      var point = new Array(this.dimension);

      for (var i = 0; i < this.dimension; i++) {
          point[i] = this.rng() * this.shape[i];
      }

      return this.directAddPoint(point);
  };

  /**
   * Add a given point to the grid
   * @param {Array} point Point
   * @returns {Array|null} The point added to the grid, null if the point is out of the bound or not of the correct dimension
   */
  FixedDensityPDS.prototype.addPoint = function (point) {
      var dimension,
          valid = true;

      if (point.length === this.dimension) {
          for (dimension = 0; dimension < this.dimension && valid; dimension++) {
              valid = (point[dimension] >= 0 && point[dimension] <= this.shape[dimension]);
          }
      } else {
          valid = false;
      }

      return valid ? this.directAddPoint(point) : null;
  };

  /**
   * Add a given point to the grid, without any check
   * @param {Array} point Point
   * @returns {Array} The point added to the grid
   * @protected
   */
  FixedDensityPDS.prototype.directAddPoint = function (point) {
      var internalArrayIndex = 0,
          stride = this.grid.stride,
          dimension;

      this.processList.push(point);
      this.samplePoints.push(point);

      for (dimension = 0; dimension < this.dimension; dimension++) {
          internalArrayIndex += ((point[dimension] / this.cellSize) | 0) * stride[dimension];
      }

      this.grid.data[internalArrayIndex] = this.samplePoints.length; // store the point reference

      return point;
  };

  /**
   * Check whether a given point is in the neighbourhood of existing points
   * @param {Array} point Point
   * @returns {boolean} Whether the point is in the neighbourhood of another point
   * @protected
   */
  FixedDensityPDS.prototype.inNeighbourhood = function (point) {
      var dimensionNumber = this.dimension,
          stride = this.grid.stride,
          neighbourIndex,
          internalArrayIndex,
          dimension,
          currentDimensionValue,
          existingPoint;

      for (neighbourIndex = 0; neighbourIndex < this.neighbourhood.length; neighbourIndex++) {
          internalArrayIndex = 0;

          for (dimension = 0; dimension < dimensionNumber; dimension++) {
              currentDimensionValue = ((point[dimension] / this.cellSize) | 0) + this.neighbourhood[neighbourIndex][dimension];

              if (currentDimensionValue >= 0 && currentDimensionValue < this.gridShape[dimension]) {
                  internalArrayIndex += currentDimensionValue * stride[dimension];
              }
          }

          if (this.grid.data[internalArrayIndex] !== 0) {
              existingPoint = this.samplePoints[this.grid.data[internalArrayIndex] - 1];

              if (squaredEuclideanDistance(point, existingPoint) < this.squaredMinDistance) {
                  return true;
              }
          }
      }

      return false;
  };

  /**
   * Try to generate a new point in the grid, returns null if it wasn't possible
   * @returns {Array|null} The added point or null
   */
  FixedDensityPDS.prototype.next = function () {
      var tries,
          angle,
          distance,
          currentPoint,
          newPoint,
          inShape,
          i;

      while (this.processList.length > 0) {
          if (this.currentPoint === null) {
              this.currentPoint = this.processList.shift();
          }

          currentPoint = this.currentPoint;

          for (tries = 0; tries < this.maxTries; tries++) {
              inShape = true;
              distance = this.minDistance + this.deltaDistance * this.rng();

              if (this.dimension === 2) {
                  angle = this.rng() * Math.PI * 2;
                  newPoint = [
                      Math.cos(angle),
                      Math.sin(angle)
                  ];
              } else {
                  newPoint = sphereRandom(this.dimension, this.rng);
              }

              for (i = 0; inShape && i < this.dimension; i++) {
                  newPoint[i] = currentPoint[i] + newPoint[i] * distance;
                  inShape = (newPoint[i] >= 0 && newPoint[i] <= this.shape[i] - 1);
              }

              if (inShape && !this.inNeighbourhood(newPoint)) {
                  return this.directAddPoint(newPoint);
              }
          }

          if (tries === this.maxTries) {
              this.currentPoint = null;
          }
      }

      return null;
  };

  /**
   * Automatically fill the grid, adding a random point to start the process if needed.
   * Will block the thread, probably best to use it in a web worker or child process.
   * @returns {Array[]} Sample points
   */
  FixedDensityPDS.prototype.fill = function () {
      if (this.samplePoints.length === 0) {
          this.addRandomPoint();
      }

      while(this.next()) {}

      return this.samplePoints;
  };

  /**
   * Get all the points in the grid.
   * @returns {Array[]} Sample points
   */
  FixedDensityPDS.prototype.getAllPoints = function () {
      return this.samplePoints;
  };

  /**
   * Get all the points in the grid along with the result of the distance function.
   * @throws Will always throw an error.
   */
  FixedDensityPDS.prototype.getAllPointsWithDistance = function () {
      throw new Error('PoissonDiskSampling: getAllPointsWithDistance() is not available in fixed-density implementation');
  };

  /**
   * Reinitialize the grid as well as the internal state
   */
  FixedDensityPDS.prototype.reset = function () {
      var gridData = this.grid.data,
          i = 0;

      // reset the cache grid
      for (i = 0; i < gridData.length; i++) {
          gridData[i] = 0;
      }

      // new array for the samplePoints as it is passed by reference to the outside
      this.samplePoints = [];

      // reset the internal state
      this.currentPoint = null;
      this.processList.length = 0;
  };

  var fixedDensity = FixedDensityPDS;

  var tinyNDArray$1 = tinyNdarray.array;

  /**
   * Get the euclidean distance from two points of arbitrary, but equal, dimensions
   * @param {Array} point1
   * @param {Array} point2
   * @returns {number} Euclidean distance
   */
  function euclideanDistance (point1, point2) {
      var result = 0,
          i = 0;

      for (; i < point1.length; i++) {
          result += Math.pow(point1[i] - point2[i], 2);
      }

      return Math.sqrt(result);
  }

  /**
   * VariableDensityPDS constructor
   * @param {object} options Options
   * @param {Array} options.shape Shape of the space
   * @param {float} options.minDistance Minimum distance between each points
   * @param {float} [options.maxDistance] Maximum distance between each points, defaults to minDistance * 2
   * @param {int} [options.tries] Number of times the algorithm will try to place a point in the neighbourhood of another points, defaults to 30
   * @param {function} options.distanceFunction Function to control the distance between each point depending on their position, must return a value between 0 and 1
   * @param {float} [options.bias] When using a distanceFunction, will indicate which point constraint takes priority when evaluating two points (0 for the lowest distance, 1 for the highest distance), defaults to 0
   * @param {function|null} rng RNG function, defaults to Math.random
   * @constructor
   */
  function VariableDensityPDS (options, rng) {
      if (typeof options.distanceFunction !== 'function') {
          throw new Error('PoissonDiskSampling: Tried to instantiate the variable density implementation without a distanceFunction');
      }

      this.shape = options.shape;
      this.minDistance = options.minDistance;
      this.maxDistance = options.maxDistance || options.minDistance * 2;
      this.maxTries = Math.ceil(Math.max(1, options.tries || 30));
      this.distanceFunction = options.distanceFunction;
      this.bias = Math.max(0, Math.min(1, options.bias || 0));

      this.rng = rng || Math.random;

      this.dimension = this.shape.length;
      this.deltaDistance = this.maxDistance - this.minDistance;
      this.cellSize = this.maxDistance / Math.sqrt(this.dimension);

      this.neighbourhood = neighbourhood(this.dimension);

      this.currentPoint = null;
      this.currentDistance = 0;
      this.processList = [];
      this.samplePoints = [];
      this.sampleDistance = []; // used to store the distance for a given point

      // cache grid

      this.gridShape = [];

      for (var i = 0; i < this.dimension; i++) {
          this.gridShape.push(Math.ceil(this.shape[i] / this.cellSize));
      }

      this.grid = tinyNDArray$1(this.gridShape); //will store references to samplePoints and sampleDistance
  }

  VariableDensityPDS.prototype.shape = null;
  VariableDensityPDS.prototype.dimension = null;
  VariableDensityPDS.prototype.minDistance = null;
  VariableDensityPDS.prototype.maxDistance = null;
  VariableDensityPDS.prototype.deltaDistance = null;
  VariableDensityPDS.prototype.cellSize = null;
  VariableDensityPDS.prototype.maxTries = null;
  VariableDensityPDS.prototype.distanceFunction = null;
  VariableDensityPDS.prototype.bias = null;
  VariableDensityPDS.prototype.rng = null;
  VariableDensityPDS.prototype.neighbourhood = null;

  VariableDensityPDS.prototype.currentPoint = null;
  VariableDensityPDS.prototype.currentDistance = null;
  VariableDensityPDS.prototype.processList = null;
  VariableDensityPDS.prototype.samplePoints = null;
  VariableDensityPDS.prototype.sampleDistance = null;
  VariableDensityPDS.prototype.gridShape = null;
  VariableDensityPDS.prototype.grid = null;

  /**
   * Add a totally random point in the grid
   * @returns {Array} The point added to the grid
   */
  VariableDensityPDS.prototype.addRandomPoint = function () {
      var point = new Array(this.dimension);

      for (var i = 0; i < this.dimension; i++) {
          point[i] = this.rng() * this.shape[i];
      }

      return this.directAddPoint(point);
  };

  /**
   * Add a given point to the grid
   * @param {Array} point Point
   * @returns {Array|null} The point added to the grid, null if the point is out of the bound or not of the correct dimension
   */
  VariableDensityPDS.prototype.addPoint = function (point) {
      var dimension,
          valid = true;

      if (point.length === this.dimension) {
          for (dimension = 0; dimension < this.dimension && valid; dimension++) {
              valid = (point[dimension] >= 0 && point[dimension] <= this.shape[dimension]);
          }
      } else {
          valid = false;
      }

      return valid ? this.directAddPoint(point) : null;
  };

  /**
   * Add a given point to the grid, without any check
   * @param {Array} point Point
   * @returns {Array} The point added to the grid
   * @protected
   */
  VariableDensityPDS.prototype.directAddPoint = function (point) {
      var internalArrayIndex = 0,
          stride = this.grid.stride,
          pointIndex = this.samplePoints.length,
          dimension;

      this.processList.push(pointIndex);
      this.samplePoints.push(point);
      this.sampleDistance.push(this.distanceFunction(point));

      for (dimension = 0; dimension < this.dimension; dimension++) {
          internalArrayIndex += ((point[dimension] / this.cellSize) | 0) * stride[dimension];
      }

      this.grid.data[internalArrayIndex].push(pointIndex); // store the point reference

      return point;
  };

  /**
   * Check whether a given point is in the neighbourhood of existing points
   * @param {Array} point Point
   * @returns {boolean} Whether the point is in the neighbourhood of another point
   * @protected
   */
  VariableDensityPDS.prototype.inNeighbourhood = function (point) {
      var dimensionNumber = this.dimension,
          stride = this.grid.stride,
          neighbourIndex,
          internalArrayIndex,
          dimension,
          currentDimensionValue,
          existingPoint,
          existingPointDistance;

      var pointDistance = this.distanceFunction(point);

      for (neighbourIndex = 0; neighbourIndex < this.neighbourhood.length; neighbourIndex++) {
          internalArrayIndex = 0;

          for (dimension = 0; dimension < dimensionNumber; dimension++) {
              currentDimensionValue = ((point[dimension] / this.cellSize) | 0) + this.neighbourhood[neighbourIndex][dimension];

              if (currentDimensionValue >= 0 && currentDimensionValue < this.gridShape[dimension]) {
                  internalArrayIndex += currentDimensionValue * stride[dimension];
              }
          }

          if (this.grid.data[internalArrayIndex].length > 0) {
              for (var i = 0; i < this.grid.data[internalArrayIndex].length; i++) {
                  existingPoint = this.samplePoints[this.grid.data[internalArrayIndex][i]];
                  existingPointDistance = this.sampleDistance[this.grid.data[internalArrayIndex][i]];

                  var minDistance = Math.min(existingPointDistance, pointDistance);
                  var maxDistance = Math.max(existingPointDistance, pointDistance);
                  var dist = minDistance + (maxDistance - minDistance) * this.bias;


                  if (euclideanDistance(point, existingPoint) < this.minDistance + this.deltaDistance * dist) {
                      return true;
                  }
              }
          }
      }

      return false;
  };

  /**
   * Try to generate a new point in the grid, returns null if it wasn't possible
   * @returns {Array|null} The added point or null
   */
  VariableDensityPDS.prototype.next = function () {
      var tries,
          angle,
          distance,
          currentPoint,
          currentDistance,
          newPoint,
          inShape,
          i;

      while (this.processList.length > 0) {
          if (this.currentPoint === null) {
              var sampleIndex = this.processList.shift();
              this.currentPoint = this.samplePoints[sampleIndex];
              this.currentDistance = this.sampleDistance[sampleIndex];
          }

          currentPoint = this.currentPoint;
          currentDistance = this.currentDistance;

          for (tries = 0; tries < this.maxTries; tries++) {
              inShape = true;
              distance = this.minDistance + this.deltaDistance * (currentDistance + (1 - currentDistance) * this.bias);

              if (this.dimension === 2) {
                  angle = this.rng() * Math.PI * 2;
                  newPoint = [
                      Math.cos(angle),
                      Math.sin(angle)
                  ];
              } else {
                  newPoint = sphereRandom(this.dimension, this.rng);
              }

              for (i = 0; inShape && i < this.dimension; i++) {
                  newPoint[i] = currentPoint[i] + newPoint[i] * distance;
                  inShape = (newPoint[i] >= 0 && newPoint[i] <= this.shape[i] - 1);
              }

              if (inShape && !this.inNeighbourhood(newPoint)) {
                  return this.directAddPoint(newPoint);
              }
          }

          if (tries === this.maxTries) {
              this.currentPoint = null;
          }
      }

      return null;
  };

  /**
   * Automatically fill the grid, adding a random point to start the process if needed.
   * Will block the thread, probably best to use it in a web worker or child process.
   * @returns {Array[]} Sample points
   */
  VariableDensityPDS.prototype.fill = function () {
      if (this.samplePoints.length === 0) {
          this.addRandomPoint();
      }

      while(this.next()) {}

      return this.samplePoints;
  };

  /**
   * Get all the points in the grid.
   * @returns {Array[]} Sample points
   */
  VariableDensityPDS.prototype.getAllPoints = function () {
      return this.samplePoints;
  };

  /**
   * Get all the points in the grid along with the result of the distance function.
   * @returns {Array[]} Sample points with their distance function result
   */
  VariableDensityPDS.prototype.getAllPointsWithDistance = function () {
      var result = new Array(this.samplePoints.length),
          i = 0,
          dimension = 0,
          point;

      for (i = 0; i < this.samplePoints.length; i++) {
          point = new Array(this.dimension + 1);

          for (dimension = 0; dimension < this.dimension; dimension++) {
              point[dimension] = this.samplePoints[i][dimension];
          }

          point[this.dimension] = this.sampleDistance[i];

          result[i] = point;
      }

      return result;
  };

  /**
   * Reinitialize the grid as well as the internal state
   */
  VariableDensityPDS.prototype.reset = function () {
      var gridData = this.grid.data,
          i = 0;

      // reset the cache grid
      for (i = 0; i < gridData.length; i++) {
          gridData[i] = [];
      }

      // new array for the samplePoints as it is passed by reference to the outside
      this.samplePoints = [];

      // reset the internal state
      this.currentPoint = null;
      this.processList.length = 0;
  };

  var variableDensity = VariableDensityPDS;

  /**
   * PoissonDiskSampling constructor
   * @param {object} options Options
   * @param {Array} options.shape Shape of the space
   * @param {float} options.minDistance Minimum distance between each points
   * @param {float} [options.maxDistance] Maximum distance between each points, defaults to minDistance * 2
   * @param {int} [options.tries] Number of times the algorithm will try to place a point in the neighbourhood of another points, defaults to 30
   * @param {function|null} [options.distanceFunction] Function to control the distance between each point depending on their position, must return a value between 0 and 1
   * @param {function|null} [options.bias] When using a distanceFunction, will indicate which point constraint takes priority when evaluating two points (0 for the lowest distance, 1 for the highest distance), defaults to 0
   * @param {function|null} [rng] RNG function, defaults to Math.random
   * @constructor
   */
  function PoissonDiskSampling (options, rng) {
      this.shape = options.shape;

      if (typeof options.distanceFunction === 'function') {
          this.implementation = new variableDensity(options, rng);
      } else {
          this.implementation = new fixedDensity(options, rng);
      }
  }

  PoissonDiskSampling.prototype.implementation = null;

  /**
   * Add a totally random point in the grid
   * @returns {Array} The point added to the grid
   */
  PoissonDiskSampling.prototype.addRandomPoint = function () {
      return this.implementation.addRandomPoint();
  };

  /**
   * Add a given point to the grid
   * @param {Array} point Point
   * @returns {Array|null} The point added to the grid, null if the point is out of the bound or not of the correct dimension
   */
  PoissonDiskSampling.prototype.addPoint = function (point) {
      return this.implementation.addPoint(point);
  };

  /**
   * Try to generate a new point in the grid, returns null if it wasn't possible
   * @returns {Array|null} The added point or null
   */
  PoissonDiskSampling.prototype.next = function () {
      return this.implementation.next();
  };

  /**
   * Automatically fill the grid, adding a random point to start the process if needed.
   * Will block the thread, probably best to use it in a web worker or child process.
   * @returns {Array[]} Sample points
   */
  PoissonDiskSampling.prototype.fill = function () {
      return this.implementation.fill();
  };

  /**
   * Get all the points in the grid.
   * @returns {Array[]} Sample points
   */
  PoissonDiskSampling.prototype.getAllPoints = function () {
      return this.implementation.getAllPoints();
  };

  /**
   * Get all the points in the grid along with the result of the distance function.
   * @throws Will throw an error if a distance function was not provided to the constructor.
   * @returns {Array[]} Sample points with their distance function result
   */
  PoissonDiskSampling.prototype.getAllPointsWithDistance = function () {
      return this.implementation.getAllPointsWithDistance();
  };

  /**
   * Reinitialize the grid as well as the internal state
   */
  PoissonDiskSampling.prototype.reset = function () {
      this.implementation.reset();
  };

  var poissonDiskSampling = PoissonDiskSampling;

  let sketch = function (p) {
    let simplex;
    let noise_grid;

    let sampling;
    let points;

    let opts;
    let palette;

    const canvas_dim_x = 1000;
    const canvas_dim_y = 1000;

    let padding;
    let grid_dim_x, grid_dim_y;
    let nx, ny;
    let cell_dim;

    p.setup = function () {
      p.createCanvas(canvas_dim_x, canvas_dim_y);
      p.frameRate(0.5);

      opts = {
        noise_scale: 40,
        noise_persistence: 0.3,
        baseline: 0.5,
        center_magnitude: 2,
        cell_dim: 3,
        padding: 160,
        min_dist: 110,
        tries: 10,
        palette: 'jupiter',
        shadow: true,
      };

      const gui$$1 = new GUI$1();
      gui$$1.width = 300;
      const f1 = gui$$1.addFolder('Noise field');
      f1.add(opts, 'noise_scale', 5, 100, 10).name('Noise scale');
      f1.add(opts, 'noise_persistence', 0.1, 1, 0.05).name('Noise persistence');
      f1.open();

      const f2 = gui$$1.addFolder('Shape');
      f2.add(opts, 'baseline', 0, 1, 0.05).name('Cutoff height');
      f2.add(opts, 'center_magnitude', 0.75, 4, 0.25).name('Center magnitude');
      f2.add(opts, 'cell_dim', 1, 10, 1).name('Zoom level');
      f2.open();

      const f3 = gui$$1.addFolder('Sampling');
      f3.add(opts, 'padding', 0, 300, 20).name('Canvas padding');
      f3.add(opts, 'min_dist', 10, 150, 10).name('Min distance');
      f3.add(opts, 'tries', 1, 20, 2).name('Tries');
      f3.open();

      const f4 = gui$$1.addFolder('Style');
      f4.add(opts, 'palette', getNames());
      f4.add(opts, 'shadow').name('Shadow');
      f4.open();

      reset();
    };

    p.draw = function () {
      reset();
    };

    function reset() {
      palette = get$1(opts.palette);

      cell_dim = opts.cell_dim;
      padding = opts.padding;
      grid_dim_x = canvas_dim_x - 2 * padding;
      grid_dim_y = canvas_dim_y - 2 * padding;
      nx = Math.floor(canvas_dim_x / 20);
      ny = Math.floor(canvas_dim_y / 20);

      sampling = new poissonDiskSampling({
        shape: [grid_dim_x, grid_dim_y],
        minDistance: opts.min_dist,
        tries: opts.tries,
      });
      points = sampling.fill();

      display();
    }

    function display() {
      p.push();
      p.translate(padding, padding);
      p.translate((-nx * cell_dim) / 2, (-ny * cell_dim) / 2);
      p.background(palette.background ? palette.background : '#f5f5f5');
      for (let i = 0; i < points.length; i++) {
        simplex = new simplexNoise();
        const pnt = points[i];
        const col = palette.colors[Math.floor(Math.random() * palette.colors.length)];

        noise_grid = build_noise_grid(opts.baseline, opts.center_magnitude);

        p.push();
        p.translate(Math.floor(pnt[0]), Math.floor(pnt[1]));

        if (opts.shadow) {
          p.fill(palette.stroke ? palette.stroke : '#000');
          process_grid();
          p.translate(5, -10);
        }

        p.fill(col);
        process_grid();
        p.pop();
      }
      p.pop();
    }

    function process_grid() {
      p.push();
      for (let y = 0; y < ny; y++) {
        p.push();
        for (let x = 0; x < nx; x++) {
          process_cell(x, y, 0);
          p.translate(cell_dim, 0);
        }
        p.pop();
        p.translate(0, cell_dim);
      }
      p.pop();
    }

    function process_cell(x, y, threshold) {
      const v1 = get_noise(x, y);
      const v2 = get_noise(x + 1, y);
      const v3 = get_noise(x + 1, y + 1);
      const v4 = get_noise(x, y + 1);

      const b1 = v1 > threshold ? 8 : 0;
      const b2 = v2 > threshold ? 4 : 0;
      const b3 = v3 > threshold ? 2 : 0;
      const b4 = v4 > threshold ? 1 : 0;

      const id = b1 + b2 + b3 + b4;

      if (id === 0) return;

      draw_poly(p, id, v1, v2, v3, v4, threshold, cell_dim);
    }

    function get_noise(x, y) {
      return noise_grid[y][x];
    }

    function build_noise_grid(baseline, offset_mag) {
      return [...Array(ny + 1)].map((_, y) =>
        [...Array(nx + 1)].map(
          (_, x) => sum_octave(16, x, y) + offset_mag * (center_offset(x, y) - baseline)
        )
      );
    }

    // Output range [-1, 1]
    function center_offset(x, y) {
      return 1 - distance_from_centre(x, y) * 2;
    }

    // Output range: [0, 1] (within tangent circle);
    function distance_from_centre(x, y) {
      return Math.sqrt(Math.pow(nx / 2 - x, 2) + Math.pow(ny / 2 - y, 2)) / nx;
    }

    // Output range: [-1, 1]
    function sum_octave(num_iterations, x, y) {
      let noise = 0;
      let maxAmp = 0;
      let amp = 1;
      let freqx = 1 / opts.noise_scale;
      let freqy = 1 / opts.noise_scale;

      for (let i = 0; i < num_iterations; i++) {
        noise += simplex.noise3D(x * freqx, y * freqy, i) * amp;
        maxAmp += amp;
        amp *= opts.noise_persistence;
        freqx *= 2;
        freqy *= 2;
      }
      //return 0;
      return noise / maxAmp;
    }

    p.keyPressed = function () {
      if (p.keyCode === 80) p.saveCanvas('topollock', 'jpeg');
    };
  };
  new p5(sketch);

}));
