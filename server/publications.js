Meteor.publish ( "words", function () { return Words.find(); })
Meteor.publish ( "decks", function () { return Decks.find(); })