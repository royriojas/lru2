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

  get(key) {
    const node = this._find(key);
    if (node) {
      return node.value;
    }
    return undefined;
  }

  _prune() {
    while (this.cache.size > this.limit) {
      this._remove(this.tail, { fireOnEntryRemove: true });
    }
  }

  _add(node) {
    const { cache } = this;
    const entry = cache.get(node.key);
    if (entry) {
      this._remove(entry);
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
    this._prune();
  }

  set(key, value) {
    const entry = new Node({
      key,
      value,
    });
    this._add(entry);
  }

  _peek(key) {
    const { cache } = this;
    const entry = cache.get(key);
    return entry;
  }

  peek(key) {
    const node = this._peek(key);

    if (node) {
      return node.value;
    }

    return undefined;
  }

  remove(key) {
    const node = this._peek(key);
    if (!node) return;
    this._remove(node, { fireOnEntryRemove: true });
  }

  toArray() {
    let runner = this.head;
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
    const { cache } = this;
    for (const node of cache.values()) {
      this._remove(node, { fireOnEntryRemove: true });
    }

    this.cache = null;
  }

  get length() {
    return this.cache.size;
  }

  _find(key) {
    const { cache } = this;
    const entry = cache.get(key);
    if (entry) {
      this._remove(entry);
      this._add(entry);
    }
    return entry;
  }

  _remove(node, { fireOnEntryRemove } = {}) {
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
}

export const create = ({ limit = 0, onRemoveEntry } = {}) => {
  if (limit <= 0) {
    limit = Infinity;
  }

  return new LRUCache({ limit, onRemoveEntry });
};
