import { html } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { Component } from 'https://unpkg.com/preact?module'

export class SelectBlock extends Component {
  render (props) {
    return html`
          <div class='generator-form_input generator-form_input-select'>
            <label for='${props.name}'>${props.label}</label>
            <select ref=${props.inputRef} props='${props.name}'>
                ${props.options.map(option => {
                    return html`
                      <option value='${option.value}'>${option.title}</option>
                    `
                })}
            </select>
          </div>
      `
  }
}
