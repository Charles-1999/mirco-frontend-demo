"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentRunningSandboxProxy = getCurrentRunningSandboxProxy;
exports.setCurrentRunningSandboxProxy = setCurrentRunningSandboxProxy;
exports.getTargetValue = getTargetValue;
exports.getProxyPropertyValue = getProxyPropertyValue;

var _utils = require("../utils");

/**
 * @author Kuitos
 * @since 2020-04-13
 */
var currentRunningSandboxProxy;

function getCurrentRunningSandboxProxy() {
  return currentRunningSandboxProxy;
}

function setCurrentRunningSandboxProxy(proxy) {
  currentRunningSandboxProxy = proxy;
}

var functionBoundedValueMap = new WeakMap();

function getTargetValue(target, value) {
  var cachedBoundFunction = functionBoundedValueMap.get(value);

  if (cachedBoundFunction) {
    return cachedBoundFunction;
  }
  /*
    仅绑定 isCallable && !isBoundedFunction && !isConstructable 的函数对象，如 window.console、window.atob 这类。目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
    @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
   */


  if ((0, _utils.isCallable)(value) && !(0, _utils.isBoundedFunction)(value) && !(0, _utils.isConstructable)(value)) {
    var boundValue = Function.prototype.bind.call(value, target); // some callable function has custom fields, we need to copy the enumerable props to boundValue. such as moment function.
    // use for..in rather than Object.keys.forEach for performance reason
    // eslint-disable-next-line guard-for-in,no-restricted-syntax

    for (var key in value) {
      boundValue[key] = value[key];
    } // copy prototype if bound function not have
    // mostly a bound function have no own prototype, but it not absolute in some old version browser, see https://github.com/umijs/qiankun/issues/1121


    if (value.hasOwnProperty('prototype') && !boundValue.hasOwnProperty('prototype')) boundValue.prototype = value.prototype;
    functionBoundedValueMap.set(value, boundValue);
    return boundValue;
  }

  return value;
}

var getterInvocationResultMap = new WeakMap();

function getProxyPropertyValue(getter) {
  var getterResult = getterInvocationResultMap.get(getter);

  if (!getterResult) {
    var result = getter();
    getterInvocationResultMap.set(getter, result);
    return result;
  }

  return getterResult;
}