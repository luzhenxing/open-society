requirejs(['scripts/editor/ReviseEditor', 'scripts/fetch'],
  (ReviseEditor, fetch) => {
    const $foldUp = $('.fold-up'),
      $foldDown = $('.fold-down'),
      reviseEditor = new ReviseEditor()

    $foldUp.on('click', () => {
      $('.hook-fold').addClass('hidden')
      $foldUp.addClass('hidden')
      $foldDown.removeClass('hidden')
    })

    $foldDown.on('click', () => {
      $('.hook-fold').removeClass('hidden')
      $foldUp.removeClass('hidden')
      $foldDown.addClass('hidden')
    })

    $('.detail-aside').on('mousewheel', '.detail-aside-layer > .content', function(e) {
      let scrollTop = $(this).scrollTop();
      let height = $(this).height()
      let direction = e.deltaY > 0 ? -1 : 1;

      // console.log(scrollTop, this.scrollHeight - height, direction)
      if (scrollTop <= 0 && direction === -1) {
        return false
      }
      if (scrollTop >= (this.scrollHeight - height) && direction === 1) {
        return false
      }
    })

    $('.detail-article').on('click', '.hook-add', function(e) {
      let $Item = $(this).closest('.detail-item'),
        paraCode = $Item.data('paracode');
      reviseEditor.show(paraCode)
    })
  })
