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

	"submit #submit-context": function ( e ) {
		var text = event.target.text.value;
		Meteor.call ( "addContext" , this._id, text )

		event.target.text.value = "";

		//Meteor.call ( this._id, text );
		return false;
	}
} )

Template.wordPage.helpers ({
	wordsInFront: function () { 
		return Words.state.indexOf (this._id) < Words.state.length -1;
	},
	wordsInBack: function () {
		return Words.state.indexOf (this._id) > 0;
	}
})