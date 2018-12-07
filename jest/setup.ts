const consoleLog = console.log;

beforeEach(() => console.log = jest.fn());
afterAll(() => console.log = consoleLog);