import assert from 'node:assert/strict';
import {diff,fingerprint} from '../assets/admin/state.js';
assert.equal(diff({a:1},{a:1}).length,0);
assert.equal(diff({a:1},{a:2})[0].path,'a');
assert.equal(fingerprint({b:2,a:1}),fingerprint({a:1,b:2}));
console.log('Admin state tests: OK');
