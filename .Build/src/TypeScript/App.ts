import * as $ from 'jquery';
import PoeCache from "./PoeCache";

interface Endpoints extends Object {
  getAccount?: string,
  getCharacters?: string,
  getItems?: string,
  getPassivSkills?: string,

  getStashItemsTabs?: string,
  getStashItemsSingleTab?: string,

  getMtxStashItemsTabs?: string,
  getMtxStashItemsSingleTab?: string,

  publicStashTabs?: string,
  leagues?: string,
  leagueRules?: string,
  ladders?: string,
  pvpMatches?: string,
}

class App {
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

  // {Standard,Hardcore,Blight,Metamorph}
  protected league: string = 'Metamorph';

  protected currentTab: number = 0;

  protected cache: PoeCache;

  protected account: string;
  protected accountText: RegExp = /\/account\/view-profile\/(.*?)/;

  protected cookie: string;
  protected cookieTest: RegExp = /^[0-9A-Fa-f]{32}$/;

  constructor() {
    this.cache = new PoeCache();
    for (let endpoint of Object.values(this.endpoints)) {
      this.fetchTabData(endpoint);
    }
  }

  fetchTabData(endpoint: string): void {
    let path = endpoint
        .replace('{account}', this.account)
        .replace('{league}', this.league)
        .replace('{tab}', this.currentTab.toString()),
      options = {
      host: this.host,
      path: path,
      cookie: this.cookie
    };
console.log(`https://${options.host}${options.path}`);
    /*$.ajax({
      url: 'http://localhost:9000',
      method: 'POST',
      dataType: 'json',
      data: JSON.stringify(options)
    }).done((response: any) => {
      console.log(response);
    });*/
  }
}

new App();
