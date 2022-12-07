import { html } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { Component, h } from 'https://unpkg.com/preact?module'

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
