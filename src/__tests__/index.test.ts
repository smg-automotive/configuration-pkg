/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import loadConfiguration from '../loadConfiguration';

beforeEach(() => {
  process.env.CONFIG_ENV = '';
  process.env.NODE_ENV = '';
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
