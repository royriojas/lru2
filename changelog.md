
# lru2 - Changelog
## v2.0.0
- **Refactoring**
  - Add diferent implementations - [0ec1d7b]( https://github.com/royriojas/lru2/commit/0ec1d7b ), [Roy Riojas](https://github.com/Roy Riojas), 11/05/2020 16:45:17

    
  - Use new impl - [1675829]( https://github.com/royriojas/lru2/commit/1675829 ), [Roy Riojas](https://github.com/Roy Riojas), 02/05/2020 02:17:13

    
  - Updated tests - [beeb4b9]( https://github.com/royriojas/lru2/commit/beeb4b9 ), [Roy Riojas](https://github.com/Roy Riojas), 02/05/2020 01:06:10

    
  - Add test to check the memory consumption - [41e6cd4]( https://github.com/royriojas/lru2/commit/41e6cd4 ), [Roy Riojas](https://github.com/Roy Riojas), 01/05/2020 20:16:38

    
  - Add test to check the memory consumption - [bd6c7c6]( https://github.com/royriojas/lru2/commit/bd6c7c6 ), [Roy Riojas](https://github.com/Roy Riojas), 01/05/2020 20:12:50

    
  - Improve memory usage using weakmaps - [44c8d0e]( https://github.com/royriojas/lru2/commit/44c8d0e ), [Roy Riojas](https://github.com/Roy Riojas), 30/04/2020 11:20:15

    
  - improve the cache using a Map - [114741a]( https://github.com/royriojas/lru2/commit/114741a ), [Roy Riojas](https://github.com/Roy Riojas), 30/04/2020 10:24:39

    
  - limit babel deps - [d1ec9c0]( https://github.com/royriojas/lru2/commit/d1ec9c0 ), [Roy Riojas](https://github.com/Roy Riojas), 30/04/2020 07:29:37

    
  - Add tests - [5642d89]( https://github.com/royriojas/lru2/commit/5642d89 ), [Roy Riojas](https://github.com/Roy Riojas), 30/04/2020 01:01:12

    
  - Upgrade deps - [5d10359]( https://github.com/royriojas/lru2/commit/5d10359 ), [Roy Riojas](https://github.com/Roy Riojas), 29/04/2020 22:29:30

    
  - Upgrade deps - [e1fbbb3]( https://github.com/royriojas/lru2/commit/e1fbbb3 ), [Roy Riojas](https://github.com/Roy Riojas), 29/04/2020 22:18:19

    
## v1.0.0
- **Build Scripts Changes**
  - Upgrade version to 1.0 - [c34fb4f]( https://github.com/royriojas/lru2/commit/c34fb4f ), [Roy Riojas](https://github.com/Roy Riojas), 04/03/2019 17:51:11

    
## v0.1.3
- **Documentation**
  - update changelog - [4fe4e8b]( https://github.com/royriojas/lru2/commit/4fe4e8b ), [Roy Riojas](https://github.com/Roy Riojas), 04/03/2019 17:49:00

    
- **Features**
  - Add `remove` and `peek` methods and `onRemoveEntry` callback - [7268150]( https://github.com/royriojas/lru2/commit/7268150 ), [Roy Riojas](https://github.com/Roy Riojas), 04/03/2019 17:48:10

    Two new methods added:
    - remove => removes an entry from the cache regardless if recently used or not
    - peek => check for a value in the cache without marking it as recently used
    
    And a callback option to peform clean up when the entry is removed from the cache.
    
    - onRemoveEntry => this method will receive the entry being removed to perform the cleanup
    
- **Build Scripts Changes**
  - Upgrade deps - [4149489]( https://github.com/royriojas/lru2/commit/4149489 ), [Roy Riojas](https://github.com/Roy Riojas), 04/03/2019 15:23:37

    
## v0.1.2
- **Documentation**
  - Add example of the usage - [a46c9ed]( https://github.com/royriojas/lru2/commit/a46c9ed ), [royriojas](https://github.com/royriojas), 10/07/2015 05:51:30

    
## v0.1.1
- **Bug Fixes**
  - wrong name of the package - [f011ecf]( https://github.com/royriojas/lru2/commit/f011ecf ), [royriojas](https://github.com/royriojas), 10/07/2015 05:45:26

    
## v0.1.0
- **Refactoring**
  - first working version - [c8908f4]( https://github.com/royriojas/lru2/commit/c8908f4 ), [royriojas](https://github.com/royriojas), 10/07/2015 05:43:26

    
