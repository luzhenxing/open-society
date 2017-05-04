'use strict';

// 行业分类联动
define(['scripts/fetch'], function (fetch) {
  var $cate1 = $('#firstClassId'),
      $cate2 = $('#secondClassId');

  var renderCategory = function renderCategory($cate, fetch_type, key) {
    return fetch[fetch_type](key).then(function (data) {
      $cate.html(template('tpl-select-option', data));
    });
  };

  $cate1.on('change', function () {
    var key = this.value;
    renderCategory($cate2, 'getCate2', key);
  });

  renderCategory($cate1, 'getCate1').then(function () {
    renderCategory($cate2, 'getCate2', $cate1.val());
  });
});