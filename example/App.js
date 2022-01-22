import { h } from '../lib/guide-mini-vue.esm.js'
window.self = null;
export const App = {

    setup() {
        // composition api
        return {
            msg: "mini-vue",
        }
    },
    render() {
        window.self = this;
        return h(
            "div",
            { id: 'root' },
            // string
            // `hi, ${this.msg}`
            // array
            [h('p', { class: 'red' }, 'hi'), h('p', { class: 'blue' }, `${this.msg}`)]
        )
    }

}