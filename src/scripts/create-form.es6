define(() => {
  let valid = true,
    $projectNameWrapper = $('#projectName-wrapper'),
    projectIntroWrapper = $('#projectIntro-wrapper'),
    $mgr_no_approveWrapper = $('#mgr_no_approve-wrapper'),
    $form = $('#create-form'),

    $projectName = $('#projectName'),
    $projectIntro = $('#projectIntro'),
    $mgr_no_approve_1 = $('#mgr_no_approve_1'),
    $mgr_no_approve_2 = $('#mgr_no_approve_2')

  $mgr_no_approve_1.on('click', function () {
    $mgr_no_approveWrapper.removeClass('layer')
  })
  $mgr_no_approve_2.on('click', function () {
    $mgr_no_approveWrapper.addClass('layer')
  })

  const checkName = () => {
    $projectNameWrapper.removeClass('has-error')
    if ($projectName.val().trim() === '') {
      $projectNameWrapper.addClass('has-error')
      valid = false
    }
  }

  const checkDesc = () => {
    projectIntroWrapper.removeClass('has-error')
    if ($projectIntro.val().trim() === '') {
      projectIntroWrapper.addClass('has-error')
      $('#projectIntro-error-txt').text('请填写简介')
      valid = false
    } else if (strlen($projectIntro.val().trim()) > 200) {
      projectIntroWrapper.addClass('has-error')
      $('#projectIntro-error-txt').text('简介范围在100个汉字或200个字符内')
      valid = false
    }
  }

  const strlen = (str) => {
    let len = 0
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 255) {
        len += 2
      } else {
        len++
      }
    }
    return len
  }

  const getData = () => {
    console.log($('#firstClassId').val())
    const params = {
        id: window.PID,
        projectName: $projectName.val().trim(),
        projectIntro: $projectIntro.val().trim(),
        firstClassId: $('#firstClassId').val(),
        firstClassName: $('#firstClassId').find(':selected').text(),
        secondClassId: $('#secondClassId').val(),
        secondClassName: $('#secondClassId').find(':selected').text(),
        isSecreted: $('[name=isSecreted]:checked').val()
      },
      rules = []

    // 投票规则
    rules.push({
      itemType: 1,
      itemCode: 1,
      ruleCode: 'mgr_scale_rule',
      ruleDesc: '项目管理者中同意的人数占全部管理者的比例大于',
      ruleValue: $('#mgr_scale_rule_1').val()
    })

    rules.push({
      itemType: 1,
      itemCode: 1,
      ruleCode: 'mgr_first_rule',
      ruleDesc: '第一管理者是否必须同意',
      ruleValue: $('[name=mgr_first_rule_1]:checked').val()
    })

    rules.push({
      itemType: 1,
      itemCode: 2,
      ruleCode: 'mgr_scale_rule',
      ruleDesc: '项目管理者中同意的人数占全部管理者的比例大于',
      ruleValue: $('#mgr_scale_rule_2').val()
    })

    rules.push({
      itemType: 1,
      itemCode: 2,
      ruleCode: 'mgr_no_approve',
      ruleDesc: '不需要审批',
      ruleValue: $('[name=mgr_no_approve]:checked').val()
    })

    if ($('[name=mgr_no_approve]:checked').val() == 1) {
      rules.push({
        itemType: 1,
        itemCode: 2,
        ruleCode: 'mgr_first_rule',
        ruleDesc: '第一管理者是否必须同意',
        ruleValue: $('[name=mgr_first_rule_2]:checked').val()
      })
    }

    params['rules'] = rules
    return params
  }

  return {
    getFormData() {
      let promise = $.Deferred()
      valid = true
      checkName()
      checkDesc()
      if (valid) {
        promise.resolve(getData())
      }
      return promise
    }
  }
})
