const assert = require('assert');
const sham = require('../src/sham');

const didThrow = f => {
	let rv = false;
	try {
		f();
	} catch(e) {
		rv = e.message || true;
	}

	return rv;
}

describe('Sham tests', () => {
	describe('Fabrication', () => {
		it('Will create a stub', () => {
			const a = sham();
			assert(typeof a === 'function');
		});

		it('Will create a return sham', () => {
			const a = sham('returns', 4);
			assert(typeof a === 'function');
		});

		it('Will create a resolve sham', () => {
			const a = sham('resolves', true);
			assert(typeof a === 'function');
		});

		it('Will create a rejects sham', () => {
			const a = sham('rejects', 'error message');
			assert(typeof a === 'function');
		});

		it('Will create a throws sham', () => {
			const a = sham('throws', new Error('Ouch'));
			assert(typeof a === 'function');
		});

		it('Will create an executes sham', () => {
			const a = sham('executes', () => { return 123; });
			assert(typeof a === 'function');
		});

		it('Will assume a return sham if only a value is provided', () => {
			const a = sham(42);
			assert(typeof a === 'function');
		});

		it('Will throw if an invalid descriptor is provided', () => {
			assert(didThrow(() => {
				const a = sham('usurp', 'Hyrule');
			}));
		});
	});

	describe('Function', () => {
		it('stub -> void', () => {
			const a = sham();
			assert(a() == undefined, typeof a());
		});

		it('return sham -> static value', () => {
			const a = sham('returns', 4);
			assert.strictEqual(a(), 4);
		});

		it('resolves sham -> resolved promise', (done) => {
			const a = sham('resolves', true);
			a().then(v => {
				try {
					assert(v === true);
					done();
				} catch(e) {
					done(e);
				}
			});
		});

		it('rejects sham -> rejected promise', (done) => {
			const a = sham('rejects', 'error message');
			a().catch(v => {
				try {
					assert(v === 'error message');
					done();
				} catch(e) {
					done(e);
				}
			});
		});

		it('executes sham -> custom return', () => {
			const a = sham('executes', (x) => x * 2)
			assert(a(4) === 8);
		});

		it('throws sham -> thrown error', () => {
			const a = sham('throws', new Error('Ouch'));
			assert(didThrow(() => {
				a();
			}) === 'Ouch')
		});

		it('Will function as a return sham if only a value is provided as a descriptor', () => {
			const a = sham(42);
			assert.strictEqual(a(), 42);
		});
	});

	describe('Interrogation', () => {
		it('Will properly track invocation stats', () => {
			a = sham();
			b = sham();
			assert(a.called() === false);
			a();
			assert(a.called() === true);
			assert(a.calledTimes(1));
			a();
			assert(a.called() === true);
			assert(a.calledTimes(2));

			// confirm no ref bleed
			assert(b.called() === false);
		});

		it('Supports interrogating invocation details', () => {
			a = sham();
			assert(a.calledWith() === false);
			a();
			assert(a.calledWith() === true);
			assert(a.calledWith(3) === false);
			a(4, 'shahbazz', [5, null, true]);
			assert(a.calledWith(4) === false);
			assert(a.calledWith(4, 'shahbazz', [5, null, true]));
			assert(a.calledWith(4, 'shahbazz0r', [5, null, true]) === false);
		});

		it('Permits shams to reset their invocation details', () => {
			a = sham();
			a(54);
			assert(a.calledWith(54));
			assert(a.called() && a.calledTimes(1));
			a.reset();
			assert(a.called() === false);
			assert(a.calledTimes(1) === false);
			assert(a.calledTimes(0) === true);
			assert(a.calledWith(54) === false);
		});
	});
});