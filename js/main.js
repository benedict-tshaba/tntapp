$(document).ready(function(){
	$("#notes").text("");
	var db = openDatabase('notesdb', '1.0', 'Notes DB', 2 * 1024 * 1024);
	var msg;
	var ind = 0;
	var progressWidth = 0;
	var notesDb = [];

	db.transaction(function (tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS NOTES (id unique autoincrement, note)');
	});

	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM NOTES', [], function (tx, results) {
		var len = results.rows.length, i;
		for (i = 0; i < len; i++){
			msg = "<li>" + results.rows.item(i).note + "</li>";
			$("#notelist").append(msg);
		}
		}, null);
	});


	$("#enter").click(function(){
		var note = $("#notes").val();
		notesDb.push(note);
		$("#notelist").append("<li>"+note+"</li>");
		$("#notes").val("");
	});

	$("#notes").bind("keypress",function(evt){
		//evt.preventDefault(); kills the other buttons
		var note = $("#notes").val();
		if(evt.keyCode === 13) {
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
				db.transaction(function (tx) {
					tx.executeSql('DELETE FROM NOTES WHERE note='+$("li").eq(ind).text()+'');
				});
				notesDb.pop($("li").eq(ind).text());
				$("li").eq(ind).remove();
			}
	});

	$("#save").click(function(){
		weight = notesDb.length;
		for(i=0; i<weight; i++) {
			db.transaction(function(tx) {
				tx.executeSql('INSERT INTO NOTES (note) VALUES ('+notesDb[i]+')');
				progressWidth += (100/weight);
				prog = progressWidth.toString()+"%";
				$("#pro-bar").css("width",prog);
				$("#pro-txt").text(prog+" Complete");
			});
		}
	});
});
