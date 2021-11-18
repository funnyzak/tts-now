const http = require('http');
const path = require('path');
const util = require('util');
const fs = require('fs');
const chalk = require('chalk');
const mime = require('mime');

const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);

/**
 * 静态服务器
 */
export default class StaticHttpServer {
  constructor(conf = {}) {
    this.config = {
      host: '127.0.0.1',
      port: 16887,
      root: process.cwd(),
      cache: {
        maxAge: 3600,
        expires: false,
        cacheControl: false,
        lastModified: false,
        etag: false
      },
      ...conf
    };

    this.getUrl = this.getUrl.bind(this);
    this.log = this.log.bind(this);
    this.getMime = this.getMime.bind(this);
    this.dispose = this.dispose.bind(this);
    this.serve = this.serve.bind(this);
    this.route = this.route.bind(this);
    this.cache = this.cache.bind(this);
    this.setCache = this.setCache.bind(this);
  }

  getUrl(filePath, withHost = false) {
    let virtualPath = filePath
      .replace(this.config.root, '')
      .replace(path.sep, '/');
    virtualPath = virtualPath.startWith('/') ? virtualPath : `/${virtualPath}`;
    return (
      `${withHost ? `http://${this.config.host}:${this.config.port}` : ''
      }${virtualPath}`
    );
  }

  serve() {
    this.server = http.createServer(
      {
        maxHeaderSize: 81920
      },
      this.route
    );

    this.server.listen(this.config.port, this.config.host, () => {
      const addr = `http://${this.config.host}:${this.config.port}`;
      this.log(`serve started at ${addr}.`);
    });

    this.server.on('close', () => {
      this.log('server is closed.');
    });
  }

  dispose() {
    if (!this.server) return;
    this.server.close((err) => {
      if (err) throw err;
      this.log('server closed.');
    });
  }

  async route(req, res) {
    const resPath = path.join(this.config.root, req.url);
    this.log(`Request Info:
URL: ${chalk.blue(req.url)}
Header: ${chalk.green(JSON.stringify(req.headers))}
`);

    try {
      const stats = await stat(resPath);
      if (stats.isFile()) {
        res.statusCode = 200;
        res.setHeader('content-type', this.getMime(resPath));
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (this.cache(req, res, stats)) {
          res.statusCode = 304;
          res.end();
          return;
        }
        fs.createReadStream(resPath).pipe(res);
      } else if (stats.isDirectory()) {
        const files = await readdir(resPath);
        res.statusCode = 200;
        res.setHeader('content-type', 'text/html');
        res.end(files.join(' '));
      }
    } catch (err) {
      res.statusCode = 404;
      res.setHeader('content-type', 'text/plain');
      res.end(`${req.url} is not a file.`);
    }
  }

  getMime(resPath) {
    const mimeTypes = {
      default: 'text/plain',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png'
    };

    let ext = path.extname(resPath).split('.').pop().toLowerCase();
    if (!ext) {
      ext = resPath;
    }
    return mimeTypes[ext] || mime.getType(ext) || mimeTypes.default;
  }

  cache(req, res, fileStats) {
    this.setCache(res);

    const lastModified = req.headers['if-modified-since'];
    const etag = req.headers['if-none-match'];

    if (!lastModified && !etag) {
      return false;
    }
    if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
      return false;
    }
    if (etag && etag !== res.getHeader('ETag')) {
      return false;
    }
    return true;
  }

  setCache(res, fileStats) {
    const {
      maxAge, expires, cacheControl, lastModified, etag
    } = this.config.cache;
    if (expires) {
      res.setHeader(
        'Expires',
        new Date(Date.now() + maxAge * 1000).toUTCString()
      );
    }
    if (cacheControl) {
      res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    }
    if (lastModified) {
      res.setHeader('Last-Modified', fileStats.mtime.toUTCString());
    }
    if (etag) {
      // mtime 需要转成字符串，否则在 windows 环境下会报错
      res.setHeader(
        'ETag',
        `${fileStats.size}-${fileStats.mtime.toUTCString()}`
      );
    }
  }

  log(...args) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('static server:', ...args);
    }
  }
}

const staticServer = new StaticHttpServer();
staticServer.serve();
