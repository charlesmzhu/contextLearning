Router.configure ( {
	layoutTemplate: 'layout',
	waitOn: function () { return [
		Meteor.subscribe ('words'),
		Meteor.subscribe ('decks')
	]}
})

Router.route ( '/', { template: 'deckList', name: 'deckList' } );

Router.route ( '/decks/:_id', function () {
	Words.state.currentSet = Words.state.shuffle();
	Words.state.length = Words.find().count();
	var id = Words.state.currentSet[0]._id;
	this.redirect ( "/" + id );
})

//Change this so that this is a call back function.

Router.route ('/:_id/:indexOfWord', {

	template: 'wordPage',

	data: function () { return this; }

});
