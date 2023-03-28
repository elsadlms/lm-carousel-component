import { html } from './lib/htm.js'
import { Component, createRef } from './lib/preact.js'

import { StrToHtml } from './StrToHtml.module.js'

export class CarouselElement extends Component {
  constructor(props) {
    super(props)

    if (props.media.url?.endsWith('.mp4')) {
      this.video = createRef()
    }

    this.lastSelected = false
    this.toggleVideo = this.toggleVideo.bind(this)
  }

  toggleVideo() {
    if (!this.props.selected) {
      return
    }

    if (this.video.current.paused) {
      this.video.current.play()
    } else {
      this.video.current.pause()
    }
  }

  render(props) {
    if (props.media.url?.endsWith('.mp4') && this.video.current) {
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

    const imageClasses = ['lmh-carousel-story_image']
    if (props.selected) imageClasses.push('lmh-carousel-story_image--selected')
    if (props.visible) imageClasses.push('lmh-carousel-story_image--visible')
    if (props.media.imageFit) imageClasses.push(`lmh-carousel-story_image-${props.media.imageFit}`)

    return html`
        <div class=${imageClasses.join(' ')}>
            <div ref=${props.imageWrapperRef} class="lmh-carousel-story_image-wrapper">
                ${props.media.url?.endsWith('.mp4')
        ? html`<video onclick=${this.toggleVideo} ref=${this.video} muted loop playsinline autoplay="${props.selected}" src="${mediaURL}"/>`
        : html`<img src="${mediaURL}"/>`}
            </div>
            ${displayCaption
        ? html`<div ref=${props.imageCaptionRef} class="lmh-carousel-story_caption">
                      ${description ? html`<div class="lmh-carousel-story_caption-description"><${StrToHtml}  ...${{ content: description }}/></div>` : ''}
                      ${credits ? html`<div class="lmh-carousel-story_caption-credits"><${StrToHtml}  ...${{ content: credits }}/></div>` : ''}
                  </div>`
        : ''}
        </div>            
    `
  }
}
