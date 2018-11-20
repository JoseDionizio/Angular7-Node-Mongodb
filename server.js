var express = require('express'),
	bodyParser = require('body-parser'),	
	mongodb = require('mongodb'),
	objectId = require('mongodb').ObjectId;

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(function(req, res, next){

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "content-type");
	res.setHeader("Access-Control-Allow-Credentials", true);

	next();
});

var porta = 8080;

app.listen(porta);

var db = new mongodb.Db(
	'agroteste',
	new mongodb.Server('localhost', 27017, {}),
	{}
);


app.get('/', (req, res)=>{
	res.send({msg:'Olá'});
});

app.post('/api',(req,res)=>{
    var dados = req.body;    
    db.open( (err, mongoclient)=>{
        mongoclient.collection('hectare',(err, collection)=>{
            collection.insert(dados,(err, result)=>{
                if(err){
                    res.json(err);                   
                }
                else{
                    res.json(result);
                }
                mongoclient.close();
            })
        }); 
    });
});

app.get('/api', (req, res)=>{	
	db.open( (err, mongoclient)=>{
		mongoclient.collection('hectare', (err, collection)=>{
			collection.find().toArray((err, results)=>{
				if(err){
					res.json(err);
				} else {
					res.json(results);
				}
				mongoclient.close();
			});
		});
	});

});

app.get('/api/:id', (req, res)=>{
	db.open( (err, mongoclient)=>{
		mongoclient.collection('hectare', (err, collection)=>{
			collection.find(objectId(req.params.id)).toArray((err, results)=>{
				if(err){
					res.json(err);
				} else {
					res.status(200).json(results);
				}
				mongoclient.close();
			});
		});
	});

});

app.put('/api/:id', (req,res)=>{
    var dados = req.body;   
    db.open( (err, mongoclient)=>{
        mongoclient.collection('hectare',(err, collection)=>{
            collection.update(
                {_id : objectId(req.params.id) },
                {$set:{Area:dados.Area, Defensivo:dados.Defensivo, Qt_Aplicado:dados.Qt_Aplicado}},
                {},
                (err,result)=>{
                    if(!err){
                        res.json(result);
                    }
                    else{
                        res.json(err); 
                    }
                    mongoclient.close();
                }
            );
        }); 
    });
});

app.delete('/api/:id', (req,res)=>{      
    db.open((err, mongoclient)=>{
        mongoclient.collection('hectare',(err, collection)=>{
            collection.remove({_id : objectId(req.params.id)}, (err,result)=>{
                if(err){
                    res.json(err);                    
                }
                else{
                    res.json(result);
                }
                mongoclient.close();
            });
        }); 
    });
});

