Meteor.methods ({
	addContext: function ( wordId, string ) {
		console.log(wordId);
		Words.update ( wordId, { $addToSet: { contexts: string }} );
	}
})
