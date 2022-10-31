import { html } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { Component } from 'https://unpkg.com/preact?module'

import { ToggleSymbol } from './ToggleSymbol.module.js'

export class CarouselElement extends Component {
  constructor (props) {
    super(props)

    if (props.media.url.endsWith('.mp4')) {
      this.video = createRef()
    }

    this.lastSelected = false
    this.toggleVideo = this.toggleVideo.bind(this)
  }

  toggleVideo () {
    if (this.video.current.paused) {
      this.video.current.play()
    } else {
      this.video.current.pause()
    }
  }

  render (props) {
    if (props.media.url.endsWith('.mp4') && this.video.current) {
      // on lance automatiquement la vidéo si on arrive dessus
      if (props.selected && !this.lastSelected) {
        this.video.current.play()
      }
      // et on met en pause si on en part
      if (this.lastSelected && !props.selected) {
        this.video.current.pause()
      }
    }

    this.lastSelected = props.selected

    let displayCaption = true

    let credits = ''
    if (props.settings.credits) credits = props.settings.credits
    if (props.media.credits) credits = props.media.credits

    let description = ''
    if (props.settings.description) description = props.settings.description
    if (props.media.description) description = props.media.description

    if (credits === '' && description === '') { displayCaption = false }

    let mediaURL = props.media.url
    if (props.media.mobileUrl && window.innerWidth < 768) {
      mediaURL = props.media.mobileUrl
    }

    const imageClass =
      `lmh-carousel_image 
      ${props.selected ? 'selected' : ''} 
      ${props.media.imageFit ? 'lmh-carousel_image-' + props.media.imageFit : ''}`

    const toggleDescriptionText = props.descriptionOpen ? 'Voir moins' : 'Voir plus'
    const descriptionClass = props.descriptionOpen ? '' : 'hidden'
    const descriptionTranslate = props.descriptionOpen ? 0 : props.descriptionHeight + 4

    return html`
          <div class='lmh-carousel_image ${imageClass}'>
              <div class='lmh-carousel_image-wrapper'>
                  ${props.media.url.endsWith('.mp4')
                  ? html`<video onclick=${this.toggleVideo} ref=${this.video} muted loop playsinline autoplay='${props.selected}' src='${mediaURL}'/>`
                  : html`<img src='${mediaURL}'/>`}
              </div>
              ${displayCaption
              ? html`<div class='lmh-carousel_caption' style='transform: translateY(${descriptionTranslate}px);'>
                      ${description && props.descriptionToggleBtn
                        ? html`
                          <div class='lmh-carousel_caption-description-btn' onClick=${props.toggleDescription}>
                            <p>${toggleDescriptionText}</p>
                            <${ToggleSymbol}  ...${{ open: !props.descriptionOpen }}/>
                          </div>`
                        : ''}
                      ${credits
                        ? html`<div class='lmh-carousel_caption-credits'>
                          <p>${credits}</p>
                        </div>`
                        : ''}
                      ${description
                        ? html`<div ref=${props.descriptionRef} class='lmh-carousel_caption-description ${descriptionClass}'>
                          <p>${description}</p>
                        </div>`
                        : ''}
                  </div>`
              : ''}
          </div>            
      `
  }
}
