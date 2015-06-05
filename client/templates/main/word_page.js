/*
Session variables:
	contextIndex: Number of times the more examples button ahs been clicked
	indexOfWord
	wordIds
	deckIds
	wordId
*/

Template.wordPage.helpers({

	wordObj: function () {
		var indexOfWord = this.params.indexOfWord;//index of word within the larger deck
		var deckId = this.params._id;//id of deck
		var wordIds = Decks.findOne ( deckId, //finds the array of word ids the deck
			{ fields: { 'wordIds': 1 } } 
		).wordIds;
		
		Meteor.call ( "setDeckSessionIndexToIndex", deckId, indexOfWord )

		Session.set ( "indexOfWord", parseInt(indexOfWord) );
		Session.set ( "wordIds", wordIds );
		Session.set ( "deckId", deckId ); //Should change this to just the URI, don't need to update this
		
		var wordId = wordIds[indexOfWord];//gets the specific wordId
		Session.set( "wordId", wordId )

		return Words.findOne (wordId );
	},

})

Template.wordItem.helpers({

	examples: function () {
		if ( Session.get ("contextIndex") )
			return this.contexts.slice(0, Session.get ("contextIndex"));
	},

	wordsInFront: function () { 
		console.log(Session.get ( "indexOfWord" ) < Session.get ( "wordIds" ).length - 1);
		return parseInt ( Session.get ( "indexOfWord" ) ) < Session.get ( "wordIds" ).length - 1 ;
	},

	wordsInBack: function () {
		return parseInt ( Session.get ( "indexOfWord" ) ) > 0;
	},

});

Template.wordPage.events ( { 

	"click .arrow-right": function ( e ) {
		var deckId = Session.get("deckId");
		if ( Session.get ( "indexOfWord" ) < Session.get ("wordIds").length-1 ) {	
			Meteor.call ( "nextWord", deckId )
		}
		Session.set("contextIndex", 0);
	},

	"click .arrow-left": function ( e ) { // As long as there's another
		var deckId = Session.get("deckId");
		if ( Session.get ( "indexOfWord" ) > 0 ) {	
			var prevIndex = Session.get("indexOfWord") - 1;
			Router.go("/" + deckId + "/" + prevIndex);//Can probably do this via route paths
		}
		Session.set("contextIndex", 0);
	},

} )

Template.wordItem.events({

	//Click to show more examples. contextIndex tracks # of times clicked and helper array is shown.
	"click .show-examples": function ( e ) {
		e.preventDefault();
		if ( Session.get ("contextIndex") ) 
			Session.set ( "contextIndex", Session.get("contextIndex") + 1 );
		else Session.set("contextIndex", 1);
	},

	"click .delete-context": function ( e ) {
		var wordId = Session.get ( "wordId" );
		var context = Blaze.getData ( e.target );
		Meteor.call ( "deleteContextFromWord", wordId, context);
		return false;
	},

	"submit #context-submit": function ( e ) {
		var text = event.target.text.value;
		Meteor.call ( "addContext" , this._id, text );
		console.log(this._id);
		event.target.text.value = "";
		return false;
	},
})

Template.wordSubmit.events ({
	"submit #word-submit": function ( e ) {
		e.preventDefault();
		var text = event.target.text.value;
		Meteor.call ( "addWord" , text );
		Words.state.currentSet.push ( Words.findOne( { word: text } ) );
		event.target.text.value = "";
		Session.set ( "submittingNewWord", false);
		
	},

	"blur #word-submit": function ( e ) {
		Session.set ( "submittingNewWord", false );
		return false;
	},

})