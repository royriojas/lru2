describe( 'lru2', function () {
  describe( 'set', function () {
    it( 'should be empty when it is created', function () {
      var lru2 = require( '../index' ).create();
      expect( lru2.length ).to.equal( 0 );
      expect( lru2.toArray() ).to.deep.equal( [] );
    } );

    it( 'should set the values on the lru2 and prune the ones that are the last recently used first', function () {
      var lru2 = require( '../index' ).create( {
        limit: 3
      } );
      lru2.set( '1', 1 );
      lru2.set( '2', 2 );
      lru2.set( '3', 3 );
      lru2.set( '4', 4 );

      expect( lru2.toArray().map( function ( item ) {
        return item.key;
      } ) ).to.deep.equal( [ '4', '3', '2' ] );
    } );
  } );

  it( 'should update the order of the structure when the items are visited', function () {
    var lru2 = require( '../index' ).create( {
      limit: 3
    } );
    lru2.set( '1', 1 );
    lru2.set( '2', 2 );
    lru2.set( '3', 3 );
    lru2.set( '4', 4 );
    lru2.get( '2' );

    expect( lru2.toArray().map( function ( item ) {
      return item.key;
    } ) ).to.deep.equal( [ '2', '4', '3' ] );
  } );

  it( 'should update the order of the structure when an item with the same key is added', function () {
    var lru2 = require( '../index' ).create( {
      limit: 3
    } );
    lru2.set( '1', 1 );
    lru2.set( '2', 2 );
    lru2.set( '3', 3 );
    lru2.set( '4', 4 );
    lru2.set( '2', {
      changed: true
    } );

    expect( lru2.toArray().map( function ( item ) {
      return item.key;
    } ) ).to.deep.equal( [ '2', '4', '3' ] );
  } );

  describe( 'get', function () {
    it( 'should return undefined if a value is not in the cache', function () {
      var lru2 = require( '../index' ).create( {
        limit: 3
      } );
      var val = lru2.get( '1' );

      expect( val ).to.be.undefined;
    } );

    it( 'should return the value if the entry is found', function () {
      var lru2 = require( '../index' ).create( {
        limit: 3
      } );
      lru2.set( '1', 1 );
      lru2.set( '2', 2 );
      lru2.set( '3', 3 );
      lru2.set( '4', 4 );

      var val = lru2.get( '4' );

      expect( val ).to.equal( 4 );
      expect( lru2.toArray().map( function ( item ) {
        return item.key;
      } ) ).to.deep.equal( [ '4', '3', '2' ] );
    } );

  } );

  describe( 'when the instance in the cache contains a complex object', function () {
    it( 'should provide a callback when an element is removed to provide a chance to perform some cleanup', function () {
      var lru2 = require( '../index' ).create( {
        limit: 3,
        onRemoveEntry: function ( entry ) {
          entry.destroy();
        }
      } );

      var createInstance = function ( value ) {
        return {
          value: value,
          destroy: function () {
            this.value = undefined;
          }
        };
      };

      var instance1 = createInstance( 1 );
      expect( instance1.value ).to.equal( 1 );

      lru2.set( '1', instance1 );
      lru2.set( '2', createInstance( 2 ) );

      var thefirstInstance = lru2.peek( '1' );
      expect( thefirstInstance.value ).to.equal( 1 );

      lru2.set( '3', createInstance( 3 ) );
      lru2.set( '4', createInstance( 4 ) );

      var val = lru2.get( '1' );

      expect( val ).to.equal( undefined );
      expect( instance1.value ).to.equal.undefined;
      expect( thefirstInstance.value ).to.equal.undefined;

    } );
  } );

  describe( 'when the remove method is used', function () {
    it( 'should remove an entry from the lru regardless if it is recently used or not', function () {
      var lru2 = require( '../index' ).create( {
        limit: 3,
        onRemoveEntry: function ( entry ) {
          entry.destroy();
        }
      } );

      var createInstance = function ( value ) {
        return {
          value: value,
          destroy: function () {
            this.value = undefined;
          }
        };
      };

      var instance1 = createInstance( 1 );
      expect( instance1.value ).to.equal( 1 );

      lru2.set( '1', instance1 );
      lru2.set( '2', createInstance( 2 ) );

      expect( lru2.length ).to.equal( 2 );
      lru2.remove( '1' );
      expect( lru2.length ).to.equal( 1 );

      // this is undefined because destroy was called to perform the cleanup
      expect( instance1.value ).to.equal( undefined );

      // once removed the entry will not longer be available
      var val = lru2.get( '1' );

      expect( val ).to.equal( undefined );

    } );
  } );

} );
