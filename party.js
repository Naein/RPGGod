class Combat{
    constructor(p){
        this.Combatants =  Array.from(p.Characters, ch =>{
            var c = { "Character" : ch, "Default": ch.Combat[0].Weapon};
            return c;
       });
    }

    Add(npc){
        this.Combatants.push({ "Character" : npc, "Default": npc.Combat[0].Weapon});
    }

    getTurns()
    {
        var Turns = [];
        this.Combatants.forEach(comb => {
            var rolled = comb.Character.Roll(['Turn', comb.Default]);
            var cR = { "Name" : comb.Character.Name, "Result": rolled};
            Turns.push(cR);
        });
        return Turns;
    }
}

class Party{
    constructor(OwnerId){
        this.OwnerId = OwnerId;
        this.Characters = [];
        this.Combat = null;
    }

    isDJOf(user, char){
        return user.Id == OwnerId && this.containsCharacter(char);
    }
    containsCharacter(ch){
        return this.Characters.filter(c => c.Id == ch.Id).length > -1;
    }

    join(char){
        this.Characters.push(char);
    }

    startCombat(){
        this.Combat = new Combat(this);
    }
    endCombat(){
        this.Combat = null;
    }
}

parties = [];


module.exports={
    Party,
    parties
}