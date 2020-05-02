import { create } from '../src/lru2';

let savedInstance;

const runMe = async () => {
  const MAX_INSTANCES = 300000;

  const lru2 = create({
    limit: MAX_INSTANCES,
  });

  const createInstance = value => ({
    value: `${value}_${'x'.repeat(10 * 1024 * 1024)}_${value}`,
    destroy() {
      this.value = undefined;
    },
  });

  for (let i = 0; i < MAX_INSTANCES; i++) {
    const instance = createInstance(i);
    lru2.set(i, instance);

    if (i === 100) {
      savedInstance = instance;
    }
  }

  for (let i = 0; i < MAX_INSTANCES; i++) {
    lru2.get(i);
  }

  return lru2;
};

const formatAsMb = amount =>
  `${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount / (1024 * 1024))}`.padStart(10, ' ');

const logMemory = message => {
  const { heapUsed } = process.memoryUsage();
  console.log('>>', `[${new Date().toJSON()}]`, message, formatAsMb(heapUsed));
};

const formatAsNumber = number => new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 }).format(number);

const test = async () => {
  const NUM_TESTS = 15;

  if (global.gc) global.gc();

  logMemory('At the start'.padEnd(25));
  for (let i = 0; i < NUM_TESTS; i++) {
    const id = i + 1;
    logMemory(`Test ${formatAsNumber(id)}: before execution`);
    const lru2 = await runMe();
    logMemory(`Test ${formatAsNumber(id)}: after  execution`);

    lru2.destroy();
    if (global.gc) {
      global.gc();
      logMemory(`Test ${formatAsNumber(id)}: after calling gc`);
    }
    console.log('');
  }

  console.log('>> saved instance', !!savedInstance);
};

test().then(() => logMemory('At the end'.padEnd(25)));
