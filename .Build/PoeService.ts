import * as http from 'http';

export class PoeService {
  protected response: http.ServerResponse;

  constructor() {
    this.startServer();
  }

  startServer() {
    http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => {
      this.response = response;

      if (request.method === 'POST') {
        this.getPostData(request);
      }
    }).listen(9000);
  }

  getPostData(request: http.IncomingMessage) {
    let chunks = [];
    request.on('data', chunk => {
      chunks.push(chunk);
    });

    request.on('end', () => {
      let options = JSON.parse(chunks.join());
      this.queryPoeApi(options);
    })
  }

  queryPoeApi(options: {}) {
    http.get(options, (response: http.IncomingMessage) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        this.sendApiResponse(data);
      });
    }).on('error', (err) => {
      console.log('Error: ' + err.message);
    });
  }

  sendApiResponse(data: string): void {
    this.response = this.setControlHeaders(this.response);
    this.response.writeHead(200, {'Content-Type': 'text/html'});
    this.response.end(data);
  }

  // Set CORS headers
  setControlHeaders(response): http.ServerResponse {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Request-Method', '*');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader('Access-Control-Allow-Headers', '*');
    return response;
  }
}
