Pre-requisites for this project:

A)Please install the latest versions of:

		Less : http://lesscss.org/

		Git : https://git-scm.com/downloads

		Sourcetree:https://www.sourcetreeapp.com/

		NodeJs:https://nodejs.org/en/

Setup Process

    Configure Git for the first time

        git config --global user.name "username"
        git config --global user.email "username@example.com"
        Working with your repository

    I just want to clone this repository

    If you want to simply clone this empty repository then run this command in your terminal.

        git clone {repository URL}
    My code is ready to be pushed

    If you already have code ready to be pushed to this repository then run this in your terminal.

        cd existing-project
        git init
        git add --all
        git commit -m "Initial Commit"
        git remote add origin {repository URL}
        git push -u origin master
    My code is already tracked by Git

    If your code is already tracked by Git then set this repository as your "origin" to push to.

        cd existing-project
        git remote set-url origin {repository URL}
        git push -u origin master

SetupInstructions to run the project:

1.  sudo npm install -g grunt-cli
2.  sudo npm install -S grunt
4.  sudo npm install grunt-contrib-compress --save-dev
5.  sudo npm install grunt-contrib-watch --save-dev
6.  sudo npm install grunt-contrib-jshint --save-dev
7.  sudo npm install grunt-contrib-uglify --save-dev
8.  sudo npm install grunt-contrib-concat --save-dev
9.  sudo npm install grunt-contrib-cssmin --save-dev
10. sudo npm install grunt-contrib-less --save-dev
11. sudo npm install grunt-express-server --save-dev
12. sudo npm install express
13. sudo npm install http
14. sudo npm install open

If you can see the package.json file and all the other prerequisites has already been installed you just have to run(from within you project's root directory):
   
   sudo npm install
   
    
To execute the project,run from CLI:

   grunt serve 
   
   
Coding & Naming GuideLines:
http://www.runopencode.com/index.php/how-we-code/css-and-less-coding-standards
   