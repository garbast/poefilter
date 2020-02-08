export default class App {
  protected element: HTMLElement;

  constructor() {
    this.element = window.document.getElementById('app');
  }

  getElementsByClassName(className: string): HTMLCollectionOf<Element> {
    return this.element.getElementsByClassName(className);
  }
}
