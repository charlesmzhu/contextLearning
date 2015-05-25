Template.deckList.helpers ( {
	decks: function () { 
		Session.set("addDeckButtonClicked", false)
		return Decks.find(); 
	},

	words: function () {
		return Words.find();
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
	"click .btn.btn-primary": function (e) {
		Session.set ( "addDeckButtonClicked", true );
		return false;
	},
/*
	"blur #deck-submit": function ( e ) {
		Session.set ( "addDeckButtonClicked", false );
		return false;
	},*/

	"submit #deck-submit": function ( e ) {
		e.preventDefault();
		var text = e.target.text.value;
		Meteor.call ( "addDeck" , text );
		return false;
	},

	"click .beginTest": function ( e ) {
		var start = parseInt(0);
		var wordArray = _.shuffle ( this.wordIds );
		Decks.update ( this._id , { $set: { wordIds: wordArray } } );
		Decks.update ( this._id , { $set: { sessionIndex: start } } );
		Router.go ( '/' + this._id + '/' + Decks.findOne ( this._id, 
					{ fields: { 'sessionIndex': 1 } } 
				).sessionIndex 
			);
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
		console.log(deck);
		var wordId = Session.get ( "draggedWord" );
		console.log(wordId);
		if ( deck.wordIds.indexOf(wordId) != -1 ) {
			alert("Word is already in deck!");
		} else {
			Decks.update ( deck._id,
				{ $push: { wordIds: wordId } },  
				{ upsert: true } );
			$(e.currentTarget).removeClass( "drag-over" );
		}	
	},

} );

/*
Template.deckList.rendered = function () {
	$(".label-default").draggable ({

	});

	$(".deck").droppable({
		accept: ".label-default",
		drop: function () {

		}
	});
}
 
var deck = Decks.find().fetch()[0];
var deckId = deck._id;
var word = Words.find().fetch()[0];
var wordId = word._id;

Decks.update ( deckId , { $set: { wordIds: [wordId] } } )
Decks.update ( deckId , { $set: { sessionIndex: 0 } } )

Decks.findOne ( deckId , 
					{ fields: { 'wordIds': 1, _id: 0 } } 
				)

Decks.findOne ( deckId, 
					{ fields: { 'sessionIndex': 1 } } 
				).sessionIndex 

Decks.findOne ( deckId, 
					{ fields: { 'wordIds': 1, 'id': 0 } } 
				).wordIds[index]

*/
Template.wordPage.events ( { 

	"click .arrow-right": function ( e ) { // As long as there's another
		var deckId = Session.get("deckId");
		if ( Session.get ( "indexOfWord" ) < Session.get ("wordIds").length-1 ) {	
			Decks.update ( deckId, { $inc : { sessionIndex: parseInt(1) } }, function ( e, d ) {
				var indexOfWord = Decks.findOne ( deckId, { fields: { "sessionIndex": 1 } } ).sessionIndex;
				Router.go( "/" + deckId + "/" + indexOfWord );
			});
		}
	},

	"click .arrow-left": function ( e ) { // As long as there's another
		var deckId = Session.get("deckId");
		if ( Session.get ( "indexOfWord" ) > 0 ) {	
			var prevIndex = Session.get("indexOfWord") - 1;
			Router.go("/" + deckId + "/" + prevIndex);//Can probably do this via route paths
		}
	},

	"submit #context-submit": function ( e ) {
		var text = event.target.text.value;
		Meteor.call ( "addContext" , this._id, text )

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
		Decks.update ( deckId, { $set: { sessionIndex: parseInt(indexOfWord) }});
		Session.set ( "indexOfWord", parseInt(indexOfWord) );
		Session.set ( "wordIds", wordIds );
		Session.set ( "deckId", deckId ); //Should change this to just the URI, don't need to update this
		var wordId = wordIds[indexOfWord];//gets the specific wordId
		return Words.findOne ( wordId );
	},


	wordsInFront: function () { 
		return parseInt ( Session.get ( "indexOfWord" ) ) < Session.get ("wordIds").length -1 ;
	},
	wordsInBack: function () {
		return parseInt ( Session.get ( "indexOfWord" ) ) > 0;
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


