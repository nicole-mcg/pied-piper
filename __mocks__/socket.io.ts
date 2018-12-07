const ioStub = { // var so variable is hoisted
    on: jest.fn(),
    emit: jest.fn()
}


export default () => ioStub;