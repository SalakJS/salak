import * as KoaApplication from 'koa'
import * as JoiObject from 'joi'
import { Server } from 'http'
import { Stream } from 'stream'

interface Salak extends KoaApplication, Salak.IService {}
declare class Salak {
  constructor (option?: { baseDir: string, opts?: { root?: string, app?: string, runtime?: string } })
  version: string
  root: string
  baseDir: string
  appDir: string
  runtime: string
  loader: any
  logger: Salak.Logger
  helper: Salak.Helper

  callback (): Promise<Server> | any
  listen (...args: any[]): Promise<Server> | any

  config (key: string, module?: string): any
  setConfig (name: string, value: any, module?: string): void

  curl (url: string, options?: Salak.DeepPartial<Salak.CURL_OPTIONS>): Promise<Salak.CURL_RESPONSE>
  run (port?: number): Promise<Server>

  close (): Promise<any>
  beforeStart (fn: () => void): void
  beforeClose (fn: () => void): void
}

declare namespace Salak {
  interface logger {
    silly (msg: any, ...args: any[]): void,
    debug (msg: any, ...args: any[]): void,
    verbose (msg: any, ...args: any[]): void,
    info (msg: any, ...args: any[]): void,
    warn (msg: any, ...args: any[]): void,
    error (msg: any, ...args: any[]): void,
    app: Logger
  }

  interface Logger extends logger {}

  type DeepPartial<T> = {
    [U in keyof T]?: T[U] extends object ? DeepPartial<T[U]> : T[U]
  }

  type PlainObject <T = any> = { [prop: string]: T }

  interface CURL_OPTIONS {
    method: string,
    timeout: number,
    body: PlainObject,
    query: PlainObject,
    headers: PlainObject,
    contentType: string,
    dataType: string,
    retry: number,
    redirects: number,
    stream: Stream,
    reqStream: Stream
  }

  interface CURL_RESPONSE {
    status: number,
    data: any,
    err: any,
    headers: any
  }

  interface helper {}
  interface Helper extends helper {}

  class IService {
    service (name: string, module?: string, ...args: any[]): any
  }

  class Base extends IService {
    constructor (app: Salak, module: string)

    module: string
    app: Salak
    root: string
    logger: Logger
    helper: Helper
    curl (url: string, options?: DeepPartial<CURL_OPTIONS>): Promise<CURL_RESPONSE>
    config (key: string, module?: string): any
    throw (...args: any[]): never
  }

  interface Context extends KoaApplication.Context {
    curl (url: string, options?: DeepPartial<CURL_OPTIONS>): Promise<CURL_RESPONSE>
  }

  class Middleware {
    only (routes: string[] | string): this
    except (routes: string[] | string): this
  }

  export class Controller extends Base {
    ctx: Context
    header: PlainObject
    query: PlainObject
    status: number
    body: any
    type: string
    send (data: any, status?: number): void
    success (data: any, message?: string, code?: number): void
    failure (code: number, message?: string, data?: any): void
    middleware (name: string | Function, module?: string, options?: any): Middleware
  }

  export class Behavior extends Base {
    behavior (name: string, module?: string): Behavior
  }

  export class Service extends Base {}
  export class Schedule extends Base {}
  export class RestController extends Controller {}

  export import Joi = JoiObject
  interface BehaviorObjectType {
    method: string | string[],
    meta: {
      summary: string,
      description: string,
      tags: string[]
    },
    validate: {
      query: PlainObject<JoiObject.AnySchema>,
      body: PlainObject<JoiObject.AnySchema>,
      header: PlainObject<JoiObject.AnySchema>,
      params: PlainObject<JoiObject.AnySchema>,
      formData: PlainObject<JoiObject.AnySchema>,
      responses: {
        [prop: string]: {
          body: PlainObject<JoiObject.AnySchema>,
          headers: PlainObject<JoiObject.AnySchema>
        }
      }
    }
  }

  interface BehaviorObject extends DeepPartial<BehaviorObjectType> {}

  type MiddlewareOrPluginObject = {
    name: string,
    package: any
  }

  type MiddlewareConfig = {
    enable: boolean,
    match: string | string [] | RegExp | Function,
    ignore: string | string [] | RegExp | Function
  }

  interface Static extends MiddlewareConfig {
    root: string,
    opts: PlainObject
  }

  interface NotFound extends MiddlewareConfig {
    type: string,
    notFoundHtml: string,
    pageUrl: string
  }

  interface SiteFile extends MiddlewareConfig {
    [prop: string]: any
  }

  interface ErrorMidddleware extends MiddlewareConfig {
    status: string | number,
    type: string
  }

  interface BodyParser extends MiddlewareConfig {
    encoding: string,
    formLimit: string,
    jsonLimit: string,
    strict: boolean,
    queryString: {
      arrayLimit: number,
      depth: number,
      parameterLimit: number
    },
    enableTypes: string[],
    extendTypes: {
      json: string[],
      form: string[],
      text: string[]
    }
  }

  interface SalakConfig {
    port: number,
    readyTimeout: number,
    schedule: {
      enable: boolean,
      prefix: string,
      store: string,
      storeOptions: any
    },
    swagger: {
      enable: boolean,
      apiDocs: string,
      apiJson: string,
      html: string,
      spec: {
        info: {
          title: string,
          version: string,
          [prop: string]: any
        },
        [prop: string]: any
      }
    },
    static: Static,
    siteFile: SiteFile,
    notFound: NotFound,
    output: {
      fields: {
        code: string,
        data: string,
        msg: string,
        detail: string
      },
      type: {
        code: string
      }
      errorHtmlFn: () => void
    },
    error: ErrorMidddleware,
    logger: {
      root: string,
      injectConsole: boolean,
      formatType: string,
      fileType: string,
      capture: {
        enable: boolean,
        category: string,
        level: string
      },
      defaultLevel: string,
      category: {
        transports: string[],
        level: string
      },
      categories: {
        [prop: string]: {
          transports: string[],
          level: string
        }
      },
      transports: {
        [prop: string]: {
          type: string,
          level: string,
          [prop: string]: any
        }
      },
      transportsDefaultOptions: {
        [prop: string]: {
          [prop: string]: any
        }
      }
    },
    bodyParser: BodyParser,
    bootstraps: Array<string | PlainObject>,
    routes: {
      defaultRoute: string,
      defaultMethods: string | string[],
      prefix: string,
      loadOrder: string[],
      alias: string,
      replaceIndex: boolean
    },
    curl: {
      timeout: string,
      headers: PlainObject,
      contentType: string,
      dataType: string,
      retry: number,
      redirects: number,
      beforeRequest: (req: PlainObject) => void,
      afterResponse: (err?: any, res?: any) => void,
      plugins: any[]
    },
    middleware: Array<string | MiddlewareOrPluginObject>,
    plugin: Array<MiddlewareOrPluginObject>,
    [prop: string]: any
  }

  interface ScheduleTimerObject {
    enable?: boolean,
    interval?: number | string,
    type?: string, // single、all、worker, default 'all'
    cron?: string, // use `cron-parser`
    cronOptions?: PlainObject
  }

  // export { Salak }
  class OriginSalak extends Salak {}
  export interface Salak extends OriginSalak {}
}

export = Salak
