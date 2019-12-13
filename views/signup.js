const mysql=require('mysql')
//const app= express();

function InsertUser( username , personalCode , firstName , familyName, phoneNumber )
{

let connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodedb'
});

//app.get('/signup', function(req, res) {
    //res.redirect('signup');});
 //user='sepehr'



//var sql = "INSERT INTO users (userName, perssonalCode, Name, familyName, phoneNumber, Email, brithDay, Password)VALUES ('aliot', '9512198574', 'ali', 'obady', '09198547462', 'pr@email.com', '12/12/98', '1230')";

connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
	var sql = "INSERT INTO users (userName, perssonalCode, Name, familyName, phoneNumber, Email, brithDay, Password) VALUES ";
	sql += "(" + username +"," + personalCode +"," + firstName +"," + familyName +"," + phoneNumber +"," +'John@some.com'+"," + '12/01/98' +"," + 'hhhh' +")";
	//sql += "('John', 51546456,'John','Johnathan', 989765412365,'John@some.com', '12/01/98', 'hhhh')";
connection.query(sql, function (err, result) {
  if (err) throw err;
  console.log("Number of records inserted: " + result.affectedRows);
});
})
}