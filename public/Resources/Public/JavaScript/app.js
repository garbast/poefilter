(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var PoeCache_1 = require("./PoeCache");
var App = /** @class */ (function () {
    function App() {
        var e_1, _a;
        // https://www.pathofexile.com/character-window/get-stash-items?accountName=garbast&realm=pc&league=Metamorph&tabs=1
        this.host = 'api.pathofexile.com';
        this.endpoints = {
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
        this.league = 'Metamorph';
        this.currentTab = 0;
        this.accountText = /\/account\/view-profile\/(.*?)/;
        this.cookieTest = /^[0-9A-Fa-f]{32}$/;
        this.cache = new PoeCache_1.default();
        try {
            for (var _b = __values(Object.values(this.endpoints)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var endpoint = _c.value;
                this.fetchTabData(endpoint);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    App.prototype.fetchTabData = function (endpoint) {
        var path = endpoint
            .replace('{account}', this.account)
            .replace('{league}', this.league)
            .replace('{tab}', this.currentTab.toString()), options = {
            host: this.host,
            path: path,
            cookie: this.cookie
        };
        console.log("https://" + options.host + options.path);
        /*$.ajax({
          url: 'http://localhost:9000',
          method: 'POST',
          dataType: 'json',
          data: JSON.stringify(options)
        }).done((response: any) => {
          console.log(response);
        });*/
    };
    return App;
}());
new App();

},{"./PoeCache":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PoeCache = /** @class */ (function () {
    function PoeCache() {
        this.account = 'garbast';
        this.cookie = '2daa91301a943bef61160ef286ff05f0';
    }
    return PoeCache;
}());
exports.default = PoeCache;

},{}]},{},[1]);
