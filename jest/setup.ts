const consoleLog = console.log;

beforeEach(() => console.log = jest.fn());
afterEach(() => jest.restoreAllMocks());
afterAll(() => console.log = consoleLog);
