class Node {
  key;

  value;

  next;

  prev;

  clearPointers() {
    this.next = this.prev = null;
  }

  constructor({ key, value } = {}) {
    this.value = value;
    this.key = key;
  }
}

class LRUCache {
  limit;

  head;

  tail;

  onRemoveEntry;

  cache = new Map();

  constructor({ limit, onRemoveEntry }) {
    this.limit = limit;
    this.onRemoveEntry = onRemoveEntry;
  }

  prune() {
    while (this.cache.size > this.limit) {
      this.remove(this.tail, { fireOnEntryRemove: true });
    }
  }

  add(node) {
    const { cache } = this;
    const entry = cache.get(node.key);
    if (entry) {
      this.remove(entry);
    }
    if (cache.size === 0) {
      this.head = this.tail = node;
      node.clearPointers();
    } else {
      this.head.prev = node;
      node.next = this.head;
      node.prev = null;
      this.head = node;
    }
    cache.set(node.key, node);
    this.prune();
  }

  peek(key) {
    const { cache } = this;
    const entry = cache.get(key);
    return entry;
  }

  find(key) {
    const { cache } = this;
    const entry = cache.get(key);
    if (entry) {
      this.remove(entry);
      this.add(entry);
    }
    return entry;
  }

  remove(node, { fireOnEntryRemove } = {}) {
    const { cache, onRemoveEntry, head, tail } = this;
    const entry = cache.get(node.key);

    if (!entry) {
      return;
    }

    cache.delete(node.key);

    const next = entry.next;
    const prev = entry.prev;

    entry.clearPointers();

    if (fireOnEntryRemove && onRemoveEntry) {
      onRemoveEntry(entry.value, entry);
    }

    if (prev) {
      prev.next = next;
    }

    if (next) {
      next.prev = prev;
    }

    if (entry === tail) {
      this.tail = prev;
    }

    if (entry === head) {
      this.head = next;
    }
  }

  clear() {
    const { cache } = this;
    for (const node of cache.values()) {
      this.remove(node, { fireOnEntryRemove: true });
    }

    this.cache = null;
  }

  get length() {
    return this.cache.size;
  }
}

class LRU {
  _lru;

  constructor({ limit, onRemoveEntry }) {
    this._lru = new LRUCache({ limit, onRemoveEntry });
  }

  get(key) {
    const node = this._lru.find(key);
    if (node) {
      return node.value;
    }
    return undefined;
  }

  set(key, value) {
    const entry = new Node({
      key,
      value,
    });
    this._lru.add(entry);
  }

  peek(key) {
    const node = this._lru.peek(key);

    if (node) {
      return node.value;
    }

    return undefined;
  }

  remove(key) {
    const node = this._lru.peek(key);
    if (!node) return;
    this._lru.remove(node, { fireOnEntryRemove: true });
  }

  toArray() {
    let runner = this._lru.head;
    const items = [];

    while (runner) {
      items.push({
        key: runner.key,
        value: runner.value,
      });
      runner = runner.next;
    }

    return items;
  }

  clear() {
    this._lru.clear();
    this._lru = null;
  }

  get length() {
    return this._lru.length;
  }
}

export const create = ({ limit = 0, onRemoveEntry } = {}) => {
  if (limit <= 0) {
    limit = Infinity;
  }

  return new LRU({ limit, onRemoveEntry });
};
