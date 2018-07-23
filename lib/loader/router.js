const SalakRouter = require('salak-router')
const is = require('is-type-of')
const path = require('path')
const compose = require('koa-compose')
const Middleware = require('../core/middleware')
const assert = require('assert')
const LoaderInterface = require('./loader_interface')
const constants = require('../util/constants')

class Router extends LoaderInterface {
  load () {
    const { mode } = this.app
    // root routes config: prefix, defaultRoute, defaultMethods, replaceIndex
    const { prefix, defaultRoute, defaultMethods, replaceIndex = true } = this._parseRouteConf(this.app.config('routes'))
    const routesDefinitions = { prefix, modules: [] }

    this.app.logger.debug(`Add Routes for Application${prefix ? ': prefix -> ' + prefix : ''}`)

    const router = new SalakRouter({
      prefix
    })

    this[mode](router, routesDefinitions, {
      defaultRoute,
      defaultMethods,
      replaceIndex
    })

    this.writeRuntimeFile(path.join('router', 'definitions.js'), this._removeJoiValidate(routesDefinitions))

    return {
      router,
      routesDefinitions
    }
  }

  [constants.MODE_SINGLE] (rootRouter, routesDefinitions, options) {
    const { defaultRoute, defaultMethods, replaceIndex } = options
    let isSetRootDefaultRoute = false
    const routesFactory = this._addModuleRoutes(rootRouter, this.app.root, {
      defaultMethods,
      replaceIndex,
      setDefaultRootRoute: defaultRoute && (({
        controllerName,
        action,
        actionMeta,
        routePath,
        fn
      }) => {
        if (isSetRootDefaultRoute || !(controllerName === defaultRoute.controller && action === defaultRoute.action)) {
          return
        }

        isSetRootDefaultRoute = true

        if (actionMeta['params'].length > 0) {
          this.app.logger.warn('salak: The default root route cannot contain the params.')
          return
        }

        this.app.logger.debug(`Add root default Route: / method: ${options.defaultMethods} action: ${this.app.root}-${controllerName}-${action}`)
        fn(routePath)
      })
    })

    routesDefinitions.modules.push({
      name: '',
      routes: routesFactory
    })
  }

  [constants.MODE_MULTIPLE] (rootRouter, routesDefinitions, options) {
    const { modules, root } = this.app
    let isSetRootDefaultRoute = false

    for (let key in modules) {
      if (key === root) {
        continue
      }

      // module routes config: prefix, defaultRoute, defaultMethods, alias
      const {
        prefix,
        alias,
        defaultRoute,
        defaultMethods
      } = this._parseRouteConf(this.app.config('routes', key), true)
      let routeModuleName = alias || key
      routeModuleName = routeModuleName === '/' ? '' : (routeModuleName.startsWith('/') ? routeModuleName : `/${routeModuleName}`)

      const router = new SalakRouter({
        prefix
      })

      const moduleMiddlewares = this.app.loader.loadMiddleware(this.app.config('middleware', key), key)
      if (moduleMiddlewares) {
        router.use(moduleMiddlewares)
      }

      this.app.logger.debug(`Add Routes for module ${key} ${(prefix && ' [prefix] -> ' + prefix) || ''}${(alias && ' [alias] -> ' + alias) || ''}`)
      let isSetModuleDefaultRoute = false
      const routesFactory = this._addModuleRoutes(router, key, {
        defaultMethods: defaultMethods || options.defaultMethods,
        replaceIndex: options.replaceIndex,
        setDefaultModuleRoute: defaultRoute && (({
          controllerName,
          action,
          actionMeta,
          routePath,
          fn
        }) => {
          if (isSetModuleDefaultRoute || !(defaultRoute.controller === controllerName && defaultRoute.action === action)) {
            return
          }

          isSetModuleDefaultRoute = true

          if (actionMeta['params'].length > 0) {
            this.app.logger.warn(`salak: The module ${key} default route cannot contain the params.`)
            return
          }

          this.app.logger.debug(`Add module default Route: / method: ${defaultMethods || options.defaultMethods} action: ${key}-${controllerName}-${action}`)
          fn(this._parseCompletedPath(routeModuleName, prefix, routePath))
        }),
        setDefaultRootRoute: (!isSetRootDefaultRoute && options.defaultRoute) && (({
          controllerName,
          action,
          actionMeta,
          routePath,
          fn
        }) => {
          const rootDefaultRoute = options.defaultRoute

          if (isSetRootDefaultRoute || !(key === rootDefaultRoute.module && controllerName === rootDefaultRoute.controller && action === rootDefaultRoute.action)) {
            return
          }

          isSetRootDefaultRoute = true

          if (actionMeta['params'].length > 0) {
            this.app.logger.warn('salak: The default root route cannot contain the params.')
            return
          }

          this.app.logger.debug(`Add root default Route: / method: ${options.defaultMethods} action: ${key}-${controllerName}-${action}`)
          fn({
            rootRouter,
            defaultMethods,
            moduleMiddlewares
          })

          // add to routesDefinitions
          let isPushed = false
          const rootDefinition = {
            path: '/',
            alias: this._parseCompletedPath(routeModuleName, prefix, routePath)
          }
          for (let moduleDefinitions of routesDefinitions.modules) {
            if (moduleDefinitions.name === '') {
              isPushed = true
              moduleDefinitions.routes.push(rootDefinition)
              break
            }
          }

          if (!isPushed) {
            routesDefinitions.modules.push({
              name: '',
              routes: [rootDefinition]
            })
          }
        })
      })

      if (!routesFactory.length) {
        continue
      }

      routesDefinitions.modules.push({
        name: routeModuleName,
        routes: routesFactory
      })

      rootRouter.use(routeModuleName, router.routes())
    }
  }

  _removeJoiValidate (routesDefinitions = {}) {
    const result = {}

    const { prefix, modules = [] } = routesDefinitions
    result['prefix'] = prefix
    result['modules'] = []

    for (let item of modules) {
      const moduleItem = {
        name: item.name,
        routes: []
      }

      for (let route of item.routes) {
        moduleItem.routes.push({
          path: route.path,
          method: route.method
        })
      }

      result['modules'].push(moduleItem)
    }

    return result
  }

  _parseCompletedPath (alias = '', prefix = '', routePath = '') {
    let arr = []
    const properties = [alias, prefix]
    properties.forEach((item) => {
      arr = arr.concat(item.split('/').filter((item) => item !== ''))
    })

    let result = arr.join('/') + routePath
    return result.startsWith('/') ? result : `/${result}`
  }

  _addModuleRoutes (router, module, {
    defaultMethods,
    replaceIndex,
    setDefaultModuleRoute,
    setDefaultRootRoute
  }) {
    const { controllers, behaviors } = this.app
    const controllerObjs = controllers[module]
    const behaviorObjs = behaviors[module]

    const routesFactory = []
    const existsPaths = []
    for (let controllerName in controllerObjs) {
      const Controller = controllerObjs[controllerName]
      assert(is.class(Controller), `${controllerName} must be class.`)

      const actions = this._parseController(Controller)
      const { routes = {}, rules = {} } = this._parBehavior(behaviorObjs[controllerName], Controller, Object.keys(actions), module)
      const moduleRoutes = this._parseRoutes(actions, routes, rules, defaultMethods)
      const controllerPrefix = controllerName.split('.').filter((item) => {
        if (replaceIndex && item === 'index') {
          return false
        }

        return true
      }).join('/')

      for (let key in moduleRoutes) {
        const item = moduleRoutes[key]
        const actionMeta = actions[key]

        for (let pathKey in item) {
          let routePath = controllerPrefix === '' ? pathKey : `/${controllerPrefix}${pathKey}`

          if (routePath !== '/' && routePath.endsWith('/')) {
            routePath = routePath.slice(0, -1)
          }

          if (existsPaths.indexOf(routePath) === -1) {
            existsPaths.push(routePath)
          } else {
            this.app.logger.warn(`Same Route: ${routePath} may causing unexpected error, please check.`)
          }

          const handler = async (ctx, next) => {
            const client = new Controller(ctx, module)
            const params = actions[key].params
            const controllerMiddlewares = []
            // execute inline middlewares
            for (let middleware of client[Controller.middlewares]) {
              const inlineMiddleware = middleware[Middleware.EXECUTE](key)
              if (inlineMiddleware) {
                controllerMiddlewares.push(inlineMiddleware)
              }
            }

            await compose(controllerMiddlewares.concat(async (ctx, next) => {
              const parameters = params.map((item) => ctx.params[item])

              const result = await client[actionMeta.key](...parameters)

              if (result && !ctx.body) {
                ctx.body = result
              }
            }))(ctx, next)
          }

          this.app.logger.debug(`Add Route: ${routePath} method: ${item[pathKey]['method']} action: ${module}-${controllerName}-${key}`)
          router.addRoute({
            path: routePath,
            method: item[pathKey]['method'],
            validate: item[pathKey]['validate']
          }, handler)

          routesFactory.push({
            path: routePath,
            method: item[pathKey]['method'],
            meta: item[pathKey]['meta'],
            validate: item[pathKey]['validate'] || {}
          })

          setDefaultModuleRoute && setDefaultModuleRoute({
            controllerName,
            action: key,
            actionMeta,
            routePath,
            fn: (aliasPath) => {
              router.addRoute({
                path: '/',
                method: defaultMethods,
                validate: item[pathKey]['validate']
              }, handler)

              routesFactory.push({
                path: '/',
                alias: aliasPath
              })
            }
          })

          setDefaultRootRoute && setDefaultRootRoute({
            controllerName,
            action: key,
            actionMeta,
            routePath,
            fn: ({
              rootRouter,
              defaultMethods,
              moduleMiddlewares
            }) => {
              rootRouter.addRoute({
                path: '/',
                method: defaultMethods,
                validate: item[pathKey]['validate']
              }, moduleMiddlewares ? compose([moduleMiddlewares, handler]) : handler)
            }
          })
        }
      }
    }

    return routesFactory
  }

  // compatible for Behavior & Controller.behavior
  _parBehavior (Behavior, Controller, keys = [], module) {
    const routes = {}
    const rules = {}

    Controller.routes && Object.assign(routes, Controller.routes)
    Controller.rules && Object.assign(rules, Controller.rules)

    if (is.function(Controller.behaviors)) { // compact salak 1.x, unrecommand
      const behaviors = Controller.behaviors()

      behaviors.routes && Object.assign(routes, behaviors.routes)
      behaviors.rules && Object.assign(rules, behaviors.routes)
    }

    if (is.class(Behavior)) {
      Behavior.routes && Object.assign(routes, Behavior.routes)
      const behavior = new Behavior(this.app, module)

      for (let key of keys) {
        if (!is.function(behavior[key])) {
          continue
        }

        rules[key] = behavior[key]()
      }
    }

    return {
      routes,
      rules
    }
  }

  _parseRouteConf (route = {}, isModule = false) {
    const { prefix, defaultRoute, defaultMethods, replaceIndex, alias } = route
    let defaultAction

    if (defaultRoute && is.string(defaultRoute)) {
      const arr = defaultRoute.split('/').filter((item) => item !== '')
      if ((this.app.mode === constants.MODE_SINGLE || isModule) && arr.length > 0) {
        defaultAction = {
          controller: arr[0],
          action: arr[1] || 'index'
        }
      } else if (arr.length > 1 && !isModule) {
        defaultAction = {
          module: arr[0],
          controller: arr[1],
          action: arr[2] || 'index'
        }
      }
    }

    const routeMethods = isModule ? (defaultMethods || constants.DEFAULT_METHODS) : defaultMethods

    return {
      alias,
      prefix: (prefix && !prefix.startsWith('/')) ? `/${prefix}` : prefix,
      replaceIndex,
      defaultRoute: defaultAction,
      defaultMethods: is.string(routeMethods) ? [routeMethods] : routeMethods
    }
  }

  _parseController (Controller) {
    const proto = Controller.prototype
    const keys = Object.getOwnPropertyNames(proto)

    const actions = {}
    for (let key of keys) {
      if (key.startsWith('action')) { // action
        let action = key.substring(6)

        if (action) {
          action = action[0].toLowerCase() + action.slice(1)

          actions[action] = {
            key,
            params: this._getParameterNames(proto[key])
          }
        }
      }
    }

    return actions
  }

  _getParameterNames (fn) {
    const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
    const DEFAULT_PARAMS = /=[^,]+/mg
    const FAT_ARROWS = /=>.*$/mg
    const code = fn.toString()
      .replace(COMMENTS, '')
      .replace(FAT_ARROWS, '')
      .replace(DEFAULT_PARAMS, '')

    const result = code.slice(code.indexOf('(') + 1, code.indexOf(')'))
      .match(/([^\s,]+)/g)

    return result === null ? [] : result
  }

  _parseRoutes (actions, routes, rules, defaultMethods = constants.DEFAULT_METHODS) {
    const ret = {}

    for (let key in actions) {
      const item = actions[key]
      const { method = defaultMethods, meta, validate } = rules[key] || {}
      ret[key] = {}

      let hasSpecified = false
      for (let item in routes) {
        if (routes[item] !== key) {
          continue
        }

        const httpAction = item.split(' ')
        if (httpAction.length < 2) {
          continue
        }

        const routeMethod = httpAction[0].toUpperCase()
        const routePath = httpAction[1].startsWith('/') ? httpAction[1] : '/' + httpAction[1]

        if (ret[key][routePath] && ret[key][routePath]['method'].indexOf(routeMethod) === -1) {
          ret[key][routePath]['method'].push(routeMethod)
          continue
        }

        ret[key][routePath] = {
          method: routeMethod,
          meta,
          validate
        }
        hasSpecified = true
      }

      // which not has specified rule
      if (hasSpecified) {
        continue
      }

      const isIndex = key === 'index'
      const defaultPath = `${isIndex ? '/' : '/' + key}` + (item.params.length > 0 ? (isIndex ? '' : '/') + item.params.map((item) => `:${item}`).join('/') : '')

      if (!ret[key][defaultPath]) {
        ret[key][defaultPath] = {
          method: is.array(method) ? method : [method],
          meta,
          validate
        }
      }
    }

    return ret
  }
}

module.exports = Router
