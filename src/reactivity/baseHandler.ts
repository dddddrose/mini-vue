import { trigger, track } from './effect'
import { reactiveFlags } from './reactive';

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

function createGetter(isReadonly = false) {
    return (target, key) => {
        const res = Reflect.get(target, key);

        if (key === reactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        } else if (key === reactiveFlags.IS_READONLY) {
            return isReadonly;
        }

        // 依赖收集
        if (!isReadonly) {
            track(target, key);
        }
        return res;
    }
}

function createSetter() {
    return (target, key, value) => {
        const res = Reflect.set(target, key, value);
        // 触发依赖
        trigger(target, key);
        return res;
    }
}

export const mutatableHandlers = {
    get,
    set,
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`${target} can not be set!`)
        return true;
    }
}