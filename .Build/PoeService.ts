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
    console.log(options);

    http.request(options, (response: http.IncomingMessage) => {
console.log(response);
      this.sendApiResponse();
    });
  }

  sendApiResponse(): void {
    this.response = this.setControlHeaders(this.response);
    this.response.writeHead(200, {'Content-Type': 'text/html'});
    this.response.end(JSON.stringify('post received'));
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
