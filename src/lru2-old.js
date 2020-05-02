function createList(options) {
  options = options || {};

  let limit = options.limit || 0;
  if (limit <= 0) {
    limit = Infinity;
  }
  const cache = {};
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
    prune() {
      const me = this;
      if (length > limit) {
        me.remove(tail);
      }
    },
    remove(node) {
      const entry = cache[node.key];
      /* istanbul ignore if */
      if (!entry) {
        return;
      }
      delete cache[node.key];
      const next = entry.next;
      const prev = entry.prev;

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
  };

  Object.defineProperty(ins, 'length', {
    get() {
      return length;
    },
  });

  return ins;
}

module.exports = { create: createList };
