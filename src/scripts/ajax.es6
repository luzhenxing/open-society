define(() => {
  return {
    ajaxData(url, data = {}, type = 'GET'){
      const promise = $.Deferred()
      $.ajax({
        url,
        data,
        type,
        dataType: 'json',
        success(result) {
          if (result.code === '000000') {
            promise.resolve(result.datas)
          } else {
            throw new Error(result.message)
            promise.reject(result)
          }
        }
      })
      return promise
    },
    getData(url, data = {}) {
      return this.ajaxData(url, data, 'GET')
    },
    postData(url, data = {}) {
      return this.ajaxData(url, data, 'POST')
    },
    putData(url, data = {}) {
      return this.ajaxData(url, data, 'PUT')
    }
  }
})
