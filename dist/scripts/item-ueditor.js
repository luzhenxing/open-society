'use strict';

define(['scripts/UEditor'], function (UEditor) {
  // 当前段落id集合
  var itemIds = {},
      checkedItem = {},
      editorShow = false;

  function ItemUeditor() {
    this.$layer = null;
  }

  ItemUeditor.prototype = {
    // 获取编辑弹层
    getLayer: function getLayer() {
      if (!this.$layer) {
        var tpl = template('tpl-item-ueditor-layer', {});
        this.$layer = $(tpl);
        $('body').append(this.$layer);

        this.bindEvent();
      }
    },

    // 绑定事件
    bindEvent: function bindEvent() {
      var _this = this;

      // 添加段落
      this.$layer.on('click', '#ueditor-btn-add', function () {
        _this.addItem();
      })
      // 删除段落
      .on('click', '#ueditor-btn-delete', function () {
        _this.deleteItem();
      })
      // 导入文档
      .on('click', '#ueditor-btn-import', function () {
        _this.importItem();
      })
      // 取消
      .on('click', '#ueditor-btn-cancel', function () {
        _this.hide();
      })
      // 点击内容显示编辑器
      .on('click', '.item-inner', function () {
        if (editorShow) {
          return;
        }
        editorShow = true;
        var $obj = $(this).closest('li'),
            editor = $obj.data('editor');
        if (editor === undefined) {
          editor = new UEditor($obj, $(this).html());
          $obj.data('editor', editor);
          $(editor).on('destroy', function () {
            $obj.data('editor', undefined);
          });
          // .on('hide', () => {
          //   editorShow = false
          // })
        } else {
          editor.setContent($(this).html());
          editor.show();
        }
        // this.setContent(this.inner.html())
        // this.show()
      })
      // checkbox
      .on('change', '.hook-item-checkbox', function () {
        var $label = $(this).closest('label.checkbox'),
            $li = $label.closest('li'),
            id = $li.data('id');
        if (this.checked) {
          $label.addClass('checked');
          checkedItem[id] = $li;
        } else {
          $label.removeClass('checked');
          delete checkedItem[id];
        }
      });
    },

    // 显示弹层
    show: function show() {
      this.getLayer();
      this.$layer.show().addClass('fadeIn');
    },

    // 隐藏弹层
    hide: function hide() {
      this.$layer.hide();
    },

    // 创建item
    createItem: function createItem() {
      var $li = $(this.getItemListTpl({ id: Date.now(), type: 'create' }));
      this.$layer.find('.item-list').prepend($li);
      return $li;
    },

    // 添加段落
    addItem: function addItem() {
      var $obj = this.createItem();
      var editor = new UEditor($obj);
      $obj.data('editor', editor);
      $(editor).on('destroy', function () {
        $obj.data('editor', null);
      });
    },

    // 获取段落dom模版
    getItemListTpl: function getItemListTpl(data) {
      return template('tpl-item-list', data);
    },

    // 渲染一个编辑器
    renderUEditor: function renderUEditor($li) {
      console.log($li);
      var height = Math.max($li.height(), UEDITOR_MIN_HEIGHT);
      var ueditorDom = $li.find('.item-ueditor').get(0);
      var content = '';
      if ($li.data('type') === 'edit') {
        content = $li.find('.item-inner').html();
      }
      UEditor.renderUEditor(ueditorDom, height, content);
      $li.find('.item-inner').hide();
    },
    disabledAddBtn: function disabledAddBtn(id, type) {
      $('#' + id).prop('disabled', type);
    },
    deleteItem: function deleteItem() {
      for (var id in checkedItem) {
        $('#item_' + id).data('editor', null);
        $('#item_' + id).remove();
        delete checkedItem[id];
      }
    },
    importItem: function importItem() {
      var _this2 = this;

      var id = 857414922369949700;
      $.getJSON('json/item-list.json').then(function (result) {
        // $.getJSON(`http://192.168.1.175:8080/api/v1/projects/${id}/paragraphs/`,{
        //   page: 5,
        //   perPageNo: 20
        // }).then(result => {
        console.log(result);
        _this2.renderItems(result.datas.sliceList);
      });
    },
    renderItems: function renderItems(data) {
      var _this3 = this;

      var tpl = '';
      data.forEach(function (item) {
        tpl += _this3.getItemListTpl($.extend(item, { type: 'edit' }));
      });
      this.$layer.find('.item-list').html(tpl);
    }
  };

  var itemUeditor = new ItemUeditor();

  return {
    setOptions: function setOptions() {
      var ops = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      $.extend(itemUeditor, ops);
    },
    show: function show() {
      var command = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      itemUeditor.show();
      switch (command) {
        case 'create':
          itemUeditor.addItem();

          break;
      }
    },
    hide: function hide() {
      itemUeditor.hide();
    }
  };
});