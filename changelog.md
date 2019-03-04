
# lru2 - Changelog
## HEAD
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

    
