var peopleBox = document.querySelector('.person-list')
var people = peopleBox.querySelectorAll('.item')
var boxWidth = peopleBox.clientWidth
var itemWidth = people[0].clientWidth
var center = (boxWidth - itemWidth) / 2
var itemTotalWidth = itemWidth * people.length
people[0].classList.add('active')

for (var i = 0; i < people.length; i++) {
  people[i].style.left = center + i * itemWidth + 'px'
}
peopleBox.onmousedown = function (e) {
  var oldX = e.clientX

  this.onmousemove = function (e) {
    var newX = e.clientX
    for (var i = 0; i < people.length; i++) {
      var newLeft = parseInt(people[i].style.left) + (newX - oldX)

      if ((newLeft - center) < itemWidth / 2 && (newLeft - center) > -itemWidth / 2) {
        people[i].classList.add('active')
      } else {
        people[i].classList.remove('active')
      }

      people[i].style.left = newLeft + 'px'
    }
    oldX = newX
  }

  // 鼠标抬起后去掉移动事件
  this.onmouseup = function () {
    this.onmousemove = null
  }

  // 鼠标移出盒子时要去掉移动事件
  this.onmouseleave = function () {
    this.onmousemove = null
  }
}

// 阻止用户的拖拽行为 头像拖动
document.body.ondragstart = function (event) {
  event.preventDefault()
}