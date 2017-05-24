define(['scripts/editor/editorTpl', 'scripts/urls', 'scripts/fetch', 'scripts/token'],
  (tpl, urls, fetch, token) => {

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

    function ReviseEditor() {
      this.name = 'ReviseEditor'
      this.proId = window.PID
      this.paraCode = ''

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

    ReviseEditor.prototype = {
      constructor: ReviseEditor,
      init() {
        this.$itemEditor = $(tpl.itemEditorLayer('revise'))
        this.$itemContainer = this.$itemEditor.find('.item-list')
        this.$itemPager = this.$itemEditor.find('.item-pager')

        this.$itemEditor.appendTo('body')
        this.bindEvent()
        // this.itemLists(listPage)
      },
      bindEvent() {
        // this.$itemEditor.find('[data-toggle="tooltip"]').tooltip()

        this.$itemEditor
        // 添加段落
          .on('click', '.hook-add-item', () => {
            if (this.arrCheckedItem.length !== 1 &&
              !$.isEmptyObject(this.objItemSet)) {
              alert('请选择一个段落进行添加')
            } else {
              this.addItem(this.arrCheckedItem[0])
            }
          })
          // 删除段落
          .on('click', '.hook-delete-item', () => {
            if (!this.arrCheckedItem.length) {
              alert('请选择要删除的段落')
            } else {
              this.deleteItem()
            }
          })
          // 合并段落
          .on('click', '.hook-coalesce-item', () => {
            if (this.arrCheckedItem.length < 2) {
              alert('请选择要合并的段落')
            } else if (!this.isAdjoin()) {
              alert('请选择相邻的段落')
            } else {
              this.coalesceItem()
            }
          })
          // 取消
          .on('click', '.hook-cancel-save,.hook-prev', () => {
            if (isShowUEditor) {
              alert('请先保存编辑的内容')
              return false
            }
            this.hide()
          })
          // 暂存
          .on('click', '.hook-save', () => {
            if (isShowUEditor) {
              alert('请先保存编辑的内容')
              return false
            }
            fetch.tempSaveRevises({
              "id": window.PID,
              "paraCode": this.paraCode
              // "userId": window.userId,
              // "userName": window.userName
            }).then(message => {
              alert(message)
            })
          })
          // 段落新增段提交
          .on('click', '.hook-submit', () => {
            if (isShowUEditor) {
              alert('请先保存编辑的内容')
              return false
            }
            fetch.saveRevises({
              "id": window.PID,
              "paraCode": this.paraCode
              // "userId": window.userId,
              // "userName": window.userName
            }).then(message => {
              alert(message)
              this.hide()

              $(`[data-paracode=${this.paraCode}]`).find('.hook-add-list').trigger('click')
            })
          })

        this.bindUpload()
        this.bindPager()
      },
      bindUpload() {
        let _this = this
        const uploader = new plupload.Uploader({ //实例化一个plupload上传对象
          browse_button: 'browse',
          container: 'browse-wrapper',
          runtimes : 'html5,flash,silverlight,html4',
          url: urls.revisesFiles,
          flash_swf_url: 'scripts/common/plupload/Moxie.swf',
          silverlight_xap_url: 'scripts/common/plupload/Moxie.xap',
          max_retries: 3,
          multi_selection: false,
          multipart_params: {
            proId: window.PID,
            paraCode: _this.$itemContainer.find('.checkbox.checked:last').closest('.item').data('itemid') || 'end'
          },
          headers: {
            'X-Authorization': token
          },
          filters: {
            mime_types: [
              {title: 'Word file', extensions: 'doc,docx'}
            ],
            max_file_size: '10mb'
          },

          init: {
            FilesAdded(up, files) {
              let paraCode = _this.$itemContainer.find('.checkbox.checked:last').closest('.item').data('itemid') || 'end'
              console.log('file add')
              uploader.setOption('url',  `${urls.revisesFiles}?paraCode=${paraCode}`)

              // 开始上传
              uploader.start()

            },
            UploadProgress(up, file) {
              console.log('upload progress', file.percent)
            },
            UploadComplete(uploader, files) {
              _this.itemLists(listPage)
              console.log('UploadComplete')
            },
            Error(uploader, errObject) {
              console.log('Error')
            },
            OptionChanged(up, name, value, oldValue){
              console.log('OptionChanged', name, value, oldValue)
            }
          }
        })
        uploader.init() //初始化
      },
      bindPager() {
        this.pager = new Pager({
          $pager: this.$itemPager
        })

        $(this.pager).on('pager', (e, page) => {
          if (isShowUEditor) {
            alert('请先保存编辑的内容')
            return false
          }
          this.itemLists(page)
        })
      },
      show(paraCode) {
        this.paraCode = paraCode
        // this.addItem()
        this.$itemEditor.fadeIn(100)
        this.itemLists(listPage)
      },
      hide() {
        this.$itemEditor.hide()
        this.clean()
      },
      clean() {
        isShowUEditor = false
        listPage = 1

        this.$itemContainer.empty()
        this.$itemPager.empty()

        this.objItemSet = {}
        // 选中段落
        this.arrCheckedItem = []
      },
      isAdjoin() {
        let adjoin = true
        const checkedItem = this.$itemContainer.find('.item')
          .filter(function () {
            return $(this).find('.checkbox').hasClass('checked')
          })

        checkedItem.each(function (i) {
          if (i === checkedItem.length - 1) {
            return false
          }
          if (!$(this).next().find('.checkbox').hasClass('checked')) {
            adjoin = false
            return adjoin
          }
        })
        return adjoin
        console.log('adjoin: ', adjoin)
        console.log('item: ', checkedItem)
      },
      // 添加段落
      addItem(targetId = '') {
        const item = new Item({
          paraCode: this.paraCode,
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
        fetch.deleteRevise({
          proId: this.proId,
          paraCode: this.paraCode,
          reviseIds: this.arrCheckedItem.join(','),
          // userId: window.userId,
          page: listPage
        }).then(data => {
          this.arrCheckedItem.length = 0
          this.showPager(data)
          this.renderItem(data)
        })

      },
      // 合并段落
      coalesceItem() {
        let arr = []

        $('.item .checked').map(function(){
          arr.push($(this).data('itemid'))
        })
        fetch.coalesceRevise({
          id: this.proId,
          // userId: window.userId,
          paraCode: this.paraCode,
          reviseIds: arr,
          page: listPage
        }).then(data => {
          this.arrCheckedItem.length = 0
          this.showPager(data)
          this.renderItem(data)
        })
      },
      // 导入段落
      importItem() {
        this.itemLists(listPage)
      },
      // 段落列表
      itemLists(page = 1) {
        listPage = page
        fetch.tempReviseList({
          proId: window.PID,
          // userId: window.userId,
          paraCode: this.paraCode,
          page
        }).then(data => {
          this.showPager(data)
          this.renderItem(data)
        })
      },
      renderItem({sliceList}) {
        if (!sliceList) {
          return false;
        }
        this.$itemContainer.empty()
        this.objItemSet = {}
        this.arrCheckedItem.length = 0
        sliceList.forEach(slice => {
          const item = new Item({
            objItemSet: this.objItemSet,
            arrCheckedItem: this.arrCheckedItem,
            paraCode: this.paraCode,
            $box: this.$itemContainer,
            type: 'edit',
            itemId: slice.id,
            content: slice.content
          })
          this.objItemSet[item.itemId] = item
          this.pushItem(item)
        })
      },
      // 分页
      showPager({from, size, count}) {
        this.pager.renderPage({curPage: from, limit: size, count})
      },
      // 提交
      submit() {},
      pushItem(item) {
        $(item).on('item.check', (checked) => {})
        $(item).on('item.add', () => {
          console.log('添加成功')
          if (!!this.arrCheckedItem.length) {
            this.arrCheckedItem.forEach((itemid) => {
              let item = this.objItemSet[itemid]
              item.checkItem(false)
              item.$item.find('.hook-item-checkbox').prop('checked', false)
            })
          }
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

      this.paraCode = ''
      this.targetId = ''
      this.itemId = ''
      this.type = 'create'
      this.proId = window.PID || 0
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
              this.addItem()
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
      addItem() {
        fetch.addRevises({
          id: this.proId,
          paraCode: this.paraCode,
          reviseId: this.targetId,
          content: this.content,
          page: listPage
        }).then(data => {
          this.type = 'edit'
          this.itemId = data.reviseId
          this.$item.data('type', this.type)
          this.$item.data('itemid', this.itemId)
          this.$item.find('.checkbox').data('itemid', this.itemId)
          this.$itemInner.html(this.content)
          this.objItemSet[this.itemId] = this
          this.showInner()
          setUEditorStatus(false)
          $(this).trigger('item.add')
          this.checkItem(true)
          this.$item.find('.hook-item-checkbox').prop('checked', true)
        })
      },
      updateItem() {
        fetch.updateRevises({
          id: this.proId,
          paraCode: this.paraCode,
          reviseId: this.itemId,
          content: this.content
        }).then(data => {
          console.log(data)
          this.$itemInner.html(this.content)
          this.showInner()
          setUEditorStatus(false)
          this.checkItem(true)
          this.$item.find('.hook-item-checkbox').prop('checked', true)
        })
      },
      cancelSave() {
        if (this.type === 'create') {
          // 段落集合大于一段以上，可以销毁当前段落，防止编辑页空白无数据
          // if (Object.keys(this.objItemSet).length) {
            setUEditorStatus(false)
            this.destroy()
          // }
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

        this.checked = checked
        if (checked) {
          $label.addClass('checked')
          this.arrCheckedItem.push(this.itemId)
        } else {
          $label.removeClass('checked')

          arrDelete(this.arrCheckedItem, this.itemId)
        }
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

    return ReviseEditor
  })
