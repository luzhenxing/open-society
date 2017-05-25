'use strict';

define(function () {

  return {
    uploadingTips: function uploadingTips(_ref) {
      var name = _ref.name,
          size = _ref.size;

      return '\n        <div class="upload-tips-layer">\n          <div class="upload-tips">\n            <span class="subject">\u6B63\u5728\u5BFC\u5165\u6587\u6863</span>\n            <span class="percent"><em style="width: 30%"></em></span>\n            <span class="file">' + name + '\uFF08' + (size / 1000).toFixed(2) + 'k\uFF09</span>\n          </div>\n        </div>\n       \n      ';
    },
    itemEditorLayer: function itemEditorLayer(type) {
      var title = '创建项目',
          bottomBtns = '\n          <button type="button" class="btn btn-default hook-cancel-save">\u53D6\u6D88</button>\n          <button type="button" class="btn btn-default hook-save">\u6682\u5B58</button>\n          <button type="button" class="btn btn-default hook-prev">\u4E0A\u4E00\u6B65</button>\n          <button type="button" class="btn btn-success hook-submit">\u63D0\u4EA4</button>\n        ';
      if (type == 'revise') {
        title = '添加';
        bottomBtns = '\n          <button type="button" class="btn btn-default hook-cancel-save">\u53D6\u6D88</button>\n          <button type="button" class="btn btn-default hook-save">\u6682\u5B58</button>\n          <button type="button" class="btn btn-success hook-submit">\u63D0\u4EA4</button>\n        ';
      }
      return '\n        <div id="item-editor-layer" class="item-editor-layer">\n          <div class="item-editor-container">\n            <div class="item-editor-header">\n              <h3>' + title + '</h3>\n            </div>\n            <div class="item-button-group text-center">\n              <button type="button" class="btn btn-sm btn-default hook-add-item">\n                <i class="iconfont icon-tianjiaduan" aria-hidden="true"></i>\n                \u6DFB\u52A0\u6BB5\n              </button>\n              <button type="button" class="btn btn-sm btn-default hook-delete-item">\n                <i class="iconfont icon-shanchuduan" aria-hidden="true"></i>\n                \u5220\u9664\u6BB5\n              </button>\n              <button type="button" class="btn btn-sm btn-default hook-coalesce-item">\n                <i class="iconfont icon-hebing" aria-hidden="true"></i>\n                \u5408\u5E76\n              </button>\n              <div id="browse-wrapper" class="btn-wrapper">\n                <button id="browse" type="button" class="btn btn-sm btn-default hook-import-item" title="\u652F\u6301Word\u6587\u4EF6">\n                  <i class="iconfont icon-daoru" aria-hidden="true"></i>\n                  \u5BFC\u5165\n                </button>\n                <div class="tooltip bottom" role="tooltip">\n                  <div class="tooltip-arrow"></div>\n                  <div class="tooltip-inner">\u652F\u6301Word\u6587\u4EF6</div>\n                </div>\n              </div>\n            </div>\n            <div class="item-editor-content">\n              \n              <div class="item-container">\n                <div class="item-list-wrapper">\n                  <div class="item-list">\n                  </div>\n                </div>\n                \n              </div>\n            </div>\n            <div class="item-editor-bottom">\n              <div class="u-pager">\n                <div class="item-pager"></div>\n              </div>\n               \n              <div class="u-btn-group text-center">\n                ' + bottomBtns + '\n              </div>\n            </div>\n            \n          </div>\n          \n        </div>\n      ';
    },
    itemReviseEditorLayer: function itemReviseEditorLayer() {
      return '\n        <div id="item-editor-layer" class="item-editor-layer">\n          <div class="item-editor-container">\n            <div class="item-editor-header">\n              <h3>\u4FEE\u8BA2</h3>\n            </div>\n            <div class="item-editor-content" style="height: 560px;">\n              <div class="item-container item-revise-container">\n                <div id="editor_revise" class="item-editor"></div>\n              </div>\n            </div>\n            <div class="item-editor-bottom">\n              <div class="u-btn-group text-center">\n                <button type="button" class="btn btn-default hook-cancel-save">\u53D6\u6D88</button>\n                <button type="button" class="btn btn-default hook-delete">\u5220\u9664\u6BB5</button>\n                <button type="button" class="btn btn-success hook-submit">\u63D0\u4EA4</button>\n              </div>\n            </div>\n            \n          </div>\n          \n        </div>\n      ';
    },
    item: function item(_ref2) {
      var id = _ref2.id,
          itemId = _ref2.itemId,
          type = _ref2.type,
          content = _ref2.content;

      return '\n      <div id="item_' + id + '" class="item" data-itemid="' + (itemId || '') + '" data-type="' + type + '">\n        <label class="checkbox" for="checkbox_' + id + '" data-itemid="' + (itemId || '') + '">\n          <input class="hook-item-checkbox" id="checkbox_' + id + '" type="checkbox">\n        </label>\n        <div class="item-content">\n          <div class="item-editor-wrap">\n            <div id="editor_' + id + '" class="item-editor"></div>\n            <div class="editor-btn-group">\n              <button class="btn btn-default btn-xs hook-editor-cancel">\u53D6\u6D88</button>\n              <button class="btn btn-success btn-xs hook-editor-save"' + (type === 'create' ? ' disabled' : '') + '>\u4FDD\u5B58</button>\n            </div>\n          </div>\n          <div class="item-inner">' + content + '</div>\n        </div>\n      </div>\n      ';
    },
    pager: function pager(_ref3) {
      var curPage = _ref3.curPage,
          total = _ref3.total;

      var pagination = function pagination() {
        // 最多显示几个页码
        var pageNum = 5;
        var tpl = '';

        // 开始页
        var start = curPage - Math.floor(pageNum / 2);
        start = start < 1 ? 1 : start;

        // 结束页
        var end = curPage + Math.floor(pageNum / 2);
        end = end > total ? total : end;

        var curPageNum = end - start + 1;

        // 设置左边
        if (curPageNum < pageNum && start > 1) {
          start = start - (pageNum - curPageNum);
          start = start < 1 ? 1 : start;
          curPageNum = end - start + 1;
        }

        // 调整右边
        if (curPageNum < pageNum && end < total) {
          end = end + (pageNum - curPageNum);
          end = end > total ? total : end;
        }

        for (var i = start; i <= end; i++) {
          tpl += '<li class="' + (i === curPage ? 'active' : '') + '"><a class="hook-go" data-page="' + i + '" href="javascript:;">' + i + '</a></li>';
        }

        return tpl;
      };

      return '\n        <div class="form-inline">\n          <span class="pager-text">\u7B2C' + curPage + '\u9875</span>\n          <ul class="pagination">\n            <li class="' + (curPage === 1 ? 'disabled' : '') + '">\n              <a href="javascript:;" class="hook-go" data-page="' + (curPage === 1 ? '1' : curPage - 1) + '" aria-label="Previous">\n                <span aria-hidden="true" class="glyphicon glyphicon-triangle-left"></span>\n              </a>\n            </li>\n            ' + pagination() + '\n            <li class="' + (curPage === total ? 'disabled' : '') + '">\n              <a href="javascript:;" class="hook-go" data-page="' + (curPage === total ? curPage : curPage + 1) + '" aria-label="Next">\n                <span aria-hidden="true" class="glyphicon glyphicon-triangle-right"></span>\n              </a>\n            </li>\n          </ul>\n          <span class="pager-text">\u5171' + total + '\u9875</span>\n          <span class="pager-text">\n            \u5230\n            <input class="form-control hook-page-text" type="text" value="' + curPage + '">\n            \u9875\n            <button class="btn btn-default hook-btn-go">\u786E\u5B9A</button>\n          </span>\n        </div>\n      ';
    }
  };
});