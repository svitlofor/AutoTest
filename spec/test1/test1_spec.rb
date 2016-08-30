# encoding: utf-8
require 'spec_helper'
require 'open-uri'

Capybara.app_host = 'http://www.trafficrules.com.ua'
Capybara.run_server = false


describe "the open", :type => :feature do
  def login
    login_ = "trafficrulestest"
    password_ = "nhfaabrhektcgfhjkm"
    login_ = "test"
    password_ = "12345678qwertyui"

    visit '/UCenter/pages/login/login.jsf?lang=uk_UA'
    within("#loginForm") do
       input = all("input", 1)[0]
       login_input = all('input', 1)[0]
       login_input_id =login_input[:id]
       login_input.set(login_)
       pass_input = all('input', 1)[1]
       pass_input_id =pass_input[:id]
       pass_input.set(password_)
       submit_button = all("button", 1)[0]
       submit_button_id = submit_button[:id]
       submit_button.click
      # fill_in "input[id='#{login_input_id}']", :with => login_
      # fill_in "input[id='#{pass_input_id}']", :with => password_
    end
    #click_button "button[id=\"#{submit_input_id}\"]"
    sleep 3
    save_screenshot("screenshots/login_result.png")
    puts "Logged in successfully!"
  end

  def go_to_topics(topic = "По темах")
    find_link(topic).click
    sleep 3
    save_screenshot("screenshots/go_to_topic_result.png")
    puts "Choose type: #{topic} successfully!"
  end

  def select_topic(number = 0, type = 2)
    radiobuttons = all(".ui-radiobutton")
    radiobuttons[type].click # Тематичні завдання "Сигнал 2014" (Київ)
    radiobuttons[-2].click # Українська мова
    topic_text = find(".ui-selectlistbox-list").all("li")[number].text
    logit topic_text
    find(".ui-selectlistbox-list").all("li")[number].click
    sleep 1

    save_screenshot("screenshots/select_topic_result.png")
    puts "Select topic #{type} #{number} #{topic_text} successfully!"
    topic_text
  end  

  def start
    find("#optform\\:learnAll").click
    sleep 1
    save_screenshot("screenshots/start_result.png")
  end

  def get_image
    img = all("#qForm div[align='center']")[0].all("img")[0]
    img && img["src"]
  end

  def check_topic_folder(type, topic_id, subfolder = nil)
    topic_folder = File.dirname(File.join(__FILE__))
    topic_folder = File.join(topic_folder, "tests")
    topic_folder = File.join(topic_folder, "#{type}")
    Dir.mkdir(topic_folder) unless Dir.exists?(topic_folder)
    topic_folder = File.join(topic_folder, subfolder) if subfolder
    Dir.mkdir(topic_folder) unless Dir.exists?(topic_folder)
    topic_folder = File.join(topic_folder, "#{topic_id}") 
    Dir.mkdir(topic_folder) unless Dir.exists?(topic_folder)
    topic_folder
  end  

  def save_image(type, topic_id, test_id, src)
    topic_folder = check_topic_folder(type, topic_id, 'images')
    image_file_name = File.join(topic_folder, "#{test_id}.gif")
    open(image_file_name, 'wb') do |file|
      file << open(src).read
    end
    image_file_name
  end  

  def parse_test(type_number, topic_number, test_number)
    puts "Parsing test #{test_number}."
    legend = "Коментар до питання "
    test = nil
    save_screenshot("screenshots/current_parsed_test.png")

    within("#qForm") do
      img_src = get_image
      test_image = img_src.nil? ? nil : save_image(type_number, topic_number, test_number, img_src)

      test_answers = []
      test_text = all("fieldset")[0].find("div").text

      rows = all("fieldset")[1].all('table').last.all("tr")
      rows.last.all("td").last.click
      sleep 1

      save_screenshot("screenshots/current_parsed_test_clicked.png")

      rows = all("fieldset")[1].all('table').last.all("tr")
      rows.each do |row|
        records = row.all("td")
#        img_src = records[0].all("img")[0] && records[0].all("img")[0] && ['src']
        check = !!((img = records[0].all("img")[0]) && (img["src"] =~ /img\/check.*/))
        number = records[1].text
        text = records[2].text
        test_answers << {right: check, number: number, text: text}
      end

      test_comment = all("fieldset")[2].text
      test_comment = test_comment[legend.size..-1]
      test = {number: test_number, text: test_text, answers: test_answers, comment: test_comment, image: test_image}

      logit test.to_yaml
    end
    test
  end

  def get_full_topic(number, name, type)
    start
    tests = []
    begin
#      binding.pry

      index = curr_test_number
      Kernel.puts "curr_test_number: #{curr_test_number.inspect}"
      test = parse_test(type, number, index)
      tests << test

      save_topic({type: type, number: number, name: name, tests: tests})

      next_test
    end while index != curr_test_number
    topic = {type: type, number: number, name: name, tests: tests}
  end

  def save_topic(topic)
    topic_folder = check_topic_folder(topic[:type], topic[:number])
    topic_file = File.join(topic_folder, "topic_#{topic[:number]}.yaml")
    File.open(topic_file, "w") do |file|
      file.write(topic.to_yaml)
    end
  end  

  def next_test
    find("#navForm\\:j_idt53").click
    sleep 1
  end

  def curr_test_number
    save_screenshot("screenshots/current_parsed_test_number.png")
    find("#navForm\\:info").text.split(" ")[0].to_i
  end  

  def test_length
    find("#navForm\\:info").text.split(" ")[2].to_i
  end

  def test_plus_ten
    find("#navForm\\:j_idt57").click
    sleep 1
  end  

  def test_plus_five
    find("#navForm\\:j_idt55").click
    sleep 1
  end  

  def exit_topic
    find("#navForm\\:cancelExam").click
    sleep 1
  end

  def exit
    visit("/UCenter/pages/internet/index.jsf")
    sleep 3
    exit_link = find("a[id*=\"\\:sectnExit\"]")
    find("a[id*=\"\\:sectnExit\"]").click
    sleep 1
  end 

  before :each do
    #User.make(:email => 'user@example.com', :password => 'password')
  end

  it "signs me in" do
    begin
      login
      type = 0
      while type < 3
        topics_length = 37
        num = 0
        while num < topics_length
          go_to_topics
          topic = get_full_topic(num+1, select_topic(num, type), type)
          save_topic(topic)
          exit_topic
          num += 1
        end
        type += 1
      end
    rescue => e
      Kernel.puts "ERROR: #{e}\n#{e.backtrace.join("\n")}"
    ensure
      exit
    end
  end
end
