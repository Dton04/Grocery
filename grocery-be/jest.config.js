module.exports = {
   preset: 'ts-jest',
   testEnvironment: 'node',
   roots: ['<rootDir>/src'],
   testMatch: ['**/tests/**/*.test.ts'],
   setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
   transformIgnorePatterns: [
      'node_modules/(?!(chalk)/)'
   ],
   moduleNameMapper: {
      '^chalk$': '<rootDir>/src/tests/__mocks__/chalk.ts'
   },
   collectCoverageFrom: [
      'src/**/*.ts',
      '!src/**/*.d.ts',
      '!src/server.ts',
      '!src/app.ts'
   ],
   coverageDirectory: 'coverage',
   verbose: true
}