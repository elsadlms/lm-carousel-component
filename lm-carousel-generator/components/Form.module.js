import { html } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { render, Component, createRef } from 'https://unpkg.com/preact?module'

import { Snippet } from './Snippet.module.js'
import { InputBlock } from './InputBlock.module.js'
import { SelectBlock } from './SelectBlock.module.js'
import { newElementBlock } from './newElementBlock.module.js'

import { getValue } from './../utils/getValue.module.js'
import { ToggleBlock } from './ToggleBlock.module.js'

class Form extends Component {
  state = {
    index: 0,
    loop: false,
    maxHeight: false,
    elements: [0, 1, 2],
    deleted: [],
    carouselSettings: {},
    carouselImages: [],
    carouselType: 'carousel',
    errorMessage: ''
  }

  /* * * * * * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * * * * * */
  constructor () {
    super()
    this.onValidate = new Event('onValidate')

    this.inputType = createRef()
    this.inputDots = createRef()
    this.inputBackgroundColor = createRef()
    this.inputArrowLeft = createRef()
    this.inputArrowRight = createRef()
    this.inputToggleDescriptionBtn = createRef()
    this.inputImageFit = createRef()
    this.inputLoop = createRef()
    this.inputLoopDuration = createRef()
    this.inputMaxHeight = createRef()
    this.inputMaxHeightValue = createRef()
    this.inputTitle = createRef()
    this.inputDescription = createRef()
    this.inputCredits = createRef()

    this.newImages = []
    this.newSettings = {}

    this.setSettings = this.setSettings.bind(this)
    this.toggleState = this.toggleState.bind(this)
    this.setNewElement = this.setNewElement.bind(this)
    this.deleteElement = this.deleteElement.bind(this)
  }

  /* * * * * * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * * * * * */
  validateForm () {
    this.newSettings = {}
    this.newImages = []

    document.dispatchEvent(this.onValidate)
    this.setSettings()

    if (this.newImages.length === 0) {
      this.setState(curr => ({
        ...curr,
        errorMessage: 'Il faut au moins une image !'
      }))
      return
    }

    if (this.newImages.filter(img => img.url != '').length === 0) {
      this.setState(curr => ({
        ...curr,
        errorMessage: 'Il faut au moins renseigner une URL !'
      }))
      return
    }

    this.setState(curr => ({
      ...curr,
      carouselSettings: this.newSettings,
      carouselImages: this.newImages,
      errorMessage: ''
    }))
  }

  setSettings () {
    this.newSettings.type = getValue(this.inputType)

    this.newSettings.dots = this.newSettings.type === 'story' ? true : getValue(this.inputDots)
    this.newSettings.arrowLeft = this.newSettings.type === 'story' ? true : getValue(this.inputArrowLeft)
    this.newSettings.arrowRight = this.newSettings.type === 'story' ? true : getValue(this.inputArrowRight)
    this.newSettings.toggleDescriptionBtn = this.newSettings.type === 'story' ? false : getValue(this.inputToggleDescriptionBtn)

    this.newSettings.imageFit = getValue(this.inputImageFit)

    this.newSettings.backgroundColor = this.newSettings.type === 'story' ? getValue(this.inputBackgroundColor) : ''

    this.newSettings.loop = this.newSettings.type === 'story' ? false : getValue(this.inputLoop)
    if (this.newSettings.loop) this.newSettings.loopDuration = getValue(this.inputLoopDuration)

    this.newSettings.maxHeight = getValue(this.inputMaxHeight)
    if (this.newSettings.maxHeight) this.newSettings.maxHeightValue = getValue(this.inputMaxHeightValue)

    this.newSettings.title = this.newSettings.type === 'story' ? getValue(this.inputTitle) : ''
    this.newSettings.description = this.newSettings.type === 'carousel' ? getValue(this.inputDescription) : ''
    this.newSettings.credits = getValue(this.inputCredits)

    this.setState(curr => ({
      ...curr,
      carouselSettings: this.newSettings
    }))

    console.log(this.newSettings)
  }

  addNewElement () {
    const newIndex = this.state.elements[this.state.elements.length - 1] + 1
    const newArray = [...this.state.elements, newIndex]

    this.setState(curr => ({
      ...curr,
      elements: newArray
    }))
  }

  deleteElement (index) {
    const newArray = [...this.state.deleted, index]

    this.setState(curr => ({
      ...curr,
      deleted: newArray
    }))
  }

  setNewElement (element) {
    if (typeof element.url === 'undefined') return
    if (this.newImages.find(image => image.id === element.id)) return

    this.newImages.push(element)
  }

  toggleState (element) {
    this.setState(curr => ({
      ...curr,
      [element]: !curr[element]
    }))
  }

  setCarouselType (value) {
    this.setState(curr => ({
      ...curr,
      carouselType: value
    }))
  }

  /* * * * * * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * * * * * */
  render () {
    const errorActive = this.state.errorMessage ? 'generator-form_validate-error--active' : ''

    return html`
            <form class='generator-form'>
                <div class='generator-form_settings'>
                  <h3>Réglages</h3>
                  <${ToggleBlock} 
                  ...${{ setCarouselType: (value) => this.setCarouselType(value), label: 'Format du snippet', inputRef: this.inputType, options: [{ label: 'Carrousel', value: 'carousel' }, { label: 'Story', value: 'story' }] }} />
                  <div class='generator-form_settings-columns'>
                    <div>
                      ${
                        this.state.carouselType === 'carousel'
                        ? html`
                          <${InputBlock} ...${{ type: 'checkbox', name: 'dots', label: 'Afficher les points', inputRef: this.inputDots }} />
                          <${InputBlock} ...${{ type: 'checkbox', name: 'arrow-left', label: 'Afficher la flèche gauche', inputRef: this.inputArrowLeft }} />
                          <${InputBlock} ...${{ type: 'checkbox', name: 'arrow-right', label: 'Afficher la flèche droite', inputRef: this.inputArrowRight }} />
                          <${InputBlock}
                          ...${{ type: 'checkbox', name: 'loop', label: 'Lecture en boucle', inputRef: this.inputLoop, onChange: () => this.toggleState('loop') }} />
                          <${InputBlock}
                          ...${{ type: 'number', name: 'loop-duration', label: 'Durée par image (en ms) :', inputRef: this.inputLoopDuration, settings: { min: 500, max: 10000, step: 100, value: 2000 }, disabled: !this.state.loop }} />
                        `
                        : html`
                          <${InputBlock} ...${{ type: 'text', name: 'backgroundColor', label: 'Couleur de fond', inputRef: this.inputBackgroundColor, settings: { placeholder: 'Au format hexadécimal : #2A303C' } }} />
                        `
                      }
                      <${InputBlock}
                      ...${{ type: 'checkbox', name: 'max-height', label: 'Hauteur max', inputRef: this.inputMaxHeight, onChange: () => this.toggleState('maxHeight') }} />
                      <${InputBlock}
                      ...${{ type: 'number', name: 'max-height-value', label: 'Valeur :', inputRef: this.inputMaxHeightValue, settings: { min: 0, max: 10000, step: 100, value: 600 }, disabled: !this.state.maxHeight }} />
                    </div>
                    <div>
                      <${SelectBlock}
                      ...${{ name: 'image-fit', label: 'Ajustement des images', inputRef: this.inputImageFit, options: [{ value: 'cover', title: 'Cover' }, { value: 'contain', title: 'Contain' }] }} />
                      
                      ${
                        this.state.carouselType === 'carousel'
                        ? html`
                            <${InputBlock} ...${{ type: 'text', name: 'description', label: 'Description', inputRef: this.inputDescription, settings: { placeholder: 'La description commune' } }} />
                            <${InputBlock} ...${{ type: 'checkbox', name: 'toggle-description', label: 'Masquer la description derrière un "voir plus"', inputRef: this.inputToggleDescriptionBtn }} />`
                        : html`<${InputBlock} ...${{ type: 'text', name: 'title', label: 'Titre', inputRef: this.inputTitle, settings: { placeholder: 'Le titre du bloc' } }} />`
                      }

                      <${InputBlock}
                      ...${{ type: 'text', name: 'credits', label: 'Crédits', inputRef: this.inputCredits, settings: { placeholder: 'Les crédits communs' } }} />
                    </div>
                  </div>
                </div>

                <div class='generator-form_images'>
                  <h3>Images (ou vidéos)</h3>
                  <div class='generator-form_images-columns'>
                    ${
                      this.state.elements.map((_el, i) => {
                        if (this.state.deleted.includes(i)) return
                        return html`<${newElementBlock} ...${{
                          class: 'new-element-block--' + (i + 1),
                          index: i,
                          setNewElement: this.setNewElement,
                          deleteElement: this.deleteElement,
                          carouselType: this.state.carouselType
                        }} />`
                      })
                    }
                  </div>
                  <p class='generator-form_images-btn' onclick=${() => this.addNewElement()}>
                    + Ajouter un élément
                  </p>
                </div>

              <div class='generator-form_validate'>
                <p class='generator-form_validate-btn' onclick=${() => this.validateForm()}>
                  Générer le snippet
                </p>
                <p class='generator-form_validate-error ${errorActive}' onclick=${() => this.validateForm()}>
                  ${this.state.errorMessage}
                </p>
              </div>
            </form>
            
            <${Snippet} ...${{ error: this.state.errorMessage, carouselSettings: this.state.carouselSettings, carouselImages: this.state.carouselImages }} />
        `
  }
}

// renderer
export default async function renderer (node) {
  // await injectStyles('{{PARENT_URL}}/styles.css')
  render(html`<${Form} />`, node)
}
