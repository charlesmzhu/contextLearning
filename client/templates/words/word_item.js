Template.wordItem.helpers({
	wordsInFront: function ( parentContext ) { 
		return Words.state.indexOf (parentContext._id) < Words.state.length - 1;
	},
	wordsInBack: function ( parentContext ) {
		return Words.state.indexOf (parentContext._id) > 0;
	}
})