import TabContent from './TabContent';
import { Item } from './Base';

export default class NormalStash extends TabContent {
  protected grid: Item[][] = [];

  protected rows = 12;

  protected cols = 12;

  processData(tabData: string) {
    this.data = JSON.parse(tabData);
    this.createGrid();
    this.addItemsToGrid(this.data.items);
  }

  createGrid() {
    for (let i = 0; i < this.rows; i++) {
      let row = [];
      for (let j = 0; j < this.cols; j++) {
        row[j] = ({} as Item);
      }
      this.grid[i] = row;
    }
  }

  addItemsToGrid(items: Item[]) {
    items.forEach((item: Item) => {
      items.forEach((item2: Item) => {
        if (item.id !== item2.id && item.typeLine === item2.typeLine) {
          item.doublet = item2.doublet = true;
        }
      });
      this.grid[item.y][item.x] = item;
    });
  }

  render() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let item: Item = this.grid[i][j],
          span = this.getSpan('', 'cell');
        span.style.top = (i * 67) + 'px';
        span.style.left = (j * 67) + 'px';
        span.style.width = (item.w * 66) + (item.w - 1) + 'px';
        span.style.height = (item.h * 66) + (item.h - 1) + 'px';

        if (item.icon) {
          let icon: HTMLImageElement = window.document.createElement('img');
          icon.src = item.icon;
          icon.title = item.typeLine;
          span.appendChild(icon);
          span.classList.add('active');
        }

        if (item.doublet) {
          span.classList.add('doublet');
        }

        item.element = span;
        this.element.appendChild(span);
      }
    }
  }
}
