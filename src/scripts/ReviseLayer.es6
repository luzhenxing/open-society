define(['scripts/fetch'], (fetch) => {
  function ReviseLayer() {
    this.currentType = 'add'
    this.proId = window.PID
    this.paraCode = ''
    this.currentPage = 1
    this.addCount = 0
    this.reviseCount = 0

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
    setPosition() {},
    fetchList() {
      let url = this.currentType == 'add'
          ? 'reviseList'
          : 'paragraphRevisesList',
        data = {
          proId: this.proId,
          paraCode: this.paraCode,
          page: this.currentPage,
          userId: 0
        },
        $content = this.$layer.find('.content')
      $content.html(
        '<div class="loading"><img src="/images/loading.svg" /></div>')

      fetch[url](data).then(data => {
        $content.html(this.itemInner(data))
      })
    },
    itemInner({sliceList}) {
      let inner = '<dl class="item">'

      sliceList.forEach(list => {
        inner += `
          <dt>
            <span class="time">${list.createDate}</span> <span>${list.userName}</span>
          </dt>
          <dd>
            <div class="item-inner">
              ${list.content}
            </div>
            <div class="item-oper">
              <a class="hook-support" href="javascript:;">
                <i class="iconfont icon-dianzan"></i> <span>赞</span>
              </a>
              <a>
                <i class="iconfont icon-guanlizhe"></i> <span>3</span>
              </a>
              <a>
                <i class="iconfont icon-canyuzhe"></i> <span>2</span>
              </a>
            </div>
          </dd>
        `
      })

      inner += '</dl>'

      return inner
    }
  }

  function Pager() {

  }

  return ReviseLayer
})
