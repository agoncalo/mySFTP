var express = require('express');
var app = express();
var dnode = require('dnode');

app.post('/', function(req, res) {
	req.on('data', function (chunk) {
		var cmd = chunk.toString('utf-8').split(" ");
		switch(cmd[0]) {
			case "mkdir":
				var d = dnode.connect(7000);
				d.on('remote', function(remote) {
					remote.mkdir(cmd[1], function(s) {
						console.log(s);
					});;
				});
				break;
			case "rmdir":
				var d = dnode.connect(7000);
				d.on('remote', function(remote) {
					remote.rmdir(cmd[1], function(s) {
						console.log(s);
					});;
				});
				break;
			case "ls":
				var d = dnode.connect(7000);
				break;
			case "put":
				var d = dnode.connect(7000);
				break;
			case "get":
				var d = dnode.connect(7000);
				break;
			case "cd":
				var d = dnode.connect(7000);
				break;
			case "useradd":
				var d = dnode.connect(9000);
				d.on('remote', function(remote) {
					remote.useradd(cmd[1], cmd[2], function(s) {
						res.send(s);
						d.end();
					});
				});
				break;
			case "userdel":
				var d = dnode.connect(9000);
				d.on('remote', function(remote) {
					remote.userdel(cmd[1], function(s) {
						res.send(s);
						d.end();
					});
				});
				break;
			default:
				res.send("Invalid command\n");
		}
	});
});

app.listen(8000);
