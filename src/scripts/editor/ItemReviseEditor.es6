define(['scripts/editor/editorTpl', 'scripts/fetch'],
  (tpl, fetch) => {
  function ItemReviseEditor() {this.name = 'ReviseEditor'
    this.proId = window.PID
    this.paraCode = ''

    this.$itemEditor = null
    this.ueditor = null

    this.init()
  }
  ItemReviseEditor.prototype = {
    constructor: ItemReviseEditor,
    init(){
      this.$itemEditor = $(tpl.itemReviseEditorLayer())

      this.$itemEditor.appendTo('body')
      this.bindEvent()
    },
    bindEvent(){
      this.ueditor = UE.getEditor('editor_revise', {
        initialFrameHeight: 460
      })

      this.$itemEditor.on('click', '.hook-cancel-save', () => {
        this.hide()
      })
        .on('click', '.hook-delete', () => {
          fetch.deleteParagraphRevises({
            proId: this.proId,
            paraCode: this.paraCode
          }).then(message => {
            alert(message)
            this.hide()
          })
        })
        .on('click', '.hook-submit', () => {
          fetch.saveParagraphRevises({
            id: this.proId,
            paraCode: this.paraCode,
            content: this.ueditor.getContent()
          }).then(message => {
            alert(message)
            this.hide()
          })
        })
    },
    show(paraCode, content) {
      this.paraCode = paraCode
      // this.addItem()
      this.ueditor.setContent(content)
      this.$itemEditor.fadeIn(100)
      // this.itemLists(listPage)
    },
    hide(){
      this.$itemEditor.hide()
      this.paraCode = ''
      this.ueditor.setContent('')
    }
  }

  return ItemReviseEditor
  })
