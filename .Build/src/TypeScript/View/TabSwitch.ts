import { Base, Tab } from './Base';

export default class TabSwitch extends Base {
  protected elementId: string = 'tabSwitch';

  initialize(tabData: string) {
    this.initializeElement();
    this.processData(tabData);
    this.render();
    this.attachEvents();
  }

  render() {
    this.data.tabs.forEach((tab: Tab) => {
      let tabElement = document.createElement('li');
      tabElement.tab = tab;
      tabElement.style.color = `rgb(${tab.colour.r}, ${tab.colour.g}, ${tab.colour.b})`;

      let spanL = this.getSpan('', 'left'),
        spanC = this.getSpan(tab.n, 'center'),
        spanR = this.getSpan('', 'right');

      spanL.style.backgroundImage = `url(${tab.srcL})`;
      spanC.style.backgroundImage = `url(${tab.srcC})`;
      spanR.style.backgroundImage = `url(${tab.srcR})`;

      tabElement.appendChild(spanL);
      tabElement.appendChild(spanC);
      tabElement.appendChild(spanR);

      tab.element = tabElement;
      this.element.appendChild(tabElement);
    });
  }

  attachEvents() {
    let leftArrow: HTMLElement = (this.app.view.getElementsByClassName('tabBarLeft')[0] as HTMLElement),
      rightArrow: HTMLElement = (this.app.view.getElementsByClassName('tabBarRight')[0] as HTMLElement);

    this.attachEventToElement(leftArrow, 'click', this.clickLeftArrow.bind(this));
    this.attachEventToElement(rightArrow, 'click', this.clickRightArrow.bind(this));
    this.attachEventToElement(this.element, 'click', this.clickTabSwitch.bind(this));
  }

  clickLeftArrow() {
    let marginLeft = 0,
      currentMargin = parseInt(this.element.style.marginLeft || '0');

    currentMargin = Math.min(currentMargin + 57, marginLeft);
    this.element.style.marginLeft = `${currentMargin}px`;
  }

  clickRightArrow() {
    let tabBar: HTMLDivElement = (this.app.view.getElementsByClassName('tabBar')[0] as HTMLDivElement),
      marginLeft = ((this.element.offsetWidth - tabBar.offsetWidth) + 52) * -1,
      currentMargin = parseInt(this.element.style.marginLeft || '0');

    currentMargin = Math.max(currentMargin - 57, marginLeft);
    this.element.style.marginLeft = `${currentMargin}px`;
  }

  clickTabSwitch(event: Event) {
    let tabElement: HTMLLIElement = ((event.target as HTMLElement).parentElement as HTMLLIElement);

    [...(this.element.getElementsByTagName('li') as unknown as HTMLElement[])]
      .forEach((element: HTMLElement) => {
        element.classList.remove('current');
      });

    if (tabElement.tagName.toLowerCase() === 'li') {
      tabElement.classList.add('current');
      this.app.fetchTab(tabElement.tab);
    }
  }
}
