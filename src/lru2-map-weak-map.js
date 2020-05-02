const createHeadOrTailManager = cache => {
  const weakMap = new WeakMap();
  return {
    get() {
      return weakMap.get(cache);
    },
    set(head) {
      return weakMap.set(cache, head);
    },
    delete() {
      return weakMap.delete(cache);
    },
  };
};

const createNextOrPrevManager = () => {
  const nextWeakMap = new WeakMap();
  const prevWeakMap = new WeakMap();

  return {
    getNext(node) {
      return nextWeakMap.get(node);
    },
    setNext(node, next) {
      return nextWeakMap.set(node, next);
    },
    getPrev(node) {
      return prevWeakMap.get(node);
    },
    setPrev(node, prev) {
      return prevWeakMap.set(node, prev);
    },
    deleteNext(node) {
      nextWeakMap.delete(node);
    },
    deletePrev(node) {
      prevWeakMap.delete(node);
    },
  };
};

export const create = ({ limit = 0, onRemoveEntry } = {}) => {
  if (limit <= 0) {
    limit = Infinity;
  }

  let cache = new Map();

  const headManager = createHeadOrTailManager(cache);
  const tailManager = createHeadOrTailManager(cache);

  const nextPrevManager = createNextOrPrevManager();

  const lru = {
    add(node) {
      const me = this;
      const entry = cache.get(node.key);
      if (entry) {
        me.remove(entry);
      }
      if (cache.size === 0) {
        headManager.set(node);
        tailManager.set(node);
        nextPrevManager.deleteNext();
        nextPrevManager.deletePrev();
      } else {
        const head = tailManager.get();
        nextPrevManager.setPrev(node);
        nextPrevManager.setNext(head);
        nextPrevManager.deletePrev(node);
        tailManager.set(node);
      }
      cache.set(node.key, node);
      me.prune();
    },
    prune() {
      const me = this;
      while (cache.size > limit) {
        me.remove(tailManager.get(), { fireEntryRemove: true });
      }
    },
    remove(node, { fireEntryRemove } = {}) {
      const entry = cache.get(node.key);

      if (!entry) {
        return;
      }

      cache.delete(node.key);

      const next = nextPrevManager.getNext(entry);
      const prev = nextPrevManager.getPrev(entry);

      nextPrevManager.deleteNext(entry);
      nextPrevManager.deletePrev(entry);

      if (fireEntryRemove && onRemoveEntry) {
        onRemoveEntry(entry.value, entry);
      }

      if (prev) {
        nextPrevManager.setNext(next);
      }
      if (next) {
        nextPrevManager.setPrev(prev);
      }
      const tail = tailManager.get();
      if (entry === tail) {
        tailManager.set(prev);
      }
      const head = headManager.get();
      if (entry === head) {
        headManager.set(next);
      }
    },
    find(key) {
      const me = this;
      const entry = cache.get(key);
      if (entry) {
        me.remove(entry);
        me.add(entry);
      }
      return entry;
    },
    peek(key) {
      const entry = cache.get(key);
      return entry;
    },
  };

  const ins = {
    get(key) {
      const val = lru.find(key);
      if (val) {
        return val.value;
      }
      return undefined;
    },
    set(key, value) {
      const entry = {
        key,
        value,
      };
      lru.add(entry);
    },
    peek(key) {
      const val = lru.peek(key);

      if (val) {
        return val.value;
      }

      return undefined;
    },
    remove(key) {
      const node = lru.peek(key);
      if (!node) return;
      lru.remove(node, { fireEntryRemove: true });
    },
    toArray() {
      let runner = headManager.get();
      const items = [];

      while (runner) {
        items.push({
          key: runner.key,
          value: runner.value,
        });
        runner = nextPrevManager.getNext(runner);
      }

      return items;
    },

    destroy() {
      for (const entry of cache.values()) {
        lru.remove(entry, { fireEntryRemove: true });
      }
      cache = null;
    },

    get length() {
      return cache.size;
    },
  };

  return ins;
};
