require "bundler/setup"
require 'rake-pipeline'

def pipeline
  Rake::Pipeline::Project.new("Assetfile")
end

desc "Build sproutcore.js"
task :dist do
  puts "Building Sproutcore..."
  pipeline.invoke
  puts "Done"
end