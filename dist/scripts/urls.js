'use strict';

define(function () {
  var origin = 'http://47.93.77.208:8080';

  return {
    categorys: origin + '/api/v1/first-categorys',
    projects: origin + '/api/v1/projects',
    tempProjects: origin + '/api/v1/temp-projects',
    paragraphs: origin + '/api/v1/projects/' + window.PID + '/paragraphs',
    mergeParagraphs: origin + '/api/v1/projects/' + window.PID + '/merge-paragraphs',
    revises: origin + '/api/v1/revises',
    mergeRevises: origin + '/api/v1/merge-revises',
    parasRevises: origin + '/api/v1/paras-revises',
    tempParasRevises: origin + '/api/v1/paras-revises/temp',
    submitRevises: origin + '/api/v1/submit-revises',
    tempSubmitRevises: origin + '/api/v1/temp-paras-revises',
    paragraphRevises: origin + '/api/v1/paragraph-revises',
    projectsFiles: origin + '/api/v1/projects/files',
    revisesFiles: origin + '/api/v1/revises/files'
  };
});