source 'https://rubygems.org'
#ruby "1.9.3", :engine => "jruby", :engine_version => "1.7.19"

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.1'
# Use jdbcsqlite3 as the database for Active Record
gem 'activerecord-jdbcsqlite3-adapter'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.1.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
#gem 'therubyrhino'
# Use jquery as the JavaScript library
gem 'jquery-rails'
# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'turbolinks'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc
gem 'thread_safe'

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

group :development, :test do
	gem 'rspec'#, github: 'rspec/rspec'
	gem 'rspec-core'#, github: 'rspec/rspec-core'
	gem 'rspec-mocks'#, github: 'rspec/rspec-mocks'
	gem 'rspec-expectations'#, github: 'rspec/rspec-expectations'
	gem 'rspec-support'#, github: 'rspec/rspec-support'
	gem 'rspec-rails'
	gem 'poltergeist'
	gem 'phantomjs', require: 'phantomjs/poltergeist'
	gem 'capybara'
	gem 'launchy'
end

group :production do
  gem 'rails_12factor'
  gem 'activerecord-jdbcpostgresql-adapter'
end

gem 'pry_debug'
# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
