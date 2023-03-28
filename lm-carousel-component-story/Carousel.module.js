import { html } from './lib/htm.js'
import { render, Component, createRef } from './lib/preact.js'

import { CarouselElement } from './CarouselElement.module.js'
import { FullscreenSymbol } from './FullscreenSymbol.module.js'
import { ArrowSymbol } from './ArrowSymbol.module.js'
import { StrToHtml } from './StrToHtml.module.js'

class Carousel extends Component {
  state = {
    index: 0,
    visibleIndex: 0,
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
  constructor(props) {
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

    this.scrollableRef = createRef()
    this.componentRef = createRef()
    this.imageWrapperRef = createRef()
    this.controlsRef = createRef()
    this.titleRef = createRef()
    this.targetIndex = null

    this.scrollBreakpoints = []
    this.indexThreshold = 0

    this.toggleFullscreen = this.toggleFullscreen.bind(this)

    this.handleScroll = this.handleScroll.bind(this)
    this.calculateDimensions = this.calculateDimensions.bind(this)
    this.fixArrowsPosition = this.fixArrowsPosition.bind(this)
    this.positionArrows = this.positionArrows.bind(this)

    this.incrementIndex = this.incrementIndex.bind(this)
    this.decrementIndex = this.decrementIndex.bind(this)
  }

  /* * * * * * * * * * * * * * * * * * *
    * METHODS
    * * * * * * * * * * * * * * * * * * */
  componentDidMount() {
    if (this.settings.loop) {
      this.setLoopTimer(this.loopDuration)
    }

    this.calculateDimensions()

    setTimeout(this.fixArrowsPosition, 200)
    setTimeout(this.fixArrowsPosition, 500)

    this.loadingInterval = setInterval(this.fixArrowsPosition, 1000)

    window.addEventListener('resize', this.calculateDimensions)
  }

  componentWillUnmount() {
    if (this.loopTimer) {
      clearInterval(this.loopTimer)
    }
  }

  handleScroll() {
    // si on s'arrête sur un breakpoint au scroll, on re-update l'index au cas où
    const scrollValue = this.scrollableRef.current.scrollLeft

    let newVisibleIndex = [...this.scrollBreakpoints].filter(breakpoint => breakpoint < (scrollValue - this.indexThreshold)).length

    if (newVisibleIndex != this.state.visibleIndex) {
      this.setState(curr => ({
        ...curr,
        visibleIndex: newVisibleIndex
      }))
    }

    let snappedIndex = this.scrollBreakpoints.findIndex(breakpoint => breakpoint === scrollValue)

    if (snappedIndex != -1) {
      // si on est juste en scroll auto à partir d'un clic sur un point, on s'arrête
      if (this.targetIndex != null && snappedIndex != this.targetIndex) {
        return
      }

      // si on est arrivé sur le bon index, on peut clean targetIndex
      this.targetIndex = null

      this.setState(curr => ({
        ...curr,
        index: snappedIndex,
        translateValue: scrollValue,
      }))
    }
  }

  fixArrowsPosition() {
    if (this.titleRef.current === null) return

    const titleDimensions = this.titleRef.current?.getBoundingClientRect()
    const imageDimensions = this.imageWrapperRef.current?.getBoundingClientRect()

    const titleHeight = titleDimensions ? titleDimensions.height : 0
    const imageHeight = imageDimensions ? imageDimensions.height : 0

    let fixed = this.state.arrowsPos === (titleHeight + imageHeight / 2)
    if (imageHeight === 0) fixed = true

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

  setLoopTimer(duration) {
    this.loopTimer = setInterval(() => {
      this.incrementIndex()
    }, duration)
  }

  setIndex(number) {
    if (this.loopTimer) {
      clearInterval(this.loopTimer)
      this.setLoopTimer(this.loopDuration)
    }

    this.targetIndex = number

    const translateValue = number === 0
      ? 0
      : number * (this.state.componentWidth - 64) - 24

    this.scrollableRef.current.scrollLeft = translateValue

    this.setState(curr => ({
      ...curr,
      index: number,
      translateValue,
    }))
  }

  incrementIndex() {
    const nextIndex = this.state.index === this.props.images.length - 1 ? 0 : this.state.index + 1
    this.setIndex(nextIndex)
  }

  decrementIndex() {
    const prevIndex = this.state.index === 0 ? this.props.images.length - 1 : this.state.index - 1
    this.setIndex(prevIndex)
  }

  getContainerClassList(settings) {
    let classList = ['lmh-carousel-story']

    if (settings.imageFit === 'cover') classList.push('lmh-carousel-story_cover')
    else classList.push('lmh-carousel-story_contain')

    if (settings.arrowsPosition === 'bottom') classList.push('lmh-carousel-story_arrows-bottom')
    else classList.push('lmh-carousel-story_arrows-center')

    if (this.state.fullscreen) classList.push('lmh-carousel-story--fullscreen')

    return classList
  }

  renderArrows({ leftArrow, rightArrow, index, limit, top }) {
    const leftArrowClasses = ['lmh-carousel-story_arrow']
    const rightArrowClasses = ['lmh-carousel-story_arrow']

    if (index === 0) leftArrowClasses.push('lmh-carousel-story_arrow-disabled')
    if (index === limit) rightArrowClasses.push('lmh-carousel-story_arrow-disabled')

    const arrowsClasses = ['lmh-carousel-story_arrows']
    const arrowsStyle = top ? `top: ${top}px` : ''

    return html`
        <div  class=${arrowsClasses.join(' ')} style=${arrowsStyle}>
            
            ${leftArrow
        ? html`<div class=${leftArrowClasses.join(' ')} onclick=${this.decrementIndex}>
                  <${ArrowSymbol}  ...${{ pointing: 'left' }} />
                </div>`
        : ''}

            ${rightArrow
        ? html`<div class=${rightArrowClasses.join(' ')} onclick=${this.incrementIndex}>
                  <${ArrowSymbol} />
                </div>`
        : ''}

        </div>
    `
  }

  renderProgressDots(total) {
    const dotsClasses = ['lmh-carousel-story_progress-dots']

    return html`
        <div class=${dotsClasses.join(' ')}>
            ${[...Array(total)].map((_el, i) => {
      const dotClasses = ['lmh-carousel-story_progress-dot']
      if (this.state.index === i) dotClasses.push('lmh-carousel-story_progress-dot--selected')

      return html`
                    <span 
                      onclick=${() => this.setIndex(i)} 
                      class=${dotClasses.join(' ')}>
                    </span>`
    })}
        </div>`
  }

  positionArrows() {
    if (this.titleRef.current === null) return
    if (this.imageWrapperRef.current === null) return

    const titleDimensions = this.titleRef.current?.getBoundingClientRect()
    const imageDimensions = this.imageWrapperRef.current?.getBoundingClientRect()

    const titleHeight = titleDimensions ? titleDimensions.height : 0
    const imageHeight = imageDimensions ? imageDimensions.height : 0
    const imageY = imageDimensions ? imageDimensions.y : 0

    let arrowsPos = 0

    if (imageHeight > 0) {
      arrowsPos = this.state.fullscreen
        ? imageY + imageHeight / 2
        : titleHeight + imageHeight / 2
    }

    this.setState(curr => ({
      ...curr,
      arrowsPos
    }))
  }

  calculateDimensions() {
    const componentWidth = this.componentRef.current.getBoundingClientRect().width
    const carouselWidth = this.props.images.length * (componentWidth - 64) + 16

    // on calcule les breakpoints du scroll snap
    if (componentWidth > 0) {
      this.scrollBreakpoints = []
      for (let i = 0; i < this.props.images.length; i++) {
        let value = i * (componentWidth - 64) - 24
        if (i === 0) value = 0
        if (i === this.props.images.length - 1) value -= 24
        this.scrollBreakpoints.push(value)
      }
    }

    this.indexThreshold = this.scrollBreakpoints[1] / 2

    this.setState(curr => ({
      ...curr,
      componentWidth,
      carouselWidth
    }),
      this.positionArrows
    )
  }

  toggleFullscreen() {
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
  render(props) {
    const titleDimensions = this.titleRef?.current?.getBoundingClientRect()
    const controlsDimensions = this.controlsRef?.current?.getBoundingClientRect()

    const titleHeight = titleDimensions ? titleDimensions.height : 0
    const controlsHeight = controlsDimensions ? controlsDimensions.height : 0

    const imagesMaxHeight = this.state.fullscreen
      ? window.innerHeight - titleHeight - controlsHeight + 'px'
      : 'unset'

    const containerClasses = this.getContainerClassList(this.settings)

    const controlsClasses = ['lmh-carousel-story_controls']
    if (this.state.controlsReady) controlsClasses.push('lmh-carousel-story_controls-visible')

    const containerStyle = `
      ${this.settings.backgroundColor ? `--carousel-bg-color: ${this.settings.backgroundColor}` : ''};
      ${this.settings.titleColor ? `--carousel-title-color: ${this.settings.titleColor}` : ''};
      ${this.settings.descriptionColor ? `--carousel-description-color: ${this.settings.descriptionColor}` : ''};
      ${this.settings.creditsColor ? `--carousel-credits-color: ${this.settings.creditsColor}` : ''};
      ${this.settings.dotColor ? `--carousel-dot-color: ${this.settings.dotColor}` : ''};
      ${this.settings.arrowColor ? `--carousel-arrow-color: ${this.settings.arrowColor}` : ''};
      ${this.settings.arrowColorDisabled ? `--carousel-arrow-color-disabled: ${this.settings.arrowColorDisabled}` : ''};
      ${this.settings.arrowBackgroundColor ? `--carousel-arrow-bg: ${this.settings.arrowBackgroundColor}` : ''};
      ${this.settings.arrowBackgroundColorHover ? `--carousel-arrow-bg-hover: ${this.settings.arrowBackgroundColorHover}` : ''};
      ${this.settings.imageBackground ? `--carousel-image-bg: ${this.settings.imageBackground}` : ''};
      ${this.settings.imageHeight && !this.state.fullscreen ? `--carousel-image-height: ${this.settings.imageHeight}` : ''};
    `

    const imagesContainerStyle = `
      width: ${this.state.carouselWidth}px;
      height: ${imagesMaxHeight};
      grid-template-columns: repeat(${props.images.length}, 1fr);
    `

    return html`
          <div ref=${this.componentRef} class=${containerClasses.join(' ')} style=${containerStyle}>
              
              <div ref=${this.titleRef} class='lmh-carousel-story_title'>
                ${this.settings.title ? html`<${StrToHtml}  ...${{ content: this.settings.title }}/>` : ''}
              </div>
                
              ${this.settings.fullscreen
        ? html`<div onclick=${this.toggleFullscreen} class='lmh-carousel-story_btn-fullscreen'>
                        <${FullscreenSymbol} ...${{ active: this.state.fullscreen }} />
                      </div>`
        : ''}

              <div ref=${this.scrollableRef} onScroll=${this.handleScroll} class='lmh-carousel-story_scrollable'>

                <div class='lmh-carousel-story_images' style=${imagesContainerStyle}>

                  ${props.images.map((media, i) => {
          return html`<${CarouselElement} 
                      ...${{
              media,
              visible: this.state.visibleIndex === i,
              selected: this.state.index === i,
              settings: this.settings,
              imageWrapperRef: this.imageWrapperRef,
            }} />`
        })}

                </div>

              </div>

              ${this.displayControls
        ? html`<div ref=${this.controlsRef} class=${controlsClasses.join(' ')}>

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
export default async function renderer(node, props) {
  // await injectStyles('{{PARENT_URL}}/styles.css')
  render(html`<${Carousel} ...${props} />`, node)
}
