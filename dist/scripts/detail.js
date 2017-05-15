'use strict';

requirejs(['scripts/editor/ReviseEditor', 'scripts/editor/ItemReviseEditor', 'scripts/fetch'], function (ReviseEditor, ItemReviseEditor, fetch) {
  var $foldUp = $('.fold-up'),
      $foldDown = $('.fold-down'),
      reviseEditor = new ReviseEditor(),
      itemReviseEditor = new ItemReviseEditor();

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

  $('.detail-aside').on('mousewheel', '.detail-aside-layer > .content', function (e) {
    var scrollTop = $(this).scrollTop();
    var height = $(this).height();
    var direction = e.deltaY > 0 ? -1 : 1;

    // console.log(scrollTop, this.scrollHeight - height, direction)
    if (scrollTop <= 0 && direction === -1) {
      return false;
    }
    if (scrollTop >= this.scrollHeight - height && direction === 1) {
      return false;
    }
  });

  $('.detail-article').on('click', '.hook-add', function (e) {
    var $item = $(this).closest('.detail-item'),
        paraCode = $item.data('paracode');
    reviseEditor.show(paraCode);
  }).on('click', '.hook-revise', function () {
    var $item = $(this).closest('.detail-item'),
        paraCode = $item.data('paracode'),
        content = $item.find('.detail-item-inner').html();

    itemReviseEditor.show(paraCode, content);
  });
});