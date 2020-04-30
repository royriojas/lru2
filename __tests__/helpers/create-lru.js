/* eslint-disable global-require */
export const create = require(process.env.USE_DIST === 'true' ? '../../dist/lru2.cjs.js' : '../../src/lru2').create;
