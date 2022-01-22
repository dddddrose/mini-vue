import { publicInstanceProxyhandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode) {

    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
    }
    return component;
}

export function setupComponent(instance) {
    // initProps()
    // initSlots()

    setupStatefulComponent(instance);// 初始化有状态的组件/  函数式组件
}


function setupStatefulComponent(instance: any) {
    // 拿到setup函数的返回值
    const component = instance.type;

    // ctx
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyhandlers)

    const { setup } = component;
    if (setup) {
        // funcion: render函数 h(...)
        // object: 注入到组件的上下文
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }

}


function handleSetupResult(instance: any, setupResult: any) {
    // obj  function
    if (typeof setupResult === 'object') {
        // 结果存在instance
        instance.setupState = setupResult;
    } else {

    }

    finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
    const component = instance.type;

    if (component.render) {
        instance.render = component.render;
    }
}

