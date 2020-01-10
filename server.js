const express = require('express');
const app = express();
const bcrypt = require('bcryptjs')
const fileupload = require('express-fileupload')
const hbs = require('hbs');
const http = require('http');
const bodyParser = require('body-parser')
//const upload=require('./upload')
var fs = require('fs');

var session = require('express-session');
var path = require('path');

let mysql = require('mysql');

const Database = require("./Database")
var DB = new Database();
//DB.InitDatabase();
//DB.CreateTables();

const User = require('./Users')
var CurrentUser = new User("Temp");

const Post = require('./Post');
const Comment = require("./Comment");

app.set('view engine', 'hbs');
hbs.registerPartials('views/partials')

//for read from other HBS files(signup.hbs)
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(fileupload());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.render('login');
});

app.get('/about', function (req, res) {
    res.render('about');
});

app.get('/signup', function (req, res) {
    res.render('signup');
});


app.post('/setPost', async (request, response) => {

    var txtpost = request.body.txtPost;

    var CurrentPost = new Post();
    CurrentPost.PostText = await txtpost;
    CurrentPost.UserName = await CurrentUser.UserName;
    await CurrentPost.Add();
    console.log("Post Text:" + CurrentPost.PostText)
    console.log("Post ID:" + CurrentPost.PostID)

    response.redirect("./viewpost?id=" + CurrentPost.PostID)
});

app.post('/setComment', async (request, response) => {

    var commentText = request.body.txtComment;
    var postID = request.body.txtPostID;

    var tmpComment = await new Comment();
    tmpComment.UserName = await CurrentUser.UserName;
    tmpComment.PostID = await postID;
    tmpComment.CommentText = await commentText;
    await tmpComment.AddToBank();
    response.redirect("/viewpost?id=" + postID)
});

app.get('/getAllPosts', async (req, res) => {
    const Post = require("./Post")
    let PostsList = await Post.getAllPosts();
    let Message = "";
    console.log("Count= " + PostsList.length);
    try {
        Message = "لیست پست های گذاشته شد<BR>";
        await PostsList.forEach(element => {
            console.log("item! ");
            Message += "<a class='buttons' href='/viewpost?id=" + element.PostID + "'>";
            Message += "پست " + element.PostID + ": توسط استاد : " + element.UserName + "  " + element.PostText + " </a> <br><br>";
        });
    }
    catch{
        Message = PostsList;
    }
    console.log("Messsage = " + Message);
    await res.render('viewPostsList', {
        TheList: Message
    });
    console.log("render done!");

});

app.get('/viewpost', async (request, response) => {
    var id = request.query.id;
    console.log("Start id = " + id);
    var thePost = await Post.getPost(id);
    console.log("Post got = " + "پست شماره " + thePost.PostID + " :\n" + thePost.PostText);
    const PostValue = "پست شماره " + thePost.PostID;
    //await PostValue.replace(' ', '%20')

    let CommentsList = await Comment.getAllComments(thePost.PostID)
    let PostComments = "";
    console.log("Count= " + CommentsList.length);
    try {
        PostComments = "<BR>کامنت ها:<BR>";
        await CommentsList.forEach(element => {
            console.log("item! ");
            PostComments += "<input type='text' value='" + element.UserName + ":" + element.CommentText + "' class='commentsStyle'></input><br>";
            //Message += "<input type='text' class='buttons' value='" + element.UserName + ":" + element.CommentText + "'>";
        });
    }
    catch{
        PostComments = CommentsList;
    }
    console.log("Messsage = " + PostComments);

    let UserOptions = "";
    if (CurrentUser.UserType == "TCH") {
        UserOptions += "<form action='/upload' method='POST' enctype='multipart/form-data'";
        UserOptions += " style='width: 90%; align-items: center;font-family: 'b traffic'; direction: rtl;'>";
        UserOptions += "<p> فایلی که میخواهید بارگذاری شود را انتخاب کنید</p><br>";
        UserOptions += "<input type='file' name='txtFile' class='messages' style='background-color: darkslategray;' placeholder=' فایل بارگذاری ' required>";
        UserOptions += "<input type='submit' value='بارگذاری' class='buttons' style='width: 40%;'>";
        UserOptions += "</form>";
    }

    const params = {
        PageTitle: PostValue,
        PostID: thePost.PostID,
        PostText: thePost.PostText,
        TeacherName: thePost.UserName,
        Comments: PostComments,
        Options: UserOptions
    }

    console.log("Params:" + params);
    await response.render('viewPost', params);
    console.log("render done!")
});

app.get('/spr', async (request, res) => {
    var id = request.query.id;
    console.log("Start id = " + id);
    const Post = require("./Post")
    var thePost = await Post.getPost(14);
    console.log("Post got = " + "پست شماره " + thePost.PostID + " :\n" + thePost.PostText);
    const PostValue = "پست شماره " + thePost.PostID + " :<BR>" + thePost.PostText;
    //await PostValue.replace(' ', '%20')
    const params = {
        PageTitle: "پست شماره " + thePost.PostID,
        PostID: thePost.PostID,
        PostText: thePost.PostText,
        TeacherName: thePost.UserName,
        message: PostValue
    }
    console.log("Params:" + params);
    await res.render('viewPost', params);
    console.log("render done!")
})

app.get('/uploader', async (request, res) => {
    res.render("uploader")
})

app.post('/upload', async (request, result) => {
    if (!request.files) {
        result.send("No File");
    }
    var postID = "0";
    postID = request.body.txtPostID;
    console.log(postID)
    let txtFile = request.files['txtFile'];
    console.log(txtFile);
    txtFile.mv('./uploaded/P_'+ postID +'_' + txtFile.name , (err) => {
        if (err) {
            console.log("Error Uploading:" + err)
            result.send("Error Uploading:" + err)
        }
        else {
            console.log("Uploaded OK")
            result.send("Uploaded OK")
        }
    })
})

app.post('/authenticate', async (request, response) => {
    var username = await request.body.username;
    var password = await request.body.password;
    console.log("Username: " + username + " Password:" + password);
    if (username && password) {
        console.log("Checking...");
        CurrentUser.UserName = await username;
        console.log("User Name: " + CurrentUser.UserName);
        await CurrentUser.GetInfo();
        console.log("Last Name: " + CurrentUser.LastName);
        CurrentUser.SayHello();

        if (bcrypt.compareSync(password, CurrentUser.Password)) {
            let Message = "";
            let Title = "";
            switch (CurrentUser.UserType) {
                case "TCH":
                    Title = "صفحه استاد"
                    Message = "استاد گرامی " + CurrentUser.FirstName + " " + CurrentUser.LastName + " خوش آمدید";
                    Message += "<BR><a class='buttons' href=\"/getAllPosts\">برای دیدن همه پستها کلیک کنید </a>"
                    Message += "<BR><input type='text' name='txtPost' class='messages' style='height:150px; background-color: antiquewhite color: #000000;' placeholder='متن پست خود را اینجا را بنویسید' required >";
                    Message += "<BR><input type='submit' value='post' class='buttons' style='width: 40%;'></input>"
                   // Message += "<BR><a class='buttons' href='/uploader'>آپلود فایل</a>"
                    break;

                case "STD":
                    Title = "صفحه دانشجو"
                    Message = "دانشجوی  گرامی " + CurrentUser.FirstName + " " + CurrentUser.LastName + " خوش آمدید";
                    Message += "<BR><a class='buttons' href=\"/getAllPosts\">برای گذاشتن نظر خود کلیک کنید<br> </a>"
                    break;

                case "ADM":
                    Title = "صفحه مدیر سایت"
                    Message = "مدیر  گرامی " + CurrentUser.FirstName + " " + CurrentUser.LastName + " خوش آمدید";
                    Message += "<BR><a class='buttons' href=\"/posts\">برای مدیریت اطلاعات کلیک کنید<br> </a>"
                    break;

                default:
                    Message = "کاربر نامشخص " + CurrentUser.FirstName + " " + CurrentUser.LastName + " خوش آمدید";
                    Message += "<BR><a class='buttons' href=\"/\">برای بازگشت کلیک کنید<br> </a>"
                    break;
            }
            const params = {
                PageTitle: Title,
                Options: Message
            }
            console.log("Params:" + params);
            response.render('switchboard', params);
            /*
                این قسمت را نوشتم تا هر بار کسی وارد سایت میشود یک پست گذاشته شود (مانند لاگ برای ورود) اما دیگر کاربرد ندارد
                اگر تونستم باید یک جدول لاگ هم درست کنم و این دستورات در اون جدول بنویسه
                                var Post = require("./Post")
                                var tmpPost = new Post();
                
                                var Comment = require("./Comment")
                                var tmpComment = new Comment();
                
                                setTimeout(() => {
                                    tmpPost.UserName = CurrentUser.UserName;
                                    tmpPost.PostText = "ورود به سایت"
                                    setTimeout(() => {
                                        tmpPost.Add();
                                        setTimeout(() => {
                                            tmpComment.UserName = CurrentUser.UserName;
                                            tmpComment.PostID = tmpPost.PostID
                                            tmpComment.CommentText = "ورود به سایت انجام شد"
                                            setTimeout(() => {
                                                tmpComment.Add();
                                            }, 500)
                
                                        }, 1000)
                                    }, 500)
                                }, 1000)
                                */
        }

        else {
            console.log("Bad User name or password")
            Message = "کاربر گرامی لطفا در وارد کردن نام کاربری و گذرواژه دقت فرمایید."
            response.send(Message)
        }
    }
    else {
        console.log("empty username or password")
        response.send("نام کاربری یا پسورد خالی است")
    }
});

app.post('/register', async (request, response) => {

    // use bodyparser for read user values for reg by name as signup.hbs

    CurrentUser.UserName = await request.body.username;
    CurrentUser.PersonalCode = request.body.personalCode;
    CurrentUser.FirstName = request.body.firstName;
    CurrentUser.LastName = request.body.familyName;
    CurrentUser.PhoneNumber = request.body.phoneNumber;
    CurrentUser.Email = request.body.Email;
    CurrentUser.BrithDate = await request.body.brithDay;
    CurrentUser.Password = await request.body.Passwords;
    CurrentUser.UserType = "STD";

    let salt = bcrypt.genSaltSync(10)
    CurrentUser.Password = await bcrypt.hashSync(CurrentUser.Password, salt)
    let Message = "";
    let Title = "";
    console.log("Start ADD");
    let result = await CurrentUser.Add();
    console.log("End ADD");
    console.log("Res:");
    console.log(result);
    if (CurrentUser.Authenticated) {
        Title = "ثبت نام موفق"
        Message = "کاربر گرامی " + CurrentUser.FirstName + " " + CurrentUser.LastName + " ثبت نام شما انجام شد";
        Message += "<BR><a class='buttons' href='/'>برای ورود کلیک کنید </a>"
        const params = {
            PageTitle: Title,
            Options: Message
        }
        console.log("Params:" + params);
        response.render('messenger', params);
    }
    else {
        Title = "ثبت نام ناموفق"
        Message = "\n " + "ثبت نام انجام نشد نام کاربری دیگری انتخاب کنید ";
        //Message += "<button onclick='goBack()'>برای ویرایش کلیک کنید</button>";
        //Message += "<script> function goBack() { window.history.back();}</script>";
        const params = {
            PageTitle: Title,
            Options: Message
        }
        console.log("Params:" + params);
        response.render('messenger', params);
    }

});

app.listen(process.env.PORT || 800);
console.log("Server is running at port: " + (process.env.PORT || 800));