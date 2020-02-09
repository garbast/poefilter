import { Base } from './Base';

export default class TabContent extends Base {
  protected elementId: string = 'tabContent';

  initialize(tabData: string) {
    this.initializeElement();
    this.processData(tabData);
    this.render();
    this.attachEvents();
  }

  render() {
    let span = this.getSpan(this.constructor.name + ' not implemented yet', 'notImplemented');
    this.element.appendChild(span);
  }
}
