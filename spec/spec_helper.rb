$: << File.join(File.dirname(File.dirname(__FILE__)), 'lib')
require 'capybara/rspec'
require 'capybara/poltergeist'
require 'test'
require 'pry_debug'

RSpec.configure do |config|
  #config.include FeatureSpecExtensions, type: :feature

  config.before :suite do
    Capybara.register_driver :poltergeist do |app|
      Capybara::Poltergeist::Driver.new(app, {
        js_errors: true,
        inspector: true,
        phantomjs: ENV["PHANTOMJS_PATH"].gsub("\\", "/"),
        phantomjs_options: ['--load-images=no', '--ignore-ssl-errors=yes'],
        timeout: 120
      })
    end
  end

  config.before :each do
    Capybara.current_driver = :poltergeist
  end
end

def logit(message)
  File.open("output.txt", "a") do |file|
    file.write("<#{Time.now.strftime('%H:%M:%S')}> -> #{message}\n")
  end
end  
