"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchAtMounting = patchAtMounting;
exports.patchAtBootstrapping = patchAtBootstrapping;
exports.css = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _interfaces = require("../../interfaces");

var css = _interopRequireWildcard(require("./css"));

exports.css = css;

var _dynamicAppend = require("./dynamicAppend");

var _historyListener = _interopRequireDefault(require("./historyListener"));

var _interval = _interopRequireDefault(require("./interval"));

var _windowListener = _interopRequireDefault(require("./windowListener"));

/**
 * @author Kuitos
 * @since 2019-04-11
 */
function patchAtMounting(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter) {
  var _patchersInSandbox;

  var _a;

  var basePatchers = [function () {
    return (0, _interval.default)(sandbox.proxy);
  }, function () {
    return (0, _windowListener.default)(sandbox.proxy);
  }, function () {
    return (0, _historyListener.default)();
  }];
  var patchersInSandbox = (_patchersInSandbox = {}, (0, _defineProperty2.default)(_patchersInSandbox, _interfaces.SandBoxType.LegacyProxy, [].concat(basePatchers, [function () {
    return (0, _dynamicAppend.patchLooseSandbox)(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter);
  }])), (0, _defineProperty2.default)(_patchersInSandbox, _interfaces.SandBoxType.Proxy, [].concat(basePatchers, [function () {
    return (0, _dynamicAppend.patchStrictSandbox)(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter);
  }])), (0, _defineProperty2.default)(_patchersInSandbox, _interfaces.SandBoxType.Snapshot, [].concat(basePatchers, [function () {
    return (0, _dynamicAppend.patchLooseSandbox)(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter);
  }])), _patchersInSandbox);
  return (_a = patchersInSandbox[sandbox.type]) === null || _a === void 0 ? void 0 : _a.map(function (patch) {
    return patch();
  });
}

function patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter) {
  var _patchersInSandbox2;

  var _a;

  var patchersInSandbox = (_patchersInSandbox2 = {}, (0, _defineProperty2.default)(_patchersInSandbox2, _interfaces.SandBoxType.LegacyProxy, [function () {
    return (0, _dynamicAppend.patchLooseSandbox)(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter);
  }]), (0, _defineProperty2.default)(_patchersInSandbox2, _interfaces.SandBoxType.Proxy, [function () {
    return (0, _dynamicAppend.patchStrictSandbox)(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter);
  }]), (0, _defineProperty2.default)(_patchersInSandbox2, _interfaces.SandBoxType.Snapshot, [function () {
    return (0, _dynamicAppend.patchLooseSandbox)(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter);
  }]), _patchersInSandbox2);
  return (_a = patchersInSandbox[sandbox.type]) === null || _a === void 0 ? void 0 : _a.map(function (patch) {
    return patch();
  });
}