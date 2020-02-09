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
    this.addItemsToGrid(this.data.items);
    this.renderTabContent(this.grid, this.rows, this.cols);
    console.log(this.grid[0][0]);
  }

  createGrid(data: StashItems, x: number, y: number) {
    for (let i = 0; i < x; i++) {
      let row = [];
      for (let j = 0; j < y; j++) {
        row[j] = ({} as Item);
      }
      this.grid[i] = row;
    }
  }

  addItemsToGrid(items: Item[]) {
    items.forEach((item: Item) => {
      items.forEach((item2: Item) => {
        if (item.typeLine === item2.typeLine) {
          item.doublet = item2.doublet = true;
        }
      });
      this.grid[item.y][item.x] = item;
    });
  }

  renderTabContent(grid: Item[][], x: number, y: number) {
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        let item: Item = grid[i][j],
          span = this.getSpan('', 'cell');
        span.style.top = (i * 67) + 'px';
        span.style.left = (j * 67) + 'px';
        span.style.width = (item.w * 66) + (item.w - 1) + 'px';
        span.style.height = (item.h * 66) + (item.h - 1) + 'px';

        if (item.doublet) {
          span.classList.add('doublet');
        }

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
