import { mutatableHandlers, readonlyHandlers } from './baseHandler';
export const enum reactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
}


export function reactive(raw) {
    return new Proxy(raw, mutatableHandlers)
}

export function readonly(raw) {
    return new Proxy(raw, readonlyHandlers)
}

export function isReactive(raw) {
    return !!raw[reactiveFlags.IS_REACTIVE];
}

export function isReadonly(raw) {
    return !!raw[reactiveFlags.IS_READONLY];
}