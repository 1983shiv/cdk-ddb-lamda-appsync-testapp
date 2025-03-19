module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__/test_cases'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  testTimeout: 90000
};
