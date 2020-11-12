!function() {
	const RETURN_TYPES = ['returns','rejects','resolves','executes','throws','void'];

	/**
	 * Are these the same?
	 * @param {any[]} arr1
	 * @param {any[]} arr2
	 * @return {boolean}
	 */
	const arraycmp = (arr1, arr2) => {
		if (arr1 === arr2) return true; // ref match
		if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
		if (arr1.length !== arr2.length) return false;

		// do strict and recursive comparisons where appropriate
		return arr1.every((v, idx) => {
			const ov = arr2[idx];
			if (typeof v === 'object') return JSON.stringify(v) === JSON.stringify(ov);
			if (Array.isArray(v)) return arraycmp(v, ov);
			return v === ov;
		});
	}

	/**
	 *
	 * @param  {...any} returnDescriptor
	 */
	function sham(...returnDescriptor) {
		if (returnDescriptor.length === 1) returnDescriptor.unshift('returns');
		if (returnDescriptor.length === 0) returnDescriptor = ['void', undefined];
		if (returnDescriptor.length !== 2) throw new Error('Invalid return descriptor!');

		let [ returnType, returnValue ] = returnDescriptor;
		returnType = String(returnType).toLowerCase();
		if (! RETURN_TYPES.includes(returnType)) {
			throw new Error(`Invalid return type: ${returnType}. Valid types are: ${RETURN_TYPES.join(', ')}`);
		}

		// default is a `void` function
		let shamf = function(...a) {
			shamf.__$sham.registerInvocation(a);
		};

		switch (returnType) {
			case 'returns':
				shamf = function(...a) {
					shamf.__$sham.registerInvocation(a);
					return returnValue;
				};

				break;
			case 'rejects':
				shamf = function(...a) {
					shamf.__$sham.registerInvocation(a);
					return Promise.reject(returnValue);
				};

				break;
			case 'resolves':
				shamf = function(...a) {
					shamf.__$sham.registerInvocation(a);
					return Promise.resolve(returnValue);
				};

				break;
			case 'executes':
				shamf = function(...a) {
					shamf.__$sham.registerInvocation(a);
					return returnValue(...a);
				};

				break;
			case 'throws':
				shamf = function(...a) {
					shamf.__$sham.registerInvocation(a);
					throw returnValue;
				};

				break;
			case 'void':
			default:
				break;
		}

		return outfitSham(shamf);
	}

	/**
	 * Attach Helper methods for doing functional assertion
	 * @param {function} f
	 * @return {function}
	 */
	function outfitSham(f) {
		f.__$sham = {
			called: false,
			calledWith: [],
			registerInvocation: (argv) => {
				f.__$sham.called = true;
				f.__$sham.calledWith.push(argv);
			}
		};

		f.called = () => f.__$sham.called === true;
		f.notCalled = () => f.__$sham.called === false;
		f.calledTimes = (v) => f.__$sham.calledWith.length === v;
		f.calledWith = (...argv) => f.__$sham.calledWith.some(invoc => arraycmp(argv, invoc));

		f.reset = () => {
			f.__$sham.called = false;
			f.__$sham.calledWith.length = 0;
		}

		return f;
	}

	if (typeof window !== 'undefined') window.sham = sham;
	else if (module && module.exports) {
		module.exports = sham;
	}
}();