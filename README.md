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
This will create an output similar to this one
```
starting tunnel
tunnel connected
Mysql Query starting
connected to DB mediaq.dbs.ifi.lmu.de
closing tunnel
Return value is: 
Number of unique videos is: 84
ssh::end
```
(at the moment, mediaQuery only prints the number of unique, uploaded videos in the MySQL database to the console)
