const { clear } = require("console");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  //forceExit: true,
};
