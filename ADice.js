class AnimaDice{
    constructor(score){
        this.Score = score;
    }
    Roll(loop = 0){
        var resArr = [this.Score];
        var rolled = Math.floor(Math.random() * 100) + 1;
        resArr.push(rolled);
        if(rolled >= Math.min(90+loop, 100)){
            resArr = resArr.concat(this.Roll(loop + 1).slice(1));
        }
        return resArr;
    }
}


module.exports = {
    AnimaDice
}