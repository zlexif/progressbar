document.addEventListener("DOMContentLoaded", () => {
  var ProgressBar = {
    init: function () {
      this.progressLabel = document.getElementById("progress-label")
      this.progressPercentage = document.getElementById("progress-percentage")
      this.bars = document.querySelectorAll(".bar")
      this.progressContainer = document.querySelector(".progress-container")
      this.alertSound = document.getElementById("alertSound")
      this.animationFrameRequest = null
      this.setupListeners()
    },

    setupListeners: () => {
      window.addEventListener("message", (event) => {
        if (event.data.action === "progress") {
          ProgressBar.update(event.data)
        } else if (event.data.action === "cancel") {
          ProgressBar.cancel()
        } else if (event.data.action === "setColor") {
          ProgressBar.setColor(event.data)
        }
      })
    },
    setColor: (data) => {
      const r = data.r ?? 220
      const g = data.g ?? 20
      const b = data.b ?? 60
      const a = data.a ?? 255
      const mainColor = `rgba(${r}, ${g}, ${b}, ${a / 255})`
      const mainShadow = `rgba(${r}, ${g}, ${b}, 0.6)`
      document.documentElement.style.setProperty("--main-color", mainColor)
      document.documentElement.style.setProperty("--main-shadow", mainShadow)
    },

    update: function (data) {
      if (this.animationFrameRequest) {
        cancelAnimationFrame(this.animationFrameRequest)
      }
      clearTimeout(this.cancelledTimer)

      this.progressLabel.textContent = data.label
      this.progressPercentage.textContent = "0%"
      this.progressContainer.style.display = "block"
      this.bars[0].style.backgroundColor = "var(--main-color)"
      setTimeout(() => {
        this.progressContainer.style.opacity = "1"
        this.progressContainer.style.transform = "scale(1)"
      }, 10)
      this.alertSound.play()
      const startTime = Date.now()
      const duration = Number.parseInt(data.duration, 10)

      const animateProgress = () => {
        const timeElapsed = Date.now() - startTime
        let progress = timeElapsed / duration
        if (progress > 1) progress = 1
        const percentage = Math.round(progress * 100)
        const filledBars = Math.floor(percentage / 10)
        this.bars.forEach((bar, index) => {
          bar.style.backgroundColor = index < filledBars ? "var(--main-color)" : "transparent"
        })
        this.progressPercentage.textContent = percentage + "%"
        if (progress < 1) {
          this.animationFrameRequest = requestAnimationFrame(animateProgress)
        } else {
          this.onComplete()
        }
      }
      this.animationFrameRequest = requestAnimationFrame(animateProgress)
    },

    cancel: function () {
      if (this.animationFrameRequest) {
        cancelAnimationFrame(this.animationFrameRequest)
        this.animationFrameRequest = null
      }
      this.progressLabel.textContent = "CANCELLED"
      this.progressPercentage.textContent = ""
      this.bars.forEach((bar) => (bar.style.backgroundColor = "var(--main-color)"))
      this.cancelledTimer = setTimeout(this.onCancel.bind(this), 1000)
    },

    onComplete: function () {
      this.bars.forEach((bar) => (bar.style.backgroundColor = "transparent"))
      this.progressPercentage.textContent = ""
      this.progressContainer.style.opacity = "0"
      this.progressContainer.style.transform = "scale(0.9)"
      setTimeout(() => {
        this.progressContainer.style.display = "none"
      }, 500)
      this.postAction("FinishAction")
    },

    onCancel: function () {
      this.bars.forEach((bar) => (bar.style.backgroundColor = "transparent"))
      this.progressPercentage.textContent = ""
      this.progressContainer.style.opacity = "0"
      this.progressContainer.style.transform = "scale(0.9)"
      setTimeout(() => {
        this.progressContainer.style.display = "none"
      }, 500)
    },

    postAction: (action) => {
      fetch(`https://progressbar/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })
    },
  }

  ProgressBar.init()
})
