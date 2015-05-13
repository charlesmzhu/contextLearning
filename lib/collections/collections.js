Words = new Mongo.Collection ('words');
Decks = new Mongo.Collection ('decks');

Words.state = {};

Words.state.shuffle = function ( ) {
	return _.shuffle( Words.find().fetch() );
};
//find id of current set

Words.state.indexOf = function ( id ) {
	var i;
	var arr = Words.state.currentSet;
	for ( i = 0; i < arr.length ; i++ ) {
		if (arr[i]._id === id ) return i;
	}
}; 

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

