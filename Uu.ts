// Add your code here
//%block="Slider"
//%color=#6699ff
//%icon=""
namespace slider {
    let selectedSlider: Sprite = null;
    let sliders: Sprite[] = [];
    let sliderBars: Sprite[] = [];
    let movingLeft = false;
    let movingRight = false;

    //%
    export class Slider133 { }

    /**
     * Creates a slider with a color and width, and positions it on the screen.
     */
    //% block="create slider of color $color with width $sliderwidth and line color $linecolor"
    //% blockSetVariable=Slider
    //%group="Create"
    //% color.shadow="colorindexpicker"
    //% linecolor.shadow="colorindexpicker"
    export function createSlider3(color: number, sliderwidth: number, linecolor: number): Sprite {
        let sliderIndex = sliders.length;

        // Create the bar for the slider
        let barImage = image.create(sliderwidth, 5);
        barImage.fill(linecolor);
        let sliderBar = sprites.create(barImage, SpriteKind.Player);
        sliderBars.push(sliderBar);

        // Create the knob for the slider
        let knobImage = image.create(10, 7);
        knobImage.fill(color);
        let sliderKnob = sprites.create(knobImage, SpriteKind.Food);
        sliders.push(sliderKnob);

        // Position the knob at the leftmost position of the bar
        sliderKnob.x = sliderBar.x - sliderwidth / 2;
        sliderKnob.y = sliderBar.y;

        return sliderKnob;
    }

    /**
     * Select the specific slider to control it.
     */
    //% block="control $slider"
     //%group="Control"
    //% slider.shadow=variables_get
    export function controlSlider3(slider: Sprite) {
        selectedSlider = slider;
    }

    /**
     * Set the position of the slider bar and place the knob at the left edge.
     */
    //% block="set $slider position to X $x Y $y"
     //%group="Functions"
    //% slider.shadow=variables_get
    export function setSliderPosition3(slider: Sprite, x: number, y: number): void {
        let index = sliders.indexOf(slider);
        if (index != -1) {
            let sliderBar = sliderBars[index];

            // Move the slider bar
            sliderBar.setPosition(x, y);

            // Move the knob to the leftmost edge of the bar
            slider.setPosition(x - sliderBar.width / 2, y);
        }
    }

    /**
     * Check if a slider's value equals a given number.
     */
    //% block="if $slider value = $num"
    //% slider.shadow=variables_get
    //%group="Functions"
    //% num.min=0 num.max=100
    export function isSliderValue(slider: Sprite, num: number): boolean {
        let index = sliders.indexOf(slider);
        if (index == -1) return false;

        let sliderBar = sliderBars[index];
        let width = sliderBar.width;

        let position = slider.x - (sliderBar.x - width / 2);
        let value = Math.round((position / width) * 100);

        return value == num;
    }

    // Control logic for movement
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

    game.onUpdate(function () {
        if (selectedSlider) {
            let index = sliders.indexOf(selectedSlider);
            if (index != -1) {
                let sliderBar = sliderBars[index];
                let minX = sliderBar.x - sliderBar.width / 2;
                let maxX = sliderBar.x + sliderBar.width / 2 - 1;

                if (movingLeft && selectedSlider.x > minX) {
                    selectedSlider.x -= 0.5;
                }
                if (movingRight && selectedSlider.x < maxX) {
                    selectedSlider.x += 0.5;
                }
            }
        }
    });
    /**
 * Show the value of a specific slider on the screen, scaled according to its width.
 */
    //% block="Show value of $slider"
    //% slider.shadow=variables_get
    //%group="Functions"
    export function showSliderValue99(slider: Sprite): void {
        let index = sliders.indexOf(slider);
        if (index != -1) {
            let sliderBar = sliderBars[index];

            // Create a renderable text that will follow the slider
            scene.createRenderable(100, function (ctx) {
                let position = slider.x - (sliderBar.x - sliderBar.width / 2);

                // Calculate the value as a percentage of the total width
                let value = (position / (sliderBar.width - 1)) * 100;

                // Ensure the value is capped at 100 if it's rounding up
                if (value > 100) {
                    value = 100;
                } else if (value < 0) {
                    value = 0;
                }

                // Round the value for cleaner display
                value = Math.round(value);

                // Draw the value on the screen above the slider
                ctx.print(value.toString(), slider.x - 15, slider.y - 20);
            });
        }
    }
}