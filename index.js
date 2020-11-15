var selected = "";
var row = 0;
var roster;
var chars = [];
var idCount = 0;
var rowCount = 0;


function buildStr() {
	var display = document.getElementsByTagName('p')[0];
	var char;
	for (var c = 0; c < chars.length; c++) {
		if (chars[c] && chars[c].name === selected) {
			char = chars[c];
		}
	}
	var title = "<b style='font-size:24px'>" + char.name + "</b><br>";
	var stats = "HP: " + char.hp + "| ATK: " + char.atk + "| SPD: " + char.spd + "| SHI: " + char.shi + "<br><br>";
	var str1 = "<u style='font-size=20px;'>Inventory</u><ul style='list-style-type:none;margin:0;padding:0;'>";
	for (var i = 0; i < char.inv.length; i++) {
		if (i > 0) {
			str1 += "<div style='line-height:10px;'><br></div>";
		}
		str1 += "<li>" + char.inv[i].name;

		var plus = "";
		if (char.inv[i].hp) {
			plus += "HP: " + char.inv[i].hp;
		}
		if (char.inv[i].atk) {
			if (plus) {
				plus += " | ";
			}
			plus += "ATK: " + char.inv[i].atk;
		}
		if (char.inv[i].spd) {
			if (plus) {
				plus += " | ";
			}
			plus += "SPD: " + char.inv[i].spd;
		}
		if (char.inv[i].rec) {
			if (plus) {
				plus += " | ";
			}
			plus += "REC: " + char.inv[i].rec;
		}
		if (plus && plus.length > 0) {
			str1 += " (" + char.inv[i].weight + ") " + plus;
		}

		str1 += "<pre style='margin:0;'>";
		if (char.inv[i].desc) {
			str1 += char.inv[i].desc;
		}
		else {
			str1 += "N/A";
		}
		str1 += "</li>";
	}
	str1 += "</ul><br>";
	var str2 = "<u style='font-size=20px;'>Skills</u><ul style='list-style-type:none;margin:0;padding:0;'>";
	for (var s = 0; s < char.skills.length; s++) {
		if (s > 0) {
			str2 += "<div style='line-height:10px;'><br></div>";
		}
		str2 += "<li>" + char.skills[s].name + " (" + char.skills[s].type;
		if (char.skills[s].cooldown > 0) {
			str2 += " | " + char.skills[s].cooldown + " turns";
		}
		str2 += ")<pre style='margin:0;'>";
		if (char.skills[s].desc) {
			str2 += char.skills[s].desc
		}
		else {
			str2 += "N/A"
		}
		str2 += "</li>"
	}
	str2 += "</ul>"

	var text = title + stats + str1 + str2;
	display.innerHTML = text;
}

function select() {
	row = this.parentElement.parentElement.rowIndex;
	selected = this.parentElement.parentElement.getElementsByTagName('td')[0].innerText;

	buildStr();
}

function openNew() {
	document.getElementById("newForm").style.display = "block";
}

function remove() {
	if (!selected) {
		alert("A character must be selected first.");
	}
	else {
		document.getElementsByTagName('table')[0].deleteRow(row);
		for (var c = 0; c < chars.length; c++) {
			if (chars[c] && chars[c].name == selected) {
				delete chars[c];
				chars = chars.filter(function (el) {
 					return el != null;
				});
				rowCount--;
			}
		}
	}

	localStorage.setItem("roster", JSON.stringify(chars));

	for (var r = 0; r < roster.length; r++) {
		roster[r].removeAttribute('id');
		if (r % 2 === 1) {
			roster[r].setAttribute('id', 'tr_odd');
		}
		else {
			roster[r].setAttribute('id', 'tr_even');
		}
	}
}

function openEdit() {
	if (!selected) {
		alert("A character must be selected first.");
	}
	else {
		var form = document.getElementById('editForm');
		form.getElementsByTagName('h3')[0].innerText = "Edit " + selected;
		document.getElementById("editForm").style.display = "block";
	}
}

function charExists(name) {
	for (var c = 0; c < chars.length; c++) {
		if (chars[c] && chars[c].name === name) {
			return c;
		}
	}
	return -1;
}

function createChar() {
	var newName = document.getElementsByName('name')[0].value;
	var newFamily = document.getElementsByName('family')[0].value;
	var newHP = document.getElementsByName('hp')[0].value;
	var newATK = document.getElementsByName('atk')[0].value;
	var newSPD = document.getElementsByName('spd')[0].value;
	var newSHI = document.getElementsByName('shi')[0].value;

	if (charExists(newName) > -1) {
		closeForm();
		alert(newName + " is already registered.");
	}
	else {
		var char = {
			id: idCount,
			name: newName,
			family: newFamily,
			hp: newHP,
			atk: newATK,
			spd: newSPD,
			shi: newSHI,
			skills: [],
			inv: []
		};
		chars.push(char);
		idCount++;

		var newRow = document.getElementsByTagName('table')[0].insertRow(-1);
		if (rowCount % 2 == 1) {
			newRow.setAttribute("id", "tr_odd");
		}
		else {
			newRow.setAttribute("id", "tr_even");
		}
		var cellName = newRow.insertCell(-1);
		var cellFamily = newRow.insertCell(-1);
		var cellHP = newRow.insertCell(-1);
		var cellATK = newRow.insertCell(-1);
		var cellSPD = newRow.insertCell(-1);
		var cellSHI = newRow.insertCell(-1);
		var cellSelect = newRow.insertCell(-1);
		cellName.innerText = newName;
		cellFamily.innerText = newFamily;
		cellHP.innerText = newHP;
		cellATK.innerText = newATK;
		cellSPD.innerText = newSPD;
		cellSHI.innerText = newSHI;
		cellSelect.innerHTML = "<button>Select</button>";
		cellSelect.firstChild.onclick = select;
		rowCount++;

		closeForm();
		localStorage.setItem("roster", JSON.stringify(chars));
	}
}

function addItem() {
	var i = chars[charExists(selected)].inv;
	var cap = Math.floor(chars[charExists(selected)].atk / 5) + 5;
	var currCost = 0;
	for (var ic = 0; ic < i.length; ic++) {
		currCost += parseInt(i[ic].weight);
	}
	var newName = document.getElementsByName('item_name')[0].value;
	var newCost = document.getElementsByName('weight')[0].value;
	var newHP = document.getElementsByName('item_hp')[0].value;
	var newATK = document.getElementsByName('item_atk')[0].value;
	var newSPD = document.getElementsByName('item_spd')[0].value;
	var newREC = document.getElementsByName('item_rec')[0].value;
	var newDesc = document.getElementsByName('item_desc')[0].value;
	var newItem = {
		name: newName,
		hp: newHP,
		atk: newATK,
		spd: newSPD,
		rec: newREC,
		weight: newCost,
		desc: newDesc,
	};
	if (currCost + parseInt(newCost) <= cap) {
		i.push(newItem);
		chars[charExists(selected)].inv = i;
		alert(newName + ' has been given to ' + selected + '.');
	}
	else {
		alert(selected + ' cannot hold ' + newName + '.');
	}
}

function addSkill() {
	var s = chars[charExists(selected)].skills;
	var newName = document.getElementsByName('skill_name')[0].value;
	var newType = document.getElementsByName('type')[0].value;
	var newTimer = document.getElementsByName('cooldown')[0].value;
	var newDesc = document.getElementsByName('skill_desc')[0].value;
	var newSkill = {
		name: newName,
		type: newType,
		cooldown: newTimer,
		desc: newDesc,
	};
	s.push(newSkill);
	chars[charExists(selected)].skills = s;
	alert(selected + ' has learned ' + newName + '.');
}

function editChar() {
	var newName = document.getElementsByName('name')[1].value;
	var newFamily = document.getElementsByName('family')[1].value;
	var newHP = document.getElementsByName('hp')[1].value;
	var newATK = document.getElementsByName('atk')[1].value;
	var newSPD = document.getElementsByName('spd')[1].value;
	var newSHI = document.getElementsByName('shi')[1].value;

	var index = charExists(selected);
	var update = chars[index];
	if (newName) {
		update.name = newName;
	} 
	if (newFamily) {
		update.family = newFamily;
	}
	if (newHP) {
		update.hp = newHP;
	} 
	if (newATK) {
		update.atk = newATK;
	} 
	if (newSPD) {
		update.spd = newSPD;
	} 
	if (newSHI) {
		update.shi = newSHI;
	} 

	chars[index] = update;
	for (var t = 1; t < roster.length; t++) {
		if (roster[t].cells[0].innerText === selected) {
			roster[t].cells[0].innerText = update.name;
			roster[t].cells[1].innerText = update.family;
			roster[t].cells[2].innerText = update.hp;
			roster[t].cells[3].innerText = update.atk;
			roster[t].cells[4].innerText = update.spd;
			roster[t].cells[5].innerText = update.shi;
		}
	}

	localStorage.setItem("roster", JSON.stringify(chars));
	buildStr();
	closeForm();
}

function closeForm() {
	document.getElementById("newForm").style.display = "none";
	document.getElementById("editForm").style.display = "none";
}

function download() {
	chars = chars.filter(function (el) {
 		return el != null;
	});
	var text = JSON.stringify(chars),
    blob = new Blob([text], { type: 'text/plain' }),
    anchor = document.createElement('a');

	anchor.download = "import.txt";
	anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
	anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
	anchor.click();
}

function upload() {
	var input = document.createElement('input');
	input.type = 'file';

	input.onchange = e => { 
		var file = e.target.files[0]; 
		var reader = new FileReader();
   		reader.readAsText(file,'UTF-8');
   		reader.onload = readerEvent => {
   			for (var r = document.getElementsByTagName('table')[0].rows.length - 1; r > 0; r--) {
   				document.getElementsByTagName('table')[0].deleteRow(r);
   			}

   			row = 0;
   			rowCount = 1;
	      	chars = JSON.parse(readerEvent.target.result);
	      	localStorage.setItem("roster", JSON.stringify(chars));
	      	idCount = chars.length;
	      	setup();
   		}
	}

	input.click();
}

function switchScene() {
	var main_style = getComputedStyle(main);
	var sim_style = getComputedStyle(sim);

	if (main_style.display === "none") {
		main.style.display = "block";
	} else {
	    main.style.display = "none";
	}

	if (sim_style.display === "none") {
		sim.style.display = "block";
	} else {
	    sim.style.display = "none";
	}
}

/**
* ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

function setup() {
	roster = document.getElementsByTagName('table')[0].rows;

	if (localStorage.getItem("roster") === null) {
		localStorage.setItem("roster", JSON.stringify(chars));
	}
	else {
		chars = JSON.parse(localStorage.getItem("roster"));
		chars = chars.filter(function (el) {
 			return el != null;
		});
	}

	rowCount = 1;
	for (var c = 0; c < chars.length; c++) {
		if (chars[c]) {
			var row = document.getElementsByTagName('table')[0].insertRow(-1);
			var cell1 = row.insertCell(-1);
			var cell2 = row.insertCell(-1);
			var cell3 = row.insertCell(-1);
			var cell4 = row.insertCell(-1);
			var cell5 = row.insertCell(-1);
			var cell6 = row.insertCell(-1);
			var cell7 = row.insertCell(-1);

			if (rowCount % 2 == 1) {
				row.setAttribute("id", "tr_odd");
			}
			else {
				row.setAttribute("id", "tr_even");
			}

			cell1.innerText = chars[c].name;
			cell2.innerText = chars[c].family;
			cell3.innerText = chars[c].hp;
			cell4.innerText = chars[c].atk;
			cell5.innerText = chars[c].spd;
			cell6.innerText = chars[c].shi;
			cell7.innerHTML = "<button>Select</button>";
			cell7.firstChild.onclick = select;

			rowCount++;
		}
	}
}

window.onload = setup;