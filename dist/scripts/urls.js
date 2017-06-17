'use strict';

define(function () {
  var origin = 'http://47.93.77.208:8080';

  return {
    categorys: origin + '/api/v1/first-categorys',
    projects: origin + '/api/v1/projects',
    tempprojects: origin + '/api/v1/temp-projects',
    paragraphs: origin + '/api/v1/projects/' + window.pid + '/paragraphs',
    mergeParagraphs: origin + '/api/v1/projects/' + window.pid + '/merge-paragraphs',
    revises: origin + '/api/v1/revises',
    mergeRevises: origin + '/api/v1/merge-revises',
    parasrevises: origin + '/api/v1/paras-revises',
    tempparasrevises: origin + '/api/v1/paras-revises/temp',
    submitrevises: origin + '/api/v1/submit-revises',
    tempsubmitrevises: origin + '/api/v1/temp-paras-revises',
    paragraphrevises: origin + '/api/v1/paragraph-revises',
    projectsfiles: origin + '/api/v1/projects/files',
    revisesfiles: origin + '/api/v1/revises/files'
  };
});