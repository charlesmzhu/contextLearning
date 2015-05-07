Words = new Mongo.Collection ('words');
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