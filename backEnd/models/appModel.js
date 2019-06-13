var sql = require('./db.js');

var User = function(user){
    this.user_id = user.user_id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.password = user.password;
    this.phone_number = user.phone_number;
};

User.createUser = function createUser(user_id, first_name, last_name, password){
    sql.query("INSERT INTO user_t (uid, first_name, last_name, phone, password, user_name) \
    VALUES (1,'?','?','?','?','?');")
}

User.createUser = function createAccount(user_id, first_name, last_name, password){
    sql.query("INSERT INTO user_t (uid, first_name, last_name, phone, password, user_name) \
    VALUES (1,'?','?','?','?','?');")
}