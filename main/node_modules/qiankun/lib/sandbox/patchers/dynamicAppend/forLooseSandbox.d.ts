/**
 * @author Kuitos
 * @since 2020-10-13
 */
import type { Freer } from '../../../interfaces';
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
export declare function patchLooseSandbox(appName: string, appWrapperGetter: () => HTMLElement | ShadowRoot, proxy: Window, mounting?: boolean, scopedCSS?: boolean, excludeAssetFilter?: CallableFunction): Freer;
