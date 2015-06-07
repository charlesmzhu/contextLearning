Decks = new Mongo.Collection ('decks');
Words = new Mongo.Collection ('words');

Meteor.methods ({
	addContext: function ( wordId, string ) {
		Words.update ( wordId, { $addToSet: { contexts: string }} );
	},

	addWord: function ( word ) {
		if ( typeof word != "string" || !word.trim() ) return;

		return Words.insert ( { 
			word: word, 
			createdAt: new Date(),
			contexts: [],
			deckIds: []
		} );
	},

	addDeck: function ( title ) {
		if ( typeof title != "string" || !title.trim() ) return;
		Decks.insert ( {
			title: title,
			createdAt: new Date(),
			wordIds: []
		} );
	},

	deleteDeck: function ( id ) {
		Decks.remove ( id );
	},

	removeWordFromDeck: function ( deckId, wordId ) {
		Decks.update ( deckId,
			{ $pull: { wordIds: wordId } } 
		);
	},

	removeWord: function ( id ) {
		Words.remove ( id );
	},

	beginTest: function ( wordArray, deckId ) {
//		if ( wordArray.length < 1 ) return;
		Decks.update ( deckId , { $set: { wordIds: wordArray } } );
		Decks.update ( deckId , { $set: { sessionIndex: parseInt(0) } } );
	},

	pushWordIdToDeck: function ( deckId, wordId ) {
	 	if ( typeof wordId != "string" ) return;
	 	else
		 	Decks.update ( deckId,
				{ $addToSet: { wordIds: wordId } } );
	},

	initializeDeckIds: function ( wordId ) {
		Words.update ( wordId , { $set: { deckIds: [] } } );
	},

	pushDeckIdToWord: function ( wordId, deckId ) {
		Words.update( wordId, { $addToSet: { deckIds: deckId } } );	
	},

	nextWord: function ( deckId ) {
		Decks.update ( deckId, { $inc : { sessionIndex: parseInt(1) } }, 
			function ( err ) {
				var indexOfWord = Decks.findOne ( deckId, { fields: { "sessionIndex": 1 } } ).sessionIndex;
				Router.go( "/" + deckId + "/" + indexOfWord );
		});
	},

	setDeckSessionIndexToIndex: function ( deckId, index ) {
		Decks.update ( deckId, { $set: { sessionIndex: parseInt(index) }});
	},

	deleteContextFromWord: function ( wordId, contextString ) {
		Words.update ( wordId, { $pull: { contexts: contextString } } );	
	},
})
