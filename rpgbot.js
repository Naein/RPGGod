// Import the discord.js module
const Discord = require('discord.js');
const EmbedFooter = { "text": "RPG_GOD under development. Use :help to see how to use this bot."};
var {Character, allCharacters} = require('./character.js');
var {User, allUsers} = require('./users.js');


//Get token
var auth = require('./auth.json');

// Create an instance of a Discord client
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages: start listening on ":"
client.on('message', message => {
  if (message.content.substring(0, 1) === ':') {
    var args = message.content.substring(1).split(' ');
    ResponseTo(message, args);
  }
});

function ResponseTo(message, args){
    message.delete(50);
    if(!allUsers[message.author.id]){
        allUsers.Create(message.author.id);
    }
    var u = allUsers[message.author.id];
    switch(args[0])
    {
        case 'help':
            if(!args[1])
                message.reply('those are the **possible commands**: as, action, own, free, set, new, show');
            else if(args[1] == 'as')
                message.reply('**As command usage ->** :as *characterName* Text to be written\nPlease, notice that yur user must OWN this character.');
            else
                message.reply('yeah, I know. There is no help on some commands. Give me a break, please? I am still under development.');
            break;
        case 'as':
        case 'action':
            var ch = GetChar(u, args[1]);
            var emb = ch.Says(args.splice(2).join(' '), args[0] == 'action');
            emb.footer = EmbedFooter;
            message.channel.send({embed: emb});
            break;
        case 'own':
            if(Own(u, args[1])){
                allCharacters[args[1]].OwnerId = u.Id;
                allCharacters.Save();
                allUsers.Save();
            }
            break;
        case 'free':
            if(Free(u, args[1])){
                allCharacters[args[1]] = 0;
                allCharacters.Save();
                allUsers.Save();
            }
            break;
        case 'set':
            var emb = GetChar(u, args[1]);
            emb[args[2]] = args.splice(3).join(' ');
            allCharacters.Save();
            break;
        case 'new':
            allCharacters.Create(message, args);
            break;
        case 'show':
            if(args[1] === 'free')
            {
                var arr = [];
                var characters = Object.values(allCharacters);
                for(i = 0; i< characters.length; i++){
                    var ch = characters[i];
                    if(ch instanceof Character && ch.OwnerId == 0)
                        arr.push(ch.Name + '(' + ch.Id + ')');
                }
                message.reply('these are the available characters: ' + arr.join(', '));
            }
            else{
                var freeUser = { "username" : "Free" };
                var chars = GetCharsByName(args[1]);
                for(i = 0; i< chars.length; i++){
                    var ch = chars[i];
                    var fullinfo = u.Id == ch.OwnerId;
                    var emb = ch.Embed(fullinfo);
                    var chOwner = client.users.get(ch.OwnerId)
                    emb.author.name = emb.author.name + ' [' + (chOwner || freeUser).username + ']'
                    emb.footer = EmbedFooter;
                    message.channel.send({embed: emb});
                }
            }
            break;
        default:
            message.reply('Not defined function.');
            break;
    }
}

Own = function(user, Id){
    if(!allCharacters[Id] || allCharacters[Id].OwnerId > 0)
        return false;
    user.Characters.push(Id);
    allCharacters[Id].OwnerId = user.Id;
    return true;
}
Free = function(user, Id){
    var ix = user.Characters.indexOf(Id);
    if (ix > -1) {
        user.Characters.splice(ix, 1);
        allCharacters[Id].OwnerId = 0;
    }
    return false;
}

GetChar = function (user, name){
    var ch;
    for(i=0; i < user.Characters.length; i++){
        var c = allCharacters[user.Characters[i]];
        if(c && c.Name == name){
            ch = c;
            break;
        }
    }
    return ch;
}
GetCharsByName = function (name){
    var chs = [];
    var characters = Object.values(allCharacters);
    for(i=0; i < characters.length; i++){
        var c = characters[i];
        if(c instanceof Character && c.Name == name){
            chs.push(c);
        }
    }
    return chs;
}

client.login(auth.token);