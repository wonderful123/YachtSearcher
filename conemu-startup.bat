start "YachtSearcher" "C:\Program Files\ConEmu\ConEmu64.exe" -Dir C:\Users\Josh\programming\YachtSearcher -runlist ^> cmd -cur_console:t:Rails /k "c:\Ruby26\bin\rails s" ^|^|^| cmd -cur_console:d:C:\Users\Josh\programming\YachtSearcher\frontend -cur_console:t:Ember /k "ember s" ^|^|^| cmd -cur_console:d:C:\Users\Josh\programming\YachtSearcher\scraper\data\images -cur_console:t:HTTP /k "python -m http.server 80"
