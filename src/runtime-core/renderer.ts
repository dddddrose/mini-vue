import { isObject } from "../reactivity/shared/index";
import { createComponentInstance, setupComponent } from "./component";


export function render(vnode: any, contaienr: any) {
    patch(vnode, contaienr)


}


function patch(vnode, container) {

    // 首先判断vnode类型 根据vnode的type是否为object
    if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    } else if (isObject(vnode.type)) {
        // 处理组件
        processComponent(vnode, container);
    }
}

function processComponent(vnode: any, container: any) {
    // 初始化流程
    mountComponent(vnode, container);

    // 更新流程
    // updateComponent()
}


function mountComponent(vnode: any, container: any) {
    // 1. 通过vnode创建组件实例对象
    const instance = createComponentInstance(vnode);

    // 2. setupComponent 设置组建的基本组成
    setupComponent(instance);

    // 3. setupRenderEffect 调用render
    setupRenderEffect(instance, vnode, container);
}

function setupRenderEffect(instance: any, vnode: any, container: any) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);  // element类型的vnode

    // vnode -> patch
    patch(subTree, container);
    vnode.el = subTree.el;
}

function processElement(vnode: any, container: any) {
    // 初始化流程
    mountElement(vnode, container);

    // 更新流程
    // updateElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
    const el = (vnode.el = document.createElement(vnode.type));
    const { children, props } = vnode;
    /** props:
     *  {
     *      id: 'root',
     *      class: ['red', 'light']     
     *  }
     */
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
    }

    // 处理children
    // children: string/array
    if (typeof children === 'string') {
        el.textContent = children;
    } else if (Array.isArray(children)) {
        children.forEach((v) => {
            patch(v, el);
        });
    }

    container.append(el);
}

function updateElement(vnode: any, container: any) {
    throw new Error("Function not implemented.");
}

