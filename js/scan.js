var container = document.querySelector('.container')
var peopleBox = document.querySelector('.person-list')
var itemList = peopleBox.getElementsByClassName('item')  // 后面js添加了item 需要动态获取
var template = document.querySelector('.template').innerHTML
var boxWidth = peopleBox.clientWidth
var itemWidth = 150  // todo: 动态获取
var center = (boxWidth - itemWidth) / 2

var moreInfo = document.querySelector('.more')

// 加载头像
window.onload = function () {
  var url = '/v1/profile/user/' + document.cookie.split('=')[1]
  ajax('get', url, null, function (data) {
    if (data.ok) {
      var avatar = document.getElementById('own-avatar')
      // 没有头像就默认
      if (data.result.icon) {
        avatar.src = data.result.icon
      }
    }
  })
}

var url = '/v1/nearby_people/' + document.cookie.split('=')[1]
// 过滤条件为 {} 空对象
// 测试
var params = storage.get('params')
ajax('put', url, params, function (data) {
  if (data.ok) {
    console.log(data.result)
    for (var i = 0; i < data.result.length; i++) {
      // 添加 item 元素
      var item = template.replace('#nickname#', data.result[i].nickname)
      item = item.replace('#base64#', data.result[i].icon.slice(2, -1))
      item = item.replace('#gender#', data.result[i].gender === '男' ? 'man' : 'woman')
      item = item.replace('#distance#', data.result[i].distance)
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

      // 更多信息按钮
      var btn = itemList[i].querySelector('button.greet')
      ;(function (btn, i) {
        btn.onclick = function () {
          var info = moreInfo.innerHTML
          info = info.replace('#base64#', data.result[i].icon.slice(2, -1))
          info = info.replace('#nickname#', data.result[i].nickname)
          info = info.replace('#age#', data.result[i].age)
          info = info.replace('#gender#', data.result[i].gender)
          info = info.replace('#interests#', data.result[i].interests)
          info = info.replace('#bio#', data.result[i].bio)
          moreInfo.innerHTML = info
          moreInfo.style.display = 'block'
          var close = moreInfo.querySelector('button.close')
          close.onclick = function () {
            moreInfo.style.display = 'none'
          }
        }
      })(btn, i)
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

var operateBtn = document.querySelector('.operate')
var operateForm = document.querySelector('.operate-form')
operateBtn.onclick = function () {
  operateBtn.classList.toggle('active')
  operateForm.classList.toggle('active')
}
var again = document.forms.again
again.onsubmit = function (e) {
  e.preventDefault()

  var params = {
    distance: this.distance.value,
    gender: this.gender.value,
    gte_age: this.gte_age.value || 1, // todo：不能为空字符串
    lte_age: this.lte_age.value || 100
  }
  storage.set('params', params)
  window.location.reload()
}