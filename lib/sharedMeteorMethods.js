Meteor.methods ({
	addContext: function ( wordId, string ) {
		console.log(wordId);
		Words.update ( wordId, { $push: { contexts: string }} );
	}
})
