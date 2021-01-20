/**
 * @author Kuitos
 * @since 2019-05-15
 */
import type { FrameworkConfiguration } from './interfaces';
export declare function toArray<T>(array: T | T[]): T[];
export declare function sleep(ms: number): Promise<unknown>;
/**
 * run a callback after next tick
 * @param cb
 */
export declare function nextTick(cb: () => void): void;
export declare function isConstructable(fn: () => any | FunctionConstructor): any;
export declare const isCallable: (fn: any) => boolean;
export declare function isBoundedFunction(fn: CallableFunction): boolean | undefined;
export declare function getDefaultTplWrapper(id: string, name: string): (tpl: string) => string;
export declare function getWrapperId(id: string): string;
/** 校验子应用导出的 生命周期 对象是否正确 */
export declare function validateExportLifecycle(exports: any): boolean;
declare class Deferred<T> {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
    constructor();
}
export { Deferred };
export declare function performanceGetEntriesByName(markName: string, type?: string): PerformanceEntryList | null;
export declare function performanceMark(markName: string): void;
export declare function performanceMeasure(measureName: string, markName: string): void;
export declare function isEnableScopedCSS(sandbox: FrameworkConfiguration['sandbox']): boolean;
/**
 * copy from https://developer.mozilla.org/zh-CN/docs/Using_XPath
 * @param el
 * @param document
 */
export declare function getXPathForElement(el: Node, document: Document): string | void;
export declare function getContainer(container: string | HTMLElement): HTMLElement | null;
