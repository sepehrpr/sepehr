module.exports = class Database {
    // constructor سازنده کلاس جایی است که فیلد ها را مشخص میکند
    constructor() {
        this.mysql = require('mysql');

        /* 
                this.Host = "localhost";
                this.DB_Name = "spr_post";
                this.DB_User = "root";
                this.DB_Pass = "";
         */

        this.Host = "remotemysql.com";
        this.DB_Name = "Z9zJQqN8im";
        this.DB_User = "Z9zJQqN8im";
        this.DB_Pass = "3clXAamwK1";        

        this.con;
        this.Connect(this.DB_Name);
        console.log("DB Name: " + this.DB_Name);
        
    }

    InitDatabase() {
        console.log("Start Initializing... ");
        try {
            console.log("Creating Database... ");
            this.CreateDatabaseIfNot();
        } catch{ }

    }

    Connect(DB_Name) {
        if (DB_Name)
            this.con = this.mysql.createConnection({
                host: this.Host,
                user: this.DB_User,
                password: this.DB_Pass,
                database: this.DB_Name
            });
        else
            this.con = this.mysql.createConnection({
                host: this.Host,
                user: this.DB_User,
                password: this.DB_Pass
            });
    }



    CreateDatabaseIfNot() {

        var TheResult;
        this.Connect();
        const sql = "SHOW DATABASES LIKE '" + this.DB_Name + "'";
        //console.log(sql);
        this.con.query(sql, function (err, result, fields) {
            if (err) {
                console.log("Check Error: " + err);
            }
            if (result.length > 0) {
                console.log("Database Exists");
                //console.log(result);
            }
            else {
                console.log("Database Must Be Created")
            }
            TheResult = result;

        });
        setTimeout(() => {
            if (!TheResult.length > 0) {
                const sql = "CREATE DATABASE " + this.DB_Name;
                console.log(sql);
                this.con.query(sql, function (err, result, fields) {
                    TheResult = result;
                    if (err) console.log("Creation Error: " + err);
                    else {
                        console.log("Database Created");
                    }
                });
            }
            if (!TheResult.length > 0) {
                setTimeout(() => {
                    this.CreateTables();
                }, 3000);
            }
        }, 1500);
    }

    CreateTables() {
        this.Connect(this.DB_Name);
        this.CreateUsersTable();
        this.CreatePostsTable();
        this.CreateCommentsTable();
        this.CreateUploadedFilesTable()
    }

    CreateUsersTable() {

        var sql = "CREATE TABLE Users (";
        //sql += "id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,";
        sql += "UserName VARCHAR(15) CHARACTER SET utf8 COLLATE utf8_persian_ci  PRIMARY KEY,";
        sql += "PersonalCode INT(10) UNSIGNED ,";
        sql += "FirstName VARCHAR(30) CHARACTER SET utf8 COLLATE utf8_persian_ci  NOT NULL,";
        sql += "LastName VARCHAR(30) CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL,";
        sql += "PhoneNumber VARCHAR(30) NOT NULL,";
        sql += "Email VARCHAR(50),";
        sql += "BrithDate DATETIME DEFAULT CURRENT_TIMESTAMP,";
        sql += "Password VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_persian_ci ,";
        sql += "UserType VARCHAR(3))";
        this.con.query(sql, function (err, result) {
            if (err) {
                console.log("Create Table Error: " + err);
            }
            else {
                if (result) {
                    console.log("Users Table Created.")
                }
            }
        });


    }

    CreatePostsTable() {
        this.con = this.mysql.createConnection({
            host: this.Host,
            user: this.DB_User,
            password: this.DB_Pass,
            database: this.DB_Name
        });
        var sql = "CREATE TABLE Posts (";
        sql += "PostID INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,";
        sql += "UserName VARCHAR(15) CHARACTER SET utf8 COLLATE utf8_persian_ci ,";
        // sql += "PersonalCode INT(10) UNSIGNED ,";
        sql += "PostText VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_persian_ci  NOT NULL,";
        sql += "PostFile VARCHAR(30))";
        this.con.query(sql, function (err, result) {
            if (err) {
                console.log("Create Posts Table Error: " + err);
            }
            else {
                if (result) {
                    console.log("Posts Table Created.")
                }
            }
        });


    }

    CreateCommentsTable() {
        this.con = this.mysql.createConnection({
            host: this.Host,
            user: this.DB_User,
            password: this.DB_Pass,
            database: this.DB_Name
        });
        var sql = "CREATE TABLE Comments (";
        sql += "CommentID INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,";
        sql += "PostID INT(6) UNSIGNED ,";
        sql += "UserName VARCHAR(15) CHARACTER SET utf8 COLLATE utf8_persian_ci ,";
        // sql += "PersonalCode INT(10) UNSIGNED ,";
        sql += "CommentText VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL)";
        this.con.query(sql, function (err, result) {
            if (err) {
                console.log("Create Comments Table Error: " + err);
            }
            else {
                if (result) {
                    console.log("Comments Table Created.")
                }
            }
        });


    }

    CreateUploadedFilesTable() {
        this.con = this.mysql.createConnection({
            host: this.Host,
            user: this.DB_User,
            password: this.DB_Pass,
            database: this.DB_Name
        });
        var sql = "CREATE TABLE UploadFiles (";
        sql += "UploadFileID INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,";
        sql += "PostID INT(6) UNSIGNED ,";
        sql += "UserName VARCHAR(15) CHARACTER SET utf8 COLLATE utf8_persian_ci ,";
        sql += "UploadFileText VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL)";
        this.con.query(sql, function (err, result) {
            if (err) {
                console.log("Create UploadFile Table Error: " + err);
            }
            else {
                if (result) {
                    console.log("UploadFile Table Created.")
                }
            }
        });


    }
}