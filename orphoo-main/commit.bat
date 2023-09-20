rd /S /Q .\build
xcopy /R /E orpho-react\build .\build\
git add .
git commit -m init
git push heroku master