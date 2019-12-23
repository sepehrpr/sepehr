const express = require('express');
const app = express();
const bcrypt = require('bcryptjs')
const fileupload = require('express-fileupload')
const hbs = require('hbs');
const bodyParser = require('body-parser')

var fs = require('fs');

var session = require('express-session');
var path = require('path');

let mysql = require('mysql');


app.set('view engine', 'hbs');
hbs.registerPartials('views/partials')

app.get('/about', function (req, res) {
    res.render('about');
});

app.get('/', function (req, res) {
    //const Database=require('./Database')
    // let DB=new Database();
    //DB.InitDatabase();
    res.render('login');
});


app.get('/signup', function (req, res) {
    res.render('signup');
});

/* app.get('/teacher', function (req, res) {
    res.render('teacher');
}); */

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

app.get('/teacher', (re, res) => {
    res.redirect('login')
});

app.post('/authenticate', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        const User = require('./User')
        CurrentUser = new User(username);
        setTimeout(() => {
            CurrentUser.SayHello();

            if (password == CurrentUser.Password) {
                let Message = "";
                if (CurrentUser.UserType == "TCH") {
                    res.redirect('teacher')
                    res.send("its TCH")
                }
                if (CurrentUser.UserType == "STD") {
                    //Message = "دانشجوی "; response.send(Message + " گرامی " + CurrentUser.FirstName + " " + CurrentUser.LastName + " " + CurrentUser.Email + " خوش آمدید")
                    res.redirect('student')
                    res.send("its STD")
                }
                setTimeout(() => {
                    var Post = require("./Post")
                    Post = new Post();
                    Post.UserName = CurrentUser.UserName;
                    Post.PostText = "ورود به سایت"
                    setTimeout(() => {
                        Post.Add();
                    }, 500)

                }, 1000)
            }
            else {

                Message = " گرامی لطفا در وارد کردن نام کاربری و گذرواژه دقت فرمایید."
                response.send()
            }
        }, 1000)
    }
    else {
        response.send("کاربر گرامی برای ورود، وارد کردن نام کاربری و گذرواژه الزامی است.")
    }

});

/* app.post('/authenticate', function (request, response) {
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
                //console.log("The Res : " + a)
                if (a == false)
                    response.send("کاربر گرامی نام کاربری یا گذر واژه صحیح نیست");
                   // res.redirect('/');
                else {
                     //response.send(username + " " + ' خوش آمدید ')

                  //  res.redirect('/teacher');
                  response.redirect('/')
                }
            } else {
              //  response.send("نام کاربری یا گذر واژه صحیح نیست");
              response.redirect('/home')
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
}); */
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

//response.render('teacher')



app.listen(800);
