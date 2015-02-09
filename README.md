mediaQuery
==========
A very basic nodejs-project used to query the MySQL-DB of a MediaQ server [for more info click here](http://mediaqv3.cloudapp.net/MediaQ_MVC_V3/).

If needed (at the moment the default setting) mediaQuery automatically creates a SSH tunnel to allow the client to bypass network restrictions without the need of an external tunnel. This is necessary to cope with the good practice of "hiding" a database from the web.

Installation:

1. Install [nodejs](http://nodejs.org/) and a local version of [mongodb](http://www.mongodb.org/) 
2. checkout git from ```https://github.com/BenSower/geohunt.git```
3. Open a console/terminal/shell and enter the geohunt directory
4. run ```npm install``` to download and install all necessary backend dependencies 
5. run ```node node_modules/bower/bin/bower install``` to download and install all necessary frontend dependencies 
(hint, since this command was also added to the postinstall-scripts in package.json, services like heroku will execute this command automatically)
5. Fill in all needed information in config.js
6. run ```npm start```
7. check http://localhost:3000 if you can see the welcome screen



If you want to, you can also insert a few example tasks to the db by executing ```node backend/insertBasicTasks.js```
