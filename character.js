var charFS = require("fs");
var charFILE = "characters.json";
const EMBEDSIZE = 50;

class Armor{
	constructor(name){
		this.Name= name;
		this.Cut= 0;
		this.Imp= 0;
		this.Thr= 0;
		this.Heat= 0;
		this.Ele= 0;
		this.Cold= 0;
		this.Ene= 0;
	}
}

class CombatStyle{
	constructor(weapon){
		this.Turn= null;
		this.Weapon= weapon;
		this.Attack= null;
		this.Block= null;
		this.Dodge= null;
		this.Damage= null,
		this.AddWeapon= null;
		this.AddAttack= null;
		this.AddDodge= null;
		this.AddDamage= null;
	}
}
class Character{
	constructor(name){
		this.Id = Number(String(Math.random()).substring(2));
		this.OwnerId = 0;

		this.Name= name;
		this.Race= "Humano";
		this.Description= "";
		this.Level= "0",
		this.Presence= 20,
		this.LifePoints= 20,
		this.Class= "Novel",
		this.Size= null,
		this.Movement= null,
		this.Regeneration= null,
		this.Fatigue= null,
		this.Actions= null,
		this.Appearence= 0,
		this.Attributes= {
			"STR": 0,
			"DEX": 0,
			"AGI": 0,
			"CON": 0,
			"POW": 0,
			"INT": 0,
			"WP": 0,
			"PER": 0
		},
		this.Resistances= {
			"Physic": 20,
			"Venom": 20,
			"Disease": 20,
			"Magic": 20,
			"Psychic": 20
		},
		this.CreationPoints= null,
		this.Combat= [],
		this.Armor= {
			"Set": null,
			"Head": null
		},
		this.Ki= {
			"Points": {
				"STR": 0,
				"DEX": 0,
				"AGI": 0,
				"CON": 0,
				"POW": 0,
				"WP": 0,
				"Generic": 0
			},
			"Accumulation": {
				"STR": 0,
				"DEX": 0,
				"AGI": 0,
				"CON": 0,
				"POW": 0,
				"WP": 0
			},
			"Abilities": null,
			"Techniques": null
		},
		this.Magic= {
			"Turn": null,
			"OffProjection": null,
			"DefProjection": null,
			"Accumulation": null,
			"Recovery": null,
			"Zeon": null,
			"Summoning": {
				"Summon": null,
				"Control": null,
				"Bind": null,
				"Banish": null
			},
			"Levels": null
		},
		this.Psychic= {
			"Turn": null,
			"Projection": null,
			"Potential": null,
			"FreePoints": null,
			"Innates": null,
			"Powers": null,
			"Patterns": null
		},
		this.Monster= {
			"EsAbilities": null,
			"Powers": null
		},
		this.Secondaries= [
			{"Acrobatics": null},
			{"Athleticism": null},
			{"Ride": null},
			{"Swim": null},
			{"Climb": null},
			{"Jump": null},
			{"Drive": null},
			{"Style": null},
			{"Intimidate": null},
			{"Leadership": null},
			{"Persuasion": null},
			{"Trading": null},
			{"Streetwise": null},
			{"Etiquette": null},
			{"Notice": null},
			{"Search": null},
			{"Track": null},
			{"Animals": null},
			{"Sciences": null},
			{"Law": null},
			{"HerbalLore": null},
			{"History": null},
			{"Tactics": null},
			{"Medicine": null},
			{"Memorize": null},
			{"Navegation": null},
			{"Occult": null},
			{"Appraisal": null},
			{"MagicAppraisal": null},
			{"Composure": null},
			{"FeatsStrength": null},
			{"WithstandPain": null},
			{"LockPicking": null},
			{"Disguise": null},
			{"Hide": null},
			{"Theft": null},
			{"Stealth": null},
			{"TrapLore": null},
			{"Poisons": null},
			{"Art": null},
			{"Dance": null},
			{"Forging": null},
			{"Runes": null},
			{"Alchemy": null},
			{"Animism": null},
			{"Music": null},
			{"SleightHand": null},
			{"RitualCalligraphy": null},
			{"Jewelry": null},
			{"Tailoring": null},
			{"ConstructMarionettes": null}
		]
	}
	IsOwned(){
		return this.OwnerId != 0;
	}

	toString() {
		return JSON.stringify(this);
	}
	Says(message, action = false){
		var charEmb = {
			"color": 3447003,
			"author": {
				"name": this.Name
			},
		};
		if(action){
			charEmb.description = message;
		}
		else{
			charEmb.title = '- ' + message;
		}

		setAvatar(this, charEmb);
		return charEmb;
	}

	Embed(full = false){
		var charEmb = {
			"color": 3447003,
			"author": {
				"name": this.Name
			},
			"title" : 'Raza: ' + this.Race + ', Tam: ' + (this.Size) + ', Asp: ' + this.App,
			"description": this.Description ||'' ,
			"timestamp": new Date()
		};

		setAvatar(this, charEmb);
		if(full){
			if(this.HA + this.HD + this.Turn > 0){
				charEmb.fields = [
					{
						"name" : "Combat Abilities",
						"value" : "HA: " + this.HA + "\t\tHD: " + this.HD + "\t\tTurn: " + this.Turn + ".",
						inline: false
					},
					{
						"name" : "Combat Abilities",
						"value" : "HA: " + this.HA + "\t\tHD: " + this.HD + "\t\tTurn: " + this.Turn + ".",
						inline: false
					},
					{
						"name" : "Combat Abilities",
						"value" : "HA: " + this.HA + "\t\tHD: " + this.HD + "\t\tTurn: " + this.Turn + ".",
						inline: false
					},
					{
						"name" : "Combat Abilities",
						"value" : "HA: " + this.HA + "\t\tHD: " + this.HD + "\t\tTurn: " + this.Turn + ".",
						inline: false
					},
					{
						"name" : "Turn",
						"value" : this.Turn,
						inline: true
					},
					{
						"name" : "HA",
						"value" : this.HA,
						inline: true
					},
					{
						"name" : "HD/HE",
						"value" : this.HD,
						inline: true
					}
				];
			}
			if(this.CharSheetURL){
				charEmb.url = this.CharSheetURL;
			}
		}
		return charEmb;
	}
}
setAvatar = function(character, Embed){
	if(character.AvatarURL){
		Embed.thumbnail = { "url" : character.AvatarURL};
	}
}

//charFILE= "a.json";
var txt = charFS.readFileSync(charFILE);
var allCharacters = JSON.parse(txt);
Object.keys(allCharacters).forEach(k => allCharacters[k] = Object.assign(new Character, allCharacters[k]));

allCharacters.Create = function(message, args){
    if(args.length <= 1){
        message.reply('Please, give character a name.');
        return;
    }
	var ch = new Character(args[1]);
	this[ch.Id] = ch;
	allCharacters.Save();
	message.reply('Created (' + ch.Name + ') with Id: ' + ch.Id);
}
allCharacters.Save = function(){
    var text = JSON.stringify(allCharacters);
	charFS.writeFile(charFILE, text);
}

var c = new Character("a");

module.exports = {
	Character,
	allCharacters
};