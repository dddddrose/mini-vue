import { track, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive';
import { isObject } from './shared';
class RefImpl {
    private _value: any;
    private _raw: any;
    public dep: any;
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