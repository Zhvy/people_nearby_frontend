var template = '<div class="item demo">' +
  '<img class="item-avatar" src="img/avatar.jpeg" alt="">' +
  '<p class="nickname">#nickname#</p>' +
  '<p class="distance"><img class="item-gender" src="img/icon/man.png" alt=""> 10KM</p>' +
  '<button class="greet">打招呼</button>' +
  '</div>'

var url = '/v1/nearby_people/' + document.cookie.split('=')[1]
// 过滤条件为 {} 空对象
// 测试
ajax('put', url, {}, function (data) {
  if (data.ok) {
    console.log(data.result)
    var box = document.getElementsByClassName('person-list')[0]
    for (var i = 0; i < data.result.length; i++) {
      var item = template.replace('#nickname#', data.result[i].nickname)
      box.innerHTML += item
    }
  } else {
    console.log(data)
  }
})

// todo: ajax 异步添加元素的代码异步执行问题
var container = document.querySelector('.container')
var peopleBox = document.querySelector('.person-list')
var people = peopleBox.querySelectorAll('.item')
var boxWidth = peopleBox.clientWidth
var itemWidth = people[0].clientWidth
var center = (boxWidth - itemWidth) / 2
var itemTotalWidth = itemWidth * people.length
people[0].classList.add('active')

function createDot () {
  var dotElem = document.createElement('div')
  dotElem.className = 'dot'
  var positon = getPosition()
  dotElem.style.top = positon.top + 'px'
  dotElem.style.left = positon.left + 'px'
  dotElem.style.backgroundColor = getRandomColor()
  return dotElem
}

function getPosition () {
  var x = Math.ceil(getRandomNumber(170, 620))
  var y = Math.ceil(getRandomNumber(20, 480))
  if (inCircle([x, y], [400, 250], 250)) {
    // 再判断是否出现在中心小圆内
    if (!inCircle([x, y], [400, 250], 30)) {
      return {
        top: y,
        left: x
      }
    } else {
      return getPosition()
    }
  } else {
    return getPosition()
  }
}

function inCircle (point, circle, r) {
  var dx = point[0] - circle[0]
  var dy = point[1] - circle[1]
  return dx * dx + dy * dy < r * r
}

function getRandomNumber (min, max) {
  return Math.random() * (max - min) + min
}

function getRandomColor () {
  return '#' + Math.random().toString(16).slice(-6)
}

for (var i = 0; i < people.length; i++) {
  people[i].style.left = center + i * itemWidth + 'px'

  // 渲染小圆点
  var dotElem = createDot()
    // 通过自执行函数处理事件索引问题
  ;(function (dotElem, i) {
    dotElem.onclick = function () {
      // 计算点击的圆点对象在person-list中所对应位置与中心位置的距离差 diff
      var diff = parseInt(people[i].style.left) - center - itemWidth / 2
      // 每一个信息的位置循环移动 并清楚 active 效果
      for (var j = 0; j < people.length; j++) {
        people[j].classList.remove('active')
        people[j].style.left = parseInt(people[j].style.left) - diff - itemWidth / 2 + 'px'
      }
      // 为点击的信息添加 active 效果
      people[i].classList.add('active')
    }
  })(dotElem, i)
  container.insertBefore(dotElem, peopleBox)
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