# encoding: utf-8
require 'spec_helper'
require 'open-uri'

Capybara.app_host = 'http://www.trafficrules.com.ua'
Capybara.run_server = false


describe "the open", :type => :feature do
  ENTRIES = { topics: "По темах", tickets: "По білетах"}

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

  def go_index
    visit("/UCenter/pages/internet/index.jsf")
    sleep 3
  end

  def go_to_entry(entry)
    go_index
    find_link(ENTRIES[entry]).click
    sleep 1
    save_screenshot("screenshots/go_to_topic_result.png")
    puts "Choose entry: #{entry} successfully!"
  end

  def types_count
    all(".ui-radiobutton").length - 2 # мови 
  end

  def select_type(type = 2)# Тематичні завдання "Сигнал 2014" (Київ)
    item = all(".ui-radiobutton")[type]
    text = item.find(:xpath, "..").find(:xpath, "./following-sibling::td").find("label").text
    item.click
    sleep 1
    puts "Select type #{type} successfully!"
    save_screenshot("screenshots/select_type_#{type}.png")
    text
  end

  def categories_count
    lists = all(".ui-selectlistbox-list")
    return 0 if lists.count == 1
    lists.first.all("li").size
  end

  def select_category(cat_num = 0)
    lists = all(".ui-selectlistbox-list")
    return "" if lists.count == 1
    item = lists.first.all("li")[cat_num]
    item.click
    sleep 1
    puts "Select category #{cat_num} #{item.text} successfully!"
    item.text
  end

  def select_language
    radiobuttons = all(".ui-radiobutton")
    radiobuttons[-2].click # Українська мова
  end

  def topics_count
    save_screenshot("screenshots/topics_count.png")
    all(".ui-selectlistbox-list").last.all("li").size
    5
  end

  def select_topic(number = 0)
    save_screenshot("screenshots/select_topic_#{number}.png")
    item = all(".ui-selectlistbox-list").last.all("li")[number]
    item.click
    Kernel.puts "Select topic #{number} #{item.text} successfully!"
    item.text
  end

  def start
    button = all("#optform\\:learnAll").first || all("#mainForm\\:j_idt62").first
    button.click
    sleep 1
    save_screenshot("screenshots/start_result.png")
  end

  def get_image
    img = all("#qForm div[align='center']")[0].all("img")[0]
    img && img["src"]
  end

  def grant_path(base, dir)
    result = File.join(base, "#{dir}")
    Dir.mkdir(result) unless Dir.exists?(result)
    result
  end

  def check_topic_folder(hash, *subfolders)
    topic_folder = File.dirname(File.join(__FILE__))
    topic_folder = grant_path(topic_folder, "tests")
    topic_folder = grant_path(topic_folder, hash[:entry])
    topic_folder = grant_path(topic_folder, hash[:type])
    topic_folder = grant_path(topic_folder, hash[:category]) if hash[:category]
    subfolders.each { |subfolder| topic_folder = grant_path(topic_folder, subfolder) } if subfolders

    topic_folder
  end

  def save_image(hash, test_id, src)
    topic_folder = check_topic_folder(hash, 'images', "#{hash[:number]}")
    image_file_name = File.join(topic_folder, "#{test_id}.gif")
    open(image_file_name, 'wb') do |file|
      file << open(src).read
    end
    image_file_name
  end

  def save_map(hash)
    topic_folder = File.dirname(File.join(__FILE__))
    topic_folder = grant_path(topic_folder, "tests")
    map_file = File.join(topic_folder, "map.yaml")
    data = {}
    if File.exists?(map_file)
      File.open(map_file, 'r:UTF-8') do |file|
        data = YAML.load(file.read) || {}
      end
    end

    File.open(map_file, "w") do |file|
      file.write(merge_hashes(hash, data).to_yaml)
    end
  end

  def merge_hashes(hash, data)
    data[:entries] = [] unless data[:entries]
    data[:entries] << hash[:entry] unless data[:entries].include?(hash[:entry])

    data[:types] = {} unless data[:types]
    type = data[:types][hash[:type_title]]
    type = data[:types][hash[:type_title]] = [] unless type
    type << hash[:category] unless type.include?(hash[:category]) || !hash[:category] || hash[:category].empty?
    data
  end  

  def parse_test(hash, test_number)
    puts "Parsing test #{test_number}."
    legend = "Коментар до питання "
    test = nil
    save_screenshot("screenshots/current_parsed_test.png")

    within("#qForm") do
      img_src = get_image
      test_image = img_src.nil? ? nil : save_image(hash, test_number, img_src)

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

  def save_topic(hash)
    topic_folder = check_topic_folder(hash)
    topic_file = File.join(topic_folder, "#{hash[:entry]}_#{hash[:number]}.yaml")
    File.open(topic_file, "w") do |file|
      file.write(hash.to_yaml)
    end
  end  

  def next_test
    find("#navForm\\:j_idt57").click
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
    find("#navForm\\:j_idt62").click
    sleep 1
  end  

  def test_plus_five
    find("#navForm\\:j_idt60").click
    sleep 1
  end  

  def exit_topic
    find("#navForm\\:cancelExam").click
    sleep 1
  end

  def exit
    go_index
    exit_link = find("a[id*=\"\\:sectnExit\"]")
    exit_link.click
    sleep 1
  end 

  def get_full_topic(hash)
    start
    tests = []
    begin
#      binding.pry

      index = curr_test_number
      test = parse_test(hash, index)
      tests << test
      hash[:tests] = tests
      save_topic(hash)

      next_test
    end while index != curr_test_number
    topic = hash
  end

  def process_all_topics(entry, type, type_title, category_num = nil )
    Kernel.puts "process_all_topics type: #{type}, category_num: #{category_num.inspect}"
    num = 0
    hash = { entry: entry, type: type, type_title: type_title }
    hash.update(category: select_category(category_num)) if category_num
    save_map(hash)
    topics_size = topics_count
    while num < topics_size
      select_language
      hash.update(number: (num + 1), topic: select_topic(num))
      topic_hash = get_full_topic(hash)
      save_topic(topic_hash)
      exit_topic
      num += 1
      if num < topics_size
        go_index
        go_to_entry(entry)
        select_type(type)
        select_category(category_num) if category_num
      end
    end
  end

  def process_type(entry, type)
    type_title = select_type(type)
    Kernel.puts "type: #{type}, categories_count: #{categories_count.inspect}"
    if categories_count == 0
      process_all_topics(entry, type, type_title)
    else
      cat_num = 0
      categories_size = categories_count
      while cat_num < categories_size
        process_all_topics(entry, type, type_title, cat_num)
        cat_num += 1
        if cat_num < categories_size
          go_index
          go_to_entry(entry)
          select_type(type)
        end
      end
    end
  end

  def process_entries
    ENTRIES.each do |key, v|
      type = 0
      go_to_entry(key)
      Kernel.puts "entry: #{key}, types: #{types_count.inspect}"
      types_size = types_count
      while type < types_size
        process_type(key, type)
        type += 1
        if type < types_size
          go_index
          go_to_entry(key)
        end  
      end
    end      
  end

  before :each do
    #User.make(:email => 'user@example.com', :password => 'password')
  end

  it "signs me in" do
    begin
      login
      process_entries
    rescue => e
        Kernel.puts "ERROR: #{e}\n#{e.backtrace.join("\n")}"
        exit
    rescue
        Kernel.puts "ERROR!!!"
        exit
    ensure
        exit
    end
  end
end
