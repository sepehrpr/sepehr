const express = require('express');
const app=express();

const hbs=require('hbs');
const bodyParser = require('body-parser')
const fs= require('fs')
var session = require('express-session');

let mysql = require('mysql');

let login=false;


conection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'nodedb'
});


let setsession = (req,username,res,callback)=>{
    setTimeout(() => {
        req.session.loggedin = true;
        req.session.username = username;
    }, 2000);
    callback(res); 

}

let redirectpage = (res)=>{
    res.redirect('/home')
    res.end();
}

app.use((req,res,next)=>{
    let time= new Date().toString();
    // console.log(time+' '+ req.url)
    next();
})

app.use(express.static ('public'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


app.set('view engine','hbs');
hbs.registerPartials('views/partials')


app.get('/',(req,res)=>{

    res.render('home',{
        title: 'login Page',
        des: 'this spr site',
        
    });
});
    
app.post('/auth',(req,res)=>{
    if(req.body.uname=='admin'&&req.body.upass=='123' ||
        req.body.uname=='spr'&&req.body.upass=='1234' ||
        req.body.uname=='user'&&req.body.upass=='3210' ){
        req.session.loggedin=true
        req.session.username=req.body.uname;
        if(req.session.username =='admin')
        {
            res.redirect('/adminPage');
        }
        else
        {
            res.redirect('/home');
        }        
       res.end();
    }
    else{
        res.send('please check your pass OR userName');    
        // res.redirect('/')
        res.end();
    }
})

app.get('/about', function(req, res) {
    res.render('about');
});

//app.get('/about',(req,res)=>{
  //  res.send('creat by sepehr');});

app.get('/adminpage',(req,res)=>{
    if(req.session.loggedin==true){
        res.send('welcome '+req.session.username+"you have admin permissions");
    }
    else{
        res.redirect('/');
    }
});

app.get('/home',(req,res)=>{
    if(req.session.loggedin==true){
        res.send('<center>'+'welcome '+req.session.username+'<br>'+'<br> you are user'+'<\center>');
    }
    else{
        res.redirect('/');
    }
});

app.listen(800);