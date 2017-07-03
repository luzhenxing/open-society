// 修订 编辑器
define(['scripts/editor/editorTpl', 'scripts/fetch', 'scripts/tips'],
  (tpl, fetch, tips) => {
    function ItemReviseEditor() {
      this.name = 'ReviseEditor'
      this.proId = window.PID
      this.paraCode = ''

      this.$detailItem = null
      this.$itemEditor = null
      this.ueditor = null

      this.initContent = ''

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
            // console.log(this.$detailItem.data('revise-count'))
            let $btn = this.$itemEditor.find('.hook-delete');
            $btn.prop('disabled', true)
            fetch.deleteParagraphRevises({
              proId: this.proId,
              paraCode: this.paraCode
            }).then(message => {
              $btn.prop('disabled', false)
              tips.show(message)

              this.$detailItem.data('revise-count', parseInt(this.$detailItem.data('revise-count')) + 1)
              let $list = this.$detailItem.find('.hook-revise-list')

              $list.find('span').text(`( ${parseInt(this.$detailItem.data('revise-count'))} )`)

              $list.trigger('click')
              this.hide()
            }, () => {
              $btn.prop('disabled', false)
            })
          })
          .on('click', '.hook-submit', () => {
            let content = this.ueditor.getContent()

            if (content === this.initContent) {
              tips.show({
                type: 'warning',
                content: '请对内容进行修改后提交'
              })
              return false
            }
            let $btn = this.$itemEditor.find('.hook-submit');
            $btn.prop('disabled', true)
            fetch.saveParagraphRevises({
              id: this.proId,
              paraCode: this.paraCode,
              content
            }).then(message => {
              $btn.prop('disabled', false)
              tips.show(message)

              this.$detailItem.data('revise-count', parseInt(this.$detailItem.data('revise-count')) + 1)

              let $list = this.$detailItem.find('.hook-revise-list')

              $list.find('span').text(`( ${parseInt(this.$detailItem.data('revise-count'))} )`)

              $list.trigger('click')
              this.hide()
            }, () => {
              $btn.prop('disabled', false)
            })
          })
      },
      show(paraCode, content) {
        this.$detailItem = $(`.detail-item[data-paracode=${paraCode}]`)
        this.paraCode = paraCode

        // this.addItem()

        this.ueditor.setContent(content)
        this.initContent = this.ueditor.getContent()
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
