module.exports = class Post {
    constructor() {
        this.PostID = "";
        this.UserName = "";
        this.PostText = "";
        this.PostFile = "";

        var Database = require('./Database');
        this.DB = new Database();
        this.GetInfo();
    }

    GetInfoFromBank() {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM Posts WHERE PostID ='" + this.PostID + "'";
            console.log(sql)
            var Database = require('./Database');
            var DB = new Database();
            DB.con.query(sql, function (err, result, fields) {
                DB.con.end();
                if (err) {
                    console.log("Get Comment Info Error: " + err);
                    reject(err);
                }
                else {
                    console.log(result);
                    resolve(result);
                }
            });
        })
    }

    async GetInfo() {
        let resRows = await this.GetInfoFromBank();
        console.log(resRows);
        try {
            this.PostID = resRows[0].PostID;
            this.UserName = resRows[0].UserName;
            this.PostText = resRows[0].PostText;
            this.PostFile = resRows[0].PostFile;
            this.DB.con.end();
        }
        catch{ }
    }

    AddToBank() {
        return new Promise((resolve, reject) => {
            console.log("Adding Post");
            var sql = "INSERT INTO Posts (UserName, PostText, PostFile) VALUES ";
            sql += "('" + this.UserName + "','" + this.PostText + "','" + this.PostFile + "')"; //(for sql code "'"+"'" to define string variable: '" + UserName +"'  )
            console.log(sql)
            var Database = require('./Database');
            var DB = new Database();
            DB.con.query(sql, function (err, result, fields) {
                DB.con.end();
                if (err) {
                    console.log("Adding Comment Error: " + err);
                    reject(err);
                }
                else {
                    console.log(result);
                    resolve(result);
                }
            });
        })
    }

    async Add() {
        var TheResult = await this.AddToBank();
        try {
            this.PostID = await TheResult.insertId;//این آی دی در هنگام افزودن رکورد به پست جاری داده شده است
        }
        catch{ }
    }


    static getPost(PostID) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM Posts WHERE PostID ='" + PostID + "'";
            var Database = require('./Database');
            let DB = new Database();
            DB.con.query(sql, function (err, result, fields) {
                DB.con.end();
                if (err) {
                    console.log("Get List Query Error: " + err);
                    reject(err);
                }
                else {
                    console.log(result);
                    resolve(result[0]);
                }
            });
        })
    }

    static getAllPosts() {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM Posts";
            var Database = require('./Database');
            let DB = new Database();
            DB.con.query(sql, function (err, result, fields) {
                DB.con.end();
                if (err) {
                    console.log("Get List Query Error: " + err);
                    reject(err);
                }
                else {
                    console.log(result);
                    resolve(result);
                }
            });
        })
    }
}