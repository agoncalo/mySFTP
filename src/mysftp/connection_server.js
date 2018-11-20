var express = require('express');
var app = express();
var dnode = require('dnode');

app.post('/', function(req, res) {
	req.on('data', function (chunk) {
		var cmd = split(chunk, " ");
		switch(cmd[0]) {
			case "mkdir":
				var ftp = dnode.connect(7000);
				break;
			case "rmdir":
				var ftp = dnode.connect(7000);
				break;
			case "ls":
				var ftp = dnode.connect(7000);
				break;
			case "put":
				var ftp = dnode.connect(7000);
				break;
			case "get":
				var ftp = dnode.connect(7000);
				break;
			case "cd":
				var ftp = dnode.connect(7000);
				break;
			case "useradd":
				var ftp = dnode.connect(9000);
				break;
			case "userdel":
				var ftp = dnode.connect(9000);
				break;
		}
	});
});
