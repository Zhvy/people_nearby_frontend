var queryForm = document.forms.query

queryForm.onsubmit = function (e) {
  e.preventDefault()

  var url = '/v1/nearby_people/' + document.cookie.split('=')[1]
  var params = {
    distance: this.distance.value,
    gender: this.gender.value,
    gte_age: this.gte_age.value, // todo：不能为空字符串
    lte_age: this.lte_age.value // todo：不能为空字符串
  }
  ajax('put', url, params, function (data) {
    if (data.ok) {
      console.log(data.result)
      window.location.replace('scan.html')
    } else {
      console.log(data)
    }
  })
}