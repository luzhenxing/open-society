'use strict';

define(['scripts/fetch'], function (fetch) {
  function ReviseLayer() {
    this.currentType = 'add';
    this.proId = window.PID;
    this.paraCode = '';
    this.currentPage = 1;
    this.addCount = 0;
    this.reviseCount = 0;

    this.$layer = null;
    this.$sourceDom = null;

    this.init();
  }

  ReviseLayer.prototype = {
    constructor: ReviseLayer,
    init: function init() {
      this.$layer = this.layerDom();
      this.bindEvent();
    },
    layerDom: function layerDom() {
      var layer = '\n        <div class="detail-aside-layer" style="display: none">\n          <div class="header"></div>\n          <div class="content"></div>\n          <div class="item-pager"></div>\n        </div>\n      ';
      return $(layer).appendTo('.detail-aside');
    },
    show: function show(type) {
      this.currentType = type;
      this.currentPage = 1;
      // this.setPosition()
      this.$layer.show();
      this.$layer.find('.header').html('\n        ' + (this.addCount != 0 ? '<a class="' + (this.currentType == 'add' ? 'current' : '') + '" data-type="add" href="javascript:;">添加列表</a>' : '') + '\n        ' + (this.reviseCount != 0 ? '<a class="' + (this.currentType == 'revise' ? 'current' : '') + '" data-type="revise" href="javascript:;">修订列表</a>' : '') + '\n      ');

      this.fetchList();
    },
    hide: function hide() {
      this.$layer.hide();
    },
    bindEvent: function bindEvent() {
      var _this = this;
      this.$layer.on('click', '.header > a', function () {
        var $this = $(this);
        if ($this.hasClass('current')) {
          return false;
        }

        $this.addClass('current').siblings().removeClass('current');
        _this.currentType = $this.data('type');
        _this.currentPage = 1;
        _this.fetchList();
      });

      $.fn.scrollUnique = function () {
        return $(this).each(function () {
          var eventType = 'mousewheel';
          // 火狐是DOMMouseScroll事件
          if (document.mozHidden !== undefined) {
            eventType = 'DOMMouseScroll';
          }
          $(this).on(eventType, function (event) {
            // 一些数据
            var scrollTop = this.scrollTop,
                scrollHeight = this.scrollHeight,
                height = this.clientHeight;

            var delta = event.originalEvent.wheelDelta ? event.originalEvent.wheelDelta : -(event.originalEvent.detail || 0);

            if (delta > 0 && scrollTop <= delta || delta < 0 && scrollHeight - height - scrollTop <= -1 * delta) {
              // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
              this.scrollTop = delta > 0 ? 0 : scrollHeight;
              // 向上滚 || 向下滚
              event.preventDefault();
            }
          });
        });
      };

      this.$layer.find('.content').scrollUnique();
    },
    setPosition: function setPosition() {},
    fetchList: function fetchList() {
      var _this2 = this;

      var url = this.currentType == 'add' ? 'reviseList' : 'paragraphRevisesList',
          data = {
        proId: this.proId,
        paraCode: this.paraCode,
        page: this.currentPage,
        userId: 0
      },
          $content = this.$layer.find('.content');
      $content.html('<div class="loading"><img src="/images/loading.svg" /></div>');

      fetch[url](data).then(function (data) {
        $content.html(_this2.itemInner(data));
      });
    },
    itemInner: function itemInner(_ref) {
      var sliceList = _ref.sliceList;

      var inner = '<dl class="item">';

      sliceList.forEach(function (list) {
        inner += '\n          <dt>\n            <span class="time">' + list.createDate + '</span> <span>' + list.userName + '</span>\n          </dt>\n          <dd>\n            <div class="item-inner">\n              ' + list.content + '\n            </div>\n            <div class="item-oper">\n              <a class="hook-support" href="javascript:;">\n                <i class="iconfont icon-dianzan"></i> <span>\u8D5E</span>\n              </a>\n              <a>\n                <i class="iconfont icon-guanlizhe"></i> <span>3</span>\n              </a>\n              <a>\n                <i class="iconfont icon-canyuzhe"></i> <span>2</span>\n              </a>\n            </div>\n          </dd>\n        ';
      });

      inner += '</dl>';

      return inner;
    }
  };

  function Pager() {}

  return ReviseLayer;
});