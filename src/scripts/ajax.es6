define(() => {
  return {
    ajaxData(url, data = {}, type = 'GET'){
      let token = `Bearer ${$.cookie('X-Authorization')}`
      const promise = $.Deferred()

      $.ajax({
        url,
        type,
        data,
        contentType: 'application/json; charset=UTF-8',
        headers: {
          'X-Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzAwMDAwMDAwMCIsImp0aSI6Ijg2NDcyODI2NTk3Mzg2NjQ5NiIsInNjb3BlcyI6WyIvOkdFVCJdLCJpc3MiOiJodHRwOi8vb3N3b3JkLmNvbSIsImlhdCI6MTQ5NTAzMzQwMiwiZXhwIjoxNDk1MDQwNjAyfQ.fmSHJtoUITDyjEzC7DJP8jekH9b5nyQDsvT36quVnQhObwFPk1O1bw36ltlqH8Jwm7XEu0lpdwtyLlg2e8USOg'
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
