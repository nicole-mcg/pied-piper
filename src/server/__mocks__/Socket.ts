const mock = jest.fn().mockImplementation(() => {
    return {
        id: 'test',
        emitError: jest.fn(),
    };
});

export default mock;