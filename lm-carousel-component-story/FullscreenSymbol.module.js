import { html } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { Component } from 'https://unpkg.com/preact?module'

export class FullscreenSymbol extends Component {
  render ({ active }) {
    return html`
        ${active
        ? html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.0566 10.6203L19.0566 9.15094L15.0084 9.15023L19.5542 4.60439L18.5106 3.56071L14.1358 7.93542L14.1351 4.22948L12.6651 4.22877L12.6651 10.621L19.0566 10.6203Z"/>
              <path d="M10.3 19.3729L8.83063 19.3729L8.82992 15.3247L4.28408 19.8706L3.24039 18.8269L7.61511 14.4522L3.90916 14.4515L3.90846 12.9814L10.3007 12.9814L10.3 19.3729Z"/>
              </svg>`
        : html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.31716 13.0421L3.8478 13.0421L3.84709 19.4336L10.2393 19.4336L10.2386 17.9635L6.53268 17.9628L10.9074 13.5881L9.86371 12.5444L5.31787 17.0902L5.31716 13.0421ZM12.7257 5.63748L12.7257 4.16811L19.1173 4.1674L19.1173 10.5596L17.6472 10.5589L17.6465 6.85299L13.2718 11.2277L12.2281 10.184L16.7739 5.63819L12.7257 5.63748Z"/>
              </svg>`
        }
    `
  }
}