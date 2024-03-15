const acceptableTypes = ['default', 'primary', 'danger', 'neutral', 'link'];
const acceptableSizes = ['small', 'medium', 'large'];

const propSpecs = {
    accessibilityText: String,
    disabled: {
      type: Boolean,
      default: false
    },
    faIcon: Array,
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: 'Button'
    },
    size: {
        type: String,
        default: 'medium',
        validator: function (value) {
            return acceptableSizes.includes(value)
        }
    },
    type: {
        type: String,
        default: 'default',
        validator: function (value) {
            return acceptableTypes.indexOf(value) !== -1
        }
    }
};

class WebButton extends WebComponent {
    static get observedAttributes() {
        return Object.keys(propSpecs);
    }
  
    constructor() {
        super();

        this.propSpecs = propSpecs;
        this.linkStylesheet('button');

        this.button = document.createElement('button');
        const slot = document.createElement('slot'); // Create a slot for slotted content
    
        this.shadowRoot.append(this.button, slot); // Append the slot to the shadow DOM
    
        // Listen for changes in the slot's content
        slot.addEventListener('slotchange', () => {
            if (slot.assignedNodes().length > 0) {
                // If there's slotted content, clear the button's textContent
                this.button.textContent = '';
            }
        });
        console.log('constructed')
    }

    updateA11yText() {
        const accessibilityText = this.getAttribute('accessibilityText');

        if (accessibilityText) {
            if (this.a11yText) {
                this.a11yText.textContent = accessibilityText;
            }
            else {
                this.createA11yText(accessibilityText);
            }
        }
    } 

    updateLabel() {
        const label = this.getAttribute('label') || '';

        // Only set textContent if there's no slotted content
        if (!this.hasSlottedContent()) {
            this.button.textContent = label;
        }
    }
  
    update(name, oldValue, newValue) {
        const accessibilityText = this.getAttribute('accessibilityText');
        const disabled = this.hasAttribute('disabled') && this.getAttribute('disabled') !== 'false';
        const label = this.getAttribute('label') || '';
        const size = this.getAttribute('size');
        const type = this.getAttribute('type');
    
        // Applying attributes
        this.button.id = this.getAttribute('id');
        this.button.disabled = disabled;

        if (name === 'size' || name === 'type') {
            this.button.classList.remove(`btn--${oldValue}`);
            this.button.classList.add(`btn--${newValue}`);
        }
        else {
            this.button.classList.add('btn', `btn--${size}`, `btn--${type}`);
        }
  
        // Only set textContent if there's no slotted content
        if (!this.hasSlottedContent()) {
            this.button.textContent = label;
        }
    
        if (accessibilityText) {
            if (this.a11yText) {
                this.a11yText.textContent = accessibilityText;
            }
            else {
                this.createA11yText(accessibilityText);
            }
        }
    }
  
    createA11yText(text) {
        this.a11yText = document.createElement('span');
        this.a11yText.className = 'sr-only';
        this.a11yText.textContent = text;
        this.button.appendChild(this.a11yText);
    }
}
  
window.customElements.define('web-button', WebButton);
