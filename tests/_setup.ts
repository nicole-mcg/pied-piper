const consoleLog = console.log;

beforeEach(() => console.log = jest.fn());
afterEach(() => jest.clearAllMocks());
afterAll(() => console.log = consoleLog);
