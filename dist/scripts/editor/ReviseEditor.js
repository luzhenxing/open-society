'use strict';

// 添加列表 编辑器
define(['scripts/editor/editorTpl', 'scripts/urls', 'scripts/fetch', 'scripts/token', 'scripts/tips'], function (tpl, urls, fetch, token, tips) {

  var isShowUEditor = false,
      listPage = 1;

  var UEDITOR_MIN_HEIGHT = 100,
      renderDom = function renderDom(obj, $target) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'append';

    $target[type](obj);
  },
      setUEditorStatus = function setUEditorStatus(status) {
    isShowUEditor = status;
    $('.item-button-group .btn').prop('disabled', status);
  },
      arrDelete = function arrDelete(arr, index) {
    var _index = arr.indexOf(index);
    if (_index !== -1) {
      arr.splice(_index, 1);
    }
  },
      generateRandomAlphaNum = function generateRandomAlphaNum(len) {
    var rdmString = '';
    for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2)) {}
    return rdmString.substr(0, len);
  };

  function ReviseEditor() {
    this.name = 'ReviseEditor';
    this.proId = window.PID;
    this.paraCode = '';

    // 编辑页对象
    this.$itemEditor = null;
    this.$itemContainer = null;
    this.$itemPager = null;

    this.pager = null;

    this.objItemSet = {};
    this.uploadingTips = null;

    // 选中段落
    this.arrCheckedItem = [];
    this.init();
  }

  ReviseEditor.prototype = {
    constructor: ReviseEditor,
    init: function init() {
      this.$itemEditor = $(tpl.itemEditorLayer('revise'));
      this.$itemContainer = this.$itemEditor.find('.item-list');
      this.$itemPager = this.$itemEditor.find('.item-pager');

      this.$itemEditor.appendTo('body');
      this.bindEvent();
      // this.itemLists(listPage)
    },
    bindEvent: function bindEvent() {
      var _this2 = this;

      // this.$itemEditor.find('[data-toggle="tooltip"]').tooltip()

      this.$itemEditor
      // 添加段落
      .on('click', '.hook-add-item', function () {
        if (_this2.arrCheckedItem.length !== 1 && !$.isEmptyObject(_this2.objItemSet)) {
          tips.show({
            type: 'warning',
            content: '请选择一个段落进行添加'
          });
        } else {
          _this2.addItem(_this2.arrCheckedItem[0]);
        }
      })
      // 删除段落
      .on('click', '.hook-delete-item', function () {
        if (!_this2.arrCheckedItem.length) {
          tips.show({
            type: 'warning',
            content: '请选择要删除的段落'
          });
        } else {
          _this2.deleteItem();
        }
      })
      // 合并段落
      .on('click', '.hook-coalesce-item', function () {
        if (_this2.arrCheckedItem.length < 2) {
          tips.show({
            type: 'warning',
            content: '请选择要合并的段落'
          });
        } else if (!_this2.isAdjoin()) {
          tips.show({
            type: 'warning',
            content: '请选择相邻的段落'
          });
        } else {
          _this2.coalesceItem();
        }
      })
      // 取消
      .on('click', '.hook-cancel-save,.hook-prev', function () {
        if (isShowUEditor) {
          tips.show({
            type: 'warning',
            content: '请先保存编辑的内容'
          });
          return false;
        }
        _this2.hide();
      })
      // 暂存
      .on('click', '.hook-save', function () {
        if (isShowUEditor) {
          tips.show({
            type: 'warning',
            content: '请先保存编辑的内容'
          });
          return false;
        }
        fetch.tempSaveRevises({
          "id": window.PID,
          "paraCode": _this2.paraCode,
          "currPage": window.currPage
        }).then(function (message) {
          tips.show(message);
        });
      })
      // 段落新增段提交
      .on('click', '.hook-submit', function () {
        if (isShowUEditor) {
          tips.show({
            type: 'warning',
            content: '请先保存编辑的内容'
          });
          return false;
        }
        var $btn = _this2.$itemEditor.find('.hook-submit');
        $btn.prop('disabled', true);
        fetch.saveRevises({
          "id": window.PID,
          "paraCode": _this2.paraCode
          // "userId": window.userId,
          // "userName": window.userName
        }).then(function (message) {
          $btn.prop('disabled', false);
          tips.show(message);
          _this2.hide();

          $('[data-paracode=' + _this2.paraCode + ']').data('add-count', parseInt($('[data-paracode=' + _this2.paraCode + ']').data('add-count')) + 1);

          var $list = $('[data-paracode=' + _this2.paraCode + ']').find('.hook-add-list');

          $list.trigger('click');

          $list.find('span').text('( ' + parseInt($('[data-paracode=' + _this2.paraCode + ']').data('add-count')) + ' )');
        }, function () {
          $btn.prop('disabled', false);
        });
      });

      this.bindUpload();
      this.bindPager();
    },
    bindUpload: function bindUpload() {
      var _this = this;
      var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
        browse_button: 'browse',
        container: 'browse-wrapper',
        runtimes: 'html5,flash,silverlight,html4',
        url: urls.revisesFiles,
        flash_swf_url: 'scripts/common/plupload/Moxie.swf',
        silverlight_xap_url: 'scripts/common/plupload/Moxie.xap',
        max_retries: 3,
        multi_selection: false,
        multipart_params: {
          proId: window.PID
        },
        headers: {
          'X-Authorization': token
        },
        filters: {
          mime_types: [{ title: 'Word file', extensions: 'doc,docx' }],
          max_file_size: '10mb'
        },

        init: {
          FilesAdded: function FilesAdded(up, files) {
            var reviseId = _this.$itemContainer.find('.checkbox.checked:last').closest('.item').data('itemid') || 'end';
            // console.log('file add')
            uploader.setOption('url', urls.revisesFiles + '?paraCode=' + _this.paraCode + '&reviseId=' + reviseId);

            _this.uploadingTips = $(tpl.uploadingTips(files[0]));
            _this.uploadingTips.appendTo('body');
            setUEditorStatus(true);

            // 开始上传
            uploader.start();
          },
          UploadProgress: function UploadProgress(up, file) {
            // console.log('upload progress', file.percent)
            _this.uploadingTips.find('.percent > em').css('width', file.percent + '%');
          },
          UploadComplete: function UploadComplete(uploader, files) {
            _this.itemLists(listPage);
            _this.uploadingTips.remove();
            _this.uploadingTips = null;
            setUEditorStatus(false);
            // console.log('UploadComplete')
          },
          Error: function Error(uploader, errObject) {
            tips.show({
              type: 'warning',
              content: '上传错误'
            });
          }
        }
      });
      uploader.init(); //初始化
    },
    bindPager: function bindPager() {
      var _this3 = this;

      this.pager = new Pager({
        $pager: this.$itemPager
      });

      $(this.pager).on('pager', function (e, page) {
        if (isShowUEditor) {
          tips.show({
            type: 'warning',
            content: '请先保存编辑的内容'
          });
          return false;
        }
        _this3.itemLists(page);
      });
    },
    show: function show(paraCode) {
      this.paraCode = paraCode;
      // this.addItem()
      this.$itemEditor.fadeIn(100);
      this.itemLists(listPage);
    },
    hide: function hide() {
      this.$itemEditor.hide();
      this.clean();
    },
    clean: function clean() {
      isShowUEditor = false;
      listPage = 1;

      this.$itemContainer.empty();
      this.$itemPager.empty();

      this.objItemSet = {};
      // 选中段落
      this.arrCheckedItem = [];
    },
    isAdjoin: function isAdjoin() {
      var adjoin = true;
      var checkedItem = this.$itemContainer.find('.item').filter(function () {
        return $(this).find('.checkbox').hasClass('checked');
      });

      checkedItem.each(function (i) {
        if (i === checkedItem.length - 1) {
          return false;
        }
        if (!$(this).next().find('.checkbox').hasClass('checked')) {
          adjoin = false;
          return adjoin;
        }
      });
      return adjoin;
    },

    // 添加段落
    addItem: function addItem() {
      var targetId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      var item = new Item({
        paraCode: this.paraCode,
        objItemSet: this.objItemSet,
        arrCheckedItem: this.arrCheckedItem,
        $box: this.$itemContainer,
        type: 'create',
        targetId: targetId
      });
      this.pushItem(item);
    },

    // 删除段落
    deleteItem: function deleteItem() {
      var _this4 = this;

      fetch.deleteRevise({
        proId: this.proId,
        paraCode: this.paraCode,
        reviseIds: this.arrCheckedItem.join(','),
        // userId: window.userId,
        page: listPage
      }).then(function (data) {
        _this4.arrCheckedItem.length = 0;
        _this4.showPager(data);
        _this4.renderItem(data);
      });
    },

    // 合并段落
    coalesceItem: function coalesceItem() {
      var _this5 = this;

      var arr = [];

      $('.item .checked').map(function () {
        arr.push($(this).data('itemid'));
      });
      fetch.coalesceRevise({
        id: this.proId,
        // userId: window.userId,
        paraCode: this.paraCode,
        reviseIds: arr,
        page: listPage
      }).then(function (data) {
        _this5.arrCheckedItem.length = 0;
        _this5.showPager(data);
        _this5.renderItem(data);
      });
    },

    // 导入段落
    importItem: function importItem() {
      this.itemLists(listPage);
    },

    // 段落列表
    itemLists: function itemLists() {
      var _this6 = this;

      var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      listPage = page;
      fetch.tempReviseList({
        proId: window.PID,
        // userId: window.userId,
        paraCode: this.paraCode,
        page: page
      }).then(function (data) {
        _this6.showPager(data);
        _this6.renderItem(data);
      });
    },
    renderItem: function renderItem(data) {
      var _this7 = this;

      var sliceList = data.sliceList || [];

      this.$itemContainer.empty();
      this.objItemSet = {};
      this.arrCheckedItem.length = 0;
      sliceList.forEach(function (slice) {
        var item = new Item({
          objItemSet: _this7.objItemSet,
          arrCheckedItem: _this7.arrCheckedItem,
          paraCode: _this7.paraCode,
          $box: _this7.$itemContainer,
          type: 'edit',
          itemId: slice.id,
          content: slice.content
        });
        _this7.objItemSet[item.itemId] = item;
        _this7.pushItem(item);
      });
    },

    // 分页
    showPager: function showPager(_ref) {
      var from = _ref.from,
          size = _ref.size,
          count = _ref.count;

      this.pager.renderPage({ curPage: from, limit: size, count: count });
    },

    // 提交
    submit: function submit() {},
    pushItem: function pushItem(item) {
      var _this8 = this;

      $(item).on('item.check', function (checked) {});
      $(item).on('item.add', function () {
        // console.log('添加成功')
        if (!!_this8.arrCheckedItem.length) {
          _this8.arrCheckedItem.forEach(function (itemid) {
            var item = _this8.objItemSet[itemid];
            item.checkItem(false);
            item.$item.find('.hook-item-checkbox').prop('checked', false);
          });
        }
      });
    }
  };

  // 段落对象
  function Item() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.id = generateRandomAlphaNum(8);
    this.$box = 'body';
    this.$item = null;
    this.$editorWrap = null;
    this.$itemInner = null;

    // 由父级传递 纪录item集合，选中的item
    this.objItemSet = null;
    this.arrCheckedItem = null;

    this.paraCode = '';
    this.targetId = '';
    this.itemId = '';
    this.type = 'create';
    this.proId = window.PID || 0;
    this.content = '';
    this.ueditor = null;
    this.checked = false;

    $.extend(this, opts);
    this.init();
  }

  Item.prototype = {
    init: function init() {
      var item = tpl.item({
        id: this.id,
        type: this.type,
        itemId: this.itemId,
        proId: this.proId,
        content: this.content
      });
      this.$item = $(item);
      this.$editorWrap = this.$item.find('.item-editor-wrap');
      this.$itemInner = this.$item.find('.item-inner');

      this.bindEvent();

      if (this.targetId !== '') {
        renderDom(this.$item, this.objItemSet[this.targetId].$item, 'after');
      } else {
        renderDom(this.$item, this.$box);
      }

      // this.objItemSet[this.id] = this
      switch (this.type) {
        case 'create':
          this.initEditor();
          this.showEditor();
      }
    },
    bindEvent: function bindEvent() {
      var _this9 = this;

      var _this = this;
      this.$item
      // 勾选段落
      .on('change', '.hook-item-checkbox', function () {
        if (isShowUEditor) {
          return false;
        }
        _this.checkItem(this.checked);
      })
      // 点击内容显示编辑器
      .on('click', '.item-inner', function () {
        if (isShowUEditor) {
          return false;
        }
        if (_this9.ueditor) {
          _this9.setContent(_this9.content);
          // this.setUEditorHeight()
        } else {
          _this9.initEditor();
        }
        _this9.showEditor();
      })
      // 保存内容
      .on('click', '.hook-editor-save', function () {
        _this9.content = _this9.getContent();
        // 没有itemId为新增
        if (_this9.itemId === '') {
          _this9.addItem();
        } else {
          _this9.updateItem();
        }
      })
      // 取消保存
      .on('click', '.hook-editor-cancel', this.cancelSave.bind(this));
    },
    initEditor: function initEditor() {
      var _this10 = this;

      var height = Math.max(UEDITOR_MIN_HEIGHT, this.$item.height());
      this.ueditor = UE.getEditor('editor_' + this.id, {
        initialFrameHeight: height,
        initialContent: this.content
      });

      this.ueditor.addListener('contentchange', function () {
        _this10.$item.find('.hook-editor-save').prop('disabled', _this10.isContentEmpty());
      });
    },

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
      return !this.ueditor.hasContents();
    },

    // 设置高度
    setUEditorHeight: function setUEditorHeight() {
      var height = Math.max(UEDITOR_MIN_HEIGHT, this.$item.height());
      this.ueditor.setHeight(height);
    },
    showEditor: function showEditor() {
      setUEditorStatus(true);
      this.$editorWrap.show();
      this.$itemInner.hide();
    },
    showInner: function showInner() {
      setUEditorStatus(false);
      this.$editorWrap.hide();
      this.$itemInner.show();
    },
    addItem: function addItem() {
      var _this11 = this;

      fetch.addRevises({
        id: this.proId,
        paraCode: this.paraCode,
        reviseId: this.targetId,
        content: this.content,
        page: listPage
      }).then(function (data) {
        _this11.type = 'edit';
        _this11.itemId = data.reviseId;
        _this11.$item.data('type', _this11.type);
        _this11.$item.data('itemid', _this11.itemId);
        _this11.$item.find('.checkbox').data('itemid', _this11.itemId);
        _this11.$itemInner.html(_this11.content);
        _this11.objItemSet[_this11.itemId] = _this11;
        _this11.showInner();
        setUEditorStatus(false);
        $(_this11).trigger('item.add');
        _this11.checkItem(true);
        _this11.$item.find('.hook-item-checkbox').prop('checked', true);
      });
    },
    updateItem: function updateItem() {
      var _this12 = this;

      fetch.updateRevises({
        id: this.proId,
        paraCode: this.paraCode,
        reviseId: this.itemId,
        content: this.content
      }).then(function (data) {
        // console.log(data)
        _this12.$itemInner.html(_this12.content);
        _this12.showInner();
        setUEditorStatus(false);
        _this12.checkItem(true);
        _this12.$item.find('.hook-item-checkbox').prop('checked', true);
      });
    },
    cancelSave: function cancelSave() {
      if (this.type === 'create') {
        // 段落集合大于一段以上，可以销毁当前段落，防止编辑页空白无数据
        // if (Object.keys(this.objItemSet).length) {
        setUEditorStatus(false);
        this.destroy();
        // }
      } else {
        setUEditorStatus(false);
        this.showInner();
      }
    },

    // 销毁段落对象
    destroy: function destroy() {
      this.ueditor = null;
      this.$item.remove();

      arrDelete(this.arrCheckedItem, this.itemId);
    },
    checkItem: function checkItem(checked) {
      var $label = this.$item.find('.checkbox');
      if (checked && $label.is('.checked')) {
        return false;
      }

      this.checked = checked;
      if (checked) {
        $label.addClass('checked');
        this.arrCheckedItem.push(this.itemId);
      } else {
        $label.removeClass('checked');

        arrDelete(this.arrCheckedItem, this.itemId);
      }
      // console.log(this.arrCheckedItem)
      $(this).trigger('item.check', [checked]);
    }
  };

  function Pager(_ref2) {
    var $pager = _ref2.$pager;

    this.$pager = $pager;

    this.init();
  }

  // 分页对象
  Pager.prototype = {
    init: function init() {
      this.bindEvent();
    },
    bindEvent: function bindEvent() {
      var _this13 = this;

      var _this = this;
      this.$pager.on('click', 'li:not(.disabled,.active) > .hook-go', function () {
        $(_this).trigger('pager', [$(this).data('page')]);
      }).on('click', '.hook-btn-go', function () {
        var page = parseInt(_this13.$pager.find('.hook-page-text').val());
        if (!window.isNaN(page) && page > 0 && page <= _this13.total) {
          $(_this).trigger('pager', [page]);
        }
      });
    },
    renderPage: function renderPage(_ref3) {
      var curPage = _ref3.curPage,
          limit = _ref3.limit,
          count = _ref3.count;

      var total = Math.ceil(count / limit);
      this.total = total;
      if (total <= 1) {
        // 只有一页无需翻页
        this.$pager.hide();
        return false;
      }

      var pager = tpl.pager({ total: total, curPage: curPage });
      this.$pager.show().html(pager);
    }
  };

  return ReviseEditor;
});