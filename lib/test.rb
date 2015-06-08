require "yaml"
class Test
	attr_reader :text, :right_answer, :answers, :explanation, :image_name, :image_, :id, :hash
	BASE_FOLDER = "tests"
	IMGEST_FOLDER = "images"
	FILE = "tests.yml"

	def initialize(hash)
		[:text, :right_answer, :answers, :explanation, :image_name, :image_, :id].each do |key|
			self.instance_variable_set("@#{key}", attrib[key]) if attrib[key]
		end
		@hash = hash
	end	

	def store
		@id = get_next_id
		tests_file = File.join(BASE_FOLDER, FILE)
		File.open(tests_file, "a") do |f|
			f.write hash.to_yaml
		end	
	end

	def self.get_next_id
		tests_file = File.join(BASE_FOLDER, FILE)
		return 0 unless File.exist?(tests_file)
		File.open(tests_file, "r") do |f|
			all_hash = YAML.load(f.read)
			raise all_hash.inspect
		end	
	end	
end