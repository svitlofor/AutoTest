# encoding: utf-8
require 'json'
require 'yaml'

class YamlToJson
	BASIC_PATH = File.dirname(__FILE__)

	attr_accessor :data, :yaml_file_name, :json_file_name

	def initialize(yaml_file_name=nil, json_file_name=nil)
		@yaml_file_name = yaml_file_name
		@json_file_name = json_file_name
	end

	def add_basic_path
		@yaml_file_name = File.join(BASIC_PATH, yaml_file_name)
		@json_file_name = File.join(BASIC_PATH, json_file_name)
	end	

	def read_yaml(yaml_file_name_=nil)
		File.open(yaml_file_name_ || @yaml_file_name, 'r:UTF-8') do |file|
			@data = YAML.load(file.read)
		end	
	end
	
	def to_json
		@data.nil? ? "{}" : @data.to_json
	end

	def self.convert_file_name(yaml_file_name)
		"#{yaml_file_name.split('.').first}.js"
	end

	def write_json(json_file_name_=nil)
		@json_file_name = json_file_name_ || @json_file_name
		@json_file_name = convert_file_name(yaml_file_name) if @json_file_name.nil?
		create_folders
		var_name = File.basename(@json_file_name).split(".").first
		File.open(@json_file_name, 'w:UTF-8') do |file|
			file.write("var #{var_name} = #{to_json};")
		end	
	end	


	def convert(yaml_file_name_=nil)
		@yaml_file_name = yaml_file_name_ unless yaml_file_name_.nil?
		read_yaml(yaml_file_name)
		write_json
	end

	def create_folders(folder=nil)
		iter_folder = folder || File.dirname(@json_file_name)
		folders = []
		while(!Dir.exists?(iter_folder)) do
			folders << iter_folder
			iter_folder = File.dirname(iter_folder)
		end
		folders.reverse.each {|folder| Dir.mkdir(folder)}
	end

	def self.convert_folder(folder_from, folder_to)
#		folder_from = File.join(BASIC_PATH, folder_from) unless folder_from.include?(BASIC_PATH)
#		folder_to = File.join(BASIC_PATH, folder_to) unless folder_to.include?(BASIC_PATH)
#		folder_from = File.absolute_path(folder_from)
#		folder_to = File.absolute_path(folder_to)

		puts "Converting folder #{folder_from} to folder #{folder_to}"
		Dir.entries(folder_from).each do |name| 
			next if ['.', '..', 'images'].include?(name)
			full_path_from = File.join(folder_from, name)
			full_path_to = File.join(folder_to, name)
			if File.directory?(full_path_from)
				convert_folder(full_path_from, full_path_to)
				next
			end
			puts "Converting... #{full_path_from} to #{full_path_to}"
			self.new(full_path_from, convert_file_name(full_path_to)).convert
		end
	end

	def self.create_topics_file(folder_from, file_to)
		all_topics = []
		Dir.entries(folder_from).each do |name| 
			next if ['.', '..', 'images'].include?(name)
			full_path_from = File.join(folder_from, name)
			if File.directory?(full_path_from)
				next
			end
			puts "Processing... #{full_path_from}"
			obj = self.new(full_path_from, convert_file_name(file_to))
			obj.read_yaml
			obj.data.delete(:tests)
			all_topics << obj.data
		end
		json_obj = self.new(folder_from, file_to)
		json_obj.data = all_topics.sort{|a,b| a[:number].to_i <=> b[:number].to_i}
		json_obj.write_json
	end	
end	

YamlToJson.convert_folder(File.absolute_path('tests/'), File.absolute_path('db/tests'))
#YamlToJson.convert_folder(File.absolute_path('tests/'), File.absolute_path('db/tests'))
#YamlToJson.new('../tests/topics/topics_2.yaml', 'tests/json/topics/topics_2.json').convert
YamlToJson.create_topics_file(File.absolute_path('tests/topics/'), File.absolute_path('db/tests/topics/topics.js'))
