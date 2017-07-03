'use strict';

// 修订 编辑器
define(['scripts/editor/editorTpl', 'scripts/fetch', 'scripts/tips'], function (tpl, fetch, tips) {
  function ItemReviseEditor() {
    this.name = 'ReviseEditor';
    this.proId = window.PID;
    this.paraCode = '';

    this.$detailItem = null;
    this.$itemEditor = null;
    this.ueditor = null;

    this.initContent = '';

    this.init();
  }

  ItemReviseEditor.prototype = {
    constructor: ItemReviseEditor,
    init: function init() {
      this.$itemEditor = $(tpl.itemReviseEditorLayer());

      this.$itemEditor.appendTo('body');
      this.bindEvent();
    },
    bindEvent: function bindEvent() {
      var _this = this;

      this.ueditor = UE.getEditor('editor_revise', {
        initialFrameHeight: 460
      });

      this.$itemEditor.on('click', '.hook-cancel-save', function () {
        _this.hide();
      }).on('click', '.hook-delete', function () {
        // console.log(this.$detailItem.data('revise-count'))
        var $btn = _this.$itemEditor.find('.hook-delete');
        $btn.prop('disabled', true);
        fetch.deleteParagraphRevises({
          proId: _this.proId,
          paraCode: _this.paraCode
        }).then(function (message) {
          $btn.prop('disabled', false);
          tips.show(message);

          _this.$detailItem.data('revise-count', parseInt(_this.$detailItem.data('revise-count')) + 1);
          var $list = _this.$detailItem.find('.hook-revise-list');

          $list.find('span').text('( ' + parseInt(_this.$detailItem.data('revise-count')) + ' )');

          $list.trigger('click');
          _this.hide();
        });
      }).on('click', '.hook-submit', function () {
        var content = _this.ueditor.getContent();

        if (content === _this.initContent) {
          tips.show({
            type: 'warning',
            content: '请对内容进行修改后提交'
          });
          return false;
        }
        var $btn = _this.$itemEditor.find('.hook-submit');
        $btn.prop('disabled', true);
        fetch.saveParagraphRevises({
          id: _this.proId,
          paraCode: _this.paraCode,
          content: content
        }).then(function (message) {
          $btn.prop('disabled', false);
          tips.show(message);

          _this.$detailItem.data('revise-count', parseInt(_this.$detailItem.data('revise-count')) + 1);

          var $list = _this.$detailItem.find('.hook-revise-list');

          $list.find('span').text('( ' + parseInt(_this.$detailItem.data('revise-count')) + ' )');

          $list.trigger('click');
          _this.hide();
        }, function () {
          $btn.prop('disabled', false);
        });
      });
    },
    show: function show(paraCode, content) {
      this.$detailItem = $('.detail-item[data-paracode=' + paraCode + ']');
      this.paraCode = paraCode;

      // this.addItem()

      this.ueditor.setContent(content);
      this.initContent = this.ueditor.getContent();
      this.$itemEditor.fadeIn(100);
      // this.itemLists(listPage)
    },
    hide: function hide() {
      this.$itemEditor.hide();
      this.paraCode = '';
      this.ueditor.setContent('');
    }
  };

  return ItemReviseEditor;
});