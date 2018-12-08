module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupTestFrameworkScriptFile: "<rootDir>/jest/setup.ts",
  moduleNameMapper: {
    "@http\\/(.*)": "<rootDir>/src/http/$1",
    "@socket\\/(.*)": "<rootDir>/src/socket//$1",
    "@endpoints\\/(.*)": "<rootDir>/src/endpoints/$1",
    "@app\\/(.*)": "<rootDir>/src/$1",
  }
};