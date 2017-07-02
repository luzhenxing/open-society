define(['scripts/urls', 'scripts/ajax'], (urls, ajax) => {

  return {
    // 一级分类
    getCate1() {
      return ajax.getData(urls.categorys)
    },
    // 二级分类
    getCate2(key) {
      return ajax.getData(`${urls.categorys}/${key}/second-categorys`)
    },
    saveProject(data) {
      return ajax.postData(urls.projects, data)
    },
    // 暂存项目
    tempSaveProject(data) {
      return ajax.postData(urls.tempProjects, data)
    },
    // 新增段落
    addItem(data) {
      return ajax.postData(urls.paragraphs, data)
    },
    // 修改段落
    updateItem(data) {
      return ajax.putData(urls.paragraphs, data)
    },
    // 删除段落
    deleteItem(data) {
      return ajax.deleteData(urls.paragraphs, data)
    },
    // 合并段落
    coalesceItem(data) {
      console.log(urls.mergeParagraphs)
      return ajax.putData(urls.mergeParagraphs, data)
    },
    // 获取段落列表
    itemList(data = {}) {
      return ajax.getData(urls.paragraphs, data)
    },

    // 段落新增段添加
    addRevises(data) {
      return ajax.postData(urls.revises, data)
    },
    // 段落新增段修改
    updateRevises(data) {
      return ajax.putData(urls.revises, data)
    },
    // 段落新增段合并
    coalesceRevise(data) {
      return ajax.putData(urls.mergeRevises, data)
    },
    // 段落新增段删除
    deleteRevise(data) {
      return ajax.deleteData(urls.revises, data)
    },
    // 段落的添加列表
    reviseList(data) {
      return ajax.getData(urls.parasRevises, data)
    },
    // 段落的添加列表
    tempReviseList(data) {
      return ajax.getData(urls.tempParasRevises, data)
    },
    paragraphRevisesList(data) {
      return ajax.getData(urls.paragraphRevises, data)
    },
    // 段落新增段提交
    saveRevises(data) {
      return ajax.postData(urls.submitRevises, data)
    },
    // 段落新增段暂存
    tempSaveRevises(data) {
      return ajax.postData(urls.tempSubmitRevises, data)
    },
    // 段落的修订删除
    deleteParagraphRevises(data) {
      return ajax.deleteData(urls.paragraphRevises, data)
    },
    // 段落的修订修改
    saveParagraphRevises(data) {
      return ajax.putData(urls.paragraphRevises, data)
    },
    // 新增列表 更多(data) {
    paragraphRevisesMore(id) {
      return ajax.getData(urls.paragraphRevisesMore + id)
    },
    // 验证项目名称是否可用
    checkExist(data) {
      return ajax.postData(urls.checkExist, data)
    }
  }
})
