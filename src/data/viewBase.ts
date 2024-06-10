export class ViewBase {
  bridge

  constructor() {
    this.bridge = window.Bridge
    this.attachEvents()
  }

  //Document element selector
  get(el): any {
    return document.querySelector(el)
  }

  getAll(els): any {
    return document.querySelectorAll(el)
  }

  attachEvents() {}
}
