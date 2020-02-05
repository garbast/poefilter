import * as $ from 'jquery';

class App {
  // https://www.pathofexile.com/character-window/get-stash-items?accountName=garbast&realm=pc&league=Metamorph&tabs=1
  protected equippedEndpoint: string = 'http://www.pathofexile.com/character-window/get-items?realm=pc&accountName=$1&league=$2';

  protected tabsEndpoint: string = 'https://www.pathofexile.com/character-window/get-stash-items?realm=pc&accountName=$1&league=$2&tabs=1';

  protected tabEndpoint: string = 'https://www.pathofexile.com/character-window/get-stash-items?realm=pc&accountName=$1&league=$2&tabIndex=$3';

  protected publicStashTabsEndpoint: string = 'http://api.pathofexile.com/public-stash-tabs';

  protected leagueEndpoint: string = 'https://api.pathofexile.com/league/Hardcore';

  protected league: string = 'Metamorph';

  protected account: string = 'garbast';

  constructor() {
    this.fetchTabData();
  }

  fetchTabData(): void {
    $.ajax({
      url: this.publicStashTabsEndpoint,
      dataType: 'jsonp'
    }).done(function(league: any) {
      console.log('Got', league.id, 'league');
    });
  }
}

new App();
