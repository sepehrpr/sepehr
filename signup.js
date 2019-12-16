const mysql=require('mysql')
const bodyParser = require('body-parser');
const express = require('express');
const app=express();
var session = require('express-session');



let connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodedb'
});
console.log("start")
//InsertUser("Akbar3",12,"Akbar","Pour","913","jh@gmail.com","12/5/1","123");


//app.get('/signup', function(req, res) {
    //res.redirect('signup');});
 //user='sepehr'
/* export reg fucntion to use outside of this files 
sample:
// mymodule.js
exports.hello = function() {
  return "Hello";
}
const myModule = require('./mymodule');
let val = myModule.hello(); // val is "Hello"

*/
exports.register= function ( username , personalCode , firstName , familyName, phoneNumber,Email,brithDay,Password )
{
connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
	var sql = "INSERT INTO users (userName, perssonalCode, Name, familyName, phoneNumber, Email, brithDay, Password) VALUES ";
	sql += "('" + username +"'," + personalCode +",'" + firstName +"','" + familyName +"','" + phoneNumber + "','" + Email + "','" + brithDay +"','" + Password +"')";//(for sql code "'"+"'" to define string variable: '" + firstName +"'  )
	console.log(sql)

connection.query(sql, function (err, result) {
  if (err) throw err;
  console.log("Number of records inserted: " + result.affectedRows);
});
})
}