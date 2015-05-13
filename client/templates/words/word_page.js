Template.deckList.helpers ( {
	decks: function () { 
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
	}
} )

Template.deckList.events ( { 
	"submit #beginTest": function ( e ) {
		var wordArray = _.shuffle ( this.wordIds );
		Decks.update ( this._id , { $set: { wordIds: wordArray } } );
		Decks.update ( this._id , { $set: { sessionIndex: 0 } } );
		Router.go ( '/' + this._id + '/' + Decks.findOne ( this._id, 
					{ fields: { 'sessionIndex': 1 } } 
				).sessionIndex 
			);
		return false;
	},
} );

/*
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
		if ( Words.state.indexOf ( this._id ) < Words.state.currentSet.length ) {	
			var nextId = Words.state.currentSet [ Words.state.indexOf (this._id) + 1 ]._id;
			Router.go("/" + nextId);
		}
	},

	"click .arrow-left": function ( e ) { // As long as there's another
		if ( Words.state.indexOf ( this._id ) > 0 ) {	
			var prevId = Words.state.currentSet [ Words.state.indexOf (this._id) - 1 ]._id;
			Router.go("/" + prevId);
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
	wordObj: function () { 
		var controller = Iron.controller();
		var index = controller.params.wordIndex;
		var id = controller.params._id;
		var wordsObject = Decks.findOne ( id, 
					{ fields: { 'wordIds': 1 } } 
				);
		var wordId = wordsObject.wordIds[index];
		return Words.findOne ( wordId );
	},


	wordsInFront: function ( parentContext ) { 
		return Words.state.indexOf (parentContext._id) < Words.state.length - 1;
	},
	wordsInBack: function ( parentContext ) {
		return Words.state.indexOf (parentContext._id) > 0;
	}
})

Template.wordSubmit.rendered = function () {
	$("#word-submit > input[name='text']").focus();
}

Template.wordSubmit.events ({
	"submit #word-submit": function ( e ) {
		console.log("Fired: ");
		e.preventDefault();
		var text = event.target.text.value;
		Meteor.call ( "addWord" , text );
		Words.state.currentSet.push ( Words.findOne( { word: text } ) );
		event.target.text.value = "";
		Session.set ( "submittingNewWord", false);
		
	}
/*	"blur #word-submit": function ( e ) {
		Session.set ( "submittingNewWord", false );
		return false;
	},
*/
})


