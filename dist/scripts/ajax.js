'use strict';

define(function () {
  return {
    ajaxData: function ajaxData(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';

      var promise = $.Deferred();
      $.ajax({
        url: url,
        data: data,
        type: type,
        dataType: 'json',
        success: function success(result) {
          if (result.code === '000000') {
            promise.resolve(result.datas);
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

      return this.ajaxData(url, data, 'POST');
    },
    putData: function putData(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.ajaxData(url, data, 'PUT');
    }
  };
});