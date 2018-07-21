const http = require("http");
var mysql = require("mysql2");
var url = require("url");
var Request = require('tedious').Request;
var Connection = require('tedious').Connection;  
var config = {  
    userName: '',  
    password: '',  
    server: '',  
    // If you are on Microsoft Azure, you need this:  
    options: {encrypt: true, database: 'mydb', rowCollectionOnDone: true}  
};  

var express = require('express');
var bodyParser = require('body-parser');


var app = express();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

var origin = "https://fridgehunters.now.sh";
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', origin || "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
    next();
});


app.get('/recipes', function(req, res) {
  	res.setHeader('Access-Control-Allow-Origin', '*')

  	var parsed = url.parse(req.url, true);

  	if(Object.keys(parsed.query).length === 0){
    	res.end("No queries");
  	}

  	var ingredlist = parsed.query.ulist.split(",");
	var namelist = [];
	var con = new Connection(config);
	var overallist = [];
	var suggested = 0;
	var broke = false;
	var valid = false;

	con.on('connect', function(error) {
    	if (error) throw error;
    	console.log("Connected!");

    	var sql = "SELECT name, ingredients, description, endorse FROM recipe ORDER BY endorse DESC";
    	var request = new Request(sql, function(err) {  
       		if (err) {  
          		console.log(err);
        	}  
      	})

    	request.on('row', function(columns){
    	})

      	request.on('doneInProc', function(rowCount, more, rows){
      		for(var i = 0; i < rows.length; i++){
      			namelist = rows[i][1].value.split(",");

    			if(ingredlist.length > namelist.length){
    				continue;
    			}

    			valid = true;
      			for(var j = 0; j < ingredlist.length; j++){
      				broke = false;
      				for(var k = 0; k < namelist.length; k++){
      					if(namelist[k] == ingredlist[j]){
      						broke = true;
      						break;
      					}
      				}

      				if(broke == false){
      					valid = false;
      				}
      			}

      			if(valid == true){
      				overallist.push(JSON.stringify({
      					name: rows[i][0].value,
      					ingredients: namelist,
      					description: rows[i][2].value,
      					endorse: rows[i][3].value
      				}))
      			}
      		}

      		res.end(overallist.toString());
      		
	    });

	    con.execSql(request);

	})
})


app.get('/ingredients', function(req, res) {
  	res.setHeader('Access-Control-Allow-Origin', '*')

  	var parsed = url.parse(req.url, true);

  	if(Object.keys(parsed.query).length === 0){
    	res.end("No queries");
  	}

  	var uname = parsed.query.uname;
	var con = new Connection(config);
	var overallist = [];
	var suggested = 0;
	var checked = 0;
	var broke = false;

	con.on('connect', function(error) {
    	if (error) throw error;
    	console.log("Connected!");

    	var sql = "SELECT name FROM ingredients ORDER BY recipes DESC";
    	var request = new Request(sql, function(err) {  
       		if (err) {  
          		console.log(err);
        	}  
      	})

    	request.on('row', function(columns){
    	})

      	request.on('doneInProc', function(rowCount, more, rows){
      		for(var i = 0; i < rowCount; i++){
      			var size = 0;
    			if(uname.length <= rows[i][0].value.length){
    				size = uname.length;
    			}
    			else{
    				continue;
    			}
    			broke = false;
    			for(var j = 0; j < size; j++){
    				if(rows[i][0].value.charAt(j) != uname.charAt(j)){
    					broke = true;
    					break;
    				}
    			}

    			if(broke == false){
    				overallist.push(rows[i][0].value);
    			}
    			checked++;

    			if(checked == rowCount){
    				res.end(overallist.toString());
    			}
      		}
      	
      		res.end(overallist.toString())
	    });



	    con.execSql(request);

	})
})


app.get('/hotrecipes', function(req, res) {
  	res.setHeader('Access-Control-Allow-Origin', '*')

  	var parsed = url.parse(req.url, true);



	var con = new Connection(config);
	var overallist = [];

	con.on('connect', function(error) {
    	if (error) throw error;
    	console.log("Connected!");

    	var sql = "SELECT name, ingredients, description, endorse FROM recipe ORDER BY endorse DESC";
    	var request = new Request(sql, function(err) {  
       		if (err) {  
          		console.log(err);
        	}  
      	})

    	request.on('row', function(columns){
    	})

      	request.on('doneInProc', function(rowCount, more, rows){
      		for(var i = 0; i < rows.length; i++){
      			namelist = rows[i][1].value.split(",");

    			if(i > 10){
    				break;
    			}

    			
  				overallist.push(JSON.stringify({
  					name: rows[i][0].value,
  					ingredients: namelist,
  					description: rows[i][2].value,
  					endorse: rows[i][3].value
  				}))
      			
      		}

      		res.end(overallist.toString());
      		
	    });

	    con.execSql(request);

	})
})


/*app.get('/hotrecipesweekly', function(req, res) {
  	res.setHeader('Access-Control-Allow-Origin', '*')

  	var parsed = url.parse(req.url, true);


	var con = new Connection(config);
	var overallist = [];

	con.on('connect', function(error) {
    	if (error) throw error;
    	console.log("Connected!");

    	var sql = "SELECT name, ingredients, description, weeklyendorse FROM recipe ORDER BY weeklyendorse DESC";
    	var request = new Request(sql, function(err) {  
       		if (err) {  
          		console.log(err);
        	}  
      	})

    	request.on('row', function(columns){
    	})

      	request.on('doneInProc', function(rowCount, more, rows){
      		for(var i = 0; i < rows.length; i++){
      			namelist = rows[i][1].value.split(",");

    			if(i > 10){
    				break;
    			}

    			
  				overallist.push(JSON.stringify({
  					name: rows[i][0].value,
  					ingredients: namelist,
  					description: rows[i][2].value,
  					endorse: rows[i][3].value
  				}))
      			
      		}

      		res.end(overallist.toString());
      		
	    });

	    con.execSql(request);

	})
})*/


app.post('/recipes', function(req, res) {
  	res.setHeader('Access-Control-Allow-Origin', '*')

  	var parsed = url.parse(req.url, true);

	var uname = req.body.uname;
	var ingredlist = req.body.ulist;
	var udesc = req.body.udesc;

	console.log(req.body.uname + req.body.ulist + req.body.udesc)
	var con0 = new Connection(config);

	con0.on('connect', function(error) {
		var sql0 = "SELECT endorse FROM recipe WHERE name='" + uname + "'";

		var request0 = new Request(sql0, function(err) {  
       		if (err) {  
          		console.log(err);
        	}  
      	})

    	request0.on('row', function(columns){
    	})


    	request0.on('doneInProc', function(rowCount, more, rows){
    		if(rowCount == 0){
		  		var con = new Connection(config);

				con.on('connect', function(error) {
			    	if (error) throw error;
			    	console.log("Connected!");

			    	var sql = "INSERT INTO recipe VALUES ('" + uname + "', 0, '" + ingredlist + "', '" + udesc + "', 0)";
			    	var request = new Request(sql, function(err) {  
			       		if (err) {  
			          		console.log(err);
			        	}  
			      	})

			    	request.on('row', function(columns){
			    	})

			      	request.on('doneInProc', function(rowCount, more, rows){
			      		//res.end("Added recipe");
			      		var ulist = ingredlist.split(",");
			      		var valuelist = ""

			      		for(var i = 0; i < ulist.length; i++){
			      			if(i == 0){
			      				valuelist += "(\'" + ulist[i] + "\', 1)"
			      			}
			      			else{
			      				valuelist += ", (\'" + ulist[i] + "\', 1)"
			      			}
			      			
			      		}

		      			var con2 = new Connection(config);

			      		con2.on('connect', function(error) {
					    	if (error) throw error;
					    	console.log("Connected!");
					    	//res.end("INSERT INTO ingredients VALUES " + valuelist + " ON DUPLICATE KEY UPDATE recipes = recipes + 1;")
					    	//var sql2 = "INSERT INTO ingredients (name, recipes) VALUES " + valuelist + " ON DUPLICATE KEY UPDATE recipes = VALUES(recipes + 1);";
					    	var sql2 = "INSERT INTO ingredients VALUES " + valuelist;

					    	var request2 = new Request(sql2, function(err2) {  
					       		if (err2) {  
					          		console.log(err2);
					        	}  
					      	})

					    	request2.on('row', function(columns){
					    	})

					      	request2.on('doneInProc', function(rowCount, more, rows){
					      		res.end("Added recipe");
						    });

						    con2.execSql(request2);

				  		})
			      		

			      		
				    });

				    con.execSql(request);

		  		})
			}
			else{
				res.end("Recipe exists")
			}
		})

		con0.execSql(request0);
	})
})


app.put('/endorsement/:recipe', function(req, res) {
  	res.setHeader('Access-Control-Allow-Origin', '*')

  	var parsed = url.parse(req.url, true);

	var uname = req.params.recipe;
	var con = new Connection(config);

	con.on('connect', function(error) {
    	if (error) throw error;
    	console.log("Connected!");

    	var sql = "UPDATE recipe SET endorse = endorse + 1 WHERE name='" + uname + "'";
    	var request = new Request(sql, function(err) {  
       		if (err) {  
          		console.log(err);
        	}  
      	})

    	request.on('row', function(columns){
    	})

      	request.on('doneInProc', function(rowCount, more, rows){

      		res.end("Added endorsement");
      		
	    });

	    con.execSql(request);

	})
})



//Testing
app.get('/', function(req, res) {
  	res.setHeader('Access-Control-Allow-Origin', '*')

  	var parsed = url.parse(req.url, true);
  	var desiredMethod = parsed.query.desiredMethod;

  	if(Object.keys(parsed.query).length === 0){
    	res.end("No queries");
  	}





	if(desiredMethod == "TEST"){
		var con = new Connection(config);
		var overallist = [];

		con.on('connect', function(error) {
	    	if (error) throw error;
	    	console.log("Connected!");

	    	var sql = "DELETE FROM recipe";
	    	//var sql = "ALTER TABLE ingredients ALTER COLUMN name VARCHAR(255) NOT NULL";
	    	var request = new Request(sql, function(err) {  
	       		if (err) {  
	          		console.log(err);
	        	}  
	      	})

	    	request.on('row', function(columns){
	    	})

	      	request.on('doneInProc', function(rowCount, more, rows){
	      		res.end("YUH")
	      		
		    });

		    con.execSql(request);

		})
	}

	else if(desiredMethod == "TEST2"){
		var con = new Connection(config);
		var overallist = [];

		con.on('connect', function(error) {
	    	if (error) throw error;
	    	console.log("Connected!");

	    	var sql = "DELETE FROM ingredients";
	    	//var sql = "ALTER TABLE ingredients ALTER COLUMN name VARCHAR(255) NOT NULL";
	    	var request = new Request(sql, function(err) {  
	       		if (err) {  
	          		console.log(err);
	        	}  
	      	})

	    	request.on('row', function(columns){
	    	})

	      	request.on('doneInProc', function(rowCount, more, rows){
	      		res.end("YUH2")
	      		
		    });

		    con.execSql(request);

		})
	}

	else if(desiredMethod == "TEST3"){
		var uname = parsed.query.uname;
		var con = new Connection(config);
		var overallist = [];

		con.on('connect', function(error) {
	    	if (error) throw error;
	    	console.log("Connected!");

	    	var sql = "DELETE FROM recipe WHERE name='" + uname + "'";
	    	//var sql = "ALTER TABLE ingredients ALTER COLUMN name VARCHAR(255) NOT NULL";
	    	var request = new Request(sql, function(err) {  
	       		if (err) {  
	          		console.log(err);
	        	}  
	      	})

	    	request.on('row', function(columns){
	    	})

	      	request.on('doneInProc', function(rowCount, more, rows){
	      		res.end("YUH3")
	      		
		    });

		    con.execSql(request);

		})
	}

	else{
		res.end();
	}
 
  
})

app.listen(process.env.PORT || 3000);


