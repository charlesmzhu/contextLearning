/*
Session variables:
	contextIndex: Number of times the more examples button ahs been clicked
	indexOfWord
	wordIds
	deckIds
	wordId
*/

Template.wordItem.helpers({

	//Change this to just using sessions variables
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

	wordsInFront: function () { 
		return parseInt ( Session.get ( "indexOfWord" ) ) < Session.get ("wordIds").length -1 ;
	},

	wordsInBack: function () {
		return parseInt ( Session.get ( "indexOfWord" ) ) > 0;
	},

	examples: function () {
		if ( Session.get ("contextIndex") )
			return this.contexts.slice(0, Session.get ("contextIndex"));
	}
});

Template.wordPage.events ( { 

	//Click to show more examples. contextIndex tracks # of times clicked and helper array is shown.
	"click .show-examples": function ( e ) {
		e.preventDefault();
		if ( Session.get ("contextIndex") ) 
			Session.set ( "contextIndex", Session.get("contextIndex") + 1 );
		else Session.set("contextIndex", 1)
	},

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

	"submit #context-submit": function ( e ) {
		var text = event.target.text.value;
		console.log("this: " + this.id)
		Meteor.call ( "addContext" , this._id, text )
		console.log(this._id);
		event.target.text.value = "";

		//Meteor.call ( this._id, text );
		return false;
	},

	'dragover .drop-to-delete' : function ( e ) {
		e.preventDefault();
		$(e.currentTarget).addClass ( "drag-over" );
	},

	'dragleave .drop-to-delete' : function( e ) {
		e.preventDefault();
    	$(e.currentTarget).removeClass( "drag-over" );
  	},

  	"drop .drop-to-delete": function (e) {
		var item = Blaze.getData ( e.target );
		var itemId = Session.get ( "draggedWord" );
		var alert = confirm("Are you sure you want to delete?");
		if ( alert == true ) {
			var deckIds =  Words.findOne ( itemId , 
					{ fields: { 'deckIds': 1 } } 
				).deckIds;

		//First removes words from decks
		if ( typeof deckIds != "undefined" ) {
			for ( var i = 0 ; i < deckIds.length; i++ )
				Meteor.call ( "removeWordFromDeck", deckIds[i], itemId );
		}
			//Then removes word completely
			Meteor.call ( "removeWord", itemId );
		}

		$(e.currentTarget).removeClass( "drag-over" );

		return false;
	},

} )



Template.wordItem.events({
	"click .delete-context": function ( e ) {
		var wordId = Session.get ( "wordId" );
		var context = Blaze.getData ( e.target );
		Meteor.call ( "deleteContextFromWord", wordId, context);
		return false;
	}
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