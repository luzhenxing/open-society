define(['scripts/UEditor'], (UEditor) => {
  // 当前段落id集合
  let itemIds = {},
    checkedItem = {},
    editorShow = false

  function ItemUeditor() {
    this.$layer = null
  }

  ItemUeditor.prototype = {
    // 获取编辑弹层
    getLayer(){
      if (!this.$layer) {
        let tpl = template('tpl-item-ueditor-layer', {})
        this.$layer = $(tpl)
        $('body').append(this.$layer)

        this.bindEvent()
      }
    },
    // 绑定事件
    bindEvent(){
      // 添加段落
      this.$layer.on('click', '#ueditor-btn-add', () => {
        this.addItem()
      })
      // 删除段落
        .on('click', '#ueditor-btn-delete', () => {
          this.deleteItem()
        })
        // 导入文档
        .on('click', '#ueditor-btn-import', () => {
          this.importItem()
        })
        // 取消
        .on('click', '#ueditor-btn-cancel', () => {
          this.hide()
        })
        // 点击内容显示编辑器
        .on('click', '.item-inner', function () {
          if (editorShow) {
            return
          }
          editorShow = true
          let $obj = $(this).closest('li'),
            editor = $obj.data('editor')
          if (editor === undefined) {
            editor = new UEditor($obj, $(this).html())
            $obj.data('editor', editor)
            $(editor).on('destroy', () => {
              $obj.data('editor', undefined)
            })
              // .on('hide', () => {
              //   editorShow = false
              // })
          } else {
            editor.setContent($(this).html())
            editor.show()
          }
          // this.setContent(this.inner.html())
          // this.show()
        })
        // checkbox
        .on('change', '.hook-item-checkbox', function () {
          let $label = $(this).closest('label.checkbox'),
            $li = $label.closest('li'),
            id = $li.data('id')
          if (this.checked) {
            $label.addClass('checked')
            checkedItem[id] = $li
          } else {
            $label.removeClass('checked')
            delete checkedItem[id]
          }
        })
    },
    // 显示弹层
    show(){
      this.getLayer()
      this.$layer.show().addClass('fadeIn')
    },
    // 隐藏弹层
    hide(){
      this.$layer.hide()
    },
    // 创建item
    createItem(){
      let $li = $(this.getItemListTpl({id: Date.now(), type: 'create'}))
      this.$layer.find('.item-list').prepend($li)
      return $li
    },
    // 添加段落
    addItem(){
      let $obj = this.createItem()
      let editor = new UEditor($obj)
      $obj.data('editor', editor)
      $(editor).on('destroy', () => {
        $obj.data('editor', null)
      })
    },
    // 获取段落dom模版
    getItemListTpl(data){
      return template('tpl-item-list', data)
    },
    // 渲染一个编辑器
    renderUEditor($li){
      console.log($li)
      let height = Math.max($li.height(), UEDITOR_MIN_HEIGHT)
      let ueditorDom = $li.find('.item-ueditor').get(0)
      let content = ''
      if ($li.data('type') === 'edit') {
        content = $li.find('.item-inner').html()
      }
      UEditor.renderUEditor(ueditorDom, height, content)
      $li.find('.item-inner').hide()
    },
    disabledAddBtn(id, type) {
      $(`#${id}`).prop('disabled', type)
    },
    deleteItem(){
      for (let id in checkedItem) {
        $(`#item_${id}`).data('editor', null)
        $(`#item_${id}`).remove()
        delete checkedItem[id]
      }
    },
    importItem(){
      var id = 857414922369949700
      $.getJSON('json/item-list.json').then(result => {
        // $.getJSON(`http://192.168.1.175:8080/api/v1/projects/${id}/paragraphs/`,{
        //   page: 5,
        //   perPageNo: 20
        // }).then(result => {
        console.log(result)
        this.renderItems(result.datas.sliceList)
      })

    },
    renderItems(data){
      let tpl = ''
      data.forEach(item => {
        tpl += this.getItemListTpl($.extend(item, {type: 'edit'}))
      })
      this.$layer.find('.item-list').html(tpl)
    }
  }

  const itemUeditor = new ItemUeditor()

  return {
    setOptions(ops = {}){
      $.extend(itemUeditor, ops)
    },
    show(command = ''){
      itemUeditor.show()
      switch (command) {
        case 'create':
          itemUeditor.addItem()

          break
      }
    },
    hide(){
      itemUeditor.hide()
    }
  }
})
