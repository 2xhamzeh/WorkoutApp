const { clear } = require("console");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./src/__tests__/jest.setup.ts"],
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  //forceExit: true,
};
