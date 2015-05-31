Router.configure ( {
	layoutTemplate: 'layout',
	waitOn: function () { return [
		Meteor.subscribe ('words'),
		Meteor.subscribe ('decks')
	]},
	loadingTemplate: 'loading',
})

Router.route ( '/', { template: 'mainPage', name: 'mainPage' } );

Router.route ('/:_id/:indexOfWord', {
	template: 'wordPage',
	data: function () { return this; }
});
