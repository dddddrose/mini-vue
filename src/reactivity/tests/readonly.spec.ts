import {readonly} from '../reactive';

describe('readonly', () => {
    it('happy path', () => {
        // can not be set
        const original = { foo: 1, bar: { baz: 1 } }
        const wrapped = readonly(original);
        expect(wrapped).not.toBe(original);
        expect(wrapped.foo).toBe(1);
    });
})
