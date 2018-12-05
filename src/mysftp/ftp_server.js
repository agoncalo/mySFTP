var dnode = require('dnode');
var mkdirp = require('mkdirp');
var rmdir = require('rmdir');
var ls = require('ls');
var fs = require('fs');	

var server = dnode({
	mkdir : function (s, cb) {
		mkdirp(s, function(err) {
			if(err) cb("NO");
			else cb("OK");
		});
	},
	rmdir : function (s, cb) {
		rmdir(s, function(err) {
			if (err) cb("NO");
			else cb("OK");
		});
	},
	ls : function (s, cb) {
		var list = ls(s + "*");
		console.log(list);
		list.forEach(function(element) {
			if(fs.lstatSync(s+element.file).isDirectory()) {
				element.file = element.file + "/";
			}
		});
		cb(list);
	},
	put : function (s, p, cb) {
		fs.writeFile(s, p, function(err) {
			console.log(err);
			if (err) cb("ERRO");
			else cb("OK");
		});
	},
	get : function (s, cb) {
		fs.readFile(s, 'utf8', function(err,contents) {
			if (err) cb("ERRO");
			else cb(contents);
		});
	},
	cd : function (s, cb) {
		try {
			if(fs.lstatSync(s).isDirectory()) {
				cb("OK");
			}
		} catch (e) {
			cb("NO");
		}
	},
	useradd : function (s, cb) {
		mkdirp(s, function(err) {
			console.log(err);
			if (err) cb("ERRO");
			else cb("OK\n");
		});
	},
	userdel : function (s, cb) {
		rmdir(s, function(err) {
			console.log(err);
			if (err) cb("ERRO");
			else cb("OK\n");
		});
	}
});

server.listen(7000);
