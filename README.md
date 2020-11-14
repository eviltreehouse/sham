# sham.js
by: Corey Sharrah (corey@eviltreehouse.com)
> Stubs/Mocks and a lite reflection layer: all for __3 KB!__ (1.5 KB minified!)


## Abstract
Tools akin to `sinon` and the mocking features within testing frameworks like `jest` are comprehensive and fantastic, but for smaller projects they are a bit heavy when you are only using the core 5-10% of their functionality. I created `sham` for just this use case: for small projects which desire a foundational mock/stub module to facilitate unit testing that is light as a feather!


## Quick Start

`sham` is concise: its entire API could fit on an index card. Within reason it also provides a pseudo DSL for declaration to hopefully make using it very intuitive. The reflection methods are simple Boolean operations that should play nicely with any assertion library.

```js
const sham = require('sham');

// ================================
// STEP ONE: Let's make some shams!
// ================================

// Generic, no return behavior
const a = sham();

// Shams that synchronously returns a value
const b = sham('returns', 42);
const b2 = sham(42);

// Shams that speak in Promise-s.
const c = sham('resolves', true);
const d = sham('rejects', 404);

// Shams that explode on demand
const e = sham('throws', new Error('Kerblams!'));

// Shams that do *precisely* what you need if you have
// a complex need
const f = sham('executes', (x) => { 
  if(true) return x * x; 
});


// ================================
// STEP TWO: Observe...
// ================================
// Assume elsewhere in code we were running our sham 
// functions, e.g. "const rv = a(...)"

// Was our sham called? How many times?
assert(a.called());
assert(a.notCalled());
assert(a.calledTimes(2));

// Was our sham called with a particular string of arguments?
// NOTE: `sham.js` does a pretty valiant job at trying to strict-cmp
// the argument list, but there's probably some outlier cases out there...
assert(a.calledWith(true, ['Bob', 'Alice']));

// Clear invocation history (helpful for those "after each" steps of your testing suite)
a.reset();



```

## Further Info
See `test/` for more examples. 


## [Potential] Future Features
- __API for Method "hijacking"__: Make it easy to swap in/out object method implementations.
- __Incremental Behaviors__: On 1st invocation, behavhior is _X_, and on the 2nd and thereafter, it is _Y_.
- __Reflection of Invocation Manifests__ -- right now there is only the single evaluator method. It might be helpful to be able to access them as an array or something of the like. 


## License
MIT -- feel free to let loose