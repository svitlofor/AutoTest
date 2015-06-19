document.observe('dom:loaded', function(){
	var test = new Test();
	test.hide();
	var ticket = new Ticket(test);
	ticket.hide();
	var category = new Category(ticket);
	category.hide();
	var topic = new Topic(test);
	topic.hide();
	var section = new Section(topic, category);
	section.build();
}, false);
