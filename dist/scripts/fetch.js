'use strict';

define(['scripts/ajax'], function (ajax) {
  var urls = {
    category1: 'http://47.93.77.208:8080/api/v1/first-categorys',
    category2: 'json/category-2.json',
    tempProjects: 'http://47.93.77.208:8080/api/v1/temp-projects/' + window.PID,
    paragraphs: 'http://47.93.77.208:8080/api/v1/projects/' + window.PID + '/paragraphs'
  },
      generateRandomAlphaNum = function generateRandomAlphaNum(len) {
    var rdmString = '';
    for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2)) {}
    return rdmString.substr(0, len);
  };

  return {
    getCate1: function getCate1() {
      return ajax.getData(urls.category1);
    },
    getCate2: function getCate2(key) {
      return ajax.getData(urls.category2, { key: key });
    },
    updateItem: function updateItem(data) {
      return ajax.putData(urls.paragraphs, data);
    },
    tempSaveProject: function tempSaveProject(data) {
      return ajax.putData(urls.tempProjects, data);
    },
    saveItem: function saveItem(data) {
      var promise = $.Deferred();
      ajax.postData(urls.paragraphs, data).then(function (data) {
        console.log(data);
        promise.resolve({
          id: generateRandomAlphaNum(10)
        });
      });
      return promise;
    },
    itemList: function itemList() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return ajax.getData(urls.paragraphs, data);
    }
  };
});