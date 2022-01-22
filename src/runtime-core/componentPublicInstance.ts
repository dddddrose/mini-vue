const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
}


export const publicInstanceProxyhandlers = {
    get({ _: instance }, key) {
        // from setupstate
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }

        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
}