define(['scripts/editor/editorTpl', 'scripts/fetch', 'scripts/tips'],
  (tpl, fetch, tips) => {
    function ItemReviseEditor() {
      this.name = 'ReviseEditor'
      this.proId = window.PID
      this.paraCode = ''

      this.$detailItem = null
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
            console.log(this.$detailItem.data('revise-count'))
            fetch.deleteParagraphRevises({
              proId: this.proId,
              paraCode: this.paraCode
            }).then(message => {
              tips.show(message)

              this.$detailItem.data('revise-count', parseInt(this.$detailItem.data('revise-count')) + 1)

              this.$detailItem
                .find('.hook-revise-list')
                .trigger('click')
              this.hide()
            })
          })
          .on('click', '.hook-submit', () => {
            fetch.saveParagraphRevises({
              id: this.proId,
              paraCode: this.paraCode,
              content: this.ueditor.getContent()
            }).then(message => {
              tips.show(message)

              this.$detailItem.data('revise-count', parseInt(this.$detailItem.data('revise-count')) + 1)

              this.$detailItem
                .find('.hook-revise-list')
                .trigger('click')
              this.hide()
            })
          })
      },
      show(paraCode, content) {
        this.$detailItem = $(`.detail-item[data-paracode=${paraCode}]`)
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
