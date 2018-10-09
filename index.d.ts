import * as KoaApplication from 'koa'
import { Server } from 'http'
import { Stream } from 'stream';

declare class Salak extends KoaApplication {
  constructor (option?: { baseDir: string, opts?: { root?: string, app?: string, runtime?: string } })
  version: string
  root: string
  baseDir: string
  appDir: string
  runtime: string
  loader: any
  logger: Salak.logger

  callback (): Promise<Server> | any
  listen (...args: any[]): Promise<Server> | any

  config (key: string, module?: string): any
  setConfig (name: string, value: any, module?: string): void
  service (name: string, module?: string, ...args: any[]): any

  curl (url: string, options?: Salak.CURL_OPTIONS): Promise<Salak.CURL_RESPONSE>
  run (port?: number): Promise<Server>

  close (): Promise<any>
  beforeStart (fn: () => void): void
  beforeClose (fn: () => void): void
}

declare namespace Salak {
  export interface logger {
    silly (msg: any, ...args: any[]): void
    debug (msg: any, ...args: any[]): void
    verbose (msg: any, ...args: any[]): void
    info (msg: any, ...args: any[]): void
    warn (msg: any, ...args: any[]): void
    error (msg: any, ...args: any[]): void
  }

  type PlainObject <T = any> = { [prop: string]: T }

  interface CURL_OPTIONS {
    method?: string
    timeout?: number
    body?: PlainObject
    query?: PlainObject
    headers?: PlainObject
    contentType?: string
    dataType?: string
    retry?: number
    redirects?: number
    stream?: Stream
    reqStream?: Stream
  }

  interface CURL_RESPONSE {
    status: number
    data: any
    err: any
    headers: any
  }

  export class Base {
    constructor (app: string, module: string)

    module: string
    app: Salak
    root: string
    logger: logger
    helper: PlainObject
    curl (url: string, options?: CURL_OPTIONS): Promise<CURL_RESPONSE>
    config (key: string, module?: string): any
    service (name: string, module?: string, ...args: any[]): any
    throw (...args: any[]): void
  }

  export interface Context extends KoaApplication.Context {
    curl (url: string, options?: CURL_OPTIONS): Promise<CURL_RESPONSE>
  }

  class Middleware {
    only (routes: string[] | string): this
    except (routes: string[] | string): this
  }

  export class Controller extends Base {
    ctx: Context
    header: PlainObject
    userAgent: string
    query: PlainObject
    status: number
    body: any
    type: string
    send (data: any, status?: number): void
    success (data: any, message?: string, code?: number): void
    failure (code: number, message?: string, data?: any): void
    middleware (name: string|Function, module?: string, options?: any): Middleware
  }

  export class Behavior extends Base {
    Joi: PlainObject
    behavior (name: string, module?: string): Behavior
  }

  export class Service extends Base {}
  export class Schedule extends Base {}
  export class RestController extends Controller {}
}

export = Salak
