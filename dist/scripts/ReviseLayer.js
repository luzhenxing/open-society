'use strict';

define(['scripts/fetch'], function (fetch) {
  function ReviseLayer() {
    this.currentType = 'add';
    this.proId = window.PID;
    this.paraCode = '';
    this.currentPage = 1;
    this.addCount = 0;
    this.reviseCount = 0;
    this.total = 1;

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
      }).on('click', '.hook-support', function () {
        // console.log('proId', _this.proId)
        // console.log('paraCode', _this.paraCode)
        // console.log('reviseId', $(this).data('id'))
        var $icon = $(this).find('.iconfont');
        if ($icon.hasClass('icon-dianzan')) {
          $icon.removeClass('icon-dianzan').addClass('icon-dianzan1');
        } else {
          $icon.removeClass('icon-dianzan1').addClass('icon-dianzan');
        }
      }).on('click', '.hook-go', function () {
        _this.currentPage = $(this).data('page');
        _this.fetchList();
      }).on('click', '.hook-btn-go', function () {
        var page = _this.$layer.find('.hook-page-text').val();
        if (!window.isNaN(page) && page > 0 && page <= this.total) {
          _this.currentPage = page;
          _this.fetchList();
        }
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
    setPosition: function setPosition() {
      var top = this.$sourceDom.position().top;
      this.$layer.css({ top: top });
    },
    fetchList: function fetchList() {
      var _this2 = this;

      var url = this.currentType == 'add' ? 'reviseList' : 'paragraphRevisesList',
          data = {
        proId: this.proId,
        paraCode: this.paraCode,
        page: this.currentPage
      },
          $content = this.$layer.find('.content');
      this.setPosition();
      $content.html('<div class="loading"><img src="/images/loading.svg" /></div>');

      fetch[url](data).then(function (data) {
        $content.html(_this2.itemInner(data));
        // console.log(this.$layer.find('.item-pager'))
        _this2.$layer.find('.item-pager').html(_this2.pagerInner(data));
      });
    },
    itemInner: function itemInner(_ref) {
      var sliceList = _ref.sliceList;

      if (!sliceList) {
        return false;
      }
      var inner = '<dl class="item">';

      sliceList.forEach(function (list) {
        inner += '\n          <dt>\n            <img class="avatar" src="" alt="' + list.userName + '">\n            <span>' + list.userName + '</span>\n            <span class="time">' + list.createDate + '</span>\n            <div class="item-oper">\n              <a class="support hook-support" data-id="' + list.id + '" href="javascript:;">\n                <i class="iconfont icon-dianzan"></i>\n              </a>\n              <a>\n                <i class="iconfont icon-guanlizhe"></i> <span>3</span>\n              </a>\n              <a>\n                <i class="iconfont icon-canyuzhe"></i> <span>2</span>\n              </a>\n            </div>\n          </dt>\n          <dd>\n            <div class="item-inner">\n              ' + list.content + '\n            </div>\n          </dd>\n        ';
      });

      inner += '</dl>';

      return inner;
    },
    pagerInner: function pagerInner(_ref2) {
      var count = _ref2.count,
          size = _ref2.size,
          from = _ref2.from;

      var total = Math.ceil(count / size),
          inner = '';

      this.total = total;

      if (total > 1) {
        inner += '\n          <div class="form-inline">\n            <span class="pager-text">\u7B2C' + from + '\u9875</span>\n            <ul class="pagination">\n              <li class="' + (from === 1 ? 'disabled' : '') + '">\n                <a href="javascript:;" class="hook-go" data-page="' + (from === 1 ? '1' : from - 1) + '" aria-label="Previous">\n                  \u4E0A\u4E00\u9875\n                </a>\n              </li>\n              <li class="' + (from === total ? 'disabled' : '') + '">\n                <a href="javascript:;" class="hook-go" data-page="' + (from === total ? from : from + 1) + '" aria-label="Next">\n                  \u4E0B\u4E00\u9875\n                </a>\n              </li>\n            </ul>\n            <span class="pager-text">\u5171' + total + '\u9875</span>\n            <span class="pager-text">\u5230 <input class="form-control hook-page-text" type="text" value="' + from + '"> \u9875\n              <button class="btn btn-default hook-btn-go">\u786E\u5B9A</button>\n            </span>\n          </div>\n        ';
      }
      return inner;
    }
  };

  function Pager() {}

  return ReviseLayer;
});