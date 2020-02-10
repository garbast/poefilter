import * as http from 'http';
import * as request from 'request-promise-native';

let logger  = require('eazy-logger').Logger({
  prefix: '[{blue:POEProxy}] ',
  useLevelPrefixes: false
});

interface Callback {
  (data: string): void;
}

export class PoeProxy {
  protected cookieName: string = 'POESESSID';

  protected response: http.ServerResponse;

  constructor() {
    this.startServer();
  }

  startServer() {
    http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => {
      this.response = response;
      if (request.method === 'POST') {
        this.getPostData(request, this.queryPoeApi.bind(this));
      }
    }).on('error', (err) => {
      console.log('Proxy Error: ' + err.message);
    }).listen(9009);

    logger.unprefixed('info', '{grey: %s', '-----------------------------------');
    logger.info('Proxy URL:');
    logger.unprefixed('info', '{grey: %s', '-----------------------------------');
    logger.unprefixed('info', '    Local: http://localhost:9009');
    logger.unprefixed('info', '{grey: %s', '-----------------------------------');
  }

  queryPoeApi(data: string) {
    const query = JSON.parse(data),
      requestOptions = {
        uri: `https://${query.host}${query.path}`,
        headers: {
          'Cookie': `${this.cookieName}=${query.cookie}`
        }
      };

    request.get(requestOptions).then((response: string) => {
      this.sendApiResponse(response);
    }).catch((err) => {
      console.log('PoeApi Error: ' + err.message);
    });
  }

  sendApiResponse(data: string) {
    this.response = this.setControlHeaders(this.response);
    this.response.writeHead(200, {'Content-Type': 'text/html'});
    this.response.end(data);
  }

  getPostData(request: http.IncomingMessage, callback: Callback) {
    let data = '';
    request.on('data', chunk => {
      data += chunk;
    });
    request.on('end', () => {
      callback(data);
    })
  }

  // Set CORS headers
  setControlHeaders(response: http.ServerResponse): http.ServerResponse {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Request-Method', '*');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader('Access-Control-Allow-Headers', '*');
    return response;
  }
}
