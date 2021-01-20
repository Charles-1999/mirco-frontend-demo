"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchLooseSandbox = patchLooseSandbox;

var _singleSpa = require("single-spa");

var _common = require("./common");

/**
 * @author Kuitos
 * @since 2020-10-13
 */
var bootstrappingPatchCount = 0;
var mountingPatchCount = 0;
/**
 * Just hijack dynamic head append, that could avoid accidentally hijacking the insertion of elements except in head.
 * Such a case: ReactDOM.createPortal(<style>.test{color:blue}</style>, container),
 * this could made we append the style element into app wrapper but it will cause an error while the react portal unmounting, as ReactDOM could not find the style in body children list.
 * @param appName
 * @param appWrapperGetter
 * @param proxy
 * @param mounting
 * @param scopedCSS
 * @param excludeAssetFilter
 */

function patchLooseSandbox(appName, appWrapperGetter, proxy) {
  var mounting = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var scopedCSS = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var excludeAssetFilter = arguments.length > 5 ? arguments[5] : undefined;
  var dynamicStyleSheetElements = [];
  var unpatchDynamicAppendPrototypeFunctions = (0, _common.patchHTMLDynamicAppendPrototypeFunctions)(
  /*
    check if the currently specified application is active
    While we switch page from qiankun app to a normal react routing page, the normal one may load stylesheet dynamically while page rendering,
    but the url change listener must to wait until the current call stack is flushed.
    This scenario may cause we record the stylesheet from react routing page dynamic injection,
    and remove them after the url change triggered and qiankun app is unmouting
    see https://github.com/ReactTraining/history/blob/master/modules/createHashHistory.js#L222-L230
   */
  function () {
    return (0, _singleSpa.checkActivityFunctions)(window.location).some(function (name) {
      return name === appName;
    });
  }, function () {
    return {
      appName: appName,
      appWrapperGetter: appWrapperGetter,
      proxy: proxy,
      strictGlobal: false,
      scopedCSS: scopedCSS,
      dynamicStyleSheetElements: dynamicStyleSheetElements,
      excludeAssetFilter: excludeAssetFilter
    };
  });
  if (!mounting) bootstrappingPatchCount++;
  if (mounting) mountingPatchCount++;
  return function free() {
    // bootstrap patch just called once but its freer will be called multiple times
    if (!mounting && bootstrappingPatchCount !== 0) bootstrappingPatchCount--;
    if (mounting) mountingPatchCount--;
    var allMicroAppUnmounted = mountingPatchCount === 0 && bootstrappingPatchCount === 0; // release the overwrite prototype after all the micro apps unmounted

    if (allMicroAppUnmounted) unpatchDynamicAppendPrototypeFunctions();
    (0, _common.recordStyledComponentsCSSRules)(dynamicStyleSheetElements); // As now the sub app content all wrapped with a special id container,
    // the dynamic style sheet would be removed automatically while unmoutting

    return function rebuild() {
      (0, _common.rebuildCSSRules)(dynamicStyleSheetElements, function (stylesheetElement) {
        var appWrapper = appWrapperGetter();

        if (!appWrapper.contains(stylesheetElement)) {
          // Using document.head.appendChild ensures that appendChild invocation can also directly use the HTMLHeadElement.prototype.appendChild method which is overwritten at mounting phase
          document.head.appendChild.call(appWrapper, stylesheetElement);
          return true;
        }

        return false;
      }); // As the patcher will be invoked every mounting phase, we could release the cache for gc after rebuilding

      if (mounting) {
        dynamicStyleSheetElements = [];
      }
    };
  };
}