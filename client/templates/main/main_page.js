/*Sessions variables:

selectedDeckWordIds: Display words within a deck when it is clicked.
displayInMainBox: Show word within the Main Box when it is clicked.
draggedWord: Id of word being dragged. Drag-and-drop words to delete or insert them in deck.

*/

Template.deckList.helpers ( {
	decks: function () { 
		return Decks.find();
	},
} );

Template.deckList.events ( { 

	//Adds deck
	"submit #deck-submit": function ( e ) {
		var text = e.target.text.value;
		Meteor.call ( "addDeck" , text );
		e.target.text.value = "";
		return false;
	},

	//Begins test
	"click .beginTest": function ( e ) {
		var startIndex = parseInt(0);
		var wordArray = _.shuffle ( this.wordIds );
		Meteor.call ( "beginTest", wordArray, this._id );
		if ( this.wordIds.length < 1 ) { 
			alert ( "Drop some words in the deck first!" );
		} else Router.go ( '/' + this._id + '/0' );
		return false;
	},

	//Deletes deck
	"click .deleteDeck": function ( e ) {
		Meteor.call ( "deleteDeck", this._id )
	},

	//Drops word into a deck. deck has array of wordIds belonging to it. word has array of deckIds it belongs to.
	"drop .deck .title": function (e) {
		var deck = Blaze.getData ( e.target );
		var wordId = Session.get ( "draggedWord" );
		if ( deck.wordIds.indexOf(wordId) != -1 ) {
			alert("Word is already in deck!");
		} else {
			Meteor.call ( "pushWordIdToDeck", deck._id, wordId);
			var deckIds = Words.findOne ( wordId , { fields: { 'deckIds': 1 } }	).deckIds;
			//For word getting dropped into a deck for the first time, make 
			if ( typeof deckIds == "undefined" )
				Meteor.call ( "initializeDeckIds", wordId )
			//Update word with deckId			
			Meteor.call ( "pushDeckIdToWord", wordId, deck._id )
			//Get rid of drag-over class
			$(e.currentTarget).removeClass( "drag-over" );
		}
		return false;	
	},

	//Changes background of deck when a word is dragged over it
	'dragover .deck .title' : function ( e ) {
		e.preventDefault();
		$(e.currentTarget).addClass ( "drag-over" );
	},

	//Reverts background of deck when a word
	'dragleave .deck .title' : function( e ) {
		e.preventDefault();
    	$(e.currentTarget).removeClass ( "drag-over" );
  	},

  	'mouseover .deck .title' : function ( e ) {
		e.preventDefault();
		$(e.currentTarget).addClass ( "drag-over" );
	},

	'mouseout .deck .title' : function( e ) {
		e.preventDefault();
    	$(e.currentTarget).removeClass( "drag-over" );
  	},

	"click .deck .title" : function ( e ) {
		Session.set ( "wordIds", Blaze.getData ( e.target ).wordIds );
		Session.set( "indexOfWord", 0 );
		return false;
	},

} );

Template.wordColumn.helpers ( { 
	//Displays words of clicked deck via Sessions variable. If no deck has been clicked, returns all words.
	words: function () {
		var words;
		var wordIds = Session.get ( "wordIds" );
		if ( typeof wordIds != "undefined" ) {
			words = Words.find( { '_id': { $in: wordIds } }, { sort: { createdAt: -1 } } );
		} else {
			words = Words.find( {}, { sort: { createdAt: -1 } } );
			wordIds = words.map ( function ( item ) { return item._id } )
			Session.set( "wordIds", wordIds);
			Session.set( "indexOfWord", 0 );
		};
		Session.set ( "displayInMainBox", Words.find( Session.get("wordIds")[0] ).fetch()[0] );
		return words;
	},
} )

Template.wordColumn.events ( {

	//Click on word to show in big box
	"click .label-default": function ( e ) {
		var wordId = Blaze.getData ( e.target )._id;
		var wordIds = Session.get("wordIds");
		Session.set ( "wordId", wordId );
		Session.set ( "displayInMainBox", Blaze.getData ( e.target ) );
		Session.set ( "contextIndex", 0 );
		Session.set ( "indexOfWord", wordIds.indexOf ( wordId ) );
		return false;
	},

	//Sets id of word being dragged
	"dragstart .label-default": function ( e ) {
		var id = Words.findOne( { word: e.target.innerHTML }, 
			{ fields: { _id: 1 } } )._id;
		Session.set ("draggedWord", id);
	},

	//Shows all words by setting the wordIds associated with a deck to undefined
	"click #show-all-words": function ( e ) {
		Session.set ( "selectedDeckWordIds", undefined )
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

	"submit .new-word": function ( e ) {
		e.preventDefault();
		console.log("test");
		var text = e.target.word.value;
		var test = Meteor.call ( "addWord" , text, function ( err, data ) {
			Session.set ( "displayInMainBox", Words.find( data ).fetch()[0] );
		} );
		e.target.word.value = "";
		return false;
	}

} )

Template.mainBox.helpers ( {
	
	//Object to be displayed in main box
	wordObj: function ( e ) {
		return Session.get ( "displayInMainBox" );
	},
} )

Template.wordSubmitLarge.events ({
	"submit .bigtextbox": function ( e ) {
		e.preventDefault();
		var text = e.target.word.value;
		var test = Meteor.call ( "addWord" , text, function ( err, data ) {
			Session.set ( "displayInMainBox", Words.find( data ).fetch()[0] );
		} );
		e.target.word.value = "";
		return false;
	}
})