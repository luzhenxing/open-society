define(['scripts/fetch'], (fetch) => {
  function ReviseLayer() {
    this.currentType = 'add'
    this.proId = window.PID
    this.paraCode = ''
    this.currentPage = 1
    this.addCount = 0
    this.reviseCount = 0
    this.total = 1

    this.$layer = null
    this.$sourceDom = null

    this.init()
  }

  ReviseLayer.prototype = {
    constructor: ReviseLayer,
    init() {
      this.$layer = this.layerDom()
      this.bindEvent()
    },
    layerDom() {
      let layer = `
        <div class="detail-aside-layer" style="display: none">
          <div class="header"></div>
          <div class="content"></div>
          <div class="item-pager"></div>
        </div>
      `
      return $(layer).appendTo('.detail-aside')
    },
    show(type) {
      this.currentType = type
      this.currentPage = 1
      // this.setPosition()
      this.$layer.show()
      this.$layer.find('.header').html(`
        ${this.addCount != 0 ? '<a class="' +
        (this.currentType == 'add' ? 'current': '') +
        '" data-type="add" href="javascript:;">添加列表</a>': ''}
        ${this.reviseCount != 0 ? '<a class="' +
        (this.currentType == 'revise' ? 'current': '') +
        '" data-type="revise" href="javascript:;">修订列表</a>': ''}
      `)

      this.fetchList()
    },
    hide() {
      this.$layer.hide()
    },
    bindEvent() {
      const _this = this
      this.$layer
        .on('click', '.header > a', function () {
          const $this = $(this)
          if ($this.hasClass('current')) {
            return false
          }

          $this.addClass('current').siblings().removeClass('current')
          _this.currentType = $this.data('type')
          _this.currentPage = 1
          _this.fetchList()
        })
        .on('click', '.hook-support' , function() {
          // console.log('proId', _this.proId)
          // console.log('paraCode', _this.paraCode)
          // console.log('reviseId', $(this).data('id'))
          let $icon = $(this).find('.iconfont')
          if ($icon.hasClass('icon-dianzan')) {
            $icon.removeClass('icon-dianzan').addClass('icon-dianzan1')
          } else {
            $icon.removeClass('icon-dianzan1').addClass('icon-dianzan')
          }

        })
        .on('click', '.hook-go', function() {
          _this.currentPage = $(this).data('page')
          _this.fetchList()
        })
        .on('click', '.hook-btn-go', function() {
          let page = _this.$layer.find('.hook-page-text').val()
          if (!window.isNaN(page) && (page > 0 && page <= this.total)) {
            _this.currentPage = page
            _this.fetchList()
          }
        })

      $.fn.scrollUnique = function () {
        return $(this).each(function () {
          let eventType = 'mousewheel'
          // 火狐是DOMMouseScroll事件
          if (document.mozHidden !== undefined) {
            eventType = 'DOMMouseScroll'
          }
          $(this).on(eventType, function (event) {
            // 一些数据
            let scrollTop = this.scrollTop,
              scrollHeight = this.scrollHeight,
              height = this.clientHeight

            let delta = (event.originalEvent.wheelDelta)
              ? event.originalEvent.wheelDelta
              : -(event.originalEvent.detail || 0)

            if ((delta > 0 && scrollTop <= delta) ||
              (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
              // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
              this.scrollTop = delta > 0 ? 0: scrollHeight
              // 向上滚 || 向下滚
              event.preventDefault()
            }
          })
        })
      }

      this.$layer.find('.content').scrollUnique()
    },
    setPosition() {
      let top = this.$sourceDom.position().top
      this.$layer.css({top})
    },
    fetchList() {
      let url = this.currentType == 'add'
          ? 'reviseList'
          : 'paragraphRevisesList',
        data = {
          proId: this.proId,
          paraCode: this.paraCode,
          page: this.currentPage
        },
        $content = this.$layer.find('.content')
      this.setPosition()
      $content.html(
        '<div class="loading"><img src="/images/loading.svg" /></div>')

      fetch[url](data).then(data => {
        $content.html(this.itemInner(data))
        // console.log(this.$layer.find('.item-pager'))
        this.$layer.find('.item-pager').html(this.pagerInner(data))

      })
    },
    itemInner({sliceList}) {
      if (!sliceList) {
        return false;
      }
      let inner = '<dl class="item">'

      sliceList.forEach(list => {
        inner += `
          <dt>
            <img class="avatar" src="" alt="${list.userName}">
            <span>${list.userName}</span>
            <span class="time">${list.createDate}</span>
            <div class="item-oper">
              <a class="support hook-support" data-id="${list.id}" href="javascript:;">
                <i class="iconfont icon-dianzan"></i>
              </a>
              <a>
                <i class="iconfont icon-guanlizhe"></i> <span>3</span>
              </a>
              <a>
                <i class="iconfont icon-canyuzhe"></i> <span>2</span>
              </a>
            </div>
          </dt>
          <dd>
            <div class="item-inner">
              ${list.content}
            </div>
          </dd>
        `
      })

      inner += '</dl>'

      return inner
    },
    pagerInner({count, size, from}) {
      let total = Math.ceil(count / size),
        inner = ''

      this.total = total

      if (total > 1) {
        inner += `
          <div class="form-inline">
            <span class="pager-text">第${from}页</span>
            <ul class="pagination">
              <li class="${from === 1 ? 'disabled': ''}">
                <a href="javascript:;" class="hook-go" data-page="${from === 1 ? '1': (from - 1)}" aria-label="Previous">
                  上一页
                </a>
              </li>
              <li class="${from === total ? 'disabled': ''}">
                <a href="javascript:;" class="hook-go" data-page="${from === total ? from: (from + 1)}" aria-label="Next">
                  下一页
                </a>
              </li>
            </ul>
            <span class="pager-text">共${total}页</span>
            <span class="pager-text">到 <input class="form-control hook-page-text" type="text" value="${from}"> 页
              <button class="btn btn-default hook-btn-go">确定</button>
            </span>
          </div>
        `
      }
      return inner
    }
  }

  function Pager() {

  }

  return ReviseLayer
})
