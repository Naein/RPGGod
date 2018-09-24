var userFS = require("fs");
var userFILE = "users.json";

class User{
	constructor(id){
        this.Id = id;
		this.Characters = [];
    }
}

var allUsers = JSON.parse(userFS.readFileSync(userFILE));
Object.keys(allUsers).forEach(k => allUsers[k] = Object.assign(new User, allUsers[k]));
allUsers.Create = function(id){
    var u = new User(id);
    this[id] = u;
	this.Save();
}
allUsers.Save = function(){
    var text = JSON.stringify(this);
	userFS.writeFile(userFILE, text);
}

module.exports = {
	User,
	allUsers
};