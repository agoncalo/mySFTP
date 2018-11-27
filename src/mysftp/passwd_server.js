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
		console.log("Adding user");
		connection.connect();
		var sql = "INSERT INTO users (nome, senha) VALUES ('"+s+"', MD5('"+p+"'))"
		connection.query(sql, function(err, results) {
			if(err) {
				cb(err);
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
		connection.end();
		cb("OK");
	},
	userdel : function (s, cb) {
		connection.connect();
		var sql = "DELETE FROM users WHERE nome="+s;
		connection.query(sql, function(err, results) {
			if(err) cb(err);
		});
		connection.end();
		var d = dnode.connect(7000);
		d.on('remote', function (remote) {
			remote.userdel(s, function(x) {
				console.log(x);
			});
			d.end();
		});
		cb("OK");
	},
	verify : function (s, p, cb) {
		connection.connect();
		var sql = "SELECT EXISTS(SELECT 1 FROM users WHERE nome=" + s + " AND senha=MD5(" + s + "))";
		connection.query(sql, function(err, results) {
			if(err) cb(err);
			else {
				cb(results[0]);
			};
			d.end();
		});
		connection.end();
	}
});

server.listen(9000);
