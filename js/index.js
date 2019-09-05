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