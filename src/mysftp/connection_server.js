var express = require('express');
var app = express();
var dnode = require('dnode');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var aesjs = require('aes-js');
var multer = require('multer');
var fs = require('fs');

var upload = multer();

app.use(bodyParser());

var appDir = path.dirname(require.main.filename);

app.use(session({
	secret: 'senha',
	cookie: { maxAge: 1000000 }
}))

app.get('/', function(req, res) {
	if(!req.session.nome) {
		res.redirect('/login');
	} else { 
		res.sendFile(appDir + '/index.html');
	}
});

app.get('/login', function(req,res) {
	res.sendFile(appDir + '/login.html');
});

app.get('/sair', function(req,res) {
	req.session.destroy();
	res.redirect('/');
});

app.post('/login', function(req,res) {
	var sess = req.session;
	console.log(req.body.nome);
	console.log(req.body.senha);
	var d = dnode.connect(9000);
	d.on('remote', function(remote) {
		remote.verify(req.body.nome, req.body.senha, function(s) {
			if(s == 'Y') {
				sess.nome = req.body.nome;
				sess.dir = './' + req.body.nome + '/';
				console.log(sess.dir);
				res.redirect('/');
			} else {
				res.redirect('/login');
			}
			d.end();
		});
	});
});

app.post('/', function(req, res) {
	console.log("RECEIVING POST REQUEST");
	var key = [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
	var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
	var sess = req.session;
	req.on('data', function (chunk) {
		var encryptedBytes = aesjs.utils.hex.toBytes(chunk.toString('utf-8'));
		var decryptedBytes = aesCtr.decrypt(encryptedBytes);
		var data = aesjs.utils.utf8.fromBytes(decryptedBytes);
		var cmd = data.split(" ");
		var response = "";
		console.log(cmd);
		switch(cmd[0]) {
			case "mkdir":
				var d = dnode.connect(7000);
				d.on('remote', function(remote) {
					remote.mkdir(sess.dir + cmd[1], function(s) {
						if(s == "OK")
							response = "<div class='animated fadeInUp msg bg-success text-white'>Created directory "+cmd[1]+"</div>";
						else
							response = "<div class='animated shake msg bg-danger text-white' style='font-weight: bold;'>Can't create directory</div>";
						var encryptedData = aesCtr.encrypt(aesjs.utils.utf8.toBytes(response));
						var encryptedHex = aesjs.utils.hex.fromBytes(encryptedData);
						console.log(encryptedHex);
						res.send(encryptedHex);
					});;
				});
				break;
			case "rmdir":
				var d = dnode.connect(7000);
				d.on('remote', function(remote) {
					remote.rmdir(sess.dir + cmd[1], function(s) {
						if(s == "OK")
							response = "<div class='animated fadeInUp msg bg-success text-white'>Removed directory "+cmd[1]+"</div>";
						else
							response = "<div class='animated shake msg bg-danger text-white' style='font-weight: bold;'>Can't remove directory</div>";
							var encryptedData = aesCtr.encrypt(aesjs.utils.utf8.toBytes(response));
							var encryptedHex = aesjs.utils.hex.fromBytes(encryptedData);
							console.log(encryptedHex);
							res.send(encryptedHex);
					});;
				});
				break;
			case "ls":
				var d = dnode.connect(7000);
				console.log(sess);
				d.on('remote', function(remote) {
					remote.ls(sess.dir, function(s) {
						console.log(s);
						var msg = "<h3 class='animated fadeInUp'>Arquivos em "+ sess.dir +":</h3>";
						s.forEach(function (i) {
							msg = msg + "<li class='animated fadeInUp'>" + i.file + "</li>";
						});
						response = msg;
						var encryptedData = aesCtr.encrypt(aesjs.utils.utf8.toBytes(response));
						var encryptedHex = aesjs.utils.hex.fromBytes(encryptedData);
						console.log(encryptedHex);
						res.send(encryptedHex);
					});
					console.log(response);
				});
				break;
			case "put":
				response = "<form class='animated fadeInUp' id='fsend' method='post' enctype='multipart/form-data' action='/send'><h3>Enviar arquivo:</h3><input name='fname' type='text' placeholder='Nome do arquivo'/><input name='arquivo' type='file' /><br><button>Enviar</button></form>";
				var encryptedData = aesCtr.encrypt(aesjs.utils.utf8.toBytes(response));
				var encryptedHex = aesjs.utils.hex.fromBytes(encryptedData);
				console.log(encryptedHex);
				res.send(encryptedHex);
				break;
			case "get":
				var d = dnode.connect(7000);
				d.on('remote', function(remote) {
					remote.get(sess.dir + cmd[1], function(s) {
						fs.writeFile(cmd[1], s, function(err) {
							if(err || s == "ERRO") {
								response = "<div class='animated shake msg bg-danger text-white' style='font-weight: bold;'>Can't load file</div>";
								var encryptedData = aesCtr.encrypt(aesjs.utils.utf8.toBytes(response));
								var encryptedHex = aesjs.utils.hex.fromBytes(encryptedData);
								console.log(encryptedHex);
								res.send(encryptedHex);
							} else {
								console.log("ARQUIVO ESCRITO");
								response = "<form method='post' action='/get' class='animated fadeInUp' id='fget'><button>Download</button></form>";
								sess.fname = cmd[1];
								var encryptedData = aesCtr.encrypt(aesjs.utils.utf8.toBytes(response));
								var encryptedHex = aesjs.utils.hex.fromBytes(encryptedData);
								console.log(encryptedHex);
								res.send(encryptedHex);
							}
						});
					});
				});
				
				break;
			case "cd":
				if(cmd[1] == "..") {
					var dirsplit = sess.dir.split("/");
					dirsplit.pop();
					dirsplit.pop();
					if(dirsplit[dirsplit.length-1] != ".") {
						sess.dir = dirsplit.join("/") + "/";
						response = "<div class='animated fadeInUp msg bg-success text-white'>Changed directory to "+sess.dir+"</div>";
					} else {
						response = "<div class='animated shake msg bg-danger text-white' style='font-weight: bold;'>Can't change directory</div>";
					}
					
					var encryptedData = aesCtr.encrypt(aesjs.utils.utf8.toBytes(response));
					var encryptedHex = aesjs.utils.hex.fromBytes(encryptedData);
					console.log(encryptedHex);
					res.send(encryptedHex);
				} else {
					var d = dnode.connect(7000);
					d.on('remote', function(remote) {
						remote.cd(sess.dir + cmd[1], function(s) {
							if(s == "OK") {
								sess.dir = sess.dir + cmd[1] + "/";
								response = "<div class='animated fadeInUp msg bg-success text-white'>Changed directory to "+sess.dir+"</div>";
							} else {
								response = "<div class='animated shake msg bg-danger text-white' style='font-weight: bold;'>Can't change directory</div>";
							}
							var encryptedData = aesCtr.encrypt(aesjs.utils.utf8.toBytes(response));
							var encryptedHex = aesjs.utils.hex.fromBytes(encryptedData);
							console.log(encryptedHex);
							res.send(encryptedHex);
						});
					});
				}
				break;
			case "useradd":
				var d = dnode.connect(9000);
				d.on('remote', function(remote) {
					remote.useradd(cmd[1], cmd[2], function(s) {
						if(s == "OK")
							response = "<div class='animated fadeInUp msg bg-success text-white'>User created!</div>";
						d.end();
						var encryptedData = aesCtr.encrypt(aesjs.utils.utf8.toBytes(response));
						var encryptedHex = aesjs.utils.hex.fromBytes(encryptedData);
						console.log(encryptedHex);
						res.send(encryptedHex);
					});
				});
				break;
			case "userdel":
				var d = dnode.connect(9000);
				d.on('remote', function(remote) {
					remote.userdel(cmd[1], function(s) {
						if(s == "OK")
							response = "<div class='animated fadeInUp msg bg-success text-white'>User removed!</div>";
						d.end();
						var encryptedData = aesCtr.encrypt(aesjs.utils.utf8.toBytes(response));
						var encryptedHex = aesjs.utils.hex.fromBytes(encryptedData);
						console.log(encryptedHex);
						res.send(encryptedHex);
					});
				});
				break;
			case "verify":
				var d = dnode.connect(9000);
				d.on('remote', function(remote) {
					remote.verify(cmd[1], cmd[2], function(s) {
						response = s;
						d.end();
						var encryptedData = aesCtr.encrypt(aesjs.utils.utf8.toBytes(response));
						var encryptedHex = aesjs.utils.hex.fromBytes(encryptedData);
						console.log(encryptedHex);
						res.send(encryptedHex);
					});
				});
				break;
			default:
				response = "<div class='animated shake msg bg-danger text-white' style='font-weight: bold;'>Invalid command!</div>";
				var encryptedData = aesCtr.encrypt(aesjs.utils.utf8.toBytes(response));
				var encryptedHex = aesjs.utils.hex.fromBytes(encryptedData);
				console.log(encryptedHex);
				res.send(encryptedHex);
		}
	});
});

app.post('/send', upload.single('arquivo'), function(req, res, next) {
	var sess = req.session;
	var d = dnode.connect(7000);
	console.log(req.body);
	d.on('remote', function(remote) {
		remote.put(sess.dir + req.body.fname, req.file.buffer.toString('utf8'), function(s) {
			res.send(s);
		});
	});
});

app.post('/get', function(req, res, next) {
	var sess = req.session;
	res.sendFile(appDir + "/" + sess.fname);
});

app.listen(8000);
