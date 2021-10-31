import { extend } from "./shared";

class ReactiveEffect {
    private _fn: any;
    private active: Boolean = true;
    private deps = [];
    onStop?: () => void;
    constructor(fn, public scheduler?) {
        this._fn = fn;
    }

    run() {

        // 1.为防止cleanupEffects后再次收集依赖，需要增加全局参数判断是否需要收集
        // 2.在不是stop的情况下，将该参数置为true，可以正常收集，stop情况下，该参数默认是false
        activeEffect = this;
        if (!this.active) {
            return this._fn();
        }


        shouldTrack = true;
        const result = this._fn();
        shouldTrack = false;
        return result;
    }

    stop() {
        // 通过effect找到deps
        if (this.active) {
            if (this.onStop) {
                this.onStop();
            }
            cleanupEffects(this);
            this.active = false;
        }
    }

}

function cleanupEffects(effect) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect);
    });
}


const targetMap = new Map(); // 以target作为key
let activeEffect: any = null;
let shouldTrack: Boolean = false;
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
    if (!activeEffect) return;
    if (!shouldTrack) return;
    dep.add(activeEffect);// 当前的effect
    activeEffect.deps.push(dep);
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

export function stop(runner) {
    // 删除相应的依赖
    runner.effect.stop();
}


export function effect(fn, options: any = {}) {
    const scheduler = options.scheduler;

    const _effect = new ReactiveEffect(fn, scheduler);

    extend(_effect, options);

    _effect.run();


    const runner: any = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}