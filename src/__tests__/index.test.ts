/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
import os from 'os';
import fs from 'fs';

import loadConfiguration from '@/src';

const originalCwd = process.cwd();
const temporaryDirectories: string[] = [];

beforeEach(() => {
  process.env.CONFIG_ENV = '';
  process.env.NODE_ENV = '';
});

afterEach(() => {
  process.chdir(originalCwd);

  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

it('throws error when CONFIG_ENV is undefined', () => {
  expect(() => {
    loadConfiguration();
  }).toThrow('Invalid environment');
});

it('throws error when CONFIG_ENV has no respective config', () => {
  process.env.CONFIG_ENV = 'invalid';
  expect(() => {
    loadConfiguration();
  }).toThrow('Invalid environment');
});

it('returns configuration', () => {
  process.env.CONFIG_ENV = 'test';
  const configuration = loadConfiguration();
  expect(configuration.VIDEO_URL).toEqual(
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  );
});

it('allows local overrides', () => {
  process.env.CONFIG_ENV = 'overrides';
  const configuration = loadConfiguration();
  expect(configuration.VIDEO_URL).toEqual(
    'https://www.youtube.com/watch?v=XSqi5s3rfqk',
  );
});

it('does not load configuration when the root module is imported', () => {
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'configuration-pkg-'),
  );
  temporaryDirectories.push(temporaryDirectory);

  process.env.CONFIG_ENV = 'missing';
  process.chdir(temporaryDirectory);

  let configurationModule: unknown;

  expect(() => {
    jest.isolateModules(() => {
      configurationModule = require('@/src');
    });
  }).not.toThrow();

  expect(typeof (configurationModule as { default: unknown }).default).toEqual(
    'function',
  );
});

it('loads configuration from an explicit env directory', () => {
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'configuration-pkg-'),
  );
  temporaryDirectories.push(temporaryDirectory);

  const envDir = path.join(temporaryDirectory, '.env');
  const toolingCwd = path.join(temporaryDirectory, 'tooling-cwd');

  fs.mkdirSync(envDir);
  fs.mkdirSync(toolingCwd);
  fs.writeFileSync(
    path.join(envDir, 'tooling'),
    'VIDEO_URL=https://example.com/tooling\n',
  );

  process.env.CONFIG_ENV = 'tooling';
  process.chdir(toolingCwd);

  const configuration = loadConfiguration({ envDir });

  expect(configuration.VIDEO_URL).toEqual('https://example.com/tooling');
  expect(process.cwd()).toEqual(fs.realpathSync(toolingCwd));
});
