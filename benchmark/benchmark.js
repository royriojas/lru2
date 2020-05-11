const { LRUMap } = require('lru_map');

const createLRUNull = require('../src/other-impl/lru2-null').create;
const createLRUFunctions = require('../src/other-impl/lru2-fns').create;
const createLRUWithMap = require('../src/other-impl/lru2-with-map').create;
const createLRUDelete = require('../src/lru2').create;
const createLRUUndef = require('../src/other-impl/lru2-undefined').create;

// const createLRUClass = require('../src/lru2-class-impl').create;
// const createLRUClassPrivate = require('../src/lru2-private-class').create;
// const createLRUFunctionsAndClass = require('../src/lru2-functions').create;

const runMe = async create => {
  const MAX_INSTANCES = 900000;
  const limit = MAX_INSTANCES / 3;

  const lru2 = create({
    limit,
    onRemoveEntry(entry) {
      entry.destroy();
    },
  });

  const createInstance = value => ({
    value: `${value}_${'x'.repeat(10 * 1024 * 1024)}_${value}`,
    destroy() {
      this.value = undefined;
    },
  });

  for (let i = 0; i < MAX_INSTANCES; i++) {
    const instance = createInstance(i);

    if (i > limit) {
      const ele = lru2.get(i - limit);
      if (ele) {
        // do nothing yet here
      }
    }

    lru2.set(i, instance);
  }

  return lru2;
};

const formatAsMb = amount => `${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount / (1024 * 1024))}`;

const formatAsTime = number =>
  new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2, minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(number / 1000);

const average = arr => {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, val) => {
    acc += val;
    return acc;
  }, 0);

  return sum / arr.length;
};

const test = async (impl, create) => {
  const NUM_TESTS = 5;
  if (global.gc) global.gc();

  const heapUsed = [];
  const heapUsedAfterGC = [];
  const deltas = [];

  for (let i = 0; i < NUM_TESTS; i++) {
    const start = Date.now();
    const lru2 = await runMe(create);
    if (lru2?.clear) {
      lru2.clear();
    }
    const delta = Date.now() - start;
    deltas.push(delta);
    heapUsed.push(process.memoryUsage().heapUsed);

    heapUsedAfterGC.push(process.memoryUsage().heapUsed);

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return { id: impl, delta: average(deltas), heapUsed: average(heapUsed), heapUsedAfterGC: average(heapUsedAfterGC) };
};

const formatter = entry => {
  const id = `${entry.id}`.padEnd(15);
  const time = formatAsTime(entry.delta);
  const memBefore = formatAsMb(entry.heapUsed);
  const memAfter = formatAsMb(entry.heapUsedAfterGC);

  return `${id}: ${time} => mem, before: ${memBefore} - after: ${memAfter}`;
};

const main = async () => {
  const entries = [
    { id: 'lru2-fns', fn: createLRUFunctions },
    { id: 'lru2-with-map', fn: createLRUWithMap },
    { id: 'lru2-null', fn: createLRUNull },
    { id: 'lru2-undef', fn: createLRUUndef },
    { id: 'lru2-delete', fn: createLRUDelete },
    { id: 'js-lru', fn: ({ limit }) => new LRUMap(limit) },
  ];
  const results = [];

  for (const entry of entries) {
    results.push(await test(entry.id, entry.fn));
  }

  console.log('>>> sort by mem usage');

  console.log(
    results
      .sort((a, b) => a.heapUsed - b.heapUsed)
      .map(formatter)
      .join('\n'),
  );

  console.log('>>> sort by time');

  console.log(
    results
      .sort((a, b) => a.delta - b.delta)
      .map(formatter)
      .join('\n'),
  );
};

main();
