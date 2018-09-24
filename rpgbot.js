// Import the discord.js module
const Discord = require('discord.js');
const BOTINVOKE = '!';
var http = require('http');
const EmbedFooter = { "text": "RPG_GOD under development. Use " + BOTINVOKE + "help to see how to use this bot."};
var {Character, allCharacters} = require('./character.js');
var {User, allUsers} = require('./users.js');


//Get token
var auth = require('./auth.json');

// Create an instance of a Discord client
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages: start listening on "BOTINVOKE"
client.on('message', message => {
    if (message.attachments.size > 0) {
        message.attachments.forEach( att => {
            ParseJSON(att, function(character){
                allCharacters[character.Id] = character;
                allCharacters.Save();
            });
        });
    }
    else if (message.content.substring(0, 1) === BOTINVOKE) {
        var args = message.content.substring(1).split(' ');
        ResponseTo(message, args);
    }
});

function ParseJSON(msgAttach, callback) {
    if(msgAttach.url.indexOf("json", msgAttach.url.length - 4) !== -1){
        allCharacters.Import(msgAttach.url, callback);
    }
}

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
                message.reply('**As command usage ->** ' + BOTINVOKE + 'as *characterName* Text to be written\nPlease, notice that yur user must OWN this character.');
            else
                message.reply('yeah, I know. There is no help on some commands. Give me a break, please? I am still under development.');
            break;
        case 'as':
        case 'action':
            var c = GetChar(u, args[1]);
            if(c){
                var emb = c.Says(args.splice(2).join(' '), args[0] == 'action');
                emb.footer = EmbedFooter;
                message.channel.send({embed: emb});
            }
            else{
                message.reply('Please, specify a valid characters');
            }
            break;
        case 'own':
            var name = args.slice(1).join(" ");
            if(name){
                var chars = GetCharsByName(name);
                if(chars.length == 1){
                    if(Own(u, chars[0].Id.toString())){
                        allCharacters[args[1]].OwnerId = u.Id;
                        allCharacters.Save();
                        allUsers.Save();
                    }
                }
                else if(chars.length > 1){
                    message.reply('multiple characters have been found: ' + chars.join(', '));
                }
            }
            else{
                chars = [];
                u.Characters.forEach(function(chID){
                    chars.push(allCharacters[chID].Name);
                });
                message.reply('these are your characters: ' + chars.join(', '));
            }
            break;
        case 'free':
            var c = GetChar(u, args[1]);
            if(c){
                var id = c.Id.toString();
                if(Free(u,id)){
                    allCharacters[args[1]] = 0;
                    allCharacters.Save();
                    allUsers.Save();
                }
            }
            else{
                message.reply('Please, specify a valid characters');
            }
            break;
        case 'set':
            var c = GetChar(u, args[1]);
            if(c){
                var c = GetChar(u, args[1]);
                c[args[2]] = args.splice(3).join(' ');
                allCharacters.Save();
            }
            else{
                message.reply('Please, specify a valid characters');
            }
            break;
        case 'show':
            if(args[1] === 'free')
            {
                var arr = [];
                var characters = Object.values(allCharacters);
                for(i = 0; i< characters.length; i++){
                    var ch = characters[i];
                    if(ch instanceof Character && ch.OwnerId == 0)
                        arr.push(ch.Name);
                }
                message.reply('these are the available characters: ' + arr.join(', '));
            }
            else{
                var freeUser = { "username" : "Free" };
                var chars = GetCharsByName(args.slice(1).join(" "));
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
        return true;
    }
    return false;
}

GetChar = function (user, name){
    var ch;
    for(i=0; i < user.Characters.length; i++){
        var c = allCharacters[user.Characters[i]];
        if(c && c.Name.startsWith(name)){
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
        if(c instanceof Character && c.Name && c.Name.startsWith(name)){
            chs.push(c);
        }
    }
    return chs;
}

client.login(auth.token);