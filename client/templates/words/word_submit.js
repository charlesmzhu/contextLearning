Template.wordSubmit.rendered = function () {
	$("#word-submit > input[name='text']").focus();
	console.log('fired');
};

Template.wordSubmit.events ({
	"blur #testing": function ( e ) {
		Session.set ( "submittingNewWord", false );
		return false;
	},

	"submit #word-submit": function ( e ) {
		e.preventDefault();
		var text = event.target.text.value;
		Meteor.call ( "addWord" , text );
		Words.state.currentSet.push( Meteor.findOne( { word: text } ) );
		event.target.text.value = "";
	}
})

