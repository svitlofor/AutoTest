var BaseComponent = Class.create({
  initialize: function(){
    this.element = $(document.getElementById(this.id));
    this.element.component = this;
  },

  hide: function(){
    this.get_container().hide();
  },

  get_container: function(){
    return $(document.getElementById(this.id + "_container"));
  },

  show: function(){
    this.get_container().show();
  }
})

var SelectClass = Class.create(BaseComponent, {
  handler: function(){
    var select = $(this);
    var index = select.selectedIndex;
    var option = select.options[index];
    this.component.selected_value = option.value;
    this.component.selected_text = option.text;
  },

  build: function(){
    $(this.element).addEventListener('change', this.handler, false);
    this.show();
  }
})

var Section = Class.create(SelectClass, {
  id: 'section',
  initialize: function($super, topic, category, exam){
    $super();
    this.topic = topic;
    this.category = category;
    this.exam = exam;
  },

  handler: function($super){
    $super();
    var selected_value = this.component.selected_value;
    if(selected_value.length == 0) {
      this.component.topic.hide(); 
      this.component.category.hide(); 
      this.component.exam.hide();
    }
    if(selected_value == 'topics') {
      this.component.topic.build(); 
      this.component.category.hide(); 
      this.component.exam.hide();
    }  
    if(selected_value == 'tickets') {
      this.component.category.build(); 
      this.component.topic.hide(); 
      this.component.exam.hide();
    }  
    if(selected_value == 'exam') {
      this.component.exam.build(); 
      this.component.topic.hide(); 
      this.component.category.hide(); 
    }  
  }
})

var Topic = Class.create(SelectClass, {
  id: 'topics',
  file_name: 'topics.js',
  topics_path: 'topics',
  initialize: function($super, test) {
    $super();
    this.file_path = this.topics_path + "/" + this.file_name;
    this.test = test;
  },

  read: function(callback){
    var self = this;
    loadScripts('topics/topics.js', callback);
  },

  handler: function($super){
    $super();
    var selected_value = this.component.selected_value;
    var self = this.component;
    if(selected_value.length > 0){
      self.load_topic(selected_value, function(data){
        self.test.start(data['tests']);
      })
    }
  },

  build: function($super){
    $super();
    var self = this;
    loadScripts(this.file_path, function(data){
      var items = $(["<option id=''>Не вибрано</option>"]);
      $(data).each(function(topic) {
        items.push( "<option value='" + topic['number'] + "'>" + topic['name'] + "</option>" );
      });
      self.element.innerHTML = items.join("");
    })
  },

  get_topics_path: function(topic_number){
    return this.topics_path + "/" + "topics_" + topic_number + ".js";
  },

  load_topic: function(topic_number, handler){
    loadScripts(this.get_topics_path(topic_number), handler)
  }

});

var Ticket = Class.create(SelectClass, {
  id: 'tickets',
  AB: 110,
  CD: 130,
  tickets_path: 'tickets',
  initialize: function($super, test){
    $super();
    this.test = test;
  },

  load_ticket: function(ticket_number, handler){
    loadScripts(this.get_tickets_path(ticket_number), handler)
  },

  get_tickets_path: function(ticket_number){
    return this.tickets_path + "/" + this.category_value + "/tickets_" + ticket_number + ".js";
  },  

  handler: function($super){
    $super();
    var selected_value = this.component.selected_value;
    var self = this.component;
    if(selected_value.length > 0){
      self.load_ticket(selected_value, function(data){
        self.test.start(data['tests']);
      })
    }
  },  

  build: function($super, category_value){
    this.category_value = category_value;
    if(this[category_value]){
      var items = $(["<option id=''>Не вибрано</option>"]);
      for(var i = 1; i <= this[category_value]; i++)
        items.push( "<option value='" + i + "'>" + i + "</option>" );
      this.element.innerHTML = items.join("");
    }
    $super();
  }
})

var Test = Class.create(BaseComponent, {
  id: 'test',
  start: function(data){
    console.log("Test.start");
    console.log(data);
  }
})

var Exam = Class.create(Test, {
  start: function(data){
    console.log("Test.start");
  }
})


var Category = Class.create(SelectClass, {
  id: 'category',

  initialize: function($super, ticket){
    $super();
    this.ticket = ticket;
  },

  handler: function($super){
    $super();
    var selected_value = this.component.selected_value;
    if(selected_value == 'AB' || selected_value == 'CD') 
      this.component.ticket.build(selected_value);
    if(selected_value == '') {
      this.component.ticket.hide(); 
    }
  }
}); 
