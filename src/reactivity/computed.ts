import { ReactiveEffect } from '../reactivity/effect'

class ComputedRefImpl {
    private _getter: any;
    private _value: any;
    private _dirty: boolean = true;
    private _effect: any;
    constructor(getter) {
        this._getter = getter;
        // trigger的时候会优先执行scheduler 响应式对象发生改变的时候将锁取消
        this._effect = new ReactiveEffect(getter, ()=> {
            if (!this._dirty) {
                this._dirty = true;
            }
        });
    }

    get value() {
        if (this._dirty) {
            this._dirty = false;
            this._value = this._effect.run();
        }
        return this._value;
    }
}


export function computed(getter) {
    return new ComputedRefImpl(getter);
}