export const extend = Object.assign;

export const isObject = (raw) => {
    return typeof raw !== null && typeof raw === 'object';
}