export const createLRU = ({ limit = 0, onRemoveEntry } = {}) => {
  if (limit <= 0) {
    limit = Infinity;
  }
  let cache = {};
  let head;
  let tail;
  let length = 0;

  const lru = {
    add(node) {
      const me = this;
      const entry = cache[node.key];
      if (entry) {
        me.remove(entry);
      }
      if (length === 0) {
        head = tail = node;
        node.next = node.prev = null;
      } else {
        head.prev = node;
        node.next = head;
        node.prev = null;
        head = node;
      }
      cache[node.key] = node;
      length++;
      me.prune();
    },
    peek(key) {
      const entry = cache[key];
      return entry;
    },
    prune() {
      const me = this;
      while (length > limit) {
        me.remove(tail);
      }
    },
    remove(node, { fireOnEntryRemove } = {}) {
      const entry = cache[node.key];

      if (!entry) {
        return;
      }

      if (fireOnEntryRemove && onRemoveEntry) {
        onRemoveEntry(entry.value, entry);
      }

      cache[node.key] = undefined;

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
      length--;
    },
    find(key) {
      const me = this;
      const entry = cache[key];
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
      return undefined;
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

      length = 0;

      cache = {};
    },
    get length() {
      return length;
    },
  };

  return ins;
};

export const create = createLRU;
