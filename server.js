const express = require('express');
const app = express();
const bcrypt = require('bcryptjs')

const hbs = require('hbs');
const bodyParser = require('body-parser')

var session = require('express-session');
var path = require('path');

let mysql = require('mysql');


app.set('view engine', 'hbs');
hbs.registerPartials('views/partials')

app.get('/about', function (req, res) {
    res.render('about');
});

app.get('/', function (req, res) {
    res.render('login');
});

/*
app.get('/',(req,res)=>{

    res.render('Login',{
        title: 'login Page',
        des: 'this spr site',
        
    });
});
*/
app.get('/signup', function (req, res) {
    res.render('signup');
});

//for read from other HBS files(signup.hbs)

app.use(express.static('public'));

app.use(bodyParser.json());


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodedb'
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


app.post('/authenticate', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;

    //bcrypt.compareSync(password,hashedPassword)

    //console.log("Salam " + username+" "+ password)



    if (username && password) {
        connection.query('SELECT * FROM users WHERE userName = ? ', [username], function (error, results, fields) {
            if (results.length > 0) {
                console.log(results)
                let hashpass = results[0].Password;
                console.log(password + '   ' + hashpass)
                //bcrypt.genSaltSync(10,(err,salt)=>{bcrypt.hash(password,salt,(err,hash)=>{})});
                //hash='$2a$10$W/AOrTA/0V92VbkGOpTqHeK5gUNsHUgLBn6O.ijMGxC/1QOvfN7y.'

                let a = bcrypt.compareSync(password, hashpass)
                console.log("The Res : " + a)
                if(a==false)
                response.send("کاربر گرامی نام کاربری یا گذر واژه صحیح نیست");
                else{
                    response.send(username+" "+' خوش آمدید ')
                }

            } else {
                response.send("نام کاربری یا گذر واژه صحیح نیست");
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});
//let username=req.bodyParser.username;
//let password=req.bodyParser.password;
//conection.query('select * from user where username = sepehr',[username,password],(err,result,field)=>{console.log(result);});
app.post('/register', (request, response) => {

    // use bodyparser for read user values for reg by name as signup.hbs

    let username = request.body.username;
    let personalCode = request.body.personalCode;
    let firstName = request.body.firstName;
    let familyName = request.body.familyName;
    let phoneNumber = request.body.phoneNumber;
    let Email = request.body.Email;
    let brithDay = request.body.brithDay;
    let Passwords = request.body.Passwords;

    let salt = bcrypt.genSaltSync(10)

    let hashedPassword = bcrypt.hashSync(Passwords, salt)

    response.send("\n" + "Your Name: " + username + "  /  " + "   your Email address:  " + Email + "\n " + "ثبت نام شما با موفقیت انجام شد ");

    //mymoudule import reg fucntion from  signup.js
    const myModule = require('./signup');

    myModule.register(username, personalCode, firstName, familyName, phoneNumber, Email, brithDay, hashedPassword);
});

app.listen(800);
