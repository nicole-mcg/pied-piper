
declare namespace jest {
    interface Matchers<R> {
        toCallFunction(expected): R;
    }
}