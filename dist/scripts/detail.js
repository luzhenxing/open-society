'use strict';

requirejs(['scripts/editor/ReviseEditor', 'scripts/editor/ItemReviseEditor', 'scripts/ReviseLayer'], function (ReviseEditor, ItemReviseEditor, ReviseLayer) {
  var $foldUp = $('.fold-up'),
      $foldDown = $('.fold-down'),
      reviseEditor = new ReviseEditor(),
      itemReviseEditor = new ItemReviseEditor(),
      reviseLayer = new ReviseLayer();

  $foldUp.on('click', function () {
    $('.hook-fold').addClass('hidden');
    $foldUp.addClass('hidden');
    $foldDown.removeClass('hidden');
  });

  $foldDown.on('click', function () {
    $('.hook-fold').removeClass('hidden');
    $foldUp.removeClass('hidden');
    $foldDown.addClass('hidden');
  });

  var addItemActive = function addItemActive($item) {
    if ($item.hasClass('current')) {
      return false;
    }
    $item.addClass('current').siblings().removeClass('current');
  };

  $('.detail-article').on('click', '.detail-item', function () {
    addItemActive($(this));
  })
  // 点击段落显示操作
  // add & revise
  .on('click', '.detail-item-inner', function () {
    var $item = $(this).closest('.detail-item'),
        paraCode = $item.data('paracode'),
        addCount = parseInt($item.data('add-count')) || 0,
        reviseCount = parseInt($item.data('revise-count')) || 0;

    if (addCount == 0 && reviseCount == 0) {
      $item.find('.detail-item-oper .oper').show();
    } else {
      reviseLayer.$sourceDom = $item;
      reviseLayer.paraCode = paraCode;
      reviseLayer.addCount = addCount;
      reviseLayer.reviseCount = reviseCount;
      if (reviseCount != 0) {
        reviseLayer.show('revise');
      } else if (addCount != 0) {
        reviseLayer.show('add');
      }
    }
  })
  // 添加
  .on('click', '.hook-add', function (e) {
    var $item = $(this).closest('.detail-item'),
        paraCode = $item.data('paracode');
    reviseEditor.show(paraCode);
  })
  // 修订
  .on('click', '.hook-revise', function () {
    var $item = $(this).closest('.detail-item'),
        paraCode = $item.data('paracode'),
        content = $item.find('.detail-item-inner').html();

    itemReviseEditor.show(paraCode, content);
  })
  // 添加列表 & 修订列表
  .on('click', '.hook-add-list,.hook-revise-list', function () {
    var type = $(this).data('type'),
        $item = $(this).closest('.detail-item'),
        paraCode = $item.data('paracode'),
        addCount = $item.data('add-count') || 0,
        reviseCount = $item.data('revise-count') || 0;

    if (type == 'add' && addCount == 0 || type == 'revise' && reviseCount == 0) {
      return false;
    }

    reviseLayer.$sourceDom = $item;
    reviseLayer.paraCode = paraCode;
    reviseLayer.addCount = addCount;
    reviseLayer.reviseCount = reviseCount;
    reviseLayer.show(type);
  });
});