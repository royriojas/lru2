var createList = function ( options ) {
  options = options || { };

  var limit = options.limit || 0;
  var onRemoveEntry = options.onRemoveEntry;

  if ( limit <= 0 ) {
    limit = Infinity;
  }
  var cache = { };
  var head;
  var tail;
  var length = 0;

  var lru = {
    add: function ( node ) {
      var me = this;
      var entry = cache[ node.key ];
      if ( entry ) {
        me.remove( entry );
      }
      if ( length === 0 ) {
        head = tail = node;
        node.next = node.prev = null;
      } else {
        head.prev = node;
        node.next = head;
        node.prev = null;
        head = node;
      }
      cache[ node.key ] = node;
      length++;
      me.prune();
    },
    prune: function () {
      var me = this;
      if ( length > limit ) {
        me.remove( tail, true /* fireEntryRemove */ );
      }
    },
    remove: function ( node, fireEntryRemove ) {
      var entry = cache[ node.key ];
      /* istanbul ignore if */
      if ( !entry ) {
        return;
      }

      delete cache[ node.key ];

      if ( fireEntryRemove && onRemoveEntry ) {
        onRemoveEntry( entry.value );
      }

      var next = entry.next;
      var prev = entry.prev;

      if ( prev ) {
        prev.next = next;
      }
      if ( next ) {
        next.prev = prev;
      }
      if ( entry === tail ) {
        tail = prev;
      }
      if ( entry === head ) {
        head = next;
      }
      length--;
    },
    find: function ( key ) {
      var me = this;
      var entry = cache[ key ];
      if ( entry ) {
        me.remove( entry );
        me.add( entry );
      }
      return entry;
    },
    peek: function ( key ) {
      var entry = cache[ key ];
      return entry;
    }
  };

  var ins = {
    get: function ( key ) {
      var val = lru.find( key );
      if ( val ) {
        return val.value;
      }
      return undefined;
    },
    set: function ( key, value ) {
      var entry = {
        key: key,
        value: value
      };
      lru.add( entry );
    },
    peek: function ( key ) {
      var val = lru.peek( key );

      if ( val ) {
        return val.value;
      }

      return undefined;
    },
    remove: function ( key ) {
      var node = lru.peek( key );
      lru.remove( node, true /* fireEntryRemove */ );
    },
    toArray: function () {
      var runner = head;
      var items = [];

      while (runner) {
        items.push( {
          key: runner.key,
          value: runner.value
        } );
        runner = runner.next;
      }

      return items;
    }
  };

  Object.defineProperty( ins, 'length', {
    get: function () {
      return length;
    }
  } );

  return ins;
};

module.exports = {
  create: createList
};
