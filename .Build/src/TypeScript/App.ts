import * as request from 'request-promise';
import PoeCache from './PoeCache';
import AppView from './View/App';
import TabSwitchView from './View/TabSwitch';
import TabContentView from './View/TabContent';
import { tabsData } from './Tabs';
import { tab8Data } from './Tab8';

interface Endpoints extends Object {
  getAccount?: string;
  getCharacters?: string;
  getItems?: string;
  getPassivSkills?: string;

  getStashItemsTabs?: string;
  getStashItemsSingleTab?: string;

  getMtxStashItemsTabs?: string;
  getMtxStashItemsSingleTab?: string;

  publicStashTabs?: string;
  leagues?: string;
  leagueRules?: string;
  ladders?: string;
  pvpMatches?: string;

  [ key: string ]: any;
}

export class App {
  public view: AppView;

  protected cache: PoeCache;

  protected accountText: RegExp = /\/account\/view-profile\/(.*?)"/;

  protected cookieTest: RegExp = /^[0-9A-Fa-f]{32}$/;

  // https://www.pathofexile.com/character-window/get-stash-items?accountName=garbast&realm=pc&league=Metamorph&tabs=1
  protected host: string = 'api.pathofexile.com';

  protected endpoints: Endpoints = {
    getAccount: '/my-account',
    getCharacters: '/character-window/get-characters',
    getItems: '/character-window/get-items?character={character}',
    getPassivSkills: '/character-window/get-passive-skills?character={character}',

    getStashItemsTabs: '/character-window/get-stash-items?accountName={account}&league={league}&tabs=1',
    getStashItemsSingleTab: '/character-window/get-stash-items?accountName={account}&league={league}&tabIndex={tab}',

    getMtxStashItemsTabs: '/character-window/get-stash-items?accountName={account}&league={league}&tabs=1',
    getMtxStashItemsSingleTab: '/character-window/get-stash-items?accountName={account}&league={league}&tabIndex={tab}',

    // https://www.pathofexile.com/developer/docs/api-resource-public-stash-tabs
    publicStashTabs: '/public-stash-tabs',
    // https://www.pathofexile.com/developer/docs/api-resource-leagues
    leagues: '/leagues',
    // https://www.pathofexile.com/developer/docs/api-resource-league-rules
    leagueRules: '/leagues-rules',
    // https://www.pathofexile.com/developer/docs/api-resource-ladders
    ladders: '/ladders',
    // https://www.pathofexile.com/developer/docs/api-resource-pvp-matches
    pvpMatches: '/pvp-matches'
  };

  protected currentTab: number = 0;

  constructor() {
    this.view = new AppView();
    this.cache = new PoeCache();

    if (this.cache.account === '') {
      this.getAccountName();
    } else {
      this.fetchTabs();
    }
  }

  getAccountName() {
    this.getApiRequestPromis('getAccount')
      .then((response: string) => {
        let accountNameMatches = response.match(this.accountText);
        if (!accountNameMatches[1]) {
          console.error(`[AUTHORIZE] Failed to identify account name: ${response}`);
        }

        this.cache.account = decodeURIComponent(accountNameMatches[1]);

        this.fetchTabs();
      });
  }

  fetchTabs() {
    return new TabSwitchView(tabsData, this);
    this.getApiRequestPromis('getStashItemsTabs')
      .then((tabsData: string) => {
        new TabSwitchView(tabsData, this);
      });
  }

  fetchTab(index: number) {
    this.currentTab = index;
    return new TabContentView(tab8Data, this);
    this.getApiRequestPromis('getStashItemsSingleTab')
      .then((tabData: string) => {
        new TabContentView(tabData, this);
      });
  }

  getApiRequestPromis(endpoint: string): request.RequestPromise {
    let path = (this.endpoints[endpoint] as string)
        .replace('{account}', this.cache.account)
        .replace('{league}', this.cache.league)
        .replace('{tab}', this.currentTab.toString()),
      query = {
        host: this.host,
        path: path,
        cookie: this.cache.cookie
      },
      options = {
        uri: 'http://localhost:9000',
        form: JSON.stringify(query)
      };

    return request.post(options);
  }
}

new App();
