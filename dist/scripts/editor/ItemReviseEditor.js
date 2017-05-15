'use strict';

define(['scripts/editor/editorTpl', 'scripts/fetch'], function (tpl, fetch) {
  function ItemReviseEditor() {
    this.name = 'ReviseEditor';
    this.proId = window.PID;
    this.paraCode = '';

    this.$itemEditor = null;
    this.ueditor = null;

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
        fetch.deleteParagraphRevises({
          proId: _this.proId,
          paraCode: _this.paraCode
        }).then(function (message) {
          alert(message);
          _this.hide();
        });
      }).on('click', '.hook-submit', function () {
        fetch.saveParagraphRevises({
          id: _this.proId,
          paraCode: _this.paraCode,
          content: _this.ueditor.getContent()
        }).then(function (message) {
          alert(message);
          console.log($('[data-paracode=' + _this.paraCode + ']'));
          $('[data-paracode=' + _this.paraCode + ']').find('.hook-revise-list').trigger('click');
          _this.hide();
        });
      });
    },
    show: function show(paraCode, content) {
      this.paraCode = paraCode;
      // this.addItem()
      this.ueditor.setContent(content);
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