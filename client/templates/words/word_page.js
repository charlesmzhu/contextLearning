Template.wordPage.events ( { 

	"click .arrow-right": function ( e ) { // As long as there's another
		if ( Words.state.indexOf ( this._id ) < Words.state.currentSet.length ) {	
			var nextId = Words.state.currentSet [ Words.state.indexOf (this._id) + 1 ]._id;
			Router.go("/" + nextId);
		}
	},

	"click .arrow-left": function ( e ) { // As long as there's another
		if ( Words.state.indexOf ( this._id ) > 0 ) {	
			var prevId = Words.state.currentSet [ Words.state.indexOf (this._id) - 1 ]._id;
			Router.go("/" + prevId);
		}
	},

	"submit #context-submit": function ( e ) {
		var text = event.target.text.value;
		Meteor.call ( "addContext" , this._id, text )

		event.target.text.value = "";

		//Meteor.call ( this._id, text );
		return false;
	},

	//Clicking on add icon shows a box to type word in
	"click #addWord": function ( e ) {
		Session.set ( "submittingNewWord", true );
		return false;
	},

	"blur #addWord": function ( e ) {
		Session.set ( "submittingNewWord", false );
		return false;
	}
} )

Template.wordPage.helpers ({
	submittingNewWord: function () { return Session.get("submittingNewWord"); }
})