import { isReadonly, readonly, shallowReadonly } from '../reactive';

describe('readonly', () => {
    it('happy path', () => {
        // can not be set
        const original = { foo: 1, bar: { baz: 1 } }
        const wrapped = readonly(original);
        expect(wrapped).not.toBe(original);
        expect(wrapped.foo).toBe(1);
    });
})


describe('shadowReadonly', () => {
    it('shallow', () => {
        const props = shallowReadonly({ n: { foo: 1 } });
        expect(isReadonly(props)).toBe(true);
        expect(isReadonly(props.n)).toBe(false);
    })
})