var maininfoElem = document.getElementById('main-info')
var formElem = document.querySelector('.form')
var signElem = document.querySelector('.sign')
var signForm = document.querySelectorAll('.sign > div')
var joinBtn = document.querySelector('.button.join')
var registerBtn = document.querySelector('.btn-register')
var lognBtn = document.querySelector('.btn-login')

joinBtn.onclick = function () {
  maininfoElem.style.display = 'none'
  formElem.style.display = 'block'
}

registerBtn.onclick = function () {
  signForm[0].classList.toggle('active')
  signForm[1].classList.toggle('active')
  signElem.style.transform = 'rotateY(179deg)'
}
lognBtn.onclick = function () {
  signForm[0].classList.toggle('active')
  signForm[1].classList.toggle('active')
  signElem.style.transform = 'rotateY(0deg)'
}

var loginForm = document.forms.login
var registerForm = document.forms.register

loginForm.onsubmit = function (e) {
  e.preventDefault()
  var params = {
    username: this.username.value,
    password: this.password.value
  }
  ajax('post', '/v1/login', params, function (data) {
    if (data.ok) {
      document.cookie = 'user_id=' + data.result['user_id']
      window.location.replace('profile.html')
    } else {
      if (data['error_type'] === 'user_profile_not_found') {
        loginForm.username.style.color = 'red'
        loginForm.username.value = '用户名不存在'
        loginForm.password.value = ''
      } else if (data['error_type'] === 'password_wrong') {
        var tip = loginForm.querySelector('.password-wrong')
        tip.classList.add('active')
        loginForm.password.value = ''
      }
    }
  })
}

registerForm.onsubmit = function (e) {
  e.preventDefault()
  var params = {
    username: this.username.value,
    password: this.password.value
  }
  ajax('post', '/v1/profile/user', params, function (data) {
    if (data.ok) {
      document.cookie = 'user_id=' + data.result['user_id']
      window.location.replace('profile.html')
    } else {
      if (data['error_type'] === 'profile_already_exist') {
        registerForm.username.style.color = 'red'
        registerForm.username.value = '用户名不存在'
        registerForm.password.value = ''
      } else {
        alert(data.message)
      }
    }
  })
}