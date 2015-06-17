//require 'classes.js'
var Test = Class.create(BaseComponent, {
  id: 'test',
  legend_id: 'test_legend',
  controls_id: 'test_controls',
  default_max: 20,

  start: function(data){
    this.data = data;
    this.index = 1;
    this.fails = 0;
    this.max_count = data.length;
    this.build($(data).first());
  },

  build_legend: function(){
    var legend_div = this.clean_legend();
    var self = this;
    if(this.max_count <= this.default_max) {
      var self = this;
      var ul = document.createElement('ul');
      var boxes = [];
      for(var i = 1; i <= this.max_count; i++){
        var li = document.createElement('li');
        if(i == 1) li.addClassName('focus');
        li.innerHTML = i + ".";
        ul.appendChild(li);
        boxes.push(li);
      }
      legend_div.appendChild(ul);
      legend_div.boxes = boxes;

      var legend_obj = {
        boxes: boxes,
        focus: function(index){
          if(index >= 1 && index <= self.default_max)
            $(boxes[index-1]).addClassName('focus');
        },
        unfocus: function(index){
          if(index >= 1 && index <= self.default_max)
            $(boxes[index-1]).removeClassName('focus');
        },
        fail: function(index){
          if(index >= 1 && index <= self.default_max)
            $(boxes[index-1]).addClassName('wrong');
        },
        pass: function(index){
          if(index >= 1 && index <= self.default_max){
            $(boxes[index-1]).addClassName('right');
          }  
        }
      };

      return legend_obj;
    }
    return null;
  },

  build_image: function(img_src){
    if(img_src.length > 0){
      img_src = "../" + img_src;
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
    text_div.className = 'test_text';
    this.element.appendChild(text_div);
  },

  build_answers: function(data){
    var self = this;
    var answers = data['answers']
    var answers_div = document.createElement('div');
    answers_div.id = "test_answers";
    answers_div.innerHTML = this.get_answers_html(data);
    answers_div.className = 'test_answers';
    this.element.appendChild(answers_div);

    if (data['answered_number']) {
      self.add_comments(data);
    } else {
      $$("#" + this.id + " .test_answers input").each(function(input){
        input.label = input.nextSibling;
        var answer = $(answers).select(function(answer){return answer['number'] == input.value;}).first();
        input.right = answer['right'];
        input.self = self;
        input.data_item = data;
        input.answers = answers;
        input.parentNode.observe('click', self.answer_hendler.bind(input));
      })
    }  
  },

  answer_hendler: function(){
    var input = this;
    var self = this.self;
    var data_item = this.data_item;
    var answers = this.answers;
    if(data_item['answered_number']) return false;
    input.checked = true;
    var answer = $(answers).select(function(answer){return answer['number'] == input.value;}).first();
    // var data_item = $(self.data).select(function(item){
    //   return self.index == Number.parseInt(item['number']);
    // }).first();
    self.add_comments(data_item);
    data_item['answered_number'] = input.value;
    $$("#" + self.id + " .test_answers input").each(function(loop_input){ 
      loop_input.disabled = true;
    })
    if(answer['right']){
      if(self.legend) self.legend.pass(self.index);
      data_item['answered_right'] = true;
      input.label.addClassName('right');
    } else {
      self.fails++;
      if(self.legend) self.legend.fail(self.index);
      data_item['answered_right'] = false;
      var right_input = $$("#" + self.id + " .test_answers input").select(function(loop_input){ 
        return loop_input.right;
      }).first();
      input.label.addClassName('wrong');
      right_input.label.addClassName('right');
      if(self.exam && self.fails > 2) self.result_screen(true);
    }
  },

  get_answers_html: function(data){
    var answers = data['answers']
    var div_html = '';
    var right_answer = $(answers).select(function(answer){return answer['right']}).first();
    var right_answer_number = right_answer['number'];
    $(answers).each(function(answer){
      var answer_number = Number.parseInt(answer['number']);
      var label_class = (data['answered_number'] && answer['number'] == right_answer_number ? 'right': (data['answered_number'] == answer['number'] ? 'wrong': ''));
      div_html += '<div class="answer_div">' + answer['number'] + 
        '<input' + (data['answered_number'] == answer['number'] ? ' checked="true"' : '') + 
        (data['answered_number'] ? ' disabled' : '') +
        ' id="answer_input_' + answer_number + 
        '" class="test_radio" type="radio" name="test_answer" value="' + 
        answer['number'] + '"><label for="answer_input_' + answer_number + '"' + 
        'class="' + label_class + '">' + 
        answer['text'] + '</label></div>';
    });
    return div_html;
  },

  add_comments: function(data){
    var comments_div = document.createElement('div');
    comments_div.id = 'test_comments';
    comments_div.className = 'test_comments';
    comments_div.innerHTML = data['comment'];
    var ext_comments_div = document.createElement('div');
    var ext_coments_button = document.createElement('input');
    ext_coments_button.type = 'button';
    ext_coments_button.value = 'Розширений коментар';
    $(ext_coments_button).observe('click', function(){
      this.parentNode.innerHTML = data['autor_comment'];
    })
    ext_comments_div.id = 'test_ext_comments';
    ext_comments_div.className = 'test_ext_comments';
    ext_comments_div.appendChild(ext_coments_button);
    this.element.appendChild(comments_div);
    this.element.appendChild(ext_comments_div);
  },  

  build_controls: function(){
    var controls_div = this.clean_controls();
    var self = this;
    var span = document.createElement('span');
    span.innerHTML = this.index + " з " + this.max_count;

    var add_number_link = function(number_arg){
      var link = document.createElement('a');
      var sign = number_arg < 0 ? '-' : '+';
      var number = Math.abs(number_arg);
      if(number == 1){
        if(sign == '-') link.className = 'prev';
        if(sign == '+') link.className = 'next';
        link.innerHTML = "&nbsp;";
      } else {
        link.innerHTML = sign + number;
      }
      controls_div.appendChild(link);
      link.observe('click', function(){
        self.go_to(self.index + Number.parseInt(sign + number));
        span.innerHTML = self.index + " з " + self.max_count;
      });
    };

    if(this.max_count > this.default_max) {
      add_number_link(-10);
      add_number_link(-5);
    }  
    add_number_link(-1);
    controls_div.appendChild(span);
    add_number_link(1);
    if(this.max_count > this.default_max) {
      add_number_link(10);
      add_number_link(5);
    }
    if(!this.exam) this.build_exit_button(controls_div);
  },

  build_exit_button: function(controls_div){
    var self = this;
    var exit_button = document.createElement('input');
    exit_button.type = 'button';
    exit_button.className = 'exit_button';
    exit_button.value = 'Вийти';
    $(exit_button).observe('click', self.result_screen.bind(self));
    controls_div.appendChild(document.createElement('br'));
    controls_div.appendChild(exit_button);
  },

  build_test: function(data){
    this.element.innerHTML = '';
    this.build_image(data["image"] || '');
    this.build_text(data['text']);
    this.build_answers(data);
  },

  build: function(data){
    var self = this;
    this.legend = this.build_legend();
    this.build_test(data);
    this.build_controls();
    this.show();
  },

  clean_legend: function(){
    var legend_div = $$("#" + this.legend_id).first();
    legend_div.innerHTML = '';
    return legend_div;
  },

  clean_controls: function(){
    var controls_div = $$("#" + this.controls_id).first();;
    controls_div.innerHTML = '';
    return controls_div;
  },

  go_to: function(index){
    if(index >= 1 && index <= this.max_count){
      prev_index = this.index;
      this.index = index;
      this.build_test(this.data[this.index-1]);
      if(this.legend)this.legend.focus(this.index);
      if(this.legend) this.legend.unfocus(prev_index);
    }  
  },

  result_screen: function(){
    this.clean_legend();
    this.clean_controls();
    var right_answers = this.data.select(function(el){ return el['answered_right'] == true;}).length;
    var wrong_answers = this.data.select(function(el){ return el['answered_right'] == false;}).length;
    if(this.exam && wrong_answers > 2){
      this.element.innerHTML = "<b class='fail'>Іспит провалено!</b>";
      return
    }
    if(this.exam && wrong_answers <= 2){
      this.element.innerHTML = "<b class='pass'>Іспит складено!</b>";
      return
    }
    var omitted_answers = this.data.select(function(el){ return el['answered_right'] == undefined;}).length;
    this.element.innerHTML = '<b>Ваш результат:</b></br>Правильно: ' + right_answers +
      '.</br>Не правильно: ' + wrong_answers +
      '.</br>Без відповіді: ' + omitted_answers + ".";
    if(!this.exam){
      var self = this;
      var review_issues_button = document.createElement('input');
      review_issues_button.type = 'button';
      review_issues_button.value = 'Переглянути помилки.';
      this.element.appendChild(document.createElement('br'));
      this.element.appendChild(review_issues_button);
      $(review_issues_button).observe('click', function(){
        var button = this;
        var issues_data = self.data.select(function(data_item){
          return data_item['answered_number'] && !data_item['answered_right'];
        });
        self.start(issues_data);
      })
    }
  },

  next: function(){
    go_to(this.index + 1)
  },

  previous: function(){
    go_to(this.index - 1)
  }
})