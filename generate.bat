jruby -S bin/rails generate scaffold Category name:string
jruby -S bin/rails generate scaffold Topic number:integer text:text
jruby -S bin/rails generate scaffold Ticket number:integer category:references
jruby -S bin/rails generate scaffold Test image:string text:text answers:text right_answer:integer comment:text ext_comment:text
jruby -S bin/rails g model TicketTest ticket:references test:references
jruby -S bin/rails g model TopicTest topic:references test:references

;rem bin/rails generate scaffold Test game:string score:integer references
;rem bin/rails g model ProductCategory product:references category:references

pause