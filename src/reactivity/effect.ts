class ReactiveEffect {
    private _fn: any;
    constructor(fn, public scheduler?) {
        this._fn = fn;
    }

    run() {
        activeEffect = this;
        return this._fn();
    }


}


const targetMap = new Map(); // 以target作为key
let activeEffect: any = null;
// 将effect中的fn添加到依赖
export function track(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }

    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    // {foo:1,sys:2}
    if (activeEffect) {
        dep.add(activeEffect);// 当前的effect
    }
}

export function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            effect.run();
        }
    }
}


export function effect(fn, options: any = {}) {
    const scheduler = options.scheduler;
    const _effect = new ReactiveEffect(fn, scheduler);
    _effect.run();

    return _effect.run.bind(_effect);
}