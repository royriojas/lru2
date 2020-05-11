function createList({ limit = 0, onRemoveEntry }) {
  if (limit <= 0) {
    limit = Infinity;
  }

  let cache = new Map();
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
      while (cache.size > limit) {
        me.remove(tail);
      }
    },
    peek(key) {
      const entry = cache[key];
      return entry;
    },
    remove(node, { fireOnEntryRemove } = {}) {
      const entry = cache.get(node.key);

      if (!entry) {
        return;
      }

      if (fireOnEntryRemove && onRemoveEntry) {
        onRemoveEntry(entry.value, entry);
      }

      cache.delete(node.key);

      const next = entry.next;
      const prev = entry.prev;

      entry.next = entry.prev = null;

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
  };
  const ins = {
    get(key) {
      const val = lru.find(key);
      if (val) {
        return val.value;
      }
      return null;
    },
    set(key, value) {
      const entry = { key, value };
      lru.add(entry);
    },
    toArray() {
      let runner = head;
      const items = [];

      while (runner) {
        items.push({ key: runner.key, value: runner.value });
        runner = runner.next;
      }

      return items;
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
      lru.remove(node, { fireOnEntryRemove: true });
    },

    clear() {
      let runner = head;

      while (runner) {
        lru.remove(runner, { fireOnEntryRemove: true });
        runner = runner.next;
      }

      head = null;
      tail = null;

      cache = new Map();
    },

    get length() {
      return cache?.size || 0;
    },
  };

  return ins;
}

module.exports = { create: createList };
