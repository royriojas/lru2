export const create = ({ limit = 0, onRemoveEntry } = {}) => {
  if (limit <= 0) {
    limit = Infinity;
  }
  const cache = new Map();
  let head;
  let tail;

  const lru = {
    add(node) {
      const me = this;
      const entry = cache.get(node.key);
      if (entry) {
        me.remove(entry);
      }
      if (cache.size === 0) {
        head = tail = node;
        node.next = node.prev = null;
      } else {
        head.prev = node;
        node.next = head;
        node.prev = null;
        head = node;
      }
      cache.set(node.key, node);
      me.prune();
    },
    prune() {
      const me = this;
      if (cache.size > limit) {
        me.remove(tail, { fireEntryRemove: true });
      }
    },
    remove(node, { fireEntryRemove } = {}) {
      const entry = cache.get(node.key);

      if (!entry) {
        return;
      }

      cache.delete(node.key);

      const next = entry.next;
      const prev = entry.prev;

      entry.next = entry.prev = null;

      if (fireEntryRemove && onRemoveEntry) {
        onRemoveEntry(entry.value, entry);
      }

      if (prev) {
        prev.next = next;
      }
      if (next) {
        next.prev = prev;
      }
      if (entry === tail) {
        tail = prev;
      }
      if (entry === head) {
        head = next;
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
      lru.remove(node, true /* fireEntryRemove */);
    },
    toArray() {
      let runner = head;
      const items = [];

      while (runner) {
        items.push({
          key: runner.key,
          value: runner.value,
        });
        runner = runner.next;
      }

      return items;
    },
  };

  Object.defineProperty(ins, 'length', {
    get() {
      return cache.size;
    },
  });

  return ins;
};
