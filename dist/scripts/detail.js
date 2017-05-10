'use strict';

requirejs(['scripts/editor/ReviseEditor', 'scripts/fetch'], function (ReviseEditor, fetch) {
  var $foldUp = $('.fold-up'),
      $foldDown = $('.fold-down'),
      reviseEditor = new ReviseEditor();

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
    var $Item = $(this).closest('.detail-item'),
        paraCode = $Item.data('paracode');
    reviseEditor.show(paraCode);
  });
});