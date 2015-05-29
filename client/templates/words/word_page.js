Template.deckList.helpers ( {
	decks: function () { 
		Session.set("addDeckButtonClicked", false)
		return Decks.find(); 
	},

	words: function () {
		return Words.find( {}, { sort: { createdAt: -1 } });
	},

	//Figures out if a state has been saved on this collection
	stateExists: function () {
		return Decks.findOne ( this._id , 
					{ fields: { 'wordIds': 1 } } 
				).wordIds.length > 0;

	},

	//Figures out where the user left off
	progressBar: function () {
		return Decks.findOne ( { _id: this._id }, 
					{ fields: { 'sessionIndex': 1 } } 
				).sessionIndex;
	},
/*
	addDeckButtonClicked : function() {
		return Session.get ( "addDeckButtonClicked" );
	}
*/

} )

Template.deckList.events ( { 

	"submit #deck-submit": function ( e ) {
		e.preventDefault();
		var text = e.target.text.value;
		Meteor.call ( "addDeck" , text );
		return false;
	},

	"click .beginTest": function ( e ) {
		var startIndex = parseInt(0);
		var wordArray = _.shuffle ( this.wordIds );
		Meteor.call ( "beginTest", wordArray, this._id );
		if ( this.wordIds.length < 1 ) { 
			alert ( "Drop some words in the deck first!" );
		} else Router.go ( '/' + this._id + '/0' );
		return false;
	},

	"click .deleteDeck": function ( e ) {
		Meteor.call ( "deleteDeck", this._id )
	},

	"dragstart .label-default": function ( e ) {
		var id = Words.findOne( { word: e.target.innerHTML }, 
			{ fields: { _id: 1 } } )._id;
		Session.set ("draggedWord", id);
	},
/*
	"dragstart .deck": function ( e ) {
		var id = Words.findOne( { word: e.target.innerHTML }, 
			{ fields: { _id: 1 } } )._id;
		Session.set ("draggedDeck", id);
	},
*/
	'dragover .deck .title' : function ( e ) {
		e.preventDefault();
		$(e.currentTarget).addClass ( "drag-over" );
	},

	'dragleave .deck .title' : function( e ) {
		e.preventDefault();
    	$(e.currentTarget).removeClass( "drag-over" );
  	},

  	'mouseover .deck .title' : function ( e ) {
		e.preventDefault();
		$(e.currentTarget).addClass ( "drag-over" );
	},

	'mouseout .deck .title' : function( e ) {
		e.preventDefault();
    	$(e.currentTarget).removeClass( "drag-over" );
  	},

	"drop .deck .title": function (e) {
		var deck = Blaze.getData ( e.target );
		var wordId = Session.get ( "draggedWord" );
		if ( deck.wordIds.indexOf(wordId) != -1 ) {
			alert("Word is already in deck!");
		} else {

			//Update deck with the wordId
			Meteor.call ( "pushWordIdToDeck", deck._id, wordId);

			//Update the word with deckId
			var deckIds = Words.findOne ( wordId , 
					{ fields: { 'deckIds': 1 } } 
				).deckIds;

			//Check if deckIds exist, e.g. if word has been dropped into deck
			if ( typeof deckIds == "undefined" )
				Meteor.call ( "initializeDeckIds", wordId )

			//Update word with deckId
				
			
			Meteor.call ( "pushDeckIdToWord", wordId, deck._id )

			//Get rid of drag-over class
			$(e.currentTarget).removeClass( "drag-over" );
		}
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
			for ( var i = 0 ; i < deckIds.length; i++ ) {
				Meteor.call ( "removeWordFromDeck", deckIds[i], itemId );
			}
		}
			//Then removes word completely
			Meteor.call ( "removeWord", itemId );
		}

		$(e.currentTarget).removeClass( "drag-over" );

		return false;
	},

} );

Template.wordSubmitLarge.events ({
	"submit .bigtextbox": function ( e ) {
		e.preventDefault();
		var text = e.target.word.value;
		console.log(text);
		Meteor.call ( "addWord" , text );
		return false;
	}
})

Template.wordPage.events ( { 

	"click .show-examples": function ( e ) {
		e.preventDefault();
		if ( Session.get ("contextIndex ") ) 
			Session.set ( "contextIndex", Session.get("contextIndex") + 1 );
		else Session.set("contextIndex", 1)
	},

	"click .arrow-right": function ( e ) { // As long as there's another
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

	//Clicking on add icon shows a box to type word in
	"click #addWord": function ( e ) {
		Session.set ( "submittingNewWord", true );
		return false;
	}
} )

Template.wordPage.helpers ({
	submittingNewWord: function () { return Session.get("submittingNewWord"); }
})

Template.wordItem.helpers({
	wordObj: function () { //the route object has been passed to these helpers
		var indexOfWord = this.params.indexOfWord;//index of word within the larger deck
		var deckId = this.params._id;//id of deck
		

		var wordIds = Decks.findOne ( deckId, //finds the array of wor ids the deck
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

})

Template.wordItem.events({
	"click .delete-context": function ( e ) {
		var wordId = Session.get ( "wordId" );
		var context = Blaze.getData ( e.target );
		Meteor.call ( "deleteContextFromWord", wordId, context);
		return false;
	}
})


Template.wordSubmit.rendered = function () {
	$("#word-submit > input[name='text']").focus();
}


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