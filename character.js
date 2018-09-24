var charFS = require("fs");
var request = require("request");
var iconv  = require('iconv-lite');
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
	Stats(){
		return "**FIL** " + this.Cut
			   + "**CON** " + this.Imp
			   + "**PEN** " + this.Thr
			   + "**CAL** " + this.Heat
			   + "**ELE** " + this.Ele
			   + "**FRI** " + this.Cold
			   + "**ENE** " + this.Ene;
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
		this.AddBlock= null;
		this.AddDodge= null;
		this.AddDamage= null;
	}
	Name(){
		var w = this.Weapon;
		if(this.AddWeapon){
			w = w + "/" + this.AddWeapon;
		}
		return w;
	}
	Stats(){
		var ha = this.Attack;
		var hd = " **HD** " + this.Block;
		if(this.Dodge > this.Block)
			hd = " **HE** " + this.Dodge;
		var dmg = this.Damage;

		if(this.AddWeapon){
			ha = ha + "/" + this.AddAttack;
			if(this.Dodge > this.Block){
				hd = hd + "/" + this.AddDodge;
			}
			else{
				hd = hd + "/" + this.AddBlock;
			}
			dmg = dmg + "/" + this.AddDamage
		}
		return "**Turno** "+ this.Turn + " **HA** " + ha + hd + " **Daño** " + dmg;
	}
}
class Character{
	constructor(){
		this.Id = Number(String(Math.random()).substring(2));
		this.OwnerId = 0;
		this.Image = null;

		this.Name= null;
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
			"ActualPoints": {
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
			"ActualZeon": null,
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
			"ActualPoints": null,
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
			"color": 16776960,
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
			"color": 16776960,
			"author": {
				"name": this.Name
			},
			"title" : 'Raza: ' + this.Race + ', Tam: ' + (this.Size) + ', Asp: ' + this.Appearence,
			"description": this.Description ||'' ,
			"timestamp": new Date()
		};

		setAvatar(this, charEmb);
		if(full){
			var combatstyles = Array.from(this.Combat, c => Object.assign(new CombatStyle, c));
			var combatnames = Array.from(combatstyles, c => c.Name()).join("\n");
			var combatstats = Array.from(combatstyles, c => c.Stats()).join("\n");
			charEmb.fields = [
				{
					"name" : "General",
					"value" : "**Categoría**: "+ this.Class + "\t\t **Nivel**: "+ this.Level + "\t\t **Presencia**: "+ this.Presence
							  + "\n**Puntos de Vida**: " + this.LifePoints + "\t\t **Movimiento**: " + this.Movement 
							  + "\t\t **Regeneración**: " + this.Regeneration + "\t\t **Cansancio**: " + this.Fatigue
							  + "\n **AGI**: " + this.Attributes.AGI + 
								"\t **CON**: " + this.Attributes.CON +
								"\t **DES**: " + this.Attributes.DEX +
								"\t **FUE**: " + this.Attributes.STR +
								"\t **INT**: " + this.Attributes.INT +
								"\t **PER**: " + this.Attributes.PER +
								"\t **POD**: " + this.Attributes.POW +
								"\t **VOL**: " + this.Attributes.WP
							+ "\n **RF**: " + this.Resistances.Physic + 
							  "\t **RV**: " + this.Resistances.Venom +
							  "\t **RE**: " + this.Resistances.Disease +
							  "\t **RM**: " + this.Resistances.Magic +
							  "\t **RP**: " + this.Resistances.Psychic,
					inline: false
				},
				{
					"name": "Combat Style",
					"value": combatnames,
					inline: true
				},
				{
					"name": "Stats",
					"value": combatstats,
					inline: true
				}
			];
			if(this.Ki.Abilities){
				var kip = null;
				if(this.Ki.Points.Generic){
					if(this.Ki.ActualPoints == null){
						this.Ki.ActualPoints = {"Generic": this.Ki.Points.Generic};
					}
					kip = "**Generic**: " + this.Ki.ActualPoints.Generic + "/"+ this.Ki.Points.Generic;
				}
				else{
					if(!this.Ki.ActualPoints){
						this.Ki.ActualPoints = { "AGI": this.Ki.Points.AGI,
												 "CON": this.Ki.Points.CON,
												 "DES":this.Ki.Points.DEX,
												 "FUE":this.Ki.Points.STR,
												 "POD":this.Ki.Points.POW,
												 "VOL":this.Ki.Points.WP}
					}
					kip = "**AGI**: " + this.Ki.ActualPoints.AGI + "/"+ this.Ki.Points.AGI
						  + "**CON**: " + this.Ki.ActualPoints.CON + "/"+ this.Ki.Points.CON
						  + "**DES**: " + this.Ki.ActualPoints.DEX + "/"+ this.Ki.Points.DEX
						  + "**FUE**: " + this.Ki.ActualPoints.STR + "/"+ this.Ki.Points.STR
						  + "**POD**: " + this.Ki.ActualPoints.POW + "/"+ this.Ki.Points.POW
						  + "**VOL**: " + this.Ki.ActualPoints.WP + "/"+ this.Ki.Points.WP;
				}
				var kia = "**AGI**: " + this.Ki.Accumulation.AGI
						  + "**CON**: " + this.Ki.Accumulation.CON
						  + "**DES**: " + this.Ki.Accumulation.DEX
						  + "**FUE**: " + this.Ki.Accumulation.STR
						  + "**POD**: " + this.Ki.Accumulation.POW
						  + "**VOL**: " + this.Ki.Accumulation.WP;
				var kfield = {
					"name": "Ki",
					"value": "Acumulación:" +kia + "\nPuntos:" + kip,
					inline :false,
				};

				charEmb.fields.push(kfield);
			}
			if(this.Magic.Turn){
				if(!this.Magic.ActualZeon){
					this.Magic.ActualZeon = this.Magic.Zeon;
				}
				var mfield = {
					"name": "Magia",
					"value": "**Turno**:" + this.Magic.Turn + " **ProyMag.Of**:" + this.Magic.OffProjection + " **ProyMag.Def**:"+ this.Magic.DefProjection
							 + "\n**ACT**:" + this.Magic.Accumulation + " **Zeon**: "+ this.Magic.ActualZeon + "/" + this.Magic.Zeon,
					inline :false,
				};

				charEmb.fields.push(mfield);
			}
			if(this.Psychic.Turn){
				if(!this.Psychic.ActualPoints){
					this.Psychic.ActualPoints = this.Psychic.FreePoints;
				}
				var pfield = {
					"name": "Psíquica",
					"value": "**Turno**: " + this.Psychic.Turn + " **Proyección**:" + this.Psychic.Projection + " **Potencial**:" + this.Psychic.Potential
							 + "\n **Innatos**:"+ this.Psychic.Innates + "**CV Libres**:"+ this.Psychic.ActualPoints + "/" + this.Psychic.FreePoints
							 + "\n **Poderes**:" + this.Psychic.Powers,
					inline : false,
				};

				charEmb.fields.push(pfield);
			}
			if(this.Armor.Set){
				this.Armor.Set = Object.assign(new Armor, this.Armor.Set);
				this.Armor.Head = Object.assign(new Armor, this.Armor.Head);
				var afield = {
					"name": "Armadura",
					"value": this.Armor.Set.Name + ":" + this.Armor.Set.Stats()
							 + "\n" + this.Armor.Head.Name + "(cabeza):"+ this.Armor.Head.Stats(),
					inline :false,
				};

				charEmb.fields.push(afield);
			}

			if(this.CharSheetURL){
				charEmb.url = this.CharSheetURL;
			}
		}
		return charEmb;
	}
}
setAvatar = function(character, Embed){
	if(character.Image){
		Embed.thumbnail = { "url" : character.Image};
	}
}

//charFILE= "a.json";
var allCharacters = JSON.parse(charFS.readFileSync(charFILE));
Object.keys(allCharacters).forEach(k => allCharacters[k] = Object.assign(new Character, allCharacters[k]));

allCharacters.Import = function(url, callback){
	request({ url: url, json: true, encoding: null }, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			var utf8String = iconv.decode(new Buffer(body), "utf-16");
			var ch = JSON.parse(utf8String);
			ch = Object.assign(new Character, ch);
			callback(ch);
		}
	})
}

allCharacters.Save = function(){
    var text = JSON.stringify(allCharacters);
	charFS.writeFile(charFILE, text);
}

module.exports = {
	Character,
	allCharacters
};