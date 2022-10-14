import { html } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { render, Component, createRef } from 'https://unpkg.com/preact?module'

import { CarouselElement } from './CarouselElement.module.js'
import { ArrowSymbol } from './ArrowSymbol.module.js'

class Carousel extends Component {
  state = {
    index: 0,
    descriptionOpen: false,
    descriptionHeight: 20
  }

  /* * * * * * * * * * * * * * * * * * *
     * CONSTRUCTOR
     * * * * * * * * * * * * * * * * * * */
  constructor (props) {
    console.log(props)
    super(props)

    this.settings = this.props.settings ?? {}
    if (typeof this.settings === 'string') this.settings = {}

    this.displayDots = this.settings.dots
    this.displayArrows = this.settings.leftArrow || this.settings.rightArrow
    this.displayControls = this.displayDots || this.displayArrows

    if (!this.displayControls) { this.settings.loop = true }

    this.defaultLoopDuration = 2000
    this.loopDuration = Number.isInteger(this.settings.duration) ? this.settings.duration : this.defaultLoopDuration

    this.incrementIndex = this.incrementIndex.bind(this)
    this.decrementIndex = this.decrementIndex.bind(this)

    this.calculateDescriptionHeight = this.calculateDescriptionHeight.bind(this)
    this.toggleDescription = this.toggleDescription.bind(this)
  }

  /* * * * * * * * * * * * * * * * * * *
     * METHODS
     * * * * * * * * * * * * * * * * * * */
  componentDidMount () {
    if (this.settings.loop) {
      this.setLoopTimer(this.loopDuration)
    }

    this.calculateDescriptionHeight()

    if (this.settings.toggleDescriptionBtn === false) {
      this.setState(curr => ({
        ...curr,
        descriptionOpen: true
      }))
    }
  }

  componentWillUnmount () {
    if (this.loopTimer) {
      clearInterval(this.loopTimer)
    }
  }

  setLoopTimer (duration) {
    this.loopTimer = setInterval(() => {
      this.incrementIndex()
    }, duration)
  }

  setIndex (number) {
    if (this.loopTimer) {
      clearInterval(this.loopTimer)
      this.setLoopTimer(this.loopDuration)
    }

    this.setState(curr => ({
      ...curr,
      index: number
    }))
  }

  incrementIndex () {
    const nextIndex = this.state.index === this.props.images.length - 1 ? 0 : this.state.index + 1
    this.setIndex(nextIndex)
  }

  decrementIndex () {
    const prevIndex = this.state.index === 0 ? this.props.images.length - 1 : this.state.index - 1
    this.setIndex(prevIndex)
  }

  getClassList (settings) {
    let classList = ''
    classList += settings.imageFit === 'cover'
      ? 'lmh-carousel_cover'
      : 'lmh-carousel_contain'
    return classList
  }

  renderArrows ({ leftArrow, rightArrow, index, limit }) {
    const leftArrowClass = index === 0 ? 'lmh-carousel-story_arrow-disabled' : ''
    const rightArrowClass = index === limit ? 'lmh-carousel-story_arrow-disabled' : ''

    return html`
            <div  class="lmh-carousel_arrows">

                ${leftArrow
                  ? html`<div class="lmh-carousel_arrow ${leftArrowClass}" onclick="${this.decrementIndex}">
                        <${ArrowSymbol}  ...${{ pointing: 'left' }} />
                      </div>`
                    : ''}

                ${rightArrow
                ? html`<div class="lmh-carousel_arrow ${rightArrowClass}" onclick="${this.incrementIndex}">
                    <${ArrowSymbol} />
                  </div>`
                : ''}

            </div>
        `
  }

  renderProgressDots (total) {
    return html`
            <div class='lmh-carousel_progress-dots'>
                ${[...Array(total)].map((_el, i) => {
                  return html`
                    <span 
                      onclick='${() => this.setIndex(i)}' 
                      class='lmh-carousel_progress-dot ${this.state.index === i ? 'selected' : ''}'>
                    </span>`
                })}                  
            </div>`
  }

  calculateDescriptionHeight () {
    const descriptionBlock = document.querySelector('.lmh-carousel_image.selected .lmh-carousel_caption-description')

    if (!descriptionBlock) return

    const descriptionHeight = descriptionBlock
      .getBoundingClientRect()
      .height

    this.setState(curr => ({
      ...curr,
      descriptionHeight
    }))
  }

  toggleDescription () {
    this.calculateDescriptionHeight()
    this.setState(curr => ({
      ...curr,
      descriptionOpen: !curr.descriptionOpen
    }))
  };

  /* * * * * * * * * * * * * * * * * * *
     * RENDER
     * * * * * * * * * * * * * * * * * * */
  render (props) {
    const containerClass = this.getClassList(this.settings)

    const containerStyle = `--carousel-max-height: ${this.settings.height ? this.settings.height + 'px' : 'none'};`

    return html`
            <div class='lmh-carousel ${containerClass}' style=${containerStyle}>
                <div class='lmh-carousel_images'>
                    ${props.images.map((media, i) => {
                        return html`<${CarouselElement} 
                        ...${{
                            media,
                            selected: this.state.index === i,
                            settings: this.settings,
                            toggleDescription: this.toggleDescription,
                            descriptionOpen: this.state.descriptionOpen,
                            descriptionHeight: this.state.descriptionHeight,
                            descriptionToggleBtn: this.settings.toggleDescriptionBtn
                          }} />`
                      })}
                </div>

                ${this.displayControls
                ? html`<div class='lmh-carousel_controls'>
                        ${this.displayDots
                          ? this.renderProgressDots(props.images.length)
                          : ''}
                        ${this.displayArrows
                          ? this.renderArrows({
                              leftArrow: props.settings.leftArrow,
                              rightArrow: props.settings.rightArrow,
                              index: this.state.index,
                              limit: props.images.length - 1
                          })
                          : ''}    
                    </div>`
                : ''
            }
            </div>
        `
  }
}

// renderer
export default async function renderer (node, props) {
  // await injectStyles('{{PARENT_URL}}/styles.css')
  render(html`<${Carousel} ...${props} />`, node)
}
