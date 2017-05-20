define(['scripts/token'], (token) => {
  return {
    ajaxData(url, data = {}, type = 'GET'){
      const promise = $.Deferred()

      $.ajax({
        url,
        type,
        data,
        contentType: 'application/json; charset=UTF-8',
        headers: {
          'X-Authorization': token
        },
        dataType: 'json',
        success(result) {
          if (result.code === '000000') {
            promise.resolve(result.datas || result.message)
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
      return this.ajaxData(url, JSON.stringify(data), 'POST')
    },
    putData(url, data = {}) {
      return this.ajaxData(url, JSON.stringify(data), 'PUT')
    },
    deleteData(url, data = {}) {
      return this.ajaxData(`${url}?${$.param(data)}`, '', 'DELETE')
    }
  }
})
