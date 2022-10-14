import { html } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { Component, createRef } from 'https://unpkg.com/preact?module'

export class Snippet extends Component {
  state = {
    notification: false
  }

  constructor(props) {
    super(props)
  }

  generateSnippet() {
    const componentName = this.props.carouselSettings.type === 'carousel'
      ? 'lmh-carousel'
      : 'lmh-carousel-story'

    const output =
      `
  ${this.generateHead(this.props.carouselSettings.type)}
  <div class='lmh-component ${componentName}' data-type='${componentName}'>
    <data class='lmh-component__props' style='display: none;'>
          ${this.generateSettings(this.props.carouselSettings)}
          ${this.generateImages(this.props.carouselImages)}
    </data>
  </div>
    `
    return this.cleanOutput(output)
  }

  copyToClipboard(text) {
    if (!navigator.clipboard) return
    navigator.clipboard.writeText(text)

    this.displayNotification()
  }

  displayNotification() {
    this.setState(curr => ({
      ...curr,
      notification: true,
    }))

    window.setTimeout(() => {
      this.setState(curr => ({
        ...curr,
        notification: false,
      }))
    }, 2000)
  }

  generateHead(type) {
    const root = type === "carousel"
      ? 'https://assets-decodeurs.lemonde.fr/redacweb/elsa-delmas-carousel-test'
      : 'https://assets-decodeurs.lemonde.fr/redacweb/elsa-delmas-carousel-v2'

    const output = `
      <link rel="stylesheet" type="text/css" href="https://assets-decodeurs.lemonde.fr/redacweb/statics/styles/reset.css">
      <link rel="stylesheet" type="text/css" href="https://assets-decodeurs.lemonde.fr/redacweb/statics/styles/fonts.css">
      <link rel="stylesheet" type="text/css" href="https://assets-decodeurs.lemonde.fr/redacweb/statics/styles/variables.css">
      <link rel="stylesheet" type="text/css" href="${root}/styles.css">
      <script defer type="module" src="${root}/index.module.js"></script>
    `.replace(/\n\s*/igm, '\n  ')
    return output
  }

  generateSettings(settings) {
    const output = `
    <data data-title="settings">
      <data data-title="leftArrow" data-type="boolean">${settings.arrowLeft}</data>
      <data data-title="rightArrow" data-type="boolean">${settings.arrowRight}</data>
      <data data-title="dots" data-type="boolean">${settings.dots}</data>
      <data data-title="imageFit" data-type="string">${settings.imageFit}</data>
      <data data-title="loop" data-type="boolean">${settings.loop}</data>
      ${settings.loop ? `<data data-title="duration" data-type="number">${settings.loopDuration}</data>` : ``}
      ${settings.maxHeight ? `<data data-title="height" data-type="number">${settings.maxHeightValue}</data>` : ``}
      ${settings.backgroundColor ? `<data data-title="backgroundColor" data-type="string">${settings.backgroundColor}</data>` : ``}
      ${settings.title ? `<data data-title="title" data-type="string">${settings.title}</data>` : ``}
      ${settings.description ? `<data data-title="description" data-type="string">${settings.description}</data>` : ``}
      ${settings.credits ? `<data data-title="credits" data-type="string">${settings.credits}</data>` : ``}
      <data data-title="toggleDescriptionBtn" data-type="boolean">${settings.toggleDescriptionBtn}</data>
    </data>
    `
    return output
  }

  generateImages(images) {
    const output = `
    <data data-title="images">
      ${images.map((img) => {
      if (!img.url) return
      return (
        `
          <data> 
            ${img.url ? `<data data-title="url" data-type="string">${img.url}</data>` : ''}
            ${img.mobileUrl ? `<data data-title="mobileUrl" data-type="string">${img.mobileUrl}</data>` : ''}
            ${img.imageFit ? `<data data-title="imageFit" data-type="string">${img.imageFit}</data>` : ''}
            ${img.description ? `<data data-title="description" data-type="string">${img.description}</data>` : ''}
            ${img.credits ? `<data data-title="credits" data-type="string">${img.credits}</data>` : ''}
          </data>`
      )
    }).join('\n')}
    </data>
    `
    return output
  }

  cleanOutput(output) {
    let cleaned = output.split('\n')
    cleaned = cleaned.filter(line => line.trim().length != 0)
    cleaned = cleaned.join('\n')
    return cleaned
  }

  render(props) {
    const snippetReady = props.carouselSettings.type && !props.error;
    const output = this.generateSnippet()

    const notificationActive = this.state.notification ? 'generator-form_snippet-copy-notification--active' : ''
    const copyBtnDisabled = snippetReady ? '' : 'generator-form_snippet-copy-btn--disabled'

    return html`
        <div class='generator-form_snippet-container'>
          <div class='generator-form_snippet-copy'>
            <p class='generator-form_snippet-copy-btn ${copyBtnDisabled}' onclick=${() => this.copyToClipboard(output)}>Copier le
              code</p>
            <p class='generator-form_snippet-copy-notification ${notificationActive}'>Le code a été copié dans le presse-papier
              !</p>
          </div>
          <pre class='generator-form_snippet-code' ref=${this.snippetContainer}>
                      ${snippetReady ? output : 'Le contenu du snippet sera généré ici'}
                  </pre>
        </div>
      `
  }
}