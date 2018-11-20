var dnode = require('dnode');
var mkdirp = require('mkdirp');
var rmdir = require('rmdir');
var ls = require('ls');

var server = dnode({
	mkdir : function (s, cb) {
		mkdirp(s, function(err) {
			console.log("Erro ao criar pasta.");
		}
	},
	rmdir : function (s, cb) {
		rmdir(s, function(err) {
			console.log("Erro ao remover pasta.");
		}
	},
	ls : function (s, cb) {
		
	},
	put : function (s, cb) {
	
	},
	get : function (s, cb) {
	
	},
	cd : function (s, cb) {
	
	},
	useradd : function (s, cb) {
	
	},
	userdel : function (s, cb) {
	
	}
});

server.listen(7000);
