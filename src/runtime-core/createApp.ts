import { render } from "./renderer";
import { createVNode } from "./vnode";

/**
 * 
 * @param rootComponent 根组件 include setup & render
 * @returns 
 */
export function createApp(rootComponent) {
    return {
        /**
         * 
         * @param rootContainer 根容器
         */
        mount(rootContainer) {

            // 先转为Vnode
            const vnode = createVNode(rootComponent);

            render(vnode, rootContainer)
        }
    }
}


