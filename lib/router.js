Router.configure ( {
	layoutTemplate: 'layout'
})

Router.route ( '/', function () {
	Session.set ('wordArray', _.shuffle( Words.find().fetch() ) );
	Session.set ( 'index', 0 )
	this.render('wordPage');
	
})
