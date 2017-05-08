'use strict';

requirejs(['scripts/create-form', 'scripts/editor/ItemEditor', 'scripts/fetch', 'scripts/select-category'], function (form, ItemEditor, fetch) {

  // 暂存
  $('#btn-save').on('click', function () {
    form.getFormData().then(function (data) {
      return fetch.tempSaveProject(data);
    }).then(function (message) {
      alert(message);
    });
  });

  // 下一步
  $('#btn-next').on('click', function () {
    form.getFormData().then(function (data) {
      window.PROJECT_DATA = data;
      var itemEditor = new ItemEditor();
      itemEditor.show();
    });
  });

  // itemEditor.show()
});