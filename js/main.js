$(document).ready(function(){
	$("#notes").text(""); //clear the notebox. On startup the <tab> character 								gets written, and I still cant find out why. 
	var ind = 0, progressWidth = 0;
	var notesDb = [];

	// Check if we have notes in the database and fill them in the notelist
	if(localStorage.notes) {
		notesDb = localStorage.notes.split(',');
		var len = notesDb.length;
		for(i=0; i<len; i++) {
			$("#notelist").append("<li>"+notesDb[i]+"</li>");
		}
	}
	
	//enable confirmation dialog
	// Deletes a note from the database and removes it from the notelist after success confirmation
	$('[data-toggle=confirmation]').confirmation({
	  rootSelector: '[data-toggle=confirmation]',
	  onConfirm: function() {
			if($("li").eq(ind).hasClass("selected")) {
				//notesDb.pop($("li").eq(ind).text());
				remove(notesDb, $("li").eq(ind).text());
				$("li").eq(ind).remove();
				localStorage.notes = notesDb;
			}
	},
	});

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

	// Copies a note on double click to the note box
	$("ol").find("li").bind("dblclick",function(){
		$("#notes").text($(this).text());
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

/*
	// Deletes a note from the database and removes it from the notelist
	$("#delete").click(function(){
			if($("li").eq(ind).hasClass("selected")) {
				//notesDb.pop($("li").eq(ind).text());
				remove(notesDb, $("li").eq(ind).text());
				$("li").eq(ind).remove();
				localStorage.notes = notesDb;
			}
	});
*/

	// Moves selected note to the top of the note list
	$("#prioritise").click(function(){
		if($("li").eq(ind).hasClass("selected")) {
			var currentNote = $("li").eq(ind).text();
			remove(notesDb, currentNote); //remove it from database
			notesDb.unshift(currentNote); //prepend selected note
			localStorage.notes = notesDb; //update local storage
			repopulateNoteList(notesDb);
		}
	});

	// Saves a note to the database
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

// Apparently javascript has no array.remove function which is stupid I think
// Anyway this function is an implementation of that.
function remove(array, item) {
	var index = array.indexOf(item);
	if(index > -1) {
		array.splice(index, 1);
	}

}

function repopulateNoteList(dataArr) {
	$("#notelist").text(""); //clear the note list
	for(i=0;i<dataArr.length;i++) {
		$("#notelist").append("<li>"+dataArr[i]+"</li>");
	}
}
