import { html } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { Component, createRef } from 'https://unpkg.com/preact?module'

export class CarouselElement extends Component {

  constructor(props) {
    super(props)

    if (props.media.url.endsWith(".mp4")) {
        this.video = createRef()
    }

    this.lastSelected = false
    this.toggleVideo = this.toggleVideo.bind(this)
  }

  toggleVideo() {
    if (this.video.current.paused) {
        this.video.current.play()
    } else {
        this.video.current.pause()
    }
  }

  render({ media, selected, settings }) {

    if (media.url.endsWith(".mp4") && this.video.current) {
        // on lance automatiquement la vidéo si on arrive dessus
        if (selected && !this.lastSelected) {
            this.video.current.play()
        }
        // et on met en pause si on en part
        if (this.lastSelected && !selected) {
            this.video.current.pause()
        }
    }

    this.lastSelected = selected

    let displayCaption = true

    let credits = "";
    if (settings.credits) credits = settings.credits
    if (media.credits) credits = media.credits

    let description = "";
    if (settings.description) description = settings.description
    if (media.description) description = media.description

    if (credits === "" && description === "") { displayCaption = false }

    let mediaURL = media.url
    if (media.mobileUrl && window.innerWidth < 768) {
        mediaURL = media.mobileUrl
    }

    const imageClass = 
      `lmh-carousel_image 
      ${selected ? 'selected' : ''} 
      ${media.imageFit ? 'lmh-carousel_image-' + media.imageFit : ''}`

    return html`
        <div class="lmh-carousel-story_image ${imageClass}">
            <div class="lmh-carousel-story_image-wrapper">
                ${media.url.endsWith(".mp4") 
                  ? html`<video onclick=${this.toggleVideo} ref=${this.video} muted loop playsinline autoplay="${selected}" src="${mediaURL}"/>` 
                  : html`<img src="${mediaURL}"/>`}
            </div>
            ${displayCaption 
              ? html`<div class="lmh-carousel-story_caption">
                      ${description ? html`<div class="lmh-carousel-story_caption-description"><p>${description}</p></div>` : ''}
                      ${credits ? html`<div class="lmh-carousel-story_caption-credits"><p>${credits}</p></div>` : ''}
                  </div>`
              : ''}
        </div>            
    `
  }
}