'use strict';

// 行业分类联动
define(['scripts/fetch'], function (fetch) {
  var $cate1 = $('#firstClassId'),
      $cate2 = $('#secondClassId');

  var renderCategory = function renderCategory($cate, fetch_type, key) {
    return fetch[fetch_type](key).then(function (data) {
      $cate.html(tpl(data));
    });
  };

  var tpl = function tpl(datas) {
    var inner = '';
    datas.forEach(function (item) {
      inner += '<option value="' + item.id + '">' + item.className + '</option>';
    });

    return inner;
  };

  $cate1.on('change', function () {
    var key = this.value;
    renderCategory($cate2, 'getCate2', key);
  });

  renderCategory($cate1, 'getCate1').then(function () {
    if (!!window.firstClassId) {
      $cate1.val(window.firstClassId);
    }
    renderCategory($cate2, 'getCate2', $cate1.val()).then(function () {
      if (!!window.secondClassId) {
        $cate2.val(window.secondClassId);
      }
    });
  });
});