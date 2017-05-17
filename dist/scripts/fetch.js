'use strict';

define(['scripts/ajax'], function (ajax) {
  var origin = 'http://47.93.77.208:8080',
      urls = {
    categorys: origin + '/api/v1/first-categorys',
    projects: origin + '/api/v1/projects',
    tempProjects: origin + '/api/v1/temp-projects',
    paragraphs: origin + '/api/v1/projects/' + window.PID + '/paragraphs',
    mergeParagraphs: origin + '/api/v1/projects/' + window.PID + '/merge-paragraphs',
    revises: origin + '/api/v1/revises',
    mergeRevises: origin + '/api/v1/merge-revises',
    parasRevises: origin + '/api/v1/paras-revises/temp',
    submitRevises: origin + '/api/v1/submit-revises',
    tempSubmitRevises: origin + '/api/v1/temp-paras-revises',
    paragraphRevises: origin + '/api/v1/paragraph-revises'
  };

  return {
    // 一级分类
    getCate1: function getCate1() {
      return ajax.getData(urls.categorys);
    },

    // 二级分类
    getCate2: function getCate2(key) {
      return ajax.getData(urls.categorys + '/' + key + '/second-categorys');
    },
    saveProject: function saveProject(data) {
      return ajax.postData(urls.projects, data);
    },

    // 暂存项目
    tempSaveProject: function tempSaveProject(data) {
      return ajax.postData(urls.tempProjects, data);
    },

    // 新增段落
    addItem: function addItem(data) {
      return ajax.postData(urls.paragraphs, data);
    },

    // 修改段落
    updateItem: function updateItem(data) {
      return ajax.putData(urls.paragraphs, data);
    },

    // 删除段落
    deleteItem: function deleteItem(data) {
      return ajax.deleteData(urls.paragraphs, data);
    },

    // 合并段落
    coalesceItem: function coalesceItem(data) {
      return ajax.putData(urls.mergeParagraphs, data);
    },

    // 获取段落列表
    itemList: function itemList() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return ajax.getData(urls.paragraphs, data);
    },


    // 段落新增段添加
    addRevises: function addRevises(data) {
      return ajax.postData(urls.revises, data);
    },

    // 段落新增段修改
    updateRevises: function updateRevises(data) {
      return ajax.putData(urls.revises, data);
    },

    // 段落新增段合并
    coalesceRevise: function coalesceRevise(data) {
      return ajax.putData(urls.mergeRevises, data);
    },

    // 段落新增段删除
    deleteRevise: function deleteRevise(data) {
      return ajax.deleteData(urls.revises, data);
    },

    // 段落的添加列表
    reviseList: function reviseList(data) {
      return ajax.getData(urls.parasRevises, data);
    },
    paragraphRevisesList: function paragraphRevisesList(data) {
      return ajax.getData(urls.paragraphRevises, data);
    },

    // 段落新增段提交
    saveRevises: function saveRevises(data) {
      return ajax.postData(urls.submitRevises, data);
    },

    // 段落新增段暂存
    tempSaveRevises: function tempSaveRevises(data) {
      return ajax.postData(urls.tempSubmitRevises, data);
    },

    // 段落的修订删除
    deleteParagraphRevises: function deleteParagraphRevises(data) {
      return ajax.deleteData(urls.paragraphRevises, data);
    },

    // 段落的修订修改
    saveParagraphRevises: function saveParagraphRevises(data) {
      return ajax.putData(urls.paragraphRevises, data);
    }
  };
});