expect.extend({
    toCallFunction(actual, expected) {
        const numCalls = expected.mock.calls.length;
        actual();

        const pass = expected.mock.calls.length === numCalls + 1;
        return {
            message: () => `expected ${actual} to call ${expected}`,
            pass,
        };
    }
});;