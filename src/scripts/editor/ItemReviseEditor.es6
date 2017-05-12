define(['scripts/editor/editorTpl', 'scripts/fetch'],
  (tpl, fetch) => {
  function ItemReviseEditor() {this.name = 'ReviseEditor'
    this.proId = window.PID
    this.paraCode = ''

    this.$itemEditor = null

    this.init()
  }
  ItemReviseEditor.prototype = {
    constructor: ItemReviseEditor,
    init(){
      this.$itemEditor = $(tpl.itemReviseEditorLayer())

      this.$itemEditor.appendTo('body')
      this.bindEvent()
    },
    bindEvent(){}
  }

  return ItemReviseEditor
  })
