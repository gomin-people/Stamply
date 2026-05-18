import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@constants/(.*)$': '<rootDir>/constants/$1',
    '^@types/(.*)$': '<rootDir>/types/$1',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};

export default config;
