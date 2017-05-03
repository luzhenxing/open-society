requirejs(['scripts/create-form',
  'scripts/editor/ItemEditor',
  'scripts/fetch',
  'scripts/select-category'], (form, ItemEditor, fetch) => {

  let itemEditor = new ItemEditor()
  // 暂存
  $('#btn-save').on('click', () => {
    form.getFormData().then(data => {
      console.log(data)
      return fetch.tempSaveProject(data)
    }).then(data => {
      console.log(data)
    })
  })

  // 下一步
  $('#btn-next').on('click', () => {
    form.getFormData().then(data => {
      console.log(data)
      itemEditor.show()
    })
  })

  // itemEditor.show()
})
