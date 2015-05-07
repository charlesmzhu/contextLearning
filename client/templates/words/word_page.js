Template.wordPage.helpers ({//Need to get this to return a word with
	word: function ( index ) {
		return Session.get ( 'wordArray' ) [ index ] ;
	},

	index: function () { return Session.get ( 'index' ); },
})

Template.wordPage.events ( { 
	"click #arrow-right": function ( e ) {
		if ( Session.get ('index') < Session.get ('wordArray').length-1 ) {
			console.log(Session.get('index'));
			Session.set ( 'index', Session.get ( 'index' ) + 1);
		}
	}
} )