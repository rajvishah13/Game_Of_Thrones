# Game_Of_Thrones
A full stack assignment built using Rest API, MongoDB and Node.js

Tools needed to run and test app
Nodejs, npm, express, nodemon

Using the api (I suggest to use postman to test rest end points)
below end points have been designed and working according to given
assignment requirement

GET localhost:5000/display to display all battles
POST localhost:5000/display to add a battle
GET localhost:5000/id/(battle id) to check on one of the battles
DELETE localhost:5000/delete/(battle id) to remove one of the battles
GET localhost:5000/display/locations to see all the locations of battles
GET localhost:5000/display/count to count the total number of battles
GET localhost:5000/display/search?king=Robb Stark&location=Darry&type=pitched battle to search a specific battle given the location, type and king of the battle

Additional:
GET localhost:5000/display/stats to see the statistics of the most active attacker king, defender king or the region. 
