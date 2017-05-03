define(() => {
  const UEDITOR_MIN_HEIGHT = 100
  // 编辑器类
  function UEditor($box, content = '') {
    this.box = $box
    this.id = $box.data('id')
    this.type = $box.data('type') // create & edit
    this.wrap = $box.find('.item-ueditor-wrap')
    this.inner = $box.find('.item-inner')
    this.ueitor = null
    this.content = content
    this.init()
  }

  UEditor.prototype = {
    // 初始化编辑器
    init(){
      this.wrap.html(`
        <div id="ueditor_${this.id}" class="item-ueditor"></div>
        <div class="ueditor-btn-group">
          <button class="btn btn-default btn-xs hook-ueditor-cancel">取消</button>
          <button class="btn btn-success btn-xs hook-ueditor-save" disabled>保存</button>
        </div>
      `)

      let height = Math.max(this.box.height(), UEDITOR_MIN_HEIGHT)
      this.ueditor = UE.getEditor(`ueditor_${this.id}`, {
        initialFrameHeight: height,
        initialContent: this.content
      })
      this.bindEvent()
      console.log(this.ueditor)
      this.show()

    },
    // 绑定事件
    bindEvent(){
      let _this = this
      this.wrap.on('click', '.hook-ueditor-save', () => {
        if (this.isContentEmpty()) {
          this.wrap.find('.hook-ueditor-save').prop('disabled', true)
          return
        }
        this.box.data('type', 'edit')
        this.inner.html(_this.getContent())
        this.hide()
        $(this).trigger('save')
      })
        .on('click', '.hook-ueditor-cancel', () => {
          this.hide()
          if (this.box.data('type') === 'create') {
            // 如果创建时取消则销毁段落
            this.box.remove()
            $(this).trigger('destroy')
          }
        })

      this.ueditor.addListener('contentchange', () => {
        this.wrap.find('.hook-ueditor-save')
          .prop('disabled', this.isContentEmpty())
      })
    },
    // 显示编辑器
    show(){
      $('.item-button-group .btn').prop('disabled', true)
      this.wrap.show()
      this.inner.hide()
    },
    // 隐藏编辑器
    hide(){
      $('.item-button-group .btn').prop('disabled', false)
      this.wrap.hide()
      this.inner.show()
      $(this).trigger('hide')
    },
    // 保存内容
    save(){},
    // 取消保存
    cancel(){},
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
    setHeight(h){
      this.ueditor.setHeight(h)
    }
  }
  return UEditor
  // return {
  //   editorCache: {},
  //   // 创建编辑器
  //   renderUEditor(dom, height, content){
  //     let id = dom.id;
  //     if (! this.editorCache.hasOwnProperty(id)) {
  //       this.createUEditor(id, height, content);
  //     } else {
  //       this.editorCache[id].setHeight(height);
  //       this.editorCache[id].setShow();
  //       this.editorCache[id].setContent(content);
  //     }
  //   },
  //   createUEditor(id, height, content){
  //     console.log(id, height, content)
  //     this.editorCache[id] = UE.getEditor(id, {
  //       initialContent: content,
  //       initialFrameHeight: height
  //     })
  //   }
  // }
})
