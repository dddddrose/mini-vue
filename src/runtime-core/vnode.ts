
/**
 * 
 * @param type component
 * @param props 
 * @param children 
 */
export function createVNode(type, props?, children?) {
    const vnode = {
        type,
        props,
        children,
        el: null,
    }
    return vnode
}