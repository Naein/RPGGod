// Import the discord.js module
const Discord = require('discord.js');
const BOTINVOKE = '!';
var http = require('http');
const EmbedFooter = { "text": "RPG_GOD under development. Use " + BOTINVOKE + "help to see how to use this bot."};
var {AnimaDice} = require('./ADice.js');
var {Character, allCharacters} = require('./character.js');
var {User, allUsers} = require('./users.js');
var {Party, parties} = require('./party.js');


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
            var c = GetUserChar(u, args[1]);
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
                        allCharacters[chars[0].Id].OwnerId = u.Id;
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
            var c = GetUserChar(u, args[1]);
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
            var c = GetUserChar(u, args[1]);
            if(c){
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
        case 'roll':
            var rolled = [];
            if(args.length == 1){
                rolled = (new AnimaDice(0)).Roll().slice(1);
            }
            else if(args.length == 3 || args.length == 4){
                var c = GetUserChar(u, args[1]);
                if(c){
                    rolled = c.Roll(args.slice(2));
                    if(rolled.length == 1 && rolled[0] == -1){
                        message.reply('Not found Character directive.');
                        return;
                    }
                }
            }
            else{
                message.reply('Invalid number of arguments to roll');
                return;
            }
            var res = rolled.reduce((a, b) => a + b, 0);
            var subMsg = '', wp = '';
            if(rolled.length == 2 && rolled[1] <= 5){
                subMsg = '(Fumble?)';
            }
            else if(rolled.length > 2){
                subMsg = '(Open!)';
            }
            if(args[3]){
                wp =  '(' + args[3] + ')';
            }
            message.channel.send(c.Name + '\'s ' + args[2] + ' ' + wp +'[' + rolled.join("+") + '] : **' + res + '**' + subMsg);
            break;
        case 'party':
            PartiesInstruction(u, message, args.slice(1));
            break;
        case 'combat':
            CombatInstruction(u, message, args.slice(1));
            break;
        case 'turn':
            TurnInstruction(u, message, args.slice(1));
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

GetUserChar = function (user, name){
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

PartiesInstruction = function(user, message, args){
    switch(args[0]){
        case 'create':
            parties.push(new Party(user.Id));
            var member = message.channel.members.get(user.Id);
            message.channel.send('`Created ' + member.displayName + '\'s party`');
            break;
        case 'join':
            var c = GetUserChar(user, args[2]);
            var DJ = allUsers[args[1].substring(2,20)];
            if(!DJ || !c){
                return false;
            }
            var p = parties.find(function(p){
                return p.OwnerId = DJ.Id;
            });
            if(!p){
                return false;
            }
            if(p.Characters.indexOf(c) == -1){
                p.Characters.push(c);
            }
            DJ = message.channel.members.get(DJ.Id);
            var membersMsg = "```Characters of " + DJ.displayName + "\'s party:\n "
                             + Array.from(p.Characters, ch => ch.Name).join('\n ') + "```";
            message.channel.send(membersMsg);
            break;
        default:
            break;
    }
}

CombatInstruction = function(user, message, args){
    switch(args[0]){
        case 'start':
            var p = parties.filter(p=> p.OwnerId == user.Id)
            if(p.length != 1){
                message.reply('cannot get user\'s party');
            }
            p = p[0];
            p.startCombat();
            var membersMsg = "```Combatants of " + message.channel.members.get(p.OwnerId).displayName + "'s party:\n "
                             + Array.from(p.Combat.Combatants, c => c.Character.Name).join(', ') + "```";
            message.channel.send(membersMsg);
            break;
        case 'end':
            var p = parties.filter(p=> p.OwnerId == user.Id)
            if(p.length != 1){
                message.reply('cannot get user\'s party');
            }
            p = p[0];
            p.endCombat();
            break;
        case 'weapon':
            var c = GetUserChar(user, args[1]);
            var p = parties.filter(p=> p.containsCharacter(c));
            if(p.length != 1){
                message.reply('cannot get user\'s party');
            }
            p = p[0];
            var combatant = p.Combat.Combatants.find(function(comb) { return comb.Character == c; });
            combatant.Default = args.slice(2);
            message.channel.send("`Set " + combatant.Character.Name + " combat style to: " + combatant.Default+ "`");
            break;
        case 'add':
            var p = parties.filter(p=> p.OwnerId == user.Id)
            if(p.length != 1){
                return 'Cannot get user\'s party';
            }
            p = p[0];
            var name = args.slice(1).join(' ');
            var c = GetCharsByName(name);
            if(c.length != 1){
                return 'Cannot add character "' + name + '". Found '+ c.length.toString();
            }
            c = c[0];
            p.Combat.Add(c);
            var membersMsg = "```Combatants of " + message.channel.members.get(p.OwnerId).displayName + "'s party:\n "
                             + Array.from(p.Combat.Combatants, c => c.Character.Name).join(', ') + "```";
            message.channel.send(membersMsg);
            break;
        case 'attack':
            var p = parties.filter(p=> p.OwnerId == user.Id)
            if(p.length != 1){
                message.reply('cannot get user\'s party');
            }
            p = p[0];
            var name = args.slice(1).join(' ');
            var Attcombatant = p.Combat.Combatants.find(function(comb) { return comb.Character.Name.startsWith(args[1])});
            var Defcombatant = p.Combat.Combatants.find(function(comb) { return comb.Character.Name.startsWith(args[2])});
            var attRes = Attcombatant.Character.Roll(['Attack', Attcombatant.Default]);
            var defRes = Defcombatant.Character.Roll(['Defense', Defcombatant.Default]);
            message.channel.send(Attcombatant.Character.Name + ' attacks ' + Defcombatant.Character.Name + ': **'
                                + Sum(attRes) + '**[' + attRes[0] + '(' + Attcombatant.Default + ')+' + attRes.slice(1).join('+')
                                + '] vs **'
                                + Sum(defRes) + '**[' + defRes[0] + '(' + Defcombatant.Default + ')+' + defRes.slice(1).join('+') + ']'
            );
            break;
        default:
            break;
    }
}
TurnInstruction = function(user, message, args){
    switch(args[0]){
        case 'start':
            var p = parties.filter(p=> p.OwnerId == user.Id)
            if(p.length != 1){
                message.reply('cannot get user\'s party');
            }
            p = p[0];
            var t = p.Combat.getTurns();
            t = t.sort(function(a, b){return Sum(b.Result) - Sum(a.Result)});
            var turns = Array.from(t, combatant => 
                " " + combatant.Name + ": **" 
                + Sum(combatant.Result)
                + '**[' + combatant.Result.join('+') + ']'
            );
            var msg = 'Turn start.\n'
                      + turns.join("\n");
            message.channel.send(msg);
            break;
        default:
            break;
    }
}
Sum = function(array){
    return array.reduce((a, b) => a + b, 0);
}


client.login(auth.token);