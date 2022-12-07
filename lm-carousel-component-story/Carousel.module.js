import { html } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { render, Component, createRef } from 'https://unpkg.com/preact?module'

import { CarouselElement } from './CarouselElement.module.js'
import { FullscreenSymbol } from './FullscreenSymbol.module.js'
import { ArrowSymbol } from './ArrowSymbol.module.js'
import { StrToHtml } from './StrToHtml.module.js'

class Carousel extends Component {
  state = {
    index: 0,
    arrowsPos: 0,
    componentWidth: 0,
    carouselWidth: 0,
    translateValue: 0,
    controlsReady: false,
    fullscreen: false
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

    this.componentRef = createRef()
    this.imageWrapperRef = createRef()
    this.controlsRef = createRef()
    this.titleRef = createRef()

    this.toggleFullscreen = this.toggleFullscreen.bind(this)

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
    if (!this.titleRef) return

    const titleDimensions = this.titleRef.current.getBoundingClientRect()
    const imageDimensions = this.imageWrapperRef.current.getBoundingClientRect()

    const fixed = this.state.arrowsPos === (titleDimensions.height + imageDimensions.height / 2)

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

    if (this.state.fullscreen) {
      classList += ' lmh-carousel-story--fullscreen'
    }

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
    if (!this.titleRef) return
    if (!this.imageWrapperRef) return

    const titleDimensions = this.titleRef.current.getBoundingClientRect()
    const imageDimensions = this.imageWrapperRef.current.getBoundingClientRect()
    const arrowsPos = this.state.fullscreen 
      ? imageDimensions.y + imageDimensions.height / 2
      : titleDimensions.height + imageDimensions.height / 2

    this.setState(curr => ({
      ...curr,
      arrowsPos
    }))
  }

  calculateDimensions () {
    const componentWidth = this.componentRef.current.getBoundingClientRect().width
    const carouselWidth = this.props.images.length * (componentWidth - 64) + 16

    this.setState(curr => ({
        ...curr,
        componentWidth,
        carouselWidth
      }),
      this.positionArrows
    )
  }

  toggleFullscreen () {
    this.setState(
      curr => ({
        ...curr,
        fullscreen: !curr.fullscreen
      }), 
      this.calculateDimensions
    )
  }

  /* * * * * * * * * * * * * * * * * * *
    * RENDER
    * * * * * * * * * * * * * * * * * * */
  render (props) {
    const titleDimensions = this.titleRef?.current?.getBoundingClientRect()
    const controlsDimensions = this.controlsRef?.current?.getBoundingClientRect()

    const translateValue = this.state.index === 0 
      ? 0 
      : this.state.index * (this.state.componentWidth - 64) - 24
      
    const imagesMaxHeight = this.state.fullscreen 
      ? window.innerHeight - titleDimensions.height - controlsDimensions.height + 'px'
      : 'unset'

    const containerClass = this.getClassList(this.settings)
    const controlsClass = this.state.controlsReady ? 'lmh-carousel-story_controls-visible' : ''

    const containerStyle =
        `--image-height: ${this.settings.imageHeight && !this.state.fullscreen ? this.settings.imageHeight + 'px' : '1fr'}; 
        background-color: ${this.settings.backgroundColor ? this.settings.backgroundColor : 'var(--dark-grey)'};`
    
    const imagesContainerStyle =
        `width: ${this.state.carouselWidth}px;
        height: ${imagesMaxHeight};
        transform: translateX(${-translateValue}px);
        grid-template-columns: repeat(${props.images.length}, 1fr);`

    return html`
          <div ref=${this.componentRef} class='lmh-carousel-story ${containerClass}' style=${containerStyle}>
              
              ${this.settings.title
                ? html`<div ref=${this.titleRef} class='lmh-carousel-story_title'>
                          <${StrToHtml}  ...${{ content: this.settings.title }}/>
                        </div>`
                : ''}
                
              ${this.settings.fullscreen
                ? html`<div onclick=${this.toggleFullscreen} class='lmh-carousel-story_btn-fullscreen'>
                        <${FullscreenSymbol} ...${{ active: this.state.fullscreen }} />
                      </div>`
                : ''}

              <div class='lmh-carousel-story_images' style=${imagesContainerStyle}>

                  ${props.images.map((media, i) => {
                    return html`<${CarouselElement} 
                      ...${{
                          media,
                          selected: this.state.index === i,
                          settings: this.settings,
                          imageWrapperRef: this.imageWrapperRef,
                      }} />`
                    })}

              </div>

              ${this.displayControls
                ? html`<div ref=${this.controlsRef} class='lmh-carousel-story_controls ${controlsClass}'>
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
