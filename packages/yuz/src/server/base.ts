import process from 'process';
import * as Koa from 'koa';
import Router from '@koa/router';
import next from 'next';
import { TypeServerStatus, TypeThemeServer, TypeServerOpts } from './../types';
// import pkg from './../../package.json';

const Server = Koa.default;

export class ThemeServer implements TypeThemeServer {

  private _opts: TypeServerOpts;
  private _appNext?: any;
  private _serverApp: any;
  private _status: TypeServerStatus;
  private _pid: number = -1;
  private _isDev: boolean = false;

  constructor(opts: TypeServerOpts) {
    this._status = TypeServerStatus.NULL;
    this._opts = opts;
    this._isDev = !!opts.dev;
    const cwdPath = process.cwd();
    const themeConf = opts.theme;
    if (themeConf) {
      const { distDir, srcDir } = themeConf;

      const nextDistDir = distDir.replace(cwdPath, '');
      this._appNext = next({
        dev: this._isDev,
        dir: srcDir,
        conf: {
          ...opts.nextConfig || {},
          ...{
            distDir: nextDistDir,
            basePath: '/page'
          }
        }
      });
    }
    this._serverApp = new Server();
  }

  start(): Promise<number> {
    const { port } = this._opts;
    return new Promise((resolve, reject) => {
      this._initAppAsync().then(() => {
        this._serverApp.listen(port, () => {
          const pid: number = process.pid;
          this._pid = pid;
          resolve(pid);
        })
      }).catch(reject);
    });
  }

  close() {
    if (this._pid > 0) {
      return process.kill(this._pid);
    }
  }

  getServerAppAsync(): Promise<Koa> {
    return new Promise((resolve, reject) => {
      this._initAppAsync().then(() => {
        resolve(this._serverApp)
      }).catch(reject);
    })
  }

  private _initAppAsync(): Promise<void> {
    if (this._status === TypeServerStatus.HAS_INITED) {
      return Promise.resolve();
    }
    const appNext = this._appNext;
    const server = this._serverApp;
    const handle = appNext.getRequestHandler();
    const apiHandler = this._opts.apiHandler;
    return new Promise((resolve, reject) => {
      appNext.prepare().then(() => {
        const router = new Router();
      
        router.get('/page/:pageName', async (ctx: Koa.Context) => {
          const { pageName } = ctx.params;
          await appNext.render(ctx.req, ctx.res, `/${pageName}`, ctx.query)
          ctx.respond = false
        })

        router.get('/api/(.*)', async (ctx: Koa.Context, next: Koa.Next) => {
          if (typeof apiHandler === 'function') {
            ctx.body = await apiHandler(ctx.request);
          }
          await next();
        });

        router.get('/api/(.*)', async (ctx: Koa.Context, next: Koa.Next) => {
          if (typeof apiHandler === 'function') {
            ctx.body = await apiHandler(ctx.request);
          }
          await next();
        })

        router.all('/page/(.*)', async (ctx: Koa.Context, next: Koa.Next) => {
          await handle(ctx.req, ctx.res)
          ctx.respond = false
        })
      
        server.use(async (ctx: Koa.Context, next: Koa.Next) => {
          const pagePath: string = ctx.path;
          if (pagePath && pagePath.startsWith('/page/')) {
            ctx.res.statusCode = 200;
          }
          await next()
        })
      
        server.use(router.routes());

        this._status = TypeServerStatus.HAS_INITED;
        resolve();
      }).catch(reject)
    })
  }
}