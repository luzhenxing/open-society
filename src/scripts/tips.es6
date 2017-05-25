define(() => {
  const insertStyle = (styleStr) => {
      const nod = document.createElement('style')
      nod.type = 'text/css'
      nod.innerHTML = styleStr
      document.getElementsByTagName('head')[0].appendChild(nod)
    },
    tipStyle = `
    .ui-tip {
      display: none;
      position: fixed;
      z-index: 2000;
      top: 0;
      left: 50%;
      box-sizing: border-box;
      margin-left: -150px;
      padding: 10px;
      min-width: 300px;
      line-height: 20px;
      
      color: #fff;
    }
    .ui-tip.tip {
      background: #20BE6D;
      text-align: center;
    }
    
    .ui-tip.warning {
      background: #E98B25;
      text-align: center;
    }
   
    .ui-tip.content {
      background: #fff;
    }
  `

  let tip = null

  function Tip() {
    this.$box = null
    this.speed = 2000
    // tip & warning & content
    this.type = 'tip'
    this.content = ''
    this.exClass = ''
    this.onFun = null
    this.timer = null

    this.init()
  }

  Tip.prototype = {
    constructor: Tip,
    init(opt) {

      insertStyle(tipStyle)
      this.$box = $(`
        <div class="ui-tip"></div>
      `).appendTo('body')
    },
    setOptions(opt = {}) {
      Object.assign(this, opt)

      switch (this.type) {
        case 'tip':
        case 'warning':
        case 'content':
          this.$box[0].className = `ui-tip ${this.type}`
          break
      }
      if (this.exClass) {
        this.$box.addClass(this.exClass)
      }
      this.$box.html(this.content)
    },
    show() {
      // if (this.$box.is(':visible')) {
      //   return false
      // }

      if (this.content === '') {
        return false
      }
      clearTimeout(this.timer)
      this.$box.fadeIn(100)

      if (this.speed != 0) {
        this.timer = setTimeout(() => {
          this.hide()
          if (this.onFun && typeof this.onFun === 'function') {
            this.onFun()
          }
        }, this.speed)
      }
    },
    hide() {
      this.content = ''
      this.$box.hide()
    }
  }

  return {
    show(opt = {}) {
      if (!tip) {
        tip = new Tip()
      }

      let _opt = {
        type: 'tip',
        speed: 2000,
        onFun: null,
        exClass: '',
        content: ''
      }

      if (typeof opt === 'string') {
        _opt.content = opt;
        tip.setOptions(_opt)
      } else {
        tip.setOptions(Object.assign(_opt, opt))
      }

      tip.show()
    },
    hide() {
      if (!tip) {
        return false
      }
    }
  }
})
