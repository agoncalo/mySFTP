var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'admin',
	password : 'password',
	database : 'mysftp'
});
var dnode = require('dnode');

var server = dnode({
	useradd : function (s, p, cb) {
		var sql = "INSERT INTO users (nome, senha) VALUES ('"+s+"', MD5('"+p+"'))";
		console.log(sql);
		connection.query(sql, function(err, results) {
			console.log(err);
			console.log(results);
			if(err) {
				cb("ERRO");
			} else {
				var d = dnode.connect(7000);
				d.on('remote', function (remote) {
					remote.useradd(s, function(x) {
						console.log(x);
					});
					d.end();
				});
			}
		});
		cb("OK");
	},
	userdel : function (s, cb) {
		var sql = "DELETE FROM users WHERE nome='"+s+"'";
		console.log(sql);
		connection.query(sql, function(err, results) {
			console.log(err);
			console.log(results);
			if(err) {
				cb("ERRO");
			} else {
				var d = dnode.connect(7000);
				d.on('remote', function (remote) {
					remote.userdel(s, function(x) {
						console.log(x);
					});
					d.end();
				});
			}
		});
		cb("OK");
	},
	verify : function (s, p, cb) {
		var sql = "SELECT EXISTS(SELECT 1 FROM users WHERE nome='" + s + "' AND senha=MD5('" + p + "')) AS r";
		console.log(sql);
		connection.query(sql, function(err, results) {
			console.log(err);
			console.log(results);
			if(err) cb("ERRO");
			else {
				if(results[0]['r'] == 1) {
				
					cb("Y");
				} else {
					cb("N");
				}
			};
		});
	}
});

server.listen(9000);
