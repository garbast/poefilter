import * as http from 'http';
import * as https from 'https';

interface Callback {
  (data: string): void;
}

export class PoeService {
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
    }).listen(9000);
  }

  queryPoeApi(data: string) {
    let options = JSON.parse(data);
    https.get(options, (response: http.IncomingMessage) => {
      this.getPostData(response, this.sendApiResponse.bind(this));
    }).on('error', (err) => {
      console.log('PoeApi Error: ' + err.message);
    });
  }

  sendApiResponse(data: string): void {
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
