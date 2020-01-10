module.exports = class Comment {
    constructor(CommentID) {
        this.CommentID = CommentID;
        this.PostID = 0;
        this.UserName = "";
        this.CommentText = "";

        var Database = require('./Database');
        this.DB = new Database();
        this.GetInfo();
    }


    AddToBank() {
        return new Promise((resolve, reject) => {
            console.log("Adding Comment");
            var sql = "INSERT INTO  Comments (PostID, UserName, CommentText) VALUES ";
            sql += "(" + this.PostID + ",'" + this.UserName + "','" + this.CommentText + "')"; //(for sql code "'"+"'" to define string variable: '" + UserName +"'  )
            console.log(sql)
            this.DB.con.query(sql, function (err, result) {
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
        await this.AddToBank()
        this.DB.con.end();
    }

    GetInfoFromBank() {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM Comments WHERE PostID ='" + this.PostID + "'";
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
                    console.log("Number of records inserted: " + result.affectedRows);
                }
            });
        })
    }

    async GetInfo() {
        let resRows = await this.GetInfoFromBank();
        console.log(resRows);
        try {
            this.PostID = resultRows[0].PostID;
            this.CommentID = resultRows[0].CommentID;
            this.UserName = resultRows[0].UserName;
            this.CommentText = resultRows[0].CommentText;
        }
        catch{ }
    }

    static getAllComments(PostID) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM Comments WHERE  PostID=" + PostID;
            console.log(sql)
            var Database = require('./Database');
            var DB = new Database();
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