controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    slider.stopcontrolingslider()
})
let Slider = slider.createSlider3(2, 80, 8)
slider.controlSlider3(Slider)
