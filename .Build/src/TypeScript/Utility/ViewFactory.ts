import TabContent from '../View/TabContent';
import CurrencyStash from '../View/CurrencyStash';
import DelveStash from '../View/DelveStash';
import DivinationCardStash from '../View/DivinationCardStash';
import EssenceStash from '../View/EssenceStash';
import FragmentStash from '../View/FragmentStash';
import MapStash from '../View/MapStash';
import NormalStash from '../View/NormalStash';
import PremiumStash from '../View/PremiumStash';
import UniqueStash from '../View/UniqueStash';
import { Tab } from '../View/Base';
import { App } from '../App';

export default class ViewFactory {
  static getInstance(app: App, tab: Tab, tabData: string): TabContent {
    let view: TabContent;

    switch (tab.type) {
      case 'CurrencyStash':
        view = new CurrencyStash(app);
        break;

      case 'DelveStash':
        view = new DelveStash(app);
        break;

      case 'DivinationCardStash':
        view = new DivinationCardStash(app);
        break;

      case 'EssenceStash':
        view = new EssenceStash(app);
        break;

      case 'FragmentStash':
        view = new FragmentStash(app);
        break;

      case 'NormalStash':
        view = new NormalStash(app);
        break;

      case 'MapStash':
        view = new MapStash(app);
        break;

      case 'PremiumStash':
        view = new PremiumStash(app);
        break;

      case 'UniqueStash':
        view = new UniqueStash(app);
        break;

      default:
        view = new TabContent(app);
    }
    if (view) {
      view.initialize(tabData);
    }

    return view;
  }
}
