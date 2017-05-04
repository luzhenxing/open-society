'use strict';

requirejs(['scripts/create-form', 'scripts/editor/ItemEditor', 'scripts/fetch', 'scripts/select-category'], function (form, ItemEditor, fetch) {

  var itemEditor = new ItemEditor();
  // 暂存
  $('#btn-save').on('click', function () {
    form.getFormData().then(function (data) {
      console.log(data);
      return fetch.tempSaveProject(data);
    }).then(function (data) {
      console.log(data);
    });
  });

  // 下一步
  $('#btn-next').on('click', function () {
    form.getFormData().then(function (data) {
      console.log(data);
      itemEditor.show();
    });
  });

  // itemEditor.show()
});