var modifyForm = document.forms.modify

var url = '/v1/profile/user/' + document.cookie.split('=')[1]
ajax('get', url, null, function (data) {
  if (data.ok) {
    modifyForm.username.value = data.result.username
    modifyForm.nickname.value = data.result.nickname
  }
})

modifyForm.onsubmit = function (e) {
  e.preventDefault()

  // 将兴趣多选项提取为数组
  var interests = []
  for (var i = 0; i < modifyForm.interests.length; i++) {
    if (modifyForm.interests[i].checked) {
      interests.push(modifyForm.interests[i].value)
    }
  }

  var params = {
    username: 're',
    nickname: modifyForm.nickname.value,
    // password: '',
    age: parseInt(modifyForm.age.value) ? parseInt(modifyForm.age.value) : 18,
    gender: modifyForm.gender.value,
    interests: interests,
    // icon: '',
    // location: {}
  }
  // 修改用户资料
  url = '/v1/profile/user/' + document.cookie.split('=')[1]
  ajax('put', url, params, function (data) {
    if (data.ok) {
      window.location.replace('query.html')
    }
  })
}