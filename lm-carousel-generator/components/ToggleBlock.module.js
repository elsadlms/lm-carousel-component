import { html } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { Component } from 'https://unpkg.com/preact?module'

export class ToggleBlock extends Component {
  state = {
    selectedIndex: 0
  }

  constructor(props) {
    super(props)
  }

  toggleSelected() {
    const newIndex = this.state.selectedIndex === 0 ? 1 : 0
    const newType = this.props.options[newIndex].value

    this.setState(curr => ({
      ...curr,
      selectedIndex: newIndex,
    }))

    this.props.setCarouselType(newType)
  }

  selectOption(index) {
    const newType = this.props.options[index].value

    this.setState(curr => ({
      ...curr,
      selectedIndex: index,
    }))
    
    this.props.setCarouselType(newType)
  }

  render(props) {
    const selected = props.options[this.state.selectedIndex].value

    return html`
          <div ref=${props.inputRef} data-value=${selected} class="generator-form_input generator-form_input-toggle">
            <div class='generator-form_input-toggle-options'>
            ${props.options.map((option, i) => {
              const classList = `generator-form_input-toggle-option ${i === this.state.selectedIndex ? 'generator-form_input-toggle-option--selected' : ''}`
              return html`
                <div onclick=${()=> this.selectOption(i)} class=${classList}>
                  <div class='generator-form_input-toggle-option-illustration'>
                    <img src='/lm-carousel-generator/assets/${option.value}.png' />
                  </div>
                  <p>${option.label}</p>
                </div>
              `
            })}
            </div>
            <div class="generator-form_input-toggle" onclick=${()=> this.toggleSelected()}>
              <span class="generator-form_input-toggle-slider"></span>
            </div>
          </div>
      `
  }
}