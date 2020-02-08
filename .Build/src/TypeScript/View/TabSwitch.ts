import { App } from '../App';
import { Abstract, StashItems, Tab } from './Abstract';


export default class TabSwitch extends Abstract {
  protected app: App;

  protected element: HTMLElement;

  protected data: StashItems;

  constructor(tabData: string, app: App) {
    super();
    this.app = app;
    this.element = window.document.getElementById('tabSwitch');
    this.element.innerHTML = '';
    this.data = JSON.parse(tabData);

    this.renderTabs(this.data);
    this.attachEvents();
  }

  renderTabs(data: StashItems) {
    data.tabs.forEach((tab: Tab) => {
      let switchElement = document.createElement('li');
      switchElement.id = tab.id;
      switchElement.dataset.index = tab.i.toString();
      switchElement.style.color = `rgb(${tab.colour.r}, ${tab.colour.g}, ${tab.colour.b})`;

      let spanL = this.getSpan('', 'left'),
        spanC = this.getSpan(tab.n, 'center'),
        spanR = this.getSpan('', 'right');

      spanL.style.backgroundImage = `url(${tab.srcL})`;
      spanC.style.backgroundImage = `url(${tab.srcC})`;
      spanR.style.backgroundImage = `url(${tab.srcR})`;

      switchElement.append(spanL);
      switchElement.append(spanC);
      switchElement.append(spanR);

      tab.element = switchElement;
      this.element.append(switchElement);
    });
  }

  attachEvents() {
    let leftArrow: HTMLElement = (this.app.view.getElementsByClassName('tabBarLeft')[0] as HTMLElement),
      rightArrow: HTMLElement = (this.app.view.getElementsByClassName('tabBarRight')[0] as HTMLElement);

    this.attachEvent(leftArrow, 'click', this.clickLeftArrow.bind(this));
    this.attachEvent(rightArrow, 'click', this.clickRightArrow.bind(this));
    this.attachEvent(this.element, 'click', this.clickTabSwitch.bind(this));
  }

  clickLeftArrow() {
    this.element.style.marginLeft = '0';
  }

  clickRightArrow() {
    let tabBar: HTMLDivElement = (this.app.view.getElementsByClassName('tabBar')[0] as HTMLDivElement),
      leftMargin = ((this.element.offsetWidth - tabBar.offsetWidth) + 52) * -1;
    this.element.style.marginLeft = `${leftMargin}px`;
  }

  clickTabSwitch(event: Event) {
    let targetParent = (event.target as HTMLElement).parentElement;
    if (targetParent.tagName.toLowerCase() === 'li') {
      this.app.fetchTab(parseInt(targetParent.dataset.index));
    }
  }
}
