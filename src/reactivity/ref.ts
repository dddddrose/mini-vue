import { track, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive';
import { isObject } from './shared';
class RefImpl {
    private _value: any;
    private _raw: any;
    public dep: any;
    public __v_isref = true;
    constructor(value) {
        this._raw = value;
        this._value = this.convert(value);
        this.dep = new Set();
    }

    get value() {
        trackEffects(this.dep);
        return this._value
    }

    set value(newValue) {
        if (Object.is(newValue, this._raw)) return;
        this._raw = newValue;
        this._value = this.convert(newValue);
        triggerEffects(this.dep);
    }

    convert(value) {
        return isObject(value) ? reactive(value) : value;
    }
}

export function ref(value) {
    return new RefImpl(value);
}

export function isRef(value) {
    return !!value.__v_isref;
}

export function unRef(ref) {
    return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objWithRefs) {
    return new Proxy(objWithRefs, {
        get(target, key) {
            return unRef(Reflect.get(target, key))
        },
        // 如果原来是ref的对象 set后仍确保是ref
        set(target, key, value) {
            if(!isRef(value) && isRef(target[key])){
                return (target[key].value = value);
            }else{
                return Reflect.set(target, key, value);
            }
        }
    })
}