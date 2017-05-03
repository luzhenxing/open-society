define(() => {

  return {
    itemEditorLayer() {
      return `
        <div id="item-editor-layer" class="item-editor-layer">
          <div class="item-button-group text-center">
            <button type="button" class="btn btn-sm btn-default hook-add-item">
              <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
              添加段
            </button>
            <button type="button" class="btn btn-sm btn-default hook-delete-item">
              <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
              删除段
            </button>
            <button type="button" class="btn btn-sm btn-default hook-coalesce-item">
              <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
              合并
            </button>
            <button id="browse" type="button" class="btn btn-sm btn-default hook-import-item" data-toggle="tooltip" data-placement="bottom" title="支持Word文件">
              <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
              导入
            </button>
          </div>
          <div class="item-container container">
            <div class="panel u-panel-style">
              <div class="panel-body item-list-wrapper">
                <div class="item-list">
                </div>
                <div class="item-pager"></div> 
              </div>
            </div>
            <div class="u-btn-group text-center">
              <button type="button" class="btn btn-default hook-cancel-save">取消</button>
              <button type="button" class="btn btn-default hook-save">暂存</button>
              <button type="button" class="btn btn-default hook-prev">上一步</button>
              <button type="button" class="btn btn-default hook-review">预览</button>
              <button type="button" class="btn btn-success hook-submit">提交</button>
            </div>
          </div>
        </div>
      `
    },
    item({id, itemId, type, content}) {
      return `
      <div id="item_${id}" class="item" data-type-itemid="${itemId ||
      ''}" data-type="${type}">
        <label class="checkbox" for="checkbox_${id}">
          <input class="hook-item-checkbox" id="checkbox_${id}" type="checkbox">
        </label>
        <div class="item-content">
          <div class="item-editor-wrap">
            <div id="editor_${id}" class="item-editor"></div>
            <div class="editor-btn-group">
              <button class="btn btn-default btn-xs hook-editor-cancel">取消</button>
              <button class="btn btn-success btn-xs hook-editor-save"${type ===
      'create' ? ' disabled': ''}>保存</button>
            </div>
          </div>
          <div class="item-inner">${content}</div>
        </div>
      </div>
      `
    },
    pager({curPage, total}) {
      const pagination = () => {
        // 最多显示几个页码
        const pageNum = 5
        let tpl = ''

        // 开始页
        let start = curPage - Math.floor(pageNum / 2)
        start = start < 1 ? 1: start

        // 结束页
        let end = curPage + Math.floor(pageNum / 2)
        end = end > total ? total: end

        let curPageNum = end - start + 1

        // 设置左边
        if (curPageNum < pageNum && start > 1) {
          start = start - (pageNum - curPageNum)
          start = start < 1 ? 1: start
          curPageNum = end - start + 1
        }

        // 调整右边
        if (curPageNum < pageNum && end < total) {
          end = end + (pageNum - curPageNum)
          end = end > total ? total: end
        }

        for (let i = start; i <= end; i++) {
          tpl += `<li class="${i === curPage
            ? 'active'
            : ''}"><a class="hook-go" data-page="${i}" href="javascript:;">${i}</a></li>`
        }

        return tpl
      }

      return `
        <div class="form-inline">
          <span class="pager-text">第${curPage}页</span>
          <ul class="pagination">
            <li class="${curPage === 1 ? 'disabled': ''}">
              <a href="javascript:;" class="hook-go" data-page="1" aria-label="Previous">
                <span aria-hidden="true" class="glyphicon glyphicon-triangle-left"></span>
              </a>
            </li>
            ${pagination()}
            <li class="${curPage === total ? 'disabled': ''}">
              <a href="javascript:;" class="hook-go" data-page="${total}" aria-label="Next">
                <span aria-hidden="true" class="glyphicon glyphicon-triangle-right"></span>
              </a>
            </li>
          </ul>
          <span class="pager-text">共${total}页</span>
          <span class="pager-text">
            到
            <input class="form-control hook-page-text" type="text" value="${curPage}">
            页
            <button class="btn btn-default hook-btn-go">确定</button>
          </span>
        </div>
      `
    }
  }
})
