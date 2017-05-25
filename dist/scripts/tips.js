'use strict';

define(function () {
  var insertStyle = function insertStyle(styleStr) {
    var nod = document.createElement('style');
    nod.type = 'text/css';
    nod.innerHTML = styleStr;
    document.getElementsByTagName('head')[0].appendChild(nod);
  },
      tipStyle = '\n    .ui-tip {\n      display: none;\n      position: fixed;\n      z-index: 2000;\n      top: 0;\n      left: 50%;\n      box-sizing: border-box;\n      margin-left: -150px;\n      padding: 10px;\n      min-width: 300px;\n      line-height: 20px;\n      \n      color: #fff;\n    }\n    .ui-tip.tip {\n      background: #20BE6D;\n      text-align: center;\n    }\n    \n    .ui-tip.warning {\n      background: #E98B25;\n      text-align: center;\n    }\n   \n    .ui-tip.content {\n      background: #fff;\n    }\n  ';

  var tip = null;

  function Tip() {
    this.$box = null;
    this.speed = 2000;
    // tip & warning & content
    this.type = 'tip';
    this.content = '';
    this.exClass = '';
    this.onFun = null;
    this.timer = null;

    this.init();
  }

  Tip.prototype = {
    constructor: Tip,
    init: function init(opt) {

      insertStyle(tipStyle);
      this.$box = $('\n        <div class="ui-tip"></div>\n      ').appendTo('body');
    },
    setOptions: function setOptions() {
      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      Object.assign(this, opt);

      switch (this.type) {
        case 'tip':
        case 'warning':
        case 'content':
          this.$box[0].className = 'ui-tip ' + this.type;
          break;
      }
      if (this.exClass) {
        this.$box.addClass(this.exClass);
      }
      this.$box.html(this.content);
    },
    show: function show() {
      var _this = this;

      // if (this.$box.is(':visible')) {
      //   return false
      // }

      if (this.content === '') {
        return false;
      }
      clearTimeout(this.timer);
      this.$box.fadeIn(100);

      if (this.speed != 0) {
        this.timer = setTimeout(function () {
          _this.hide();
          if (_this.onFun && typeof _this.onFun === 'function') {
            _this.onFun();
          }
        }, this.speed);
      }
    },
    hide: function hide() {
      this.content = '';
      this.$box.hide();
    }
  };

  return {
    show: function show() {
      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!tip) {
        tip = new Tip();
      }

      var _opt = {
        type: 'tip',
        speed: 2000,
        onFun: null,
        exClass: '',
        content: ''
      };

      if (typeof opt === 'string') {
        _opt.content = opt;
        tip.setOptions(_opt);
      } else {
        tip.setOptions(Object.assign(_opt, opt));
      }

      tip.show();
    },
    hide: function hide() {
      if (!tip) {
        return false;
      }
    }
  };
});