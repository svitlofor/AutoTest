@echo off

set "PRJ_HOME=%CD%"
set "JRUBY_HOME=%PRJ_HOME%\jruby"
set "JRE_HOME=%PRJ_HOME%\jre6"
set "JAVA_HOME=%JRE_HOME%"
set "PHANTOMJS_HOME=%PRJ_HOME%\phantomjs"
set "PHANTOMJS_PATH=%PRJ_HOME%\phantomjs\phantomjs.exe"

set "PATH=%JRE_HOME%\bin;%JRUBY_HOME%\bin;%PHANTOMJS_HOME%;%PATH%"

echo %JRE_HOME%
echo %JRUBY_HOME%
echo %PATH%

set GEM_HOME=%JRUBY_HOME%\lib\ruby\gems\shared
set JRUBY_OPTS=%JRUBY_OPTS% --1.9

cd "%PRJ_HOME%\AutoTest"