source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 6.0.1.rc1'
# Use sqlite3 as the database for Active Record
gem 'sqlite3', '~> 1.3.7'
# Use Puma as the app server
gem 'puma', '~> 4.2.1'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
# gem 'jbuilder', '~> 2.7'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.5', require: false

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
gem 'rack-cors'

gem 'oj'
gem 'fast_jsonapi'
gem 'sucker_punch' # Backgorund jobs
gem 'active_model_serializers'
gem 'jsonl' # Loading json lines in import rake task
gem 'tty-progressbar' # For rake task console progress bar
gem 'pastel' # Colours the progress bar
gem 'pagy', '~> 3.5' # pagination
gem 'has_scope' # filtering results
gem 'jsonl' # JSON lines for loading scraped content

group :development do
  gem "better_errors"
  gem "binding_of_caller"
end


group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end

group :development do
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
