/**
 * @author Kuitos
 * @since 2020-10-13
 */
import { getCurrentRunningSandboxProxy } from '../../common';
import { isHijackingTag, patchHTMLDynamicAppendPrototypeFunctions, rawHeadAppendChild, rebuildCSSRules, recordStyledComponentsCSSRules } from './common';
var rawDocumentCreateElement = Document.prototype.createElement;
var proxyAttachContainerConfigMap = new WeakMap();
var elementAttachContainerConfigMap = new WeakMap();

function patchDocumentCreateElement() {
  if (Document.prototype.createElement === rawDocumentCreateElement) {
    Document.prototype.createElement = function createElement(tagName, options) {
      var element = rawDocumentCreateElement.call(this, tagName, options);

      if (isHijackingTag(tagName)) {
        var currentRunningSandboxProxy = getCurrentRunningSandboxProxy();

        if (currentRunningSandboxProxy) {
          var proxyContainerConfig = proxyAttachContainerConfigMap.get(currentRunningSandboxProxy);

          if (proxyContainerConfig) {
            elementAttachContainerConfigMap.set(element, proxyContainerConfig);
          }
        }
      }

      return element;
    };
  }

  return function unpatch() {
    Document.prototype.createElement = rawDocumentCreateElement;
  };
}

var bootstrappingPatchCount = 0;
var mountingPatchCount = 0;
export function patchStrictSandbox(appName, appWrapperGetter, proxy) {
  var mounting = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var scopedCSS = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var excludeAssetFilter = arguments.length > 5 ? arguments[5] : undefined;
  var containerConfig = proxyAttachContainerConfigMap.get(proxy);

  if (!containerConfig) {
    containerConfig = {
      appName: appName,
      proxy: proxy,
      appWrapperGetter: appWrapperGetter,
      dynamicStyleSheetElements: [],
      strictGlobal: true,
      excludeAssetFilter: excludeAssetFilter,
      scopedCSS: scopedCSS
    };
    proxyAttachContainerConfigMap.set(proxy, containerConfig);
  } // all dynamic style sheets are stored in proxy container


  var _containerConfig = containerConfig,
      dynamicStyleSheetElements = _containerConfig.dynamicStyleSheetElements;
  var unpatchDocumentCreate = patchDocumentCreateElement();
  var unpatchDynamicAppendPrototypeFunctions = patchHTMLDynamicAppendPrototypeFunctions(function (element) {
    return elementAttachContainerConfigMap.has(element);
  }, function (element) {
    return elementAttachContainerConfigMap.get(element);
  });
  if (!mounting) bootstrappingPatchCount++;
  if (mounting) mountingPatchCount++;
  return function free() {
    // bootstrap patch just called once but its freer will be called multiple times
    if (!mounting && bootstrappingPatchCount !== 0) bootstrappingPatchCount--;
    if (mounting) mountingPatchCount--;
    var allMicroAppUnmounted = mountingPatchCount === 0 && bootstrappingPatchCount === 0; // release the overwrite prototype after all the micro apps unmounted

    if (allMicroAppUnmounted) {
      unpatchDynamicAppendPrototypeFunctions();
      unpatchDocumentCreate();
    }

    recordStyledComponentsCSSRules(dynamicStyleSheetElements); // As now the sub app content all wrapped with a special id container,
    // the dynamic style sheet would be removed automatically while unmoutting

    return function rebuild() {
      rebuildCSSRules(dynamicStyleSheetElements, function (stylesheetElement) {
        var appWrapper = appWrapperGetter();

        if (!appWrapper.contains(stylesheetElement)) {
          rawHeadAppendChild.call(appWrapper, stylesheetElement);
          return true;
        }

        return false;
      });
    };
  };
}