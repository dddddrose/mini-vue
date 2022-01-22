var isObject = function (raw) {
    return typeof raw !== null && typeof raw === 'object';
};

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
};
var publicInstanceProxyhandlers = {
    get: function (_a, key) {
        var instance = _a._;
        // from setupstate
        var setupState = instance.setupState;
        if (key in setupState) {
            return setupState[key];
        }
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
    };
    return component;
}
function setupComponent(instance) {
    // initProps()
    // initSlots()
    setupStatefulComponent(instance); // 初始化有状态的组件/  函数式组件
}
function setupStatefulComponent(instance) {
    // 拿到setup函数的返回值
    var component = instance.type;
    // ctx
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyhandlers);
    var setup = component.setup;
    if (setup) {
        // funcion: render函数 h(...)
        // object: 注入到组件的上下文
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // obj  function
    if (typeof setupResult === 'object') {
        // 结果存在instance
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var component = instance.type;
    if (component.render) {
        instance.render = component.render;
    }
}

function render(vnode, contaienr) {
    patch(vnode, contaienr);
}
function patch(vnode, container) {
    // 首先判断vnode类型 根据vnode的type是否为object
    if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        // 处理组件
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    // 初始化流程
    mountComponent(vnode, container);
    // 更新流程
    // updateComponent()
}
function mountComponent(vnode, container) {
    // 1. 通过vnode创建组件实例对象
    var instance = createComponentInstance(vnode);
    // 2. setupComponent 设置组建的基本组成
    setupComponent(instance);
    // 3. setupRenderEffect 调用render
    setupRenderEffect(instance, vnode, container);
}
function setupRenderEffect(instance, vnode, container) {
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy); // element类型的vnode
    // vnode -> patch
    patch(subTree, container);
    vnode.el = subTree.el;
}
function processElement(vnode, container) {
    // 初始化流程
    mountElement(vnode, container);
    // 更新流程
    // updateElement(vnode, container);
}
function mountElement(vnode, container) {
    var el = (vnode.el = document.createElement(vnode.type));
    var children = vnode.children, props = vnode.props;
    /** props:
     *  {
     *      id: 'root',
     *      class: ['red', 'light']
     *  }
     */
    for (var key in props) {
        var val = props[key];
        el.setAttribute(key, val);
    }
    // 处理children
    // children: string/array
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        children.forEach(function (v) {
            patch(v, el);
        });
    }
    container.append(el);
}

/**
 *
 * @param type component
 * @param props
 * @param children
 */
function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        el: null,
    };
    return vnode;
}

/**
 *
 * @param rootComponent 根组件 include setup & render
 * @returns
 */
function createApp(rootComponent) {
    return {
        /**
         *
         * @param rootContainer 根容器
         */
        mount: function (rootContainer) {
            // 先转为Vnode
            var vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
