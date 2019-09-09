var serverUrl = 'http://localhost:8922'

function ajax (method, url, params, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open(method, serverUrl + url, true)
  xhr.onload = function () {
    var responseJson = JSON.parse(xhr.responseText)
    callback(responseJson)
  }
  if (method.toLowerCase() === 'post') {
    xhr.send(JSON.stringify(params))
  } else if (method.toLowerCase() === 'put') {
    xhr.setRequestHeader('x-authenticated-userid', document.cookie.split('=')[1])
    xhr.send(JSON.stringify(params))
  } else {
    xhr.send()
  }
}