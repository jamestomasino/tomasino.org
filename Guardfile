notification :off

guard :bundler do
  watch('Gemfile')
end

guard 'compass' do
  watch(%r{(.*)\.s[ac]ss$})
end

guard 'livereload' do
  watch(%r{.+\.(css|js|html?|php|inc)$})
end
