import { create } from './helpers/create-lru';

/* eslint-disable global-require */
describe('lru2', () => {
  describe('set', () => {
    it('should be empty when it is created', () => {
      const lru2 = create();
      expect(lru2.length).toEqual(0);
      expect(lru2.toArray()).toEqual([]);
    });

    it('should set the values on the lru2 and prune the ones that are the last recently used first', () => {
      const lru2 = create({
        limit: 3,
      });
      lru2.set('1', 1);
      lru2.set('2', 2);
      lru2.set('3', 3);
      lru2.set('4', 4);

      expect(lru2.toArray().map(item => item.key)).toEqual(['4', '3', '2']);
    });
  });

  it('should update the order of the structure when the items are visited', () => {
    const lru2 = create({
      limit: 3,
    });
    lru2.set('1', 1);
    lru2.set('2', 2);
    lru2.set('3', 3);
    lru2.set('4', 4);
    lru2.get('2');

    expect(lru2.toArray().map(item => item.key)).toEqual(['2', '4', '3']);
  });

  it('should update the order of the structure when an item with the same key is added', () => {
    const lru2 = create({
      limit: 3,
    });
    lru2.set('1', 1);
    lru2.set('2', 2);
    lru2.set('3', 3);
    lru2.set('4', 4);
    lru2.set('2', {
      changed: true,
    });

    expect(lru2.toArray().map(item => item.key)).toEqual(['2', '4', '3']);
  });

  describe('get', () => {
    it('should return undefined if a value is not in the cache', () => {
      const lru2 = create({
        limit: 3,
      });
      const val = lru2.get('1');

      expect(val).toBeUndefined();
    });

    it('should return the value if the entry is found', () => {
      const lru2 = create({
        limit: 3,
      });
      lru2.set('1', 1);
      lru2.set('2', 2);
      lru2.set('3', 3);
      lru2.set('4', 4);

      const val = lru2.get('4');

      expect(val).toEqual(4);
      expect(lru2.toArray().map(item => item.key)).toEqual(['4', '3', '2']);
    });
  });

  describe('when the instance in the cache contains a complex object', () => {
    it('should provide a callback when an element is removed to provide a chance to perform some cleanup', () => {
      const lru2 = create({
        limit: 3,
        onRemoveEntry(entry, node) {
          console.log(node);
          entry.destroy();
        },
      });

      const createInstance = value => ({
        value,
        destroy() {
          this.value = undefined;
        },
      });

      const instance1 = createInstance(1);
      expect(instance1.value).toEqual(1);

      lru2.set('1', instance1);
      lru2.set('2', createInstance(2));

      const thefirstInstance = lru2.peek('1');
      expect(thefirstInstance.value).toEqual(1);

      lru2.set('3', createInstance(3));
      lru2.set('4', createInstance(4));

      const val = lru2.get('1');

      expect(val).toEqual(undefined);
      expect(instance1.value).toEqual.undefined;
      expect(thefirstInstance.value).toEqual.undefined;
    });
  });

  describe('when the remove method is used', () => {
    it('should remove an entry from the lru regardless if it is recently used or not', () => {
      const lru2 = create({
        limit: 3,
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

      const instance1 = createInstance(1);
      expect(instance1.value).toEqual(1);

      lru2.set('1', instance1);
      lru2.set('2', createInstance(2));

      expect(lru2.length).toEqual(2);
      lru2.remove('1');
      expect(lru2.length).toEqual(1);

      // this is undefined because destroy was called to perform the cleanup
      expect(instance1.value).toEqual(undefined);

      // once removed the entry will not longer be available
      const val = lru2.get('1');

      expect(val).toEqual(undefined);
    });
  });
});
