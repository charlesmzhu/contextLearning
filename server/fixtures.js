if (Words.find().count() == 0 ) {
	 Words.insert({
    	word: 'insidious',
      createdAt: new Date (),
      contexts: [
        "The insidious nature of the EU is such that the majority of British citizens do not even recognize the threat.",
        "But while gaseous products and even falling water are capable of modifying electrical conditions in their immediate neighbourhood, the 'infection' produced by radium is more insidious, and other drawbacks present themselves in practice."
      ]
  	});

  	Words.insert({
    	word: '意料',
      createdAt: new Date (),
      contexts: [
        "出乎意料的新事件",
        "一切都在我的意料之内",
        "他的举动在我的意料之中"]
  	});

  	Words.insert({
    	word: 'mississippi',
    	createdAt: new Date(),
      contexts: [
        "Ranked the most religious state in the country since 2011", 
        "Bordered on the north by Tennessee, on the east by Alabama, on the south by Louisiana and a narrow coast on the Gulf of Mexico; and on the west, across the Mississippi River, by Louisiana and Arkansas."]
  	});
} 