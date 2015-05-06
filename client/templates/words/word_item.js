Template.wordItem.helpers({
	word: function () { 
		return Session.get ( 'wordArray' ) [0].word; 
	},

	contexts: function () {
		return Session.get ( 'wordArray' ) [0].contexts;
	}
})