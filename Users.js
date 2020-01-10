module.exports = class User {
    constructor(UserName) {
        //متغیر های زیر فیلد های کلاس یوزر می باشند
        this.UserName = UserName;
        this.PersonalCode = 0;
        this.FirstName = "";
        this.LastName = "";
        this.PhoneNumber = "";
        this.Email = "";
        this.BrithDate = "";
        this.Password = "";
        this.UserType = "";
        this.Authenticated = false;
        this.GetInfo();
    }

    myExample = () => {
        return new Promise((Resolve, Reject) => {
            sum = 7 + 3;
            Resolve(sum);
        });
    }

    GetInfoFromBank() {
        return new Promise((Resolve, Reject) => {
            let sql = "SELECT * FROM Users WHERE UserName ='" + this.UserName + "'";
            console.log("SQL: " + sql);
            var Database = require('./Database');
            var DB = new Database();
            DB.con.query(sql, function (err, result, fields) {
                DB.con.end();
                if (err) {
                    console.log("GetInfo Query Error: " + err);
                    Reject(err);
                }
                else {
                    console.log(result);
                    Resolve(result);
                }
            });
        });
    }

    async GetInfo() {
        let results = await this.GetInfoFromBank();
        console.log(results);
        try {
            this.UserName = results[0].UserName;
            this.PersonalCode = results[0].PersonalCode;
            this.FirstName = results[0].FirstName;
            this.LastName = results[0].LastName;
            this.PhoneNumber = results[0].PhoneNumber;
            this.Email = results[0].Email;
            this.BrithDate = results[0].BrithDate;
            this.Password = results[0].Password;
            this.UserType = results[0].UserType;
        }
        catch (err) {
            console.log("User not found");
            // console.log("Error: " + err); 
        }
    }



    AddToBank() {
        return new Promise((resolve, reject) => {
            console.log("Adding User");
            var sql = "INSERT INTO Users (UserName, PersonalCode, FirstName, LastName, PhoneNumber"
            sql += ", Email, BrithDate, Password, UserType) VALUES ";
            sql += "('" + this.UserName + "'," + this.PersonalCode + ",'" + this.FirstName + "','" + this.LastName + "','" + this.PhoneNumber + "','"
            sql += this.Email + "','" + this.BrithDate + "','" + this.Password + "','" + this.UserType + "')"; //(for sql code "'"+"'" to define string variable: '" + firstName +"'  )
            console.log(sql)

            var Database = require('./Database');
            var DB = new Database();
            DB.con.query(sql, function (err, result, fields) {
                DB.con.end();
                if (err) {
                    console.log("Adding User Error: " + err);
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
        await this.AddToBank().then((result) => {
            console.log("Add User OK ");
            this.Authenticated = true;
        }).catch((err) => {
            console.log("Error: Add User Failed ");
            this.Authenticated = false;;
        })
            }

    /*
        Add() {
            console.log("Adding User");
            var sql = "INSERT INTO Users (UserName, PersonalCode, FirstName, LastName, PhoneNumber"
            sql += ", Email, BrithDate, Password, UserType) VALUES ";
            sql += "('" + this.UserName + "'," + this.PersonalCode + ",'" + this.FirstName + "','" + this.LastName + "','" + this.PhoneNumber + "','"
            sql += this.Email + "','" + this.BrithDate + "','" + this.Password + "','" + this.UserType + "')"; //(for sql code "'"+"'" to define string variable: '" + firstName +"'  )
            console.log(sql)
            var Database = require('./Database');
            var DB = new Database();
            DB.con.query(sql, function (err, result, fields) {
                DB.con.end();
                if (err) {
                    console.log("Check Error: " + err);
                }
                console.log("Number of records inserted: " + result.affectedRows);
            });
        }
    */
    SayHello() {
        console.log("Hi there User  " + this.UserName + " : " + this.FirstName + " " + this.LastName);
    }

    SetUserInfo(User_Name, Personal_Code, First_Name, Last_Name, Phone_Number, E_mail, Brith_Date, Pass_word, User_Type) {
        this.UserName = User_Name;
        this.PersonalCode = Personal_Code;
        this.FirstName = First_Name;
        this.LastName = Last_Name;
        this.PhoneNumber = Phone_Number;
        this.Email = E_mail;
        this.BrithDate = Brith_Date;
        this.Password = Pass_word;
        this.UserType = User_Type;
    }

    static async AddUser(UserName, PersonalCode, FirstName, LastName, PhoneNumber, Email, BrithDate, UserType, Password) {

        console.log("Adding User");
        var Database = require('./Database');
        this.DB = new Database();
        var Success = false;
        var sql = "INSERT INTO Users (UserName, PersonalCode, FirstName, LastName, PhoneNumber"
        sql += ", Email, BrithDate, Password, UserType) VALUES "; sql += "('" + UserName + "'," + PersonalCode + ",'";
        sql += FirstName + "','" + LastName + "','" + PhoneNumber + "','" + Email + "','" + BrithDate + "','"
        sql += Password + "','" + UserType + "')";//(for sql code "'"+"'" to define string variable: '" + firstName +"'  )
        var Database = require('./Database');
        var DB = new Database();
        DB.con.query(sql, function (err, result, fields) {
            DB.con.end();
            if (err) {
                console.log("Add User Error:")
                // console.log(err);
            }
            if (result) {
                Success = true;
                console.log("Number of records inserted: " + result.affectedRows);
            }
        });
        setTimeout(() => {
            return Success;
        }, 2000);
    }
}