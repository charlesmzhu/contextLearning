Meteor.methods ({
	addContext: function ( wordId, string ) {
		console.log(wordId);
		Words.update ( wordId, { $addToSet: { contexts: string }} );
	},

	addWord: function ( word ) {
		Words.insert ( { 
			word: word, 
			createdAt: new Date()
		} );

	}
})
