module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: [
    "**/*.(t|j)s",
    "!**/*.module.ts",
    "!**/main.ts",
    "!**/*.spec.ts",
    "!**/*.dto.ts",
    "!**/*.model.ts",
  ],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
};
