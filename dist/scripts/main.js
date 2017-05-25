'use strict';

requirejs(['scripts/create-form', 'scripts/editor/ItemEditor', 'scripts/fetch', 'scripts/tips', 'scripts/select-category'], function (form, ItemEditor, fetch, tips) {

  // 暂存
  $('#btn-save').on('click', function () {
    form.getFormData().then(fetch.tempSaveProject).then(function (message) {
      tips.show(message);
    });
  });

  // 下一步
  $('#btn-next').on('click', function () {
    form.getFormData().then(function (data) {
      window.PROJECT_DATA = data;
      if (!window.itemEditor) {
        window.itemEditor = new ItemEditor();
      }
      itemEditor.show();
    });
  });
});