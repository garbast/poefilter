import { App } from '../App';
import { Abstract, StashItems, Item } from './Abstract';

export default class TabContent extends Abstract {
  protected app: App;

  protected element: HTMLElement;

  protected data: StashItems;

  protected grid: Item[][] = [];

  protected rows = 12;

  protected cols = 12;

  constructor(tabData: string, app: App) {
    super();
    this.app = app;
    this.element = window.document.getElementById('tab');
    this.element.innerHTML = '';
    this.data = JSON.parse(tabData);

    this.createGrid(this.data, this.rows, this.cols);
    this.renderTabContent(this.grid, this.rows, this.cols);
    console.log(this.grid);
  }

  createGrid(data: StashItems, x: number, y: number) {
    for (let i = 0; i < x; i++) {
      let row = [];
      for (let j = 0; j < y; j++) {
        row[j] = ({} as Item);
      }
      this.grid[i] = row;
    }

    data.items.forEach((item: Item) => {
      this.grid[item.y][item.x] = item;
    });
  }

  renderTabContent(data: Item[][], x: number, y: number) {
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        let item: Item = data[i][j],
          span = this.getSpan('', 'cell');
        span.style.top = (i * 67) + 'px';
        span.style.left = (j * 67) + 'px';

        if (item.icon) {
          let icon: HTMLImageElement = window.document.createElement('img');
          icon.src = item.icon;
          icon.title = item.typeLine;
          span.append(icon);
        }

        item.element = span;
        this.element.append(span);
      }
    }
  }
}
