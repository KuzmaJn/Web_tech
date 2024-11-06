// TODO: make this class more readable and compact
class SliderWithNumberInput extends HTMLElement {
    constructor() {
        super();
        // Attach a shadow DOM
        this.attachShadow({ mode: 'open' });

        // Create the wrapper
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');

        const checkbox = document.createElement('div');
        checkbox.setAttribute('class', 'checkbox');

        this.checkbox_input = document.createElement("input");
        this.checkbox_input.setAttribute('type', 'checkbox');
        this.checkbox_input.setAttribute('id', 'checkbox');

        // label for checkbox_input
        this.checkbox_label = document.createElement('label');
        this.checkbox_label.setAttribute('for', 'checkbox');
        this.checkbox_label.textContent = 'Press to change';

        // Create the slider input
        this.slider = document.createElement('input');
        this.slider.setAttribute('type', 'range');
        this.slider.setAttribute('min', '1');
        this.slider.setAttribute('max', '100');
        this.slider.setAttribute('value', '1');

        this.slider_span = document.createElement('span');
        this.slider_span.setAttribute('class', 'slider-value');
        this.slider_span.textContent = this.slider.value;
        // Create the number input
        this.numberInput = document.createElement('input');
        this.numberInput.setAttribute('type', 'number');
        this.numberInput.setAttribute('min', '1');
        this.numberInput.setAttribute('max', '100');
        this.numberInput.setAttribute('value', '1');

        // Append inputs to the wrapper
        checkbox.appendChild(this.checkbox_input);
        checkbox.appendChild(this.checkbox_label);
        wrapper.appendChild(checkbox);
        wrapper.appendChild(this.slider);
        wrapper.appendChild(this.slider_span);
        wrapper.appendChild(this.numberInput);

        // Attach styles and wrapper to the shadow DOM
        const style = document.createElement('style');
        style.textContent = `
      div {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 10rem;
        position: relative;
        margin: auto;
      }
      .checkbox {
        flex-direction: row;
        justify-content: space-around;
        margin-bottom: 1rem;
      }
      input {
        flex: 1 1 auto;
        width: 100%;
        border: none;
        border-radius: 1px;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
        background: #fff;
      }
      .checkbox input {
        flex: 0 0 auto;
        max-width: 1rem;
      }
      .checkbox label {
        flex: 0 0 auto;
      }
      .slider-value {
        position: absolute;
        top: 62%; /* Position on top of the slider thumb */
        transform: translateX(-50%);
        font-size: 1rem;
        min-width: 20%;
        padding: 2px 6px;
        background: #F1F1F1;
        border-radius: 1px;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
        pointer-events: none; /* So it doesn’t interfere with slider */
        text-align: center;
      }
      input[type='range']{
        appearance: none;
        height: 0.5rem;
      }
      input[type='number']{
        background: #F1F1F1;
      }
    `;
        this.shadowRoot.append(style, wrapper);

        // Sync the slider and number input values
        this.checkbox_input.addEventListener('input', this.showInputs.bind(this));
        this.slider.addEventListener('input', this.syncInputs.bind(this));
        this.numberInput.addEventListener('input', this.syncInputs.bind(this));

        const min = this.getAttribute('min') || '1';
        const max = this.getAttribute('max') || '100';
        const step = this.getAttribute('step') || '1';

        this.slider.setAttribute('min', min);
        this.slider.setAttribute('max', max);
        this.slider.setAttribute('step', step);
        this.numberInput.setAttribute('min', min);
        this.numberInput.setAttribute('max', max);
        this.numberInput.setAttribute('step', step);
        this.updateSlider_spanPosition();
        this.showInputs();
    }

    syncInputs(event) {
        const value = event.target.value;
        this.slider.value = value;
        this.numberInput.value = value;
        this.slider_span.textContent = value;
        this.updateSlider_spanPosition();
    }

    updateSlider_spanPosition() {
        // Calculate position based on the slider value
        const sliderValue = this.slider.value;
        const min = this.slider.min;
        const max = this.slider.max;

        // Calculate the position of the slider_span based on the slider’s width
        const percentage = ((sliderValue - min) / (max - min)) * 100;

        // Move the slider_span along with the thumb
        this.slider_span.style.left = `calc(${percentage}% + (${8 - (percentage * 0.15)}px))`;
    }

    showInputs() {
        if(this.checkbox_input.checked){
            this.slider.style.display = 'none';
            this.slider_span.style.display = 'none';
            this.numberInput.style.display = 'initial';
        } else{
            this.slider.style.display = 'initial';
            this.slider_span.style.display = 'initial';
            this.numberInput.style.display = 'none';
        }
    }
}

// Define the new element
customElements.define('slider-with-number-input', SliderWithNumberInput);
