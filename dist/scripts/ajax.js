'use strict';

define(function () {
  return {
    ajaxData: function ajaxData(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';

      var token = 'Bearer ' + $.cookie('X-Authorization');
      var promise = $.Deferred();

      $.ajax({
        url: url,
        type: type,
        data: data,
        contentType: 'application/json; charset=UTF-8',
        headers: {
          'X-Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzAwMDAwMDAwMCIsImp0aSI6Ijg2NDcyODI2NTk3Mzg2NjQ5NiIsInNjb3BlcyI6WyIvOkdFVCJdLCJpc3MiOiJodHRwOi8vb3N3b3JkLmNvbSIsImlhdCI6MTQ5NTAzMzQwMiwiZXhwIjoxNDk1MDQwNjAyfQ.fmSHJtoUITDyjEzC7DJP8jekH9b5nyQDsvT36quVnQhObwFPk1O1bw36ltlqH8Jwm7XEu0lpdwtyLlg2e8USOg'
        },
        dataType: 'json',
        success: function success(result) {
          if (result.code === '000000') {
            promise.resolve(result.datas || result.message);
          } else {
            throw new Error(result.message);
            promise.reject(result);
          }
        }
      });
      return promise;
    },
    getData: function getData(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.ajaxData(url, data, 'GET');
    },
    postData: function postData(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.ajaxData(url, JSON.stringify(data), 'POST');
    },
    putData: function putData(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.ajaxData(url, JSON.stringify(data), 'PUT');
    },
    deleteData: function deleteData(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.ajaxData(url + '?' + $.param(data), '', 'DELETE');
    }
  };
});