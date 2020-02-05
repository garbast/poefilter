class App {
    protected tabsEndpoint: string = 'https://www.pathofexile.com/character-window/get-stash-items?realm=pc&accountName=$1&league=$2&tabs=1';

    protected tabEndpoint: string = 'https://www.pathofexile.com/character-window/get-stash-items?realm=pc&accountName=$1&league=$2&tabIndex=$3';

    protected league: string = 'Metamorph';

    protected account: string = 'garbast';

    constructor() {
        console.log('app loaded more');
    }
}
new App();