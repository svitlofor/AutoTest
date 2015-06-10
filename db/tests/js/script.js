document.observe('dom:loaded', function(){
	console.log("document ready");

	var test = new Test();
	test.hide();
	var ticket = new Ticket(test);
	ticket.hide();
	var category = new Category(ticket);
	category.hide();
	var topic = new Topic(test);
	topic.hide();
	var exam = new Exam();
	var section = new Section(topic, category, exam);
	section.build();
	console.log(section.element)
}, false);
console.log("End");
