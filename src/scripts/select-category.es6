// 行业分类联动
define(['scripts/fetch'], (fetch) => {
  const $cate1 = $('#firstClassId'),
    $cate2 = $('#secondClassId')

  const renderCategory = ($cate, fetch_type, key) => {
    return fetch[fetch_type](key).then(data => {
      $cate.html(tpl(data))
    })
  }

  const tpl = (datas) => {
    let inner = ''
    datas.forEach(item => {
      inner += `<option value="${item.id}">${item.className}</option>`
    })

    return inner;
  }

  $cate1.on('change', function () {
    var key = this.value
    renderCategory($cate2, 'getCate2', key)
  })

  renderCategory($cate1, 'getCate1').then(() => {
    renderCategory($cate2, 'getCate2', $cate1.val())
  })
})
