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
    if($(this.element.options).length > 0) $(this.element.options)[0].selected = true;
    $(this.element).addEventListener('change', this.handler, false);
    this.show();
  }
})

var Section = Class.create(SelectClass, {
  id: 'section',
  initialize: function($super, topic, category){
    $super();
    this.topic = topic;
    this.category = category;
  },

  handler: function($super){
    $super();
    var selected_value = this.component.selected_value;
    if(selected_value.length == 0) {
      this.component.topic.hide(); 
      this.component.category.hide(); 
    }
    if(selected_value == 'topics') {
      this.component.category.ticket.rendom = false; 
      this.component.topic.build(); 
      this.component.category.hide(); 
    }  
    if(selected_value == 'tickets') {
      this.component.category.ticket.rendom = false; 
      this.component.category.build(); 
      this.component.topic.hide(); 
    }  
    if(selected_value == 'exam') {
      this.component.category.ticket.rendom = true; 
      this.component.category.ticket.hide();
      this.component.category.build(); 
      this.component.topic.hide(); 
    }  
  }
})

var Topic = Class.create(SelectClass, {
  id: 'topics',
  file_name: 'topics.js',
  topics_path: 'tests/topics',
  initialize: function($super, test) {
    $super();
    this.file_path = this.topics_path + "/" + this.file_name;
    this.test = test;
  },

  read: function(callback){
    var self = this;
    loadScripts('topics/topics.js', callback);
  },

  hide: function($super){
    $super();
    this.test.hide();
  },  

  handler: function($super){
    $super();
    var selected_value = this.component.selected_value;
    var self = this.component;
    if(selected_value.length > 0){
      self.load_topic(selected_value, function(data){
        self.test.number = selected_value;
        self.test.exam = false;
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
  tickets_path: 'tests/tickets',
  initialize: function($super, test){
    $super();
    this.test = test;
  },

  hide: function($super){
    $super();
    this.test.hide();
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
        self.test.number = selected_value;
        self.test.start(data['tests']);
      })
    }
  },

  get_rendom_ticket: function(){
    return Math.floor(Math.random() * (this[this.category_value] - 2)) + 1;
  },

  build: function($super, category_value){
    this.category_value = category_value;
    var self = this;
    if(this[category_value]){
      if(this.rendom){
        var ticket_number = this.get_rendom_ticket();
        this.load_ticket(ticket_number, function(data){
          self.test.number = ticket_number;
          self.test.exam = true;
          self.test.start(data['tests']);
        })
      } else{
        var items = $(["<option id=''>Не вибрано</option>"]);
        for(var i = 1; i <= this[category_value]; i++)
          items.push( "<option value='" + i + "'>" + i + "</option>" );
        this.element.innerHTML = items.join("");
        self.test.exam = false;
        $super();
      }  
    }
  }
})

var Category = Class.create(SelectClass, {
  id: 'category',

  initialize: function($super, ticket){
    $super();
    this.ticket = ticket;
  },

  hide: function($super){
    $super();
    this.ticket.hide();
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
