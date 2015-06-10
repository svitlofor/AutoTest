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
      this.component.category.build(); 
      this.component.topic.hide(); 
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
        self.test.number = selected_value;
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
    if(this[category_value]){
      if(this.rendom){
        var ticket_number = this.get_rendom_ticket();
        console.log(ticket_number);
        var self = this;
        this.load_ticket(ticket_number, function(data){
          self.test.number = ticket_number;
          self.test.start(data['tests']);
        })
      } else{
        var items = $(["<option id=''>Не вибрано</option>"]);
        for(var i = 1; i <= this[category_value]; i++)
          items.push( "<option value='" + i + "'>" + i + "</option>" );
        this.element.innerHTML = items.join("");
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

var Test = Class.create(BaseComponent, {
  id: 'test',
  legend_id: 'test_legend',
  controls_id: 'test_controls',
  default_max: 20,

  start: function(data){
    this.data = data;
    this.index = 1;
    this.max_count = data.length;
    this.build($(data).first());
  },

  build_legend: function(){
    var legend_div = $$("#" + this.legend_id).first();
    legend_div.innerHTML = '';
    if(this.max_count <= this.default_count) {
      var self = this;
      var ul = document.createElement('ul');
      var boxes = [];
      for(var i = 1; i <= this.max_count; i++){
        var li = document.createElement('li');
        ul.appendChild(li);
        boxes.push(ul);
      }
      legend_div.appendChild(ul);
      legend_div.boxes = boxes;
      var legend_obj = {
        boxes: boxes,
        focus: function(index){
          if(index > 1 && index <= self.default_max)
            boxes[index-1].className = 'focus';
        },
        error: function(index){
          if(index > 1 && index <= self.default_max)
            boxes[index-1].className = 'error';
        },
        right: function(index){
          if(index > 1 && index <= self.default_max)
            boxes[index-1].className = 'right';
        }
      };

      return legend_obj;
    }
    return null;
  },

  build_image: function(img_src){
    if(img_src.length > 0){
      img_src = "../" + img_src;
      console.log("build_image: " + img_src);
      var img = document.createElement("img");
      img.src = img_src;
      img.className = 'test_image';
      this.element.appendChild(img);
      this.element.appendChild(document.createElement('br'));
    }
  },

  build_text: function(text){
    var text_div = document.createElement('div');
    text_div.innerHTML = text;
    this.element.appendChild(text_div);
  },

  build_answers: function(answers){
    var self = this;
    var answers_div = document.createElement('div');
    answers_div.id = "test_answers";
    var div_html = '';
    $(answers).each(function(answer){
      div_html += answer['number'] + 
        '. <input class="test_radio" type="radio" name="test_answer" value="' + 
        answer['number'] + '">' + answer['text'] + '<br>';
    });
    answers_div.innerHTML = div_html;
    answers_div.className = 'test_answers';
    this.element.appendChild(answers_div);
    $$("#" + this.id + ".test_answers input").each(function(input){
      input.observe('click', function(){});
    })
  },

  build_controls: function(){
    var controls_div = $$("#" + this.controls_id).first();
    var self = this;
    var span = document.createElement('span');
    span.innerHTML = this.index + " з " + this.max_count;
    var add_number_link = function(sign, number){
      var link = document.createElement('a');
      if(number == 1){
        if(sign == '-') link.className = 'prev';
        if(sign == '+') link.className = 'next';
      } else {
        link.innerHTML = sign + number;
      }
      controls_div.appendChild(link);
      link.observe('click', function(){
        self.go_to(self.index + Number.parseInt(sign + number));
        span.innerHTML = self.index + " з " + self.max_count;
      });
    };
    if(this.max_count <= this.default_count) {
      add_number_link('-10');
      add_number_link('-5');
    }  
    add_number_link('-1');
    var span = document.createElement('span');
    controls_div.appendChild(span);
    add_number_link('+1');
    if(this.max_count <= this.default_count) {
      add_number_link('-10');
      add_number_link('-5');
    }  
  },

  build_test: function(data){
    this.element.innerHTML = '';
    this.build_image(data["image"] || '');
    this.build_text(data['text']);
    this.build_answers(data['answers']);
  },

  build: function(data){
    console.log("Test.start");
    console.log(data);
    var self = this;
    this.legend = this.build_legend();
    this.build_test(data);
    this.build_controls();
    this.show();
  },

  go_to: function(index){
    if(index >= 1 && index <= this.max_count){
      this.index = index;
      this.build_test(this.data[this.index]);
      if(this.legend)this.legend.focus(this.index);
    }  
  },

  next: function(){
    go_to(this.index + 1)
  },

  previous: function(){
    go_to(this.index - 1)
  }
})