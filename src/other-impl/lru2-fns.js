export const create = ({ limit = 0, onRemoveEntry } = {}) => {
  if (limit <= 0) {
    limit = Infinity;
  }

  let lru = {
    limit,
    onRemoveEntry,
    cache: new Map(),
    head: null,
    tail: null,
  };

  const _peek = key => {
    const { cache } = lru;
    const entry = cache.get(key);
    return entry;
  };

  const _remove = (node, { fireOnEntryRemove } = {}) => {
    const { cache, head, tail } = lru;
    const entry = cache.get(node.key);

    if (!entry) {
      return;
    }

    cache.delete(node.key);

    const next = entry.next;
    const prev = entry.prev;

    entry.next = entry.prev = null;

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
      lru.tail = prev;
    }

    if (entry === head) {
      lru.head = next;
    }
  };

  const _clear = () => {
    const { cache } = lru;
    for (const node of cache.values()) {
      _remove(node, { fireOnEntryRemove: true });
    }

    lru.cache = null;
  };

  const _prune = () => {
    while (lru.cache.size > lru.limit) {
      _remove(lru.tail, { fireOnEntryRemove: true });
    }
  };

  const _add = node => {
    const { cache } = lru;
    const entry = cache.get(node.key);
    if (entry) {
      _remove(entry);
    }
    if (cache.size === 0) {
      lru.head = lru.tail = node;
      node.next = node.prev = null;
    } else {
      lru.head.prev = node;
      node.next = lru.head;
      node.prev = null;
      lru.head = node;
    }
    cache.set(node.key, node);
    _prune();
  };

  const _find = key => {
    const { cache } = lru;
    const entry = cache.get(key);
    if (entry) {
      _remove(entry);
      _add(entry);
    }
    return entry;
  };

  return {
    get(key) {
      const node = _find(key);
      if (node) {
        return node.value;
      }
      return undefined;
    },

    set(key, value) {
      const entry = {
        key,
        value,
      };
      _add(entry);
    },

    peek(key) {
      const node = _peek(key);

      if (node) {
        return node.value;
      }

      return undefined;
    },

    remove(key) {
      const node = _peek(key);
      if (!node) return;
      _remove(node, { fireOnEntryRemove: true });
    },

    toArray() {
      let runner = lru.head;
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

    clear() {
      _clear();
      lru = {
        cache: new Map(),
        head: null,
        tail: null,
      };
    },

    get length() {
      return lru.cache.size;
    },
  };
};
