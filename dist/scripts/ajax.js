'use strict';

define(['scripts/token', 'scripts/tips'], function (token, tips) {
  return {
    ajaxData: function ajaxData(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';

      var promise = $.Deferred();

      $.ajax({
        url: url,
        type: type,
        data: data,
        contentType: 'application/json; charset=UTF-8',
        headers: {
          'X-Authorization': token
        },
        dataType: 'json',
        success: function success(result) {
          if (result.code === '000000') {
            promise.resolve(result.datas || result.message);
          } else {
            tips.show({
              type: 'warning',
              content: result.message
            });
            promise.reject(result);
            throw new Error(result.message);
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