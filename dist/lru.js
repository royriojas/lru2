

require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"lru":[function(require,module,exports){
"use strict";

var createList = function createList(options) {
  options = options || {};

  var limit = options.limit || 10;
  var cache = {};
  var head;
  var tail;
  var length = 0;

  return {
    peek: function peek() {
      return {
        cache: cache,
        head: head,
        tail: tail,
        length: length
      };
    },
    add: function add(node) {
      var me = this;
      var entry = cache[node.key];
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
    prune: function prune() {
      var me = this;
      if (length > limit) {
        me.remove(tail);
      }
    },
    remove: function remove(node) {
      var entry = cache[node.key];
      if (entry) {
        delete cache[node.key];
        var next = entry.next;
        var prev = entry.prev;

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
      }
    },
    find: function find(key) {
      var me = this;
      var entry = cache[key];
      if (entry) {
        me.remove(entry);
        me.add(entry);
      }
      return entry;
    }
  };
};

module.exports = {
  create: function create() {
    var itemsList = createList({
      limit: 3
    });

    return {
      get: function get(key) {
        var val = itemsList.find(key);
        if (val) {
          return val.value;
        }
        return null;
      },
      setVal: function setVal(key, value) {
        var entry = { key: key, value: value };
        itemsList.add(entry);
      },
      peek: itemsList.peek.bind(itemsList)
    };
  }
};
},{}]},{},["lru"]);
