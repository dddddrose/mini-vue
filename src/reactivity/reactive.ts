import { mutatableHandlers, readonlyHandlers } from './baseHandler';

export function reactive(raw) {
    return new Proxy(raw, mutatableHandlers)
}

export function readonly(raw) {
    return new Proxy(raw, readonlyHandlers)
}