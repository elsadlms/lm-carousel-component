import { html } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { Component } from 'https://unpkg.com/preact?module'

export class InputBlock extends Component {
  render (props) {
    const classList =
      `generator-form_input generator-form_input-${props.type} ${props.disabled ? 'generator-form_input--disabled' : ''} ${props.mandatory ? 'generator-form_input--mandatory' : ''}`

    return html`
          <div class=${classList}>
            <label for='${props.name}'>${props.label}</label>
            <input 
              onChange=${props.onChange}
              ref=${props.inputRef}
              name='${props.name}' 
              type='${props.type}' 
              ...${props.settings} />
          </div>
      `
  }
}
