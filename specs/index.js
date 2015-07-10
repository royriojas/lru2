describe( 'lru2', function () {
  describe( 'set', function () {
    it( 'should be empty when it is created', function () {
      var lru2 = require( '../index' ).create();
      expect( lru2.length ).to.equal( 0 );
      expect( lru2.toArray() ).to.deep.equal( [ ] );
    } );

    it( 'should set the values on the lru2 and prune the ones that are the last recently used first', function () {
      var lru2 = require( '../index' ).create( { limit: 3 } );
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
    var lru2 = require( '../index' ).create( { limit: 3 } );
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
    var lru2 = require( '../index' ).create( { limit: 3 } );
    lru2.set( '1', 1 );
    lru2.set( '2', 2 );
    lru2.set( '3', 3 );
    lru2.set( '4', 4 );
    lru2.set( '2', { changed: true } );

    expect( lru2.toArray().map( function ( item ) {
      return item.key;
    } ) ).to.deep.equal( [ '2', '4', '3' ] );
  } );

  describe( 'get', function () {
    it( 'should return null if a value is not in the cache', function () {
      var lru2 = require( '../index' ).create( { limit: 3 } );
      var val = lru2.get( '1' );

      expect( val ).to.be.null;
    } );

    it( 'should return the value if the entry is found', function () {
      var lru2 = require( '../index' ).create( { limit: 3 } );
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

} );
