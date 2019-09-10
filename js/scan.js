var container = document.querySelector('.container')
var peopleBox = document.querySelector('.person-list')
var itemList = peopleBox.getElementsByClassName('item')  // 后面js添加了item 需要动态获取
var templateElem = document.querySelector('.template')
var boxWidth = peopleBox.clientWidth
var itemWidth = 150  // todo: 动态获取
var center = (boxWidth - itemWidth) / 2

var url = '/v1/nearby_people/' + document.cookie.split('=')[1]
// 过滤条件为 {} 空对象
// 测试
ajax('put', url, {}, function (data) {
  if (data.ok) {
    console.log(data.result)
    for (var i = 0; i < data.result.length; i++) {
      // 添加 item 元素
      var item = templateElem.innerHTML.replace('#nickname#', data.result[i].nickname)
      peopleBox.appendChild(createItemElem(item))

      itemList[i].style.left = center + i * itemWidth + 'px'
      // 渲染小圆点
      var dotElem = createDot()
        // 通过自执行函数处理事件索引问题
      ;(function (dotElem, i) {
        dotElem.onclick = function () {
          // 计算点击的圆点对象在person-list中所对应位置与中心位置的距离差 diff
          var diff = parseInt(itemList[i].style.left) - center - itemWidth / 2
          // 每一个信息的位置循环移动 并清楚 active 效果
          for (var j = 0; j < itemList.length; j++) {
            itemList[j].classList.remove('active')
            itemList[j].style.left = parseInt(itemList[j].style.left) - diff - itemWidth / 2 + 'px'
          }
          // 为点击的信息添加 active 效果
          itemList[i].classList.add('active')
        }
      })(dotElem, i)
      container.insertBefore(dotElem, peopleBox)
    }
    itemList[0].classList.add('active')
  } else {
    console.log(data)
  }
})

peopleBox.onmousedown = function (e) {
  var oldX = e.clientX

  this.onmousemove = function (e) {
    var newX = e.clientX
    for (var i = 0; i < itemList.length; i++) {
      var newLeft = parseInt(itemList[i].style.left) + (newX - oldX)

      if ((newLeft - center) < itemWidth / 2 && (newLeft - center) > -itemWidth / 2) {
        itemList[i].classList.add('active')
      } else {
        itemList[i].classList.remove('active')
      }

      itemList[i].style.left = newLeft + 'px'
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