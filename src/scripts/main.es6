requirejs(['scripts/create-form',
  'scripts/editor/ItemEditor',
  'scripts/fetch',
  'scripts/tips',
  'scripts/select-category'], (form, ItemEditor, fetch, tips) => {

  // 暂存
  $('#btn-save').on('click', () => {
    form.getFormData()
      .then(fetch.tempSaveProject)
      .then(message => {
        tips.show(message)
      })
  })

  // 下一步
  $('#btn-next').on('click', () => {
    form.getFormData().then(data => {
      window.PROJECT_DATA = data
      if (! window.itemEditor) {
        window.itemEditor = new ItemEditor()
      }
      itemEditor.show()
    })
  })
})
