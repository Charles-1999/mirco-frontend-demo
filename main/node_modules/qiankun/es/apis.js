import _typeof from "@babel/runtime/helpers/esm/typeof";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _noop from "lodash/noop";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { __awaiter, __rest } from "tslib";
import { mountRootParcel, registerApplication, start as startSingleSpa } from 'single-spa';
import { loadApp } from './loader';
import { doPrefetchStrategy } from './prefetch';
import { Deferred, getContainer, getXPathForElement, toArray } from './utils';
var microApps = []; // eslint-disable-next-line import/no-mutable-exports

export var frameworkConfiguration = {};
var frameworkStartedDefer = new Deferred();
export function registerMicroApps(apps, lifeCycles) {
  var _this = this;

  // Each app only needs to be registered once
  var unregisteredApps = apps.filter(function (app) {
    return !microApps.some(function (registeredApp) {
      return registeredApp.name === app.name;
    });
  });
  microApps = [].concat(_toConsumableArray(microApps), _toConsumableArray(unregisteredApps));
  unregisteredApps.forEach(function (app) {
    var name = app.name,
        activeRule = app.activeRule,
        _app$loader = app.loader,
        loader = _app$loader === void 0 ? _noop : _app$loader,
        props = app.props,
        appConfig = __rest(app, ["name", "activeRule", "loader", "props"]);

    registerApplication({
      name: name,
      app: function app() {
        return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
          var _this2 = this;

          var _a, mount, otherMicroAppConfigs;

          return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  loader(true);
                  _context3.next = 3;
                  return frameworkStartedDefer.promise;

                case 3:
                  _context3.next = 5;
                  return loadApp(Object.assign({
                    name: name,
                    props: props
                  }, appConfig), frameworkConfiguration, lifeCycles);

                case 5:
                  _context3.t0 = _context3.sent;
                  _a = (0, _context3.t0)();
                  mount = _a.mount;
                  otherMicroAppConfigs = __rest(_a, ["mount"]);
                  return _context3.abrupt("return", Object.assign({
                    mount: [function () {
                      return __awaiter(_this2, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                        return _regeneratorRuntime.wrap(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                return _context.abrupt("return", loader(true));

                              case 1:
                              case "end":
                                return _context.stop();
                            }
                          }
                        }, _callee);
                      }));
                    }].concat(_toConsumableArray(toArray(mount)), [function () {
                      return __awaiter(_this2, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
                        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                          while (1) {
                            switch (_context2.prev = _context2.next) {
                              case 0:
                                return _context2.abrupt("return", loader(false));

                              case 1:
                              case "end":
                                return _context2.stop();
                            }
                          }
                        }, _callee2);
                      }));
                    }])
                  }, otherMicroAppConfigs));

                case 10:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));
      },
      activeWhen: activeRule,
      customProps: props
    });
  });
}
var appConfigPromiseGetterMap = new Map();
export function loadMicroApp(app, configuration, lifeCycles) {
  var _this3 = this;

  var props = app.props,
      name = app.name;

  var getContainerXpath = function getContainerXpath(container) {
    var containerElement = getContainer(container);

    if (containerElement) {
      return getXPathForElement(containerElement, document);
    }

    return undefined;
  };

  var wrapParcelConfigForRemount = function wrapParcelConfigForRemount(config) {
    return Object.assign(Object.assign({}, config), {
      // empty bootstrap hook which should not run twice while it calling from cached micro app
      bootstrap: function bootstrap() {
        return Promise.resolve();
      }
    });
  };
  /**
   * using name + container xpath as the micro app instance id,
   * it means if you rendering a micro app to a dom which have been rendered before,
   * the micro app would not load and evaluate its lifecycles again
   */


  var memorizedLoadingFn = function memorizedLoadingFn() {
    return __awaiter(_this3, void 0, void 0, /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
      var userConfiguration, $$cacheLifecycleByAppName, container, parcelConfigGetterPromise, xpath, _parcelConfigGetterPromise, parcelConfigObjectGetterPromise, _xpath;

      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              userConfiguration = configuration !== null && configuration !== void 0 ? configuration : Object.assign(Object.assign({}, frameworkConfiguration), {
                singular: false
              });
              $$cacheLifecycleByAppName = userConfiguration.$$cacheLifecycleByAppName;
              container = 'container' in app ? app.container : undefined;

              if (!container) {
                _context4.next = 23;
                break;
              }

              if (!$$cacheLifecycleByAppName) {
                _context4.next = 13;
                break;
              }

              parcelConfigGetterPromise = appConfigPromiseGetterMap.get(name);

              if (!parcelConfigGetterPromise) {
                _context4.next = 13;
                break;
              }

              _context4.t0 = wrapParcelConfigForRemount;
              _context4.next = 10;
              return parcelConfigGetterPromise;

            case 10:
              _context4.t1 = _context4.sent;
              _context4.t2 = (0, _context4.t1)(container);
              return _context4.abrupt("return", (0, _context4.t0)(_context4.t2));

            case 13:
              xpath = getContainerXpath(container);

              if (!xpath) {
                _context4.next = 23;
                break;
              }

              _parcelConfigGetterPromise = appConfigPromiseGetterMap.get("".concat(name, "-").concat(xpath));

              if (!_parcelConfigGetterPromise) {
                _context4.next = 23;
                break;
              }

              _context4.t3 = wrapParcelConfigForRemount;
              _context4.next = 20;
              return _parcelConfigGetterPromise;

            case 20:
              _context4.t4 = _context4.sent;
              _context4.t5 = (0, _context4.t4)(container);
              return _context4.abrupt("return", (0, _context4.t3)(_context4.t5));

            case 23:
              parcelConfigObjectGetterPromise = loadApp(app, userConfiguration, lifeCycles);

              if (container) {
                if ($$cacheLifecycleByAppName) {
                  appConfigPromiseGetterMap.set(name, parcelConfigObjectGetterPromise);
                } else {
                  _xpath = getContainerXpath(container);
                  if (_xpath) appConfigPromiseGetterMap.set("".concat(name, "-").concat(_xpath), parcelConfigObjectGetterPromise);
                }
              }

              _context4.next = 27;
              return parcelConfigObjectGetterPromise;

            case 27:
              _context4.t6 = _context4.sent;
              return _context4.abrupt("return", (0, _context4.t6)(container));

            case 29:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
  };

  return mountRootParcel(memorizedLoadingFn, Object.assign({
    domElement: document.createElement('div')
  }, props));
}
export function start() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  frameworkConfiguration = Object.assign({
    prefetch: true,
    singular: true,
    sandbox: true
  }, opts);

  var _frameworkConfigurati = frameworkConfiguration,
      prefetch = _frameworkConfigurati.prefetch,
      sandbox = _frameworkConfigurati.sandbox,
      singular = _frameworkConfigurati.singular,
      urlRerouteOnly = _frameworkConfigurati.urlRerouteOnly,
      importEntryOpts = __rest(frameworkConfiguration, ["prefetch", "sandbox", "singular", "urlRerouteOnly"]);

  if (prefetch) {
    doPrefetchStrategy(microApps, prefetch, importEntryOpts);
  }

  if (sandbox) {
    if (!window.Proxy) {
      console.warn('[qiankun] Miss window.Proxy, proxySandbox will degenerate into snapshotSandbox');
      frameworkConfiguration.sandbox = _typeof(sandbox) === 'object' ? Object.assign(Object.assign({}, sandbox), {
        loose: true
      }) : {
        loose: true
      };

      if (!singular) {
        console.warn('[qiankun] Setting singular as false may cause unexpected behavior while your browser not support window.Proxy');
      }
    }
  }

  startSingleSpa({
    urlRerouteOnly: urlRerouteOnly
  });
  frameworkStartedDefer.resolve();
}