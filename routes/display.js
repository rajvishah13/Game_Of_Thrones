const express = require('express');
const router = express.Router();
const Battles = require('../models/Battle');
const asyncc = require('async');

//GETS ALL THE BATTLES
router.get('/', async (req,res) => {
    try{
        const battles = await Battles.find();
        res.json(battles);
    }
    catch(err){
        res.json({message:err});
    }
});

//ADDS A BATTLE
router.post('/', async (req,res) =>{
    const battle = new Battles({
        name: req.body.name,
        year: req.body.year,
        battle_number :  req.body.battle_number,
        attacker_king : req.body.attacker_king,
        defender_king : req.body.defender_king,
        attacker_1 : req.body.attacker_1,
        attacker_2 : req.body.attacker_2,
        attacker_3 : req.body.attacker_3,
        attacker_4 : req.body.attacker_4,
        defender_1 : req.body.defender_1,
        defender_2 : req.body.defender_2,
        defender_3 : req.body.defender_3,
        defender_4 : req.body.defender_4,
        attacker_outcome : req.body.attacker_outcome,
        battle_type : req.body.battle_type,
        major_death : req.body.major_death,
        major_capture : req.body.major_capture,
        attacker_size : req.body.attacker_size,
        defender_size : req.body.defender_size,
        attacker_commander : req.body.attacker_commander,
        defender_commander : req.body.defender_commander,
        summer : req.body.summer,
        location : req.body.location,
        region : req.body.region,
        note : req.body.note
    });
    try{
        const savedBattle = await battle.save();
        res.json(savedBattle);
    } catch(err) {
        res.json({message:err});
    }
 
});

//SPECIFIC POST
router.get('/id/:battleID', async(req,res) =>{
    try{
    const battle = await Battles.findById(req.params.battleID);
    res.json(battle);
    }catch(err){
        res.json({message: err});
    }
});

//DELETE A POST
router.delete('/delete/:battleID', async(req,res) =>{
    try{
        const removedBattle = await Battles.remove({_id: req.params.battleID});
        res.json(removedBattle);
    }catch(err){
        res.json({message: err});
    }
});

//LIST OF BATTLES
router.get('/locations', async(req, res) =>{
	Battles.distinct("location",  {'location': {"$exists": true, "$type": 2, "$ne": ""} }, (err, locations)=>{
        if (err) {
          res.send(err);
      }
      res.json(locations);
    })
});

//COUNT TOTAL NUMBER OF BATTLES
router.get('/count', async(req, res) => {
	Battles.countDocuments((err, count)=>{
        if (err) {
          res.send(err);
      }
      res.json(count);
    })
});

//SEARCH QUERIES WITH LOCATION, ATTACKER KING/DEFENDER KING , TYPE OF BATTLE
router.get('/search', async(req,res) => {
    console.log('req query', req.query);
	let query = {
	    $and : [
		  { $or: [ { attacker_king: req.query.king} , { defender_king: req.query.king } ] },
		  { location: req.query.location, battle_type: req.query.type }
	    ]
	};
	Battles.find(query, '-__v').exec().then(response => {
	    res.send({
		  code: 1,
		  data: response
	    });
	});	
});

//STATS
router.get('/stats', async(req,res) => {
    Battles.find({}, 'attacker_king defender_king region attacker_outcome battle_type defender_size -_id').exec().then(response => {
		if (response.length > 0) {
		    let statics = Stats(response);

		    res.send({
			  code: 1,
			  data: statics
		    });
		} else {
		    res.send({
			  code: 0,
			  data: response
		    });
		}

	  }).catch(err => {
		console.log('getList Err >>>>', err);
	  });
});

function Stats(response){

    if(response.length > 0) {

      let values = {
          attacker_kings: [],
          defender_kings: [],
          regions: []
      };
      let attacker_outcome = {
          wins: 0,
          loss: 0
      };
      let battleTypes = [];
      let defenderValues = [];
      let defender_size = {};
      let defenderSum = 0;
      response.forEach(item => {

          let obj = item.toObject();

          for (let key in obj) {

            if (obj.hasOwnProperty(key)) {

              switch (key) {
                  case 'attacker_king':
                    values.attacker_kings.push(obj[key]);
                    break;
                  case 'defender_king':
                    values.defender_kings.push(obj[key]);
                    break;
                  case 'region':
                    values.regions.push(obj[key]);
                    break;
                  case 'attacker_outcome':
                      if(obj[key] === 'win'){
                      attacker_outcome.wins++
                    }else if(obj[key] === 'loss'){
                      attacker_outcome.loss++;
                    }
                      break;
                  case 'battle_type':
                    battleTypes.push(obj[key]);
                      break;
                  case 'defender_size':
                    defenderValues.push(obj[key]);
                    defenderSum += (obj[key]);
                      break;
                  default:
                    break;
              }
            }

          }
      });

      let most_active = {};
      most_active.attacker_king = Maxcnt(values.attacker_kings);
      most_active.defender_king = Maxcnt(values.defender_kings);
      most_active.region = Maxcnt(values.regions);

      let battle_types = UniqueArr(battleTypes);
      console.log('defenders>>>', defenderValues);
      defender_size.min = defenderValues.reduce((a, b) =>  Math.min(a, b));
      defender_size.max = defenderValues.reduce((a, b) =>  Math.max(a, b));
      defender_size.average = parseInt(defenderSum / defenderValues.length);
      return {
          most_active,
          attacker_outcome,
          battle_types,
          defender_size
      };
    }

}

function Maxcnt(arr) {
    if(arr.length == 0)
	  return null;
    let k = {};
    let Elem = arr[0], max = 1;
    for(let i = 0; i < arr.length; i++) {
	  let m = arr[i];
	  if(k[m] == null)
		k[m] = 1;
	  else
		k[m]++;
	  if(k[m] > max)
	  {
		Elem = m;
		max = k[m];
	  }
    }
    return Elem;
}

function UniqueArr(arr) {

    if(arr.length == 0)
	  return null;
    let f = {};
    return arr.reduce((acc, n) => {

	  if(f[n] == null)
		f[n] = 1;
	  else
		f[n]++;
	  if(f[n] === 1) {
	      if(n){
		    acc.push(n);
		}

	  }
	  return acc;

    },[]);

}

module.exports = router;