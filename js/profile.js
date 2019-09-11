var modifyForm = document.forms.modify
var addLocation = document.getElementById('add-location')

window.onload = function () {
  var url = '/v1/profile/user/' + document.cookie.split('=')[1]
  ajax('get', url, null, function (data) {
    if (data.ok) {
      modifyForm.username.value = data.result.username
      modifyForm.nickname.value = data.result.nickname
    }
  })
}

addLocation.onclick = function () {
  addLocation.disabled = true
  getLatAndLon(function (data, err) {
    if (err) {
      addLocation.disabled = false
      return alert(err)
    }
    modifyForm.lat.value = data.lat
    modifyForm.lon.value = data.lon
  })
}

// 头像处理
var upload = document.getElementById('upload')
var iconBase64 = ''
upload.onchange = function () {
  var fReader = new FileReader();
  fReader.readAsDataURL(this.files[0]);
  fReader.onloadend = function(e){
    var avatar = document.getElementById("avatar");
    avatar.src = e.target.result;
    // 取得编码
    // var index = avatar.src.indexOf(',') + 1
    // iconBase64 = avatar.src.slice(index)
    iconBase64 = avatar.src
  }
}

modifyForm.onsubmit = function (e) {
  e.preventDefault()

  if (modifyForm.lat.value === '' || modifyForm.lon.value === '') {
    alert('请获取位置信息')
  } else {
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
      bio: modifyForm.bio.value,
      // password: '',
      age: parseInt(modifyForm.age.value) ? parseInt(modifyForm.age.value) : 18,
      gender: modifyForm.gender.value,
      interests: interests,
      icon: iconBase64,
      location: {
        lat: modifyForm.lat.value,
        lon: modifyForm.lon.value
      }
    }
    console.log(params)
    // 修改用户资料
    url = '/v1/profile/user/' + document.cookie.split('=')[1]
    ajax('put', url, params, function (data) {
      if (data.ok) {
        window.location.replace('query.html')
      }
    })
  }
}

function getLatAndLon (callback) {
  navigator.geolocation.getCurrentPosition(function (position) {
    callback({
      lat: position.coords.latitude,
      lon: position.coords.longitude
    })
  }, function (err) {
    var message = '您禁止了该网页获取位置信息的权限，请开启后重试'
    callback(null, message)
  })
}