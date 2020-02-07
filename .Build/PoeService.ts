import * as http from 'http';
import {ServerResponse} from "http";

export class PoeService {
  constructor() {
    this.startServer();
  }

  startServer() {
    http.createServer((request, res) => {
      this.setControlHeaders(res);
      if (request.method === 'POST') {
        let body = '';
        request.on('data', (data) => {
          body += data;
          console.log('Partial body: ' + body)
        });

        request.on('end', function () {
          console.log('Body: ' + body);
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end('post received')
        })
      }
    }).listen(9000);
  }

  setControlHeaders(response): ServerResponse {
    // Set CORS headers
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Request-Method', '*');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader('Access-Control-Allow-Headers', '*');
    return response;
  }

  callPoeApi() {
    /*
  return DoServerRequest({
    method: 'get',
    url: Constants.POE_STASH_ITEMS_URL,
    options: {
      headers: {
        'Cookie': `${Constants.POE_COOKIE_NAME}=${cookie}`
      },
      params: options
    },
    onSuccess: `STASH_TAB_RESPONSE`,
    onError: `STASH_TAB_ERROR`
  })
*/
  }
}
