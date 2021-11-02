import { mutatableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandler';
export const enum reactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
}


export function reactive(raw) {
    return createReactiveObject(raw, mutatableHandlers);
}

export function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers);
}

export function isReactive(raw) {
    return !!raw[reactiveFlags.IS_REACTIVE];
}

export function isReadonly(raw) {
    return !!raw[reactiveFlags.IS_READONLY];
}

export function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers);
}

export function isProxy(raw) {
    return isReadonly(raw) || isReactive(raw);
}

function createReactiveObject(target, baseHandlers) {
    return new Proxy(target, baseHandlers);
}