define(() => {

  return {
    uploadingTips({name, size}){
      return `
        <div class="upload-tips-layer">
          <div class="upload-tips">
            <span class="subject">正在导入文档</span>
            <span class="percent"><em style="width: 30%"></em></span>
            <span class="file">${name}（${(size / 1000).toFixed(2)}k）</span>
          </div>
        </div>
       
      `
    },
    itemEditorLayer(type) {
      let title = '创建项目',
        bottomBtns = `
          <button type="button" class="btn btn-default hook-cancel-save">取消</button>
          <button type="button" class="btn btn-default hook-save">暂存</button>
          <button type="button" class="btn btn-default hook-prev">上一步</button>
          <button type="button" class="btn btn-success hook-submit">提交</button>
        `
      if (type == 'revise') {
        title = '添加'
        bottomBtns = `
          <button type="button" class="btn btn-default hook-cancel-save">取消</button>
          <button type="button" class="btn btn-default hook-save">暂存</button>
          <button type="button" class="btn btn-success hook-submit">提交</button>
        `
      }
      return `
        <div id="item-editor-layer" class="item-editor-layer">
          <div class="item-editor-container">
            <div class="item-editor-header">
              <h3>${title}</h3>
            </div>
            <div class="item-button-group text-center">
              <button type="button" class="btn btn-sm btn-default hook-add-item">
                <i class="iconfont icon-tianjiaduan" aria-hidden="true"></i>
                添加段
              </button>
              <button type="button" class="btn btn-sm btn-default hook-delete-item">
                <i class="iconfont icon-shanchuduan" aria-hidden="true"></i>
                删除段
              </button>
              <button type="button" class="btn btn-sm btn-default hook-coalesce-item">
                <i class="iconfont icon-hebing" aria-hidden="true"></i>
                合并
              </button>
              <div id="browse-wrapper" class="btn-wrapper">
                <button id="browse" type="button" class="btn btn-sm btn-default hook-import-item" title="支持Word文件">
                  <i class="iconfont icon-daoru" aria-hidden="true"></i>
                  导入
                </button>
                <div class="tooltip bottom" role="tooltip">
                  <div class="tooltip-arrow"></div>
                  <div class="tooltip-inner">支持Word文件</div>
                </div>
              </div>
            </div>
            <div class="item-editor-content">
              
              <div class="item-container">
                <div class="item-list-wrapper">
                  <div class="item-list">
                  </div>
                </div>
                
              </div>
            </div>
            <div class="item-editor-bottom">
              <div class="u-pager">
                <div class="item-pager"></div>
              </div>
               
              <div class="u-btn-group text-center">
                ${bottomBtns}
              </div>
            </div>
            
          </div>
          
        </div>
      `
    },
    itemReviseEditorLayer() {
      return `
        <div id="item-editor-layer" class="item-editor-layer">
          <div class="item-editor-container">
            <div class="item-editor-header">
              <h3>修订</h3>
            </div>
            <div class="item-editor-content" style="height: 560px;">
              <div class="item-container item-revise-container">
                <div id="editor_revise" class="item-editor"></div>
              </div>
            </div>
            <div class="item-editor-bottom">
              <div class="u-btn-group text-center">
                <button type="button" class="btn btn-default hook-cancel-save">取消</button>
                <button type="button" class="btn btn-default hook-delete">删除段</button>
                <button type="button" class="btn btn-success hook-submit">提交</button>
              </div>
            </div>
            
          </div>
          
        </div>
      `
    },
    item({id, itemId, type, content}) {
      return `
      <div id="item_${id}" class="item" data-itemid="${itemId || ''}" data-type="${type}">
        <label class="checkbox" for="checkbox_${id}" data-itemid="${itemId || ''}">
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
              <a href="javascript:;" class="hook-go" data-page="${curPage === 1
        ? '1'
        : (curPage - 1)}" aria-label="Previous">
                <span aria-hidden="true" class="glyphicon glyphicon-triangle-left"></span>
              </a>
            </li>
            ${pagination()}
            <li class="${curPage === total ? 'disabled': ''}">
              <a href="javascript:;" class="hook-go" data-page="${curPage ===
      total ? curPage: (curPage + 1)}" aria-label="Next">
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
