const mock = jest.fn().mockImplementation(() => {
    return {
        onUpdate: jest.fn(),
        onDisconnect: jest.fn(),
    };
});

export default mock;