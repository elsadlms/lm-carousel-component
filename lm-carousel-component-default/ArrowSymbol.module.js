import { html } from './lib/htm.js'
import { Component } from './lib/preact.js'

export class ArrowSymbol extends Component {
  render ({ pointing }) {
    const rotate = pointing === 'left' ? 180 : 0

    return html`
          <svg style="transform: rotate(${rotate}deg);" width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="arrow-symbol" fill-rule="evenodd" clip-rule="evenodd" d="M0 3.762V5.238H9.44L7.056 7.938L8 9L12 4.5L8 0L7.056 1.062L9.44 3.762H0Z" />
          </svg>
      `
  }
}
