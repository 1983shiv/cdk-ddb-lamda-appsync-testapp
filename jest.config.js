module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__/test_cases'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testTimeOut: 90000
};
