'use strict';

define(function () {
  var UEDITOR_MIN_HEIGHT = 100;
  // 编辑器类
  function UEditor($box) {
    var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    this.box = $box;
    this.id = $box.data('id');
    this.type = $box.data('type'); // create & edit
    this.wrap = $box.find('.item-ueditor-wrap');
    this.inner = $box.find('.item-inner');
    this.ueitor = null;
    this.content = content;
    this.init();
  }

  UEditor.prototype = {
    // 初始化编辑器
    init: function init() {
      this.wrap.html('\n        <div id="ueditor_' + this.id + '" class="item-ueditor"></div>\n        <div class="ueditor-btn-group">\n          <button class="btn btn-default btn-xs hook-ueditor-cancel">\u53D6\u6D88</button>\n          <button class="btn btn-success btn-xs hook-ueditor-save" disabled>\u4FDD\u5B58</button>\n        </div>\n      ');

      var height = Math.max(this.box.height(), UEDITOR_MIN_HEIGHT);
      this.ueditor = UE.getEditor('ueditor_' + this.id, {
        initialFrameHeight: height,
        initialContent: this.content
      });
      this.bindEvent();
      console.log(this.ueditor);
      this.show();
    },

    // 绑定事件
    bindEvent: function bindEvent() {
      var _this2 = this;

      var _this = this;
      this.wrap.on('click', '.hook-ueditor-save', function () {
        if (_this2.isContentEmpty()) {
          _this2.wrap.find('.hook-ueditor-save').prop('disabled', true);
          return;
        }
        _this2.box.data('type', 'edit');
        _this2.inner.html(_this.getContent());
        _this2.hide();
        $(_this2).trigger('save');
      }).on('click', '.hook-ueditor-cancel', function () {
        _this2.hide();
        if (_this2.box.data('type') === 'create') {
          // 如果创建时取消则销毁段落
          _this2.box.remove();
          $(_this2).trigger('destroy');
        }
      });

      this.ueditor.addListener('contentchange', function () {
        _this2.wrap.find('.hook-ueditor-save').prop('disabled', _this2.isContentEmpty());
      });
    },

    // 显示编辑器
    show: function show() {
      $('.item-button-group .btn').prop('disabled', true);
      this.wrap.show();
      this.inner.hide();
    },

    // 隐藏编辑器
    hide: function hide() {
      $('.item-button-group .btn').prop('disabled', false);
      this.wrap.hide();
      this.inner.show();
      $(this).trigger('hide');
    },

    // 保存内容
    save: function save() {},

    // 取消保存
    cancel: function cancel() {},

    // 获取内容
    getContent: function getContent() {
      return this.ueditor.getContent();
    },

    // 设置内容
    setContent: function setContent(cont) {
      this.ueditor.setContent(cont);
    },

    // 内容是否为空
    isContentEmpty: function isContentEmpty() {
      return this.ueditor.getContentTxt().trim() === '';
    },

    // 设置高度
    setHeight: function setHeight(h) {
      this.ueditor.setHeight(h);
    }
  };
  return UEditor;
  // return {
  //   editorCache: {},
  //   // 创建编辑器
  //   renderUEditor(dom, height, content){
  //     let id = dom.id;
  //     if (! this.editorCache.hasOwnProperty(id)) {
  //       this.createUEditor(id, height, content);
  //     } else {
  //       this.editorCache[id].setHeight(height);
  //       this.editorCache[id].setShow();
  //       this.editorCache[id].setContent(content);
  //     }
  //   },
  //   createUEditor(id, height, content){
  //     console.log(id, height, content)
  //     this.editorCache[id] = UE.getEditor(id, {
  //       initialContent: content,
  //       initialFrameHeight: height
  //     })
  //   }
  // }
});