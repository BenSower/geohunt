mediaQuery
==========
A very basic nodejs-project used to query the MySQL-DB of a MediaQ server [for more info click here](http://mediaqv3.cloudapp.net/MediaQ_MVC_V3/).

If needed (at the moment the default setting) mediaQuery automatically creates a SSH tunnel to allow the client to bypass network restrictions without the need of an external tunnel. This is necessary to cope with the good practice of "hiding" a database from the web.

Installation:

1. Install [nodejs](http://nodejs.org/)
2. checkout git from ```https://github.com/BenSower/mediaquery.git```
3. Open a console/terminal/shell and enter git directory
4. run ```npm install``` to download and install all necessary dependencies 
5. Fill in all needed information in config.js
6. run ```npm start```
7. check http://localhost:3000 if you can see something like "Mediaquery v 1.0"
8. stop the server (e.g. by pressing "ctrl + c" in the terminal/console
9. run ```node backend/main.js```
This will create an output similar to this one
```
Creating ssh tunnel to remote.cip.ifi.lmu.de
Connection not yet established, waiting and trying again. Attempt :1/10
Tunnel connected
Trying to connect to Mysql DB...
Connected to Mysql DB on mediaq.dbs.ifi.lmu.de
Current number of uploaded videos is: 129
```
(at the moment, mediaQuery only prints the number of unique, uploaded videos in the MySQL database to the console)
