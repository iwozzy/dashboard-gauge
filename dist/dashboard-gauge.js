function Gauge (parentId, options) {

	var gauge = this
	gauge.options = options
	gauge.counter = 0

	// create the canvas element
	gauge.canvas = document.createElement('canvas')
	gauge.canvas.id = parentId + 'Gauge'

	// have canvas fill the parent
	gauge.canvas.style.width = gauge.options.width
	gauge.canvas.style.height = gauge.options.height

	// append the canvas to the supplied parentId element
	document.getElementById(parentId).appendChild(gauge.canvas)

	// set the internal size of the canvas to fit the parent
	gauge.canvas.width = gauge.canvas.offsetWidth
	gauge.canvas.height = gauge.canvas.offsetHeight

	gauge.ctx = gauge.canvas.getContext('2d')

	gauge.drawBackground = function () {

		// draw background outline
		gauge.ctx.beginPath()
		gauge.ctx.strokeStyle = gauge.options.backgroundColor
		gauge.ctx.lineWidth = 20
		// start the arc in the middle of the canvas
		// with the radius of the circle being 100
		// draw from Math.PI which is far left on the x axis
		// go to 0 which is far right on the x aris
		// go clockwise
		gauge.ctx.arc(gauge.canvas.width / 2, gauge.canvas.height / 1.5, 100, Math.PI, 0, false)
		gauge.ctx.stroke()
	}

	// draw the counter in the middle of the gauge
	// argument may be supplied, otherwise draw 0
	gauge.drawCounter = function (counter) {

		console.log('drawing counter')

		var counterToDraw

		if (typeof counter != 'undefined') {
			counterToDraw = counter
		} else {
			counterToDraw = gauge.counter
		}

		// add the text / number display
		gauge.ctx.fillStyle = gauge.options.color
		gauge.ctx.font = "50px arial"
		gauge.ctx.textAlign = "center"
		gauge.ctx.textBaseline = 'middle'
		gauge.ctx.fillText(counterToDraw, gauge.canvas.width / 2, gauge.canvas.height / 1.5)
	}

	// clear the canvas
	gauge.clear = function () {
		gauge.ctx.clearRect(0, 0, gauge.canvas.width, gauge.canvas.height)
	}


	// performs the update of the gauge
	gauge.update = function (newStat) {

		gauge.newStat = newStat

		// calculate the speed of the update
		// it is 1 second devided by the difference between
		// the current and the new
		var difference = Math.abs(gauge.counter - gauge.newStat)

		// setup the repeater
		gauge.stepInterval = setInterval(gauge.step, 1000/ difference)

	}

	// performs a single step in the animation
	gauge.step = function () {

		// if the animation is finished then clear the interval
		if (gauge.counter == gauge.newStat) {
			clearInterval(gauge.stepInterval)
		} else {
			// otherwise determine which way to go
			if (gauge.counter < gauge.newStat) {
				gauge.counter++
			} else {
				gauge.counter--
			}

			// now we have to determine what to do
			// do we animate step as usual
			// or do we stop the animation, draw max fill and draw the max+ counter
			if (gauge.counter > gauge.options.max) {
				clearInterval(gauge.stepInterval)
				gauge.clear()
				gauge.drawBackground()
				gauge.drawFill(gauge.options.max)
				gauge.drawCounter(gauge.options.max + '+')
			} else {
				gauge.animateStep()
			}

		}

	}

	// animates a single step
	gauge.animateStep = function () {
		// first we clear the canvas and draw the background arc
		gauge.clear()
		gauge.drawBackground()

		gauge.drawFill()

		// finally we draw the counter
		gauge.drawCounter()
	}

	gauge.drawFill = function (counter) {

		var fillToDraw

		if (typeof counter != 'undefined') {
			fillToDraw = counter
		} else {
			fillToDraw = gauge.counter
		}

		// then we calculate what angle will the new value take
		// since we are dealing with a half circle, there are 180 possible angles
		// we calculate what angle a single unit represents on our gauge
		// and then muliply the counter
		var degrees = fillToDraw * (180 / gauge.options.max)
		var radians = degrees * Math.PI / 180

		gauge.ctx.beginPath()
		gauge.ctx.strokeStyle = gauge.options.color
		gauge.ctx.lineWidth = 20
		// since in the arc the start angle and end angle values are absolute
		// we need to add PI to our calculated angle to start from far left
		gauge.ctx.arc(gauge.canvas.width / 2, gauge.canvas.height / 1.5, 100, Math.PI, radians + Math.PI, false)
		gauge.ctx.stroke()
	}

	gauge.drawBackground()
	gauge.drawCounter()
}