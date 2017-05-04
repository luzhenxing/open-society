define(['scripts/editor/editorTpl', 'scripts/common/plupload/plupload', 'scripts/fetch'],
  (tpl, plupload, fetch) => {

    let isShowUEditor = false,
      listPage = 1

    const UEDITOR_MIN_HEIGHT = 100,
      renderDom = (obj, $target, type = 'append') => {
        $target[type](obj)
      },
      setUEditorStatus = (status) => {
        isShowUEditor = status
        $('.item-button-group .btn').prop('disabled', status)
      },
      arrDelete = (arr, index) => {
        const _index = arr.indexOf(index)
        if (_index !== -1) {
          arr.splice(_index, 1)
        }
      },
      generateRandomAlphaNum = (len) => {
        let rdmString = ''
        for (; rdmString.length < len; rdmString += Math.random()
          .toString(36)
          .substr(2));
        return rdmString.substr(0, len)
      }

    function ItemEditor() {
      this.name = 'ItemEditor'
      // 编辑页对象
      this.$itemEditor = null
      this.$itemContainer = null
      this.$itemPager = null

      this.pager = null

      this.objItemSet = {}

      // 选中段落
      this.arrCheckedItem = []
      this.init()
    }

    ItemEditor.prototype = {
      constructor: ItemEditor,
      init() {
        this.$itemEditor = $(tpl.itemEditorLayer())
        this.$itemContainer = this.$itemEditor.find('.item-list')
        this.$itemPager = this.$itemEditor.find('.item-pager')

        this.$itemEditor.appendTo('body')
        this.bindEvent()
        // this.addItem()
        this.itemLists(listPage)
      },
      bindEvent() {
        this.$itemEditor.find('[data-toggle="tooltip"]').tooltip()

        this.$itemEditor
          .on('click', '.hook-add-item', () => {
            if (this.arrCheckedItem.length !== 1 &&
              !$.isEmptyObject(this.objItemSet)) {
              alert('请选择一个段落进行添加')
            } else {
              this.addItem(this.arrCheckedItem[0])
            }

          })
          .on('click', '.hook-delete-item', () => {
            if (!this.arrCheckedItem.length) {
              alert('请选择要删除的段落')
            } else {
              this.deleteItem()
            }
          })
          .on('click', '.hook-coalesce-item', () => {
            if (this.arrCheckedItem.length < 2) {
              alert('请选择要合并的段落')
            } else if (! this.isAdjoin()) {
              alert('请选择相邻的段落')
            } else {
              this.coalesceItem()
            }
          })
          .on('click', '.hook-import-item', () => {
            // if (this.arrCheckedItem.length !== 1 &&
            //   !$.isEmptyObject(this.objItemSet)) {
            //   alert('请选择一个段落进行导入')
            // } else {
            this.importItem()
            // }
          })
          .on('click', '.hook-cancel-save', this.hide.bind(this))

        // this.bindUpload()
        this.bindPager()
      },
      bindUpload() {
        const uploader = new plupload.Uploader({ //实例化一个plupload上传对象
          browse_button: 'browse',
          url: 'upload.html',
          flash_swf_url: 'scripts/common/plupload/Moxie.swf',
          silverlight_xap_url: 'scripts/common/plupload/Moxie.xap',
          max_retries: 3,
          multi_selection: false,
          filters: {
            mime_types: [
              {title: 'Word file', extensions: 'doc,docx'}
            ],
            max_file_size: '4mb'
          }
        })
        uploader.init() //初始化

        uploader.bind('FilesAdded', (uploader, files) => {
          console.log(files)
          console.log('file add')
          // 开始上传
          // uploader.start()
        })
        uploader.bind('BeforeUpload', (uploader, file) => {
          console.log('upload before')
        })
      },
      bindPager() {
        this.pager = new Pager({
          $pager: this.$itemPager
        })

        $(this.pager).on('pager', (e, page) => {
          this.itemLists(page)
        })
      },
      show() {
        this.$itemEditor.fadeIn(100)
      },
      hide() {
        this.$itemEditor.hide()
      },
      isAdjoin() {
        let adjoin = true
        const checkedItem = this.$itemContainer.find('.item').filter(function() {
            return $(this).find('.checkbox').hasClass('checked')
        })

        checkedItem.each(function(i) {
          if (i === checkedItem.length - 1) {
            return false
          }
          if (! $(this).next().find('.checkbox').hasClass('checked')) {
            adjoin = false
            return adjoin
          }
        })
        return adjoin
        console.log('adjoin: ', adjoin)
        console.log('item: ' , checkedItem)
      },
      // 添加段落
      addItem(targetId = '') {
        const item = new Item({
          objItemSet: this.objItemSet,
          arrCheckedItem: this.arrCheckedItem,
          $box: this.$itemContainer,
          type: 'create',
          targetId
        })
        this.pushItem(item)
      },
      // 删除段落
      deleteItem() {
        // this.arrCheckedItem.forEach(id => {
        //   console.log(id)
        //   this.objItemSet[id].ueditor = null
        //   this.objItemSet[id].$item.remove()
        //   delete this.objItemSet[id]
        // })
        // this.arrCheckedItem.length = 0
        this.arrCheckedItem.forEach(itemId => {

        })
        console.log(this.arrCheckedItem)
        console.log(this.objItemSet)

      },
      // 合并段落
      coalesceItem() {
        console.log(this.arrCheckedItem)
      },
      // 导入段落
      importItem() {
        this.itemLists(listPage)
      },
      // 段落列表
      itemLists(page = 1) {
        listPage = page
        fetch.itemList({
          page
        }).then(data => {
          this.showPager(data)
          this.renderItem(data)
        })
      },
      renderItem({sliceList}) {
        this.$itemContainer.empty()
        this.objItemSet = {}
        this.arrCheckedItem.length = 0
        sliceList.forEach(slice => {
          const item = new Item({
            objItemSet: this.objItemSet,
            arrCheckedItem: this.arrCheckedItem,
            $box: this.$itemContainer,
            type: 'edit',
            itemId: slice.id,
            content: slice.content
          })
          this.objItemSet[item.itemId] = item
        })
      },
      // 分页
      showPager({from, size, count}) {
        this.pager.renderPage({curPage: from, limit: size, count})
      },
      // 提交
      submit() {},
      pushItem(item) {
        $(item).on('item.check', (checked) => {

        })
      }
    }

    // 段落对象
    function Item(opts = {}) {
      this.id = generateRandomAlphaNum(8)
      this.$box = 'body'
      this.$item = null
      this.$editorWrap = null
      this.$itemInner = null

      // 由父级传递 纪录item集合，选中的item
      this.objItemSet = null
      this.arrCheckedItem = null

      this.targetId = ''
      this.itemId = ''
      this.type = 'create'
      this.proId = window.proId || 0
      this.content = ''
      this.ueditor = null
      this.checked = false

      $.extend(this, opts)
      this.init()
    }

    Item.prototype = {
      init() {
        const item = tpl.item({
          id: this.id,
          type: this.type,
          itemId: this.itemId,
          proId: this.proId,
          content: this.content
        })
        this.$item = $(item)
        this.$editorWrap = this.$item.find('.item-editor-wrap')
        this.$itemInner = this.$item.find('.item-inner')

        this.bindEvent()

        console.log(this.targetId)
        if (this.targetId !== '') {
          renderDom(this.$item, this.objItemSet[this.targetId].$item, 'after')
        } else {
          renderDom(this.$item, this.$box)
        }

        // this.objItemSet[this.id] = this
        switch (this.type) {
          case 'create':
            this.initEditor()
            this.showEditor()
        }
      },
      bindEvent() {
        const _this = this
        this.$item
        // 勾选段落
          .on('change', '.hook-item-checkbox', function () {
            if (isShowUEditor) {
              return false
            }
            _this.checkItem(this.checked)
          })
          // 点击内容显示编辑器
          .on('click', '.item-inner', () => {
            if (isShowUEditor) {
              return false
            }
            if (this.ueditor) {
              this.setContent(this.content)
              // this.setUEditorHeight()
            } else {
              this.initEditor()
            }
            this.showEditor()
          })
          // 保存内容
          .on('click', '.hook-editor-save', () => {
            this.content = this.getContent()
            // 没有itemId为新增
            if (this.itemId === '') {
              this.saveItem()
            } else {
              this.updateItem()
            }
          })
          // 取消保存
          .on('click', '.hook-editor-cancel', this.cancelSave.bind(this))
      },
      initEditor() {
        const height = Math.max(UEDITOR_MIN_HEIGHT, this.$item.height())
        this.ueditor = UE.getEditor(`editor_${this.id}`, {
          initialFrameHeight: height,
          initialContent: this.content
        })

        this.ueditor.addListener('contentchange', () => {
          this.$item.find('.hook-editor-save')
            .prop('disabled', this.isContentEmpty())
        })
      },
      // 获取内容
      getContent(){
        return this.ueditor.getContent()
      },
      // 设置内容
      setContent(cont){
        this.ueditor.setContent(cont)
      },
      // 内容是否为空
      isContentEmpty(){
        return this.ueditor.getContentTxt().trim() === ''
      },
      // 设置高度
      setUEditorHeight(){
        const height = Math.max(UEDITOR_MIN_HEIGHT, this.$item.height())
        this.ueditor.setHeight(height)
      },
      showEditor() {
        setUEditorStatus(true)
        this.$editorWrap.show()
        this.$itemInner.hide()
      },
      showInner() {
        setUEditorStatus(false)
        this.$editorWrap.hide()
        this.$itemInner.show()
      },
      saveItem() {
        fetch.saveItem({
          paraCode: this.targetId,
          content: this.content,
          page: listPage
        }).then(data => {
          console.log(data)
          this.type = 'edit'
          this.itemId = data.id
          this.$item.data('type', this.type)
          this.$itemInner.html(this.content)
          this.objItemSet[this.itemId] = this
          this.showInner()
          setUEditorStatus(false)
          console.log(this.objItemSet)
        })
      },
      updateItem() {
        fetch.updateItem({
          paraCode: this.itemId,
          content: this.content
        }).then(data => {
          console.log(data)
          this.$itemInner.html(this.content)
          this.showInner()
          setUEditorStatus(false)
        })
      },
      cancelSave() {
        if (this.type === 'create') {
          // 段落集合大于一段以上，可以销毁当前段落，防止编辑页空白无数据
          if (Object.keys(this.objItemSet).length) {
            setUEditorStatus(false)
            this.destroy()
          }
        } else {
          setUEditorStatus(false)
          this.showInner()
        }
      },
      // 销毁段落对象
      destroy() {
        this.ueditor = null
        this.$item.remove()

        arrDelete(this.arrCheckedItem, this.itemId)
      },
      checkItem(checked) {
        const $label = this.$item.find('.checkbox')

        if (checked) {
          $label.addClass('checked')
          this.arrCheckedItem.push(this.itemId)
        } else {
          $label.removeClass('checked')

          arrDelete(this.arrCheckedItem, this.itemId)
        }
        this.checked = checked
        console.log(this.arrCheckedItem)
        $(this).trigger('item.check', [checked])
      }
    }

    function Pager({$pager}) {
      this.$pager = $pager

      this.init()
    }

    // 分页对象
    Pager.prototype = {
      init() {
        this.bindEvent()
      },
      bindEvent() {
        const _this = this
        this.$pager
          .on('click', 'li:not(.disabled,.active) > .hook-go', function () {
            $(_this).trigger('pager', [$(this).data('page')])
          })
          .on('click', '.hook-btn-go', () => {
            let page = parseInt(this.$pager.find('.hook-page-text').val())
            if (!window.isNaN(page) && (page > 0 && page <= this.total)) {
              $(_this).trigger('pager', [page])
            }
          })
      },
      renderPage({curPage, limit, count}) {
        const total = Math.ceil(count / limit)
        this.total = total
        if (total === 1) {
          // 只有一页无需翻页
          this.$pager.hide()
          return false
        }

        const pager = tpl.pager({total, curPage})
        this.$pager.show().html(pager)
      }
    }

    return ItemEditor
  })
