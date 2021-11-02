import { trigger, track } from './effect'
import { reactiveFlags, readonly, reactive } from './reactive';
import { isObject, extend } from './shared/index';

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isReadonly = false, shallow = false) {
    return (target, key) => {
        const res = Reflect.get(target, key);

        if (key === reactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        } else if (key === reactiveFlags.IS_READONLY) {
            return isReadonly;
        }

        if (shallow) {
            return res;
        }

        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
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

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
});