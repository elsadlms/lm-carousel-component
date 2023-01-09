import { html } from './lib/htm.js'
import { Component } from './lib/preact.js'

export class StrToHtml extends Component {
  constructor(props) {
    super(props)
    this.id = `lm-strtohtml-${Math.random().toString(36).slice(2)}` 
  }

  componentDidMount () {
    document.getElementById(this.id).innerHTML = this.props.content
  }

  componentDidUpdate () {
    document.getElementById(this.id).innerHTML = this.props.content
  }

  render() {
    const { props } = this

    if (props.content === undefined || props.content === '') return null

    return html`<span id=${this.id} />`
  }
}
