import { html } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { Component, createRef } from 'https://unpkg.com/preact?module'

import { InputBlock } from './InputBlock.module.js'
import { SelectBlock } from './SelectBlock.module.js'

import { getValue } from './../utils/getValue.module.js'

export class newElementBlock extends Component {
  state = {
    collapsed: true,
  }

  constructor(props) {
    super(props)

    this.inputUrl = createRef()
    this.inputMobileUrl = createRef()
    this.inputImageFit = createRef()
    this.inputDescription = createRef()
    this.inputCredits = createRef()
  }

  getImageProps() {
    const imageProps = {}

    imageProps.url = getValue(this.inputUrl)
    imageProps.mobileUrl = getValue(this.inputMobileUrl)
    imageProps.imageFit = getValue(this.inputImageFit)
    imageProps.description = getValue(this.inputDescription)
    imageProps.credits = getValue(this.inputCredits)
    imageProps.id = `image-${this.props.index}`

    return imageProps
  }

  toggleCollasped() {
    this.setState(curr => ({
      ...curr,
      collapsed: !curr.collapsed
    }))
  }

  render(props) {
    document.addEventListener('onValidate', () => {
      const newImage = this.getImageProps()
      props.setNewElement(newImage)
    })

    const classList = `generator-form_element ${props.class} ${this.state.collapsed ? 'generator-form_element--collapsed' : ''}`
    const toggleText = this.state.collapsed ? "Plus d'options" : "Masquer"

    return html`
              <div class=${classList}>
                <${InputBlock}
                  ...${{ type: 'text', name: 'url', label: 'URL', inputRef: this.inputUrl, mandatory: true, settings: { placeholder: "L'URL de l'image" } }} />
                <${InputBlock}
                  ...${{ type: 'text', name: 'mobileUrl', label: 'URL mobile', inputRef: this.inputMobileUrl, settings: { placeholder: "L'URL de l'image à afficher sur les petits écrans" } }} />

                ${
                  props.carouselType === 'carousel'
                  ? html`
                    <div onclick=${() => this.toggleCollasped()} class='generator-form_element-toggle-collapsed'>
                      <p>${toggleText}</p>
                    </div>
                    <div class='generator-form_element-collapsible'>
                      <${InputBlock}
                      ...${{ type: 'text', name: 'description', label: 'Description', inputRef: this.inputDescription, settings: { placeholder: 'La description de cette image' } }} />
                      <${InputBlock}
                      ...${{ type: 'text', name: 'credits', label: 'Crédits', inputRef: this.inputCredits, settings: { placeholder: 'Les crédits de cette image' } }} />
                      <${SelectBlock}
                        ...${{ name: 'image-fit', label: "Ajustement de l'image", inputRef: this.inputImageFit, options: [{ value: '', title: 'Par défaut' }, { value: 'cover', title: 'Cover' }, { value: 'contain', title: 'Contain' }] }} />
                    </div>
                  `
                  : html`
                    <${InputBlock}
                      ...${{ type: 'text', name: 'description', label: 'Description', inputRef: this.inputDescription, settings: { placeholder: 'La description de cette image' } }} />
                    <div onclick=${() => this.toggleCollasped()} class='generator-form_element-toggle-collapsed'>
                      <p>${toggleText}</p>
                    </div>
                    <div class='generator-form_element-collapsible'>
                      <${InputBlock}
                      ...${{ type: 'text', name: 'credits', label: 'Crédits', inputRef: this.inputCredits, settings: { placeholder: 'Les crédits de cette image' } }} />
                      <${SelectBlock}
                        ...${{ name: 'image-fit', label: "Ajustement de l'image", inputRef: this.inputImageFit, options: [{ value: '', title: 'Par défaut' }, { value: 'cover', title: 'Cover' }, { value: 'contain', title: 'Contain' }] }} />
                    </div>
                  `
                }

                <p class='generator-form_element-delete-btn' onclick=${() => props.deleteElement(props.index)}>
                  Supprimer
                </p>  
              </div>
      `
  }
}