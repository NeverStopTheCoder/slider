//% block="Slider"
//% color=#6699ff
//% icon=""
//% weight=85
namespace slider {
    let selectedSlider: Sprite = null;
    let sliders: Sprite[] = [];
    let sliderBars: Sprite[] = [];
    let sliderTexts: Sprite[] = []; // Array to store text sprites for slider values
    let sliderOrientations: boolean[] = [];
    let movingLeft = false;
    let movingRight = false;
    let movingUp = false;
    let movingDown = false;
    //% block="create slider of color $color with width $sliderwidth and bar color $linecolor"
    //% blockSetVariable=Slider
    //% group="Create"
    //% color.shadow="colorindexpicker"
    //% linecolor.shadow="colorindexpicker"
    export function createSlider3(color: number, sliderwidth: number, linecolor: number): Sprite {
        let sliderIndex = sliders.length;

        // Create the bar for the slider (default: horizontal)
        let barImage = image.create(sliderwidth, 5);
        barImage.fill(linecolor);
        let sliderBar = sprites.create(barImage, SpriteKind.Player);
        sliderBars.push(sliderBar);

        // Create the knob for the slider
        let knobImage = image.create(10, 7);
        knobImage.fill(color);
        let sliderKnob = sprites.create(knobImage, SpriteKind.Food);
        sliders.push(sliderKnob);
        sliderOrientations.push(false); // Default is horizontal

        // Position the knob at the leftmost position of the bar
        sliderBar.setPosition(80, 60); // Default position
        sliderKnob.setPosition(sliderBar.x - sliderwidth / 2, sliderBar.y);

        return sliderKnob;
    }

    //% block="set $slider to vertical"
    //% group="Functions"
    //% slider.shadow=variables_get
    export function setSliderToVertical(slider: Sprite): void {
        let index = sliders.indexOf(slider);
        if (index !== -1) {
            let sliderBar = sliderBars[index];
            sliderOrientations[index] = true; // Set to vertical

            let barImage = image.create(5, sliderBar.width);
            barImage.fill(sliderBar.image.getPixel(0, 0)); // Preserve bar color
            sliderBar.setImage(barImage);

            slider.setPosition(sliderBar.x, sliderBar.y - sliderBar.height / 2);
        }
    }

    //% block="control $slider"
    //% group="Control"
    //% slider.shadow=variables_get
    export function controlSlider3(slider: Sprite) {
        selectedSlider = slider;
    }

    //% block="set $slider position to X $x Y $y"
    //% group="Functions"
    //% slider.shadow=variables_get
    export function setSliderPosition3(slider: Sprite, x: number, y: number): void {
        let index = sliders.indexOf(slider);
        if (index != -1) {
            let sliderBar = sliderBars[index];

            sliderBar.setPosition(x, y);

            if (sliderOrientations[index]) {
                slider.setPosition(x, y - sliderBar.height / 2);
            } else {
                slider.setPosition(x - sliderBar.width / 2, y);
            }
        }
    }

    controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
        movingLeft = true;
    });

    controller.left.onEvent(ControllerButtonEvent.Released, function () {
        movingLeft = false;
    });

    controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
        movingRight = true;
    });

    controller.right.onEvent(ControllerButtonEvent.Released, function () {
        movingRight = false;
    });

    controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
        movingUp = true;
    });

    controller.up.onEvent(ControllerButtonEvent.Released, function () {
        movingUp = false;
    });

    controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
        movingDown = true;
    });

    controller.down.onEvent(ControllerButtonEvent.Released, function () {
        movingDown = false;
    });

    game.onUpdate(function () {
        if (selectedSlider) {
            let index = sliders.indexOf(selectedSlider);
            if (index != -1) {
                let sliderBar = sliderBars[index];

                if (sliderOrientations[index]) {
                    let minY = sliderBar.y - sliderBar.height / 2;
                    let maxY = sliderBar.y + sliderBar.height / 2 - 1;

                    if (movingUp && selectedSlider.y > minY) {
                        selectedSlider.y -= 1;
                    }
                    if (movingDown && selectedSlider.y < maxY) {
                        selectedSlider.y += 1;
                    }
                } else {
                    let minX = sliderBar.x - sliderBar.width / 2;
                    let maxX = sliderBar.x + sliderBar.width / 2 - 1;

                    if (movingLeft && selectedSlider.x > minX) {
                        selectedSlider.x -= 1;
                    }
                    if (movingRight && selectedSlider.x < maxX) {
                        selectedSlider.x += 1;
                    }
                }
            }
        }
    });

    //% block="Show value of $slider"
    //% slider.shadow=variables_get
    //% group="Show/Hide"
    export function showSliderValue99(slider: Sprite): void {
        let index = sliders.indexOf(slider);
        if (index != -1) {
            let sliderBar = sliderBars[index];

            // Create a renderable text that will follow the slider
            let sliderText = sprites.create(image.create(1, 1), SpriteKind.Player); // Create empty sprite for text
            sliderTexts.push(sliderText); // Store the text sprite

            scene.createRenderable(100, function (ctx) {
                let value: number;
                if (sliderOrientations[index]) {
                    let position = slider.y - (sliderBar.y - sliderBar.height / 2);
                    value = (position / (sliderBar.height - 1)) * 100;
                } else {
                    let position = slider.x - (sliderBar.x - sliderBar.width / 2);
                    value = (position / (sliderBar.width - 1)) * 100;
                }

                if (value > 100) value = 100;
                if (value < 0) value = 0;

                value = Math.round(value);

                // Create text above the slider
                sliderText.setImage(image.create(value.toString().length * 8, 8));
                sliderText.image.fill(0);  // Clear the image to create new text
                sliderText.image.print(value.toString(), 0, 0);
                sliderText.setPosition(slider.x - 15, slider.y - 20);  // Position the text above the slider
            });
        }
    }

    //% block="Hide value of $slider"
    //% slider.shadow=variables_get
    //% group="Show/Hide"
    export function hideSliderValue(slider: Sprite): void {
        let index = sliders.indexOf(slider);
        if (index != -1) {
            let sliderText = sliderTexts[index];
            sliderText.destroy();  // Destroy the text sprite
            sliderTexts.splice(index, 1);  // Remove it from the array
        }
    }
    //% block="Destroy $slider"
    //% slider.shadow=variables_get
    //% group="Functions"
    export function destroySlider(slider: Sprite): void {
        let index = sliders.indexOf(slider);
        if (index != -1) {
            // Destroy the slider knob and bar
            let sliderBar = sliderBars[index];
            sliderBar.destroy();
            slider.destroy();  // Destroy the slider knob

            // Destroy the associated text
            let sliderText = sliderTexts[index];
            if (sliderText) {
                sliderText.destroy();
                sliderTexts.splice(index, 1);  // Remove the text sprite from the array
            }

            // Remove the slider from the arrays
            sliders.splice(index, 1);
            sliderBars.splice(index, 1);
            sliderOrientations.splice(index, 1);
        }
    }
    //% block="get value of $slider"
    //% slider.shadow=variables_get
    //% group="Functions"
    export function getSliderValue(slider: Sprite): number {
        let index = sliders.indexOf(slider);
        if (index !== -1) {
            let sliderBar = sliderBars[index];
            let value: number;

            if (sliderOrientations[index]) {
                // Vertical value calculation
                let position = slider.y - (sliderBar.y - sliderBar.height / 2);
                value = (position / (sliderBar.height - 1)) * 100;
            } else {
                // Horizontal value calculation
                let position = slider.x - (sliderBar.x - sliderBar.width / 2);
                value = (position / (sliderBar.width - 1)) * 100;
            }

            return Math.round(value);
        }
        return 0; // Default if no valid slider is found
    }
    //% block="if value of $slider equals $num"
    //% slider.shadow=variables_get
    //% num.min=0 num.max=100
    //% group="Functions"
    export function checkSliderValue(slider: Sprite, num: number): boolean {
        let currentValue = getSliderValue(slider);
        return currentValue === num;
    }
    //%block="Show $slider"
    //%slider.shadow=variables_get
    //%group="Show/Hide"
    export function ss(slider: Sprite): void {
        let index = sliders.indexOf(slider);
        if (index != 1) {
            let sb = sliderBars[index];
            let v = 4
            let st = sliderTexts[index];
            if (st) {
                st.setFlag(SpriteFlag.Invisible, false)
            }
            slider.setFlag(SpriteFlag.Invisible, false)
            sb.setFlag(SpriteFlag.Invisible, false)
            if (!sliderOrientations || sliderOrientations) {
                controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
                    movingRight = true
                })
                controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
                    movingLeft = true
                })

                controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
                    movingUp = true
                })
                controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
                    movingDown = true
                })
            }
        }
    }
    //%block="Hide $slider"
    //%slider.shadow=variables_get
    //%group="Show/Hide"
    export function hs(slider: Sprite): void {
        let index = sliders.indexOf(slider)
        if (index != -1) {
            let hb = sliderBars[index];
            let v = 45
            let st = sliderTexts[index];
            if (st) {
                st.setFlag(SpriteFlag.Invisible, true)
            }
            slider.setFlag(SpriteFlag.Invisible, true)
            hb.setFlag(SpriteFlag.Invisible, true)
            if (!sliderOrientations || sliderOrientations) {
                controller.right.onEvent(ControllerButtonEvent.Repeated, function () {
                    movingRight = false
                })

                controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
                    movingRight = false
                })
                controller.left.onEvent(ControllerButtonEvent.Repeated, function () {
                    movingLeft = false
                })
                controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
                    movingLeft = false
                })
                controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
                    movingUp = false
                })
                controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
                    movingDown = false
                })
            } else if (v = 22) {
                controller.up.onEvent(ControllerButtonEvent.Repeated, function () {
                    movingUp = false
                })
                controller.down.onEvent(ControllerButtonEvent.Repeated, function () {
                    movingDown = false
                })
                controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
                    movingUp = false
                })
                controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
                    movingDown = false
                })
            }
        }
    }
    // Cycling through the sliders
    //%block="Cycle through sliders"
    //%group=Control
    export function cycleToNextSlider(): void {
        if (sliders.length == 0) return; // No sliders exist

        // If no slider is selected, start from the first one
        if (!selectedSlider) {
            selectedSlider = sliders[0];
        } else {
            // Get the current index and cycle to the next slider
            let index = sliders.indexOf(selectedSlider);
            if (index != -1) {
                index += 1;
                if (index >= sliders.length) {
                    index = 0; // If we reach the end, cycle back to the first one
                }
                selectedSlider = sliders[index];
            }
        }
    }

    // Trigger cycling when the A button is pressed
    controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
        cycleToNextSlider(); // Trigger slider cycling
    });

    // Update slider control behavior
    game.onUpdate(function () {
        if (selectedSlider) {
            let index = sliders.indexOf(selectedSlider);
            if (index != -1) {
                let sliderBar = sliderBars[index];

                if (sliderOrientations[index]) {
                    let minY = sliderBar.y - sliderBar.height / 2;
                    let maxY = sliderBar.y + sliderBar.height / 2 - 1;

                    if (movingUp && selectedSlider.y > minY) {
                        selectedSlider.y -= 1;
                    }
                    if (movingDown && selectedSlider.y < maxY) {
                        selectedSlider.y += 1;
                    }
                } else {
                    let minX = sliderBar.x - sliderBar.width / 2;
                    let maxX = sliderBar.x + sliderBar.width / 2 - 1;

                    if (movingLeft && selectedSlider.x > minX) {
                        selectedSlider.x -= 1;
                    }
                    if (movingRight && selectedSlider.x < maxX) {
                        selectedSlider.x += 1;
                    }
                }
            }
        }
    });
}
