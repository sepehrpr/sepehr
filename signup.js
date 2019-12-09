var mysql = require('mysql');
//const app = express();
var session=require('express-session')


let redirectpage = (res)=>{
  res.redirect('/home')
  res.end();
}

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:'nodedb'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  let un=req.body.userName;
  let pass=req.body.password;
  if(un&&pas){
    connection.query('select * from users wher un=? and password=?',[userName],[password],(error,results,fields)=>{
      if(results.length>0){
        Request.session.logedin=true;
        Request.session.userName=userName;
        response.redirect('/home')
      }
      else{
        response.send('check your username or password')
      }
      response.end();
    });
  }
  else {
		response.send('Please enter Username and Password!');
		response.end();
	}
    console.log("Database created");
  });
