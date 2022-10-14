import { html } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { render, Component, createRef } from 'https://unpkg.com/preact?module'

import { CarouselElement } from './CarouselElement.module.js'
import { ArrowSymbol } from './ArrowSymbol.module.js'

class Carousel extends Component {
  state = {
    index: 0,
    arrowsPos: 0,
    componentWidth: 0,
    carouselWidth: 0,
    translateValue: 0,
    controlsReady: false
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

    this.calculateDimensions = this.calculateDimensions.bind(this)
    this.fixArrowsPosition = this.fixArrowsPosition.bind(this)
    this.positionArrows = this.positionArrows.bind(this)

    this.incrementIndex = this.incrementIndex.bind(this)
    this.decrementIndex = this.decrementIndex.bind(this)
  }

  /* * * * * * * * * * * * * * * * * * *
    * METHODS
    * * * * * * * * * * * * * * * * * * */
  componentDidMount () {
    if (this.settings.loop) {
      this.setLoopTimer(this.loopDuration)
    }

    this.calculateDimensions()

    setTimeout(this.fixArrowsPosition, 200)
    setTimeout(this.fixArrowsPosition, 500)

    this.loadingInterval = setInterval(this.fixArrowsPosition, 1000)

    window.addEventListener('resize', this.calculateDimensions)
  }

  componentWillUnmount () {
    if (this.loopTimer) {
      clearInterval(this.loopTimer)
    }
  }

  fixArrowsPosition () {
    const titleDimensions = document.querySelector('.lmh-carousel-story_title').getBoundingClientRect()
    const fixed = this.state.arrowsPos > (titleDimensions.height + 50)

    if (!fixed) {
      this.positionArrows()
    } else {
      this.setState(curr => ({
        ...curr,
        controlsReady: true
      }))
      clearInterval(this.loadingInterval)
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
      ? 'lmh-carousel-story_cover'
      : 'lmh-carousel-story_contain'
    return classList
  }

  renderArrows ({ leftArrow, rightArrow, index, limit, top }) {
    const leftArrowClass = index === 0 ? 'lmh-carousel-story_arrow-disabled' : ''
    const rightArrowClass = index === limit ? 'lmh-carousel-story_arrow-disabled' : ''

    return html`
        <div  class='lmh-carousel-story_arrows' style='top: ${top}px'>
            
            ${leftArrow
              ? html`<div class='lmh-carousel-story_arrow ${leftArrowClass}' onclick='${this.decrementIndex}'>
                  <${ArrowSymbol}  ...${{ pointing: 'left' }} />
                </div>`
              : ''}

            ${rightArrow
              ? html`<div class='lmh-carousel-story_arrow ${rightArrowClass}' onclick='${this.incrementIndex}'>
                  <${ArrowSymbol} />
                </div>`
              : ''}

        </div>
    `
  }

  renderProgressDots (total) {
    return html`
        <div class='lmh-carousel-story_progress-dots'>
            ${[...Array(total)].map((_el, i) => {
                return html`
                  <span 
                    onclick='${() => this.setIndex(i)}' 
                    class='lmh-carousel-story_progress-dot ${this.state.index === i ? 'selected' : ''}'>
                  </span>`
              })}
        </div>`
  }

  positionArrows () {
    const titleDimensions = document.querySelector('.lmh-carousel-story_title').getBoundingClientRect()
    const imageDimensions = document.querySelector('.lmh-carousel-story_image-wrapper').getBoundingClientRect()
    const arrowsPos = titleDimensions.height + imageDimensions.height / 2

    this.setState(curr => ({
      ...curr,
      arrowsPos
    }))
  }

  calculateCarouselDimensions (images) {
    const componentWidth = document.querySelector('.lmh-carousel-story').getBoundingClientRect().width
    const carouselWidth = images.length * (componentWidth - 64) + 16

    this.setState(curr => ({
      ...curr,
      componentWidth,
      carouselWidth
    }))
  }

  calculateDimensions () {
    this.calculateCarouselDimensions(this.props.images)
    this.positionArrows()
  }

  /* * * * * * * * * * * * * * * * * * *
    * RENDER
    * * * * * * * * * * * * * * * * * * */
  render (props) {
    const translateValue = this.state.index === 0 ? 0 : this.state.index * (this.state.componentWidth - 64) - 24

    const containerClass = this.getClassList(this.settings)
    const controlsClass = this.state.controlsReady ? 'lmh-carousel-story_controls-visible' : ''

    const containerStyle =
        `--image-height: ${this.settings.imageHeight ? this.settings.imageHeight + 'px' : '1fr'}; background-color: ${this.settings.backgroundColor ? this.settings.backgroundColor : 'var(--dark-grey)'};`

    const imagesContainerStyle =
        `width: ${this.state.carouselWidth}px;
          transform: translateX(${-translateValue}px);
          grid-template-columns: repeat(${props.images.length}, 1fr);`

    return html`
          <div class='lmh-carousel-story ${containerClass}' style=${containerStyle}>
              
              ${this.settings.title
                ? html`<div class='lmh-carousel-story_title'><p>${this.settings.title}</p></div>`
                : ''}

              <div class='lmh-carousel-story_images' style=${imagesContainerStyle}>

                  ${props.images.map((media, i) => {
                    return html`<${CarouselElement} 
                      ...${{
 media,
                          selected: this.state.index === i,
                          settings: this.settings
}} />`
                    })}

              </div>

              ${this.displayControls
                ? html`<div class='lmh-carousel-story_controls ${controlsClass}'>
                        ${this.displayDots
                          ? this.renderProgressDots(props.images.length)
                          : ''}
                        ${this.displayArrows
                          ? this.renderArrows({
                                leftArrow: this.settings.leftArrow,
                                rightArrow: this.settings.rightArrow,
                                index: this.state.index,
                                limit: props.images.length - 1,
                                top: this.state.arrowsPos
                              })
                          : ''}    
                    </div>`
                : ''}

          </div>
      `
  }
}

// renderer
export default async function renderer (node, props) {
  // await injectStyles('{{PARENT_URL}}/styles.css')
  render(html`<${Carousel} ...${props} />`, node)
}
