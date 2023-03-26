// Requiring express package for routing
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')


// Creating app
const app = express();
app.use(cors())
app.use('/downloads', express.static('/home/adarsh/Downloads'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// The folder path for the files
const folderPath = '/home/adarsh/Downloads/';

// GET request for single file
app.get('/single/:id',function(req,res) {
	console.log('single file ' + req.params.id);
	// Download function provided by express
	res.download('/home/adarsh/Downloads/code-1.75.1-1675893486.el7.x86_64.rpm', function(err) {
		if(err) {
			console.log(err);
		}
	})
})

app.get('/files/:link', (req, res) => {
	console.log(req.params.link)
	res.send( 'http://localhost:3000/downloads/'  +'code-1.75.1-1675893486.el7.x86_64.rpm');
})
// Creating server at port 3000
app.listen(3000,function(req,res){
	console.log('Server started to listen at 3000');
})

