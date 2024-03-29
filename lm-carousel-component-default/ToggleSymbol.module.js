import { html } from './lib/htm.js'
import { Component } from './lib/preact.js'

export class ToggleSymbol extends Component {
  render ({ open }) {
    const rotate = open ? 0 : 180

    return html`
          <svg style="transform: rotate(${rotate}deg);" width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.056 5L8 4.04531L4 0L0 4.04531L0.944 5L4 1.8932L7.056 5Z" fill="#A4A9B4"/>
          </svg>
      `
  }
}
