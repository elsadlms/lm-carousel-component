import readPropsNode from './readPropsNode.module.js'
import initCarousel from './Carousel.module.js'

const carouselElements = [...document.querySelectorAll('.lmh-carousel-story')]

carouselElements.forEach(element => {
  const props = readPropsNode(element)[0]
  initCarousel(element, props)
})
