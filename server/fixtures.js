if (Words.find().count() == 0 ) {
	 var id1, id2, id3, id4, id5;
   id1 = Random.id();
   id2 = Random.id();
   id3 = Random.id();
   id4 = Random.id();
   id5 = Random.id();

   Words.insert({
      _id: id1,
      word: 'ahora mismo',
      createdAt: new Date (),
      contexts: [
        "- Una tapa de tortilla, por favor. - Si, ahora mismo"
      ]
  	});

  	Words.insert({
      _id: id2,
    	word: 'merendar',
      createdAt: new Date (),
      contexts: [
        "- La amiga de ANa ha telefoneado. - Que queria? - Invitar a los ninos a merendar. Despues podemos irnos al cine."
      ]
  	});

  	Words.insert({
      _id: id3,
    	word: 'semaforo',
    	createdAt: new Date(),
      contexts: [
        "Cuidado!  El semaforo esta en rojo." 
      ]
  	});

    Words.insert({
      _id: id4,
      word: 'deprisa',
      createdAt: new Date(),
      contexts: ["Deprisa! Necesito suelto por el autobus."],
    })

    Words.insert({
      _id: id5,
      word: 'todavia',
      createdAt: new Date(),
      contexts: ["-El primer acto era malisimo. -Y el segundo? -Todavia peor."],
    })

}

if (Decks.find().count() == 0) {
  var id6, id7;
  id6 = Random.id();
  id7 = Random.id();

  Decks.insert(
    {
      _id: id6,
      title: "Assimil Espanol: Leccion Primera a Septima",
      createAt: new Date(),
      wordIds: [id1, id2, id3, id4]
    }
  )

  Decks.insert(
    {
      _id: id7,
      title: "Assimil Espanol: Leccion Octava a Catorce",
      createAt: new Date(),
      wordIds: [id5]
    }
  )

  Words.update ( id1, { $set: { deckIds: [id6] } } );
  Words.update ( id2, { $set: { deckIds: [id6] } } );
  Words.update ( id3, { $set: { deckIds: [id6] } } );
  Words.update ( id4, { $set: { deckIds: [id6] } } );
  Words.update ( id5, { $set: { deckIds: [id7] } } );
}