$(document).ready(function(){
	$("#notes").text("");
	var ind = 0, progressWidth = 0;
	var notesDb = [];

	if(localStorage.notes) {
		notesDb = localStorage.notes.split(',');
		var len = notesDb.length;
		for(i=0; i<len; i++) {
			$("#notelist").append("<li>"+notesDb[i]+"</li>");
		}
	}

	$("#enter").click(function(){
		var note = $("#notes").val();
		notesDb.push(note);
		$("#notelist").append("<li>"+note+"</li>");
		$("#notes").val("");
	});

	$("#notes").bind("keypress",function(evt){
		var note = $("#notes").val();
		if(evt.keyCode === 13) {
			evt.preventDefault(); //kills the other buttons
			notesDb.push(note);
			$("#notelist").append("<li>"+note+"</li>");
			$(this).val("");
		}
		//evt.stopImmediatePropagation(); expensive for no reason at all
	});

	$("ol").click(function(){
		$(this).find("li").click(function(){
			$(this).addClass("selected");
			//check if that note has already been selected and remove selection
			if(ind !== $(this).index()) {
				$("li").eq(ind).removeClass("selected");
			}
			//mark selection
			ind = $(this).index();
		});
	});

	$("#delete").click(function(){
			if($("li").eq(ind).hasClass("selected")) {
				//notesDb.pop($("li").eq(ind).text());
				remove(notesDb, $("li").eq(ind).text());
				$("li").eq(ind).remove();
				localStorage.notes = notesDb;
			}
	});

	$("#save").click(function(){
		weight = notesDb.length;
		for(i=0; i<weight; i++) {
			progressWidth += (100/weight);
			prog = progressWidth.toString()+"%";
			$("#pro-bar").css("width",prog);
			$("#pro-txt").text(prog+" Complete");
		}
		localStorage.notes = notesDb;
	});
});

function remove(array, item) {
	var index = array.indexOf(item);
	if(index > -1) {
		array.splice(index, 1);
	}

}
