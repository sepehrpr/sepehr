const mysql=require('mysql')
const bodyParser = require('body-parser');
const express = require('express');
const app=express();
var session = require('express-session');
const bcrypt=require('bcryptjs')


let connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodedb'
});
console.log("start")




exports.register= function ( username , personalCode , firstName , familyName, phoneNumber,Email,brithDay,Password )
{
const user=require('./User')
	let CurrentUser=new user(username);
	CurrentUser.SetInfo(username,personalCode, firstName,familyName,phoneNumber,Email,brithDay,"STD",Password)
	
	setTimeout(() => {
		CurrentUser.Add();
	}, 1000);
/* connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
	var sql = "INSERT INTO users (userName, perssonalCode, Name, familyName, phoneNumber, Email, brithDay, Password) VALUES ";
	sql += "('" + username +"'," + personalCode +",'" + firstName +"','" + familyName +"','" + phoneNumber + "','" + Email + "','" + brithDay +"','" + Password +"')";//(for sql code "'"+"'" to define string variable: '" + firstName +"'  )
	console.log(sql)

connection.query(sql, function (err, result) {
  if (err) throw err;
  console.log("Number of records inserted: " + result.affectedRows);
});
}) */
}