function createItemElem (content) {
  var divElem = document.createElement('div')
  divElem.className = 'item'
  divElem.innerHTML = content
  return divElem
}

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