module.exports = {
  roots: [
    "<rootDir>/src"
  ],
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "**/*.ts",
    "!**/server.ts",

    "!**/node_modules/**",
    "!**/testing/**",
    "!**/seed/**",

    "!**/index.ts",
    "!**/*.route.ts",
    "!**/*.entity.ts",
    "!**/*.mock.ts",
    "!**/*.enum.ts",
    "!**/*.schema.ts",
    "!**/*.interface.ts",
    "!**/*.dto.ts",
    "!**/*.seed.ts"
  ],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  testEnvironment: 'node',
  silent: true
}
