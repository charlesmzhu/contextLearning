Router.configure ( {
	layoutTemplate: 'layout'
})

Router.route ( '/', function () {
	Words.state.currentSet = Words.state.shuffle();
	Words.state.length = Words.find().count();
	var id = Words.state.currentSet[0]._id;
	this.redirect ( "/" + id );

})

//Change this so that this is a call back function.

Router.route ('/:_id', {
	template: 'wordPage',
	
	data: function () { 
		return Words.findOne (this.params._id); //no array if you navigate directly to the data
	},
	
});


//Need to 1. Create a new "set list variable"
//2. Allow a way to add contexts.