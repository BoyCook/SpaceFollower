$(document).ready(function () {
    var app = new SPA("http://" + window.location.hostname + ':' + window.location.port);
   	app.getFollowTiddlers();
   
    $('#followSpaces').click(function(){
    	app.followSpaces($('#txtFollow').val().trim().split(' '));
	});
});

function SPA(host) {
    this.host = host;
	this.currentSpace = host.substring(host.indexOf('://') + 3, host.indexOf('.'));
	this.spaces = undefined;
	//TODO: do something with this data - i.e. provide client filter
	this.loadSpaces();    
}

SPA.prototype.followSpaces = function(spaces) {
	if (confirm('Do you want to follow [' + spaces.length + '] spaces? - ' + spaces)) {
		for (var i=0,len=spaces.length;i<len;i++) {
			this.doFollow(spaces[i]);
			//TODO call getFollowTiddlers in callback
		}		
	}
}

SPA.prototype.doFollow = function(space) {
	var url = this.host + '/bags/' + this.currentSpace + '_public/tiddlers/@' + space;
	var data = { tags: ['follow'] };
	var success = function(data) {
	};
	var error = function(error) {
		alert(error);
	};	
	this.putFollowTiddler(url, data, success, error);
}

SPA.prototype.loadSpaces = function() {
	var context = this;
	var success = function(data) {
		context.spaces = data;
	};
	var error = function(error) {
		alert(error);
	};
	this.load(this.host + '/spaces', success, error);	
}

SPA.prototype.getFollowTiddlers = function() {
	var context = this;	
	var success = function(data) {
		var following = '';
		for (var i=0,len=data.length;i<len;i++) {
			following += context.generateHtml(data[i].title);
		}
		context.renderTiddlers(following);
	};
	
	var error = function(error) {
		alert(error);
	};
	
	this.load(this.host + '/search?q=tag:follow', success, error);
}

SPA.prototype.renderTiddlers = function(html) {
   $('#following').html(html);	
}

SPA.prototype.putFollowTiddler = function(url, data, success, error) {
    $.ajax({
        url: url,
        type: 'PUT',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),        
        success: function(data, status, xhr) {
            success(data);
        },
        error: function(xhr, error, exc) {
            error(error);
        }
    });	
}

SPA.prototype.load = function(url, success, error) {
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(data, status, xhr) {
            success(data);
        },
        error: function(xhr, error, exc) {
            error(error);
        }
    });	
}

SPA.prototype.generateHtml = function(title) {
	return "<article><a onclick=\"stopFollowing('" + title.substring(1) + "')\";'><i class='icon-remove'></i></a>" +
	       "<a href='http://" + title.substring(1) + ".tiddlyspace.com' target='_blank'>" + title + "</a></article>"
}

function stopFollowing(space) {
	alert('Stop following: ' + space);
}

