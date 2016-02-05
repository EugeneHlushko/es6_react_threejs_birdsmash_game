import path from 'path';
import debug from 'debug';

import Koa from 'koa';
import mount from 'koa-mount';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import favicon from 'koa-favicon';
import staticCache from 'koa-static-cache';
import responseTime from 'koa-response-time';
import Router from 'koa-router';
import convert from 'koa-convert';

import router from './router';
import config from './config/init';

const app = new Koa();
const env = process.env.NODE_ENV || 'development';

if (process.env.BROWSER) {
  app.use(async (ctx, next) => {
    const auth = {login: 'review@ebuilders.nl', password: 'Amsterd@m!'};
    //debug.enable('dev,koa');
    debug('koa')(ctx);

    const b64auth = (ctx.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = new Buffer(b64auth, 'base64').toString().split(':')

    // Verify login and password are set and correct
    if (!login || !password || login !== auth.login || password !== auth.password) {
      ctx.status = 401;
      ctx.set('WWW-Authenticate', 'Basic');
      return
    } else {
      await next();
    }
  });
}

// add header `X-Response-Time`
app.use(convert(responseTime()));
app.use(convert(logger()));

// various security headers
app.use(helmet());

if (env === 'production') {
  // set debug env to `koa` only
  // must be set programmaticaly for windows
  debug.enable('koa');

  // load production middleware
  app.use(convert(require('koa-conditional-get')()));
  app.use(convert(require('koa-etag')()));
  app.use(convert(require('koa-compressor')()));
}

if (env === 'development') {
  // set debug env, must be programmaticaly for windows
  debug.enable('dev,koa');
  // log when process is blocked
  require('blocked')((ms) => debug('koa')(`blocked for ${ms}ms`));
}

app.use(convert(favicon(path.join(__dirname, '../app/images/favicon.ico'))));

const cacheOpts = { maxAge: 86400000, gzip: true };

// Proxy asset folder to webpack development server in development mode
if (env === 'development') {
  const webpackConfig = require('./../webpack/dev.config');
  const proxy = require('koa-proxy')({
    host: 'http://0.0.0.0:' + webpackConfig.server.port,
    map: (filePath) => 'assets/' + filePath
  });
  app.use(convert(mount('/assets', proxy)));
} else {
  app.use(convert(mount('/assets', staticCache(path.join(__dirname, '../dist'), cacheOpts))));
}

// mount `/api` router
const apiRouter = new Router({ prefix: '/api' });
require('./api/routes')(apiRouter);
app.use(apiRouter.routes());

// mount react-router
app.use(router);

app.listen(config.port);

// Tell parent process koa-server is started
if (process.send) process.send('online');
debug('koa')(`Application started on port ${config.port}`);
