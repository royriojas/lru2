import { create } from './helpers/create-lru';

const runMe = () => {
  const MAX_INSTANCES = 1000000;
  const lru2 = create({
    limit: MAX_INSTANCES,
    onRemoveEntry(entry) {
      entry.destroy();
    },
  });

  const createInstance = value => ({
    value,
    destroy() {
      this.value = undefined;
    },
  });

  for (let i = 0; i < MAX_INSTANCES; i++) {
    const instance = createInstance(i);
    lru2.set(i, instance);
  }

  // expect(lru2.length).toEqual(MAX_INSTANCES);

  for (let i = 0; i < MAX_INSTANCES; i++) {
    lru2.remove(i);
  }

  // expect(lru2.length).toEqual(0);
};

runMe();
debugger;

runMe();
debugger;

// describe('memory consumption', () => {
//   it('should not leak memory', () => {
//     debugger;
//     runMe();
//   });
//   it('should not leak memory if executed again', () => {
//     runMe();
//     debugger;
//   });
// });
