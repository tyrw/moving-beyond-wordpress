component.data.name = ''
component.data.email = ''
component.data.message = ''
component.data.alert = ''
component.data.success = false

function loadScript (id) {
	if (document.getElementById(id)) return
	var js, fjs = document.getElementsByTagName('script')[0]
	js = document.createElement('script')
	js.id = id
	js.src = "https://www.google.com/recaptcha/api.js"
	fjs.parentNode.insertBefore(js, fjs)
}

component.mounted = function () {
	if (this.reCaptcha) loadScript('recaptcha-js')
}

component.methods = {
  submit: function (e) {
    e.preventDefault()
    var that = this
    this.alert = ''
    if (!this.message) return this.alert = 'Please add your message'
		// reCAPTCHA
		var recaptchaResponse = (window.grecaptcha && grecaptcha.getResponse()) || !this.reCaptcha
		if (!recaptchaResponse) return this.alert = 'Please check the reCAPTCHA box'
    Component.axios.post(Component.ApiUrl + 'posts', {
      project: Component.Project,
      component: this.componentKey,
			recaptcha: recaptchaResponse,
      data: {
        name: this.name,
        email: this.email,
        message: this.message
      }
    })
    .then(function (response) {
      that.alert = 'Message sent'
      that.success = true
    })
    .catch(function (error) {
      that.alert = '' + error.message
    })
  }
}
