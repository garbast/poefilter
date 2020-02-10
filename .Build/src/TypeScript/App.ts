import * as request from 'request-promise';
import PoeCache from './PoeCache';
import AppView from './View/App';
import { Tab } from './View/Base';
import TabSwitch from './View/TabSwitch';
import ViewFactory from './Utility/ViewFactory';

interface Endpoints extends Object {
  getAccount?: string;
  getCharacters?: string;
  getItems?: string;
  getPassiveSkills?: string;

  getStashItemsTabs?: string;
  getStashItemsSingleTab?: string;

  getMtxStashItemsTabs?: string;
  getMtxStashItemsSingleTab?: string;

  publicStashTabs?: string;
  leagues?: string;
  leagueRules?: string;
  ladders?: string;
  pvpMatches?: string;
}

interface ApiRequestParameter extends Object {
  character?: string;
  account?: string;
  league?: string;
  tabIndex?: string;

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
    getPassiveSkills: '/character-window/get-passive-skills?character={character}',

    getStashItemsTabs: '/character-window/get-stash-items?accountName={account}&league={league}&tabs=1',
    getStashItemsSingleTab: '/character-window/get-stash-items?accountName={account}&league={league}&tabIndex={tabIndex}',

    getMtxStashItemsTabs: '/character-window/get-stash-items?accountName={account}&league={league}&tabs=1',
    getMtxStashItemsSingleTab: '/character-window/get-stash-items?accountName={account}&league={league}&tabIndex={tabIndex}',

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
    this.getApiRequestPromise(this.endpoints.getAccount, {})
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
    this.getApiRequestPromise(this.endpoints.getStashItemsTabs, {
      account: this.cache.account,
      league: this.cache.league
    })
      .then((tabsData: string) => {
        (new TabSwitch(this)).initialize(tabsData);
      });
  }

  fetchTab(tab: Tab) {
    this.getApiRequestPromise(this.endpoints.getStashItemsSingleTab, {
      account: this.cache.account,
      league: this.cache.league,
      tabIndex: tab.i.toString()
    })
      .then((tabData: string) => {
        // test
        ViewFactory.getInstance(this, tab, tabData);
      });
  }

  getApiRequestPromise(path: string, options: ApiRequestParameter): request.RequestPromise {
    for (let property in options) {
      if (options.hasOwnProperty(property)) {
        path = path.replace(`{${property}}`, options[property]);
      }
    }

    let requestOptions = {
      uri: 'http://localhost:9009',
      form: JSON.stringify({
        host: this.host,
        path: path,
        cookie: this.cache.cookie
      })
    };

    return request.post(requestOptions);
  }
}

new App();
