Router.configure ( {
	layoutTemplate: 'layout'
})

Router.route ( '/', function () {
	Session.set ('wordArray', _.shuffle( Words.find().fetch() ) );
	this.render('wordPage');
})