const table = document.querySelector("table");
const tbody = document.querySelector("tbody");
const th = document.querySelectorAll("th");

let isAscending = true;

let addRow = () => {
	let newRow = document.createElement("tr");
	tbody.appendChild(newRow);
	let checkMarkData = document.createElement("td");
	checkMarkData.innerHTML = `<i class="bi bi-check2"></i>`;
	newRow.appendChild(checkMarkData);
	for (i = 1; i < th.length; i++) {
		let newTableData = document.createElement("td");
		headings = th[i].id;
		newTableData.innerHTML = `<input/>`;
		newRow.appendChild(newTableData);
	}
};
let rowDown = () => {
	const activeRow = tbody.querySelector(".active");
	const nextRow = activeRow.nextElementSibling;
	if (nextRow) {
		tbody.insertBefore(nextRow, activeRow);
	}
};
let rowUp = () => {
	const activeRow = tbody.querySelector(".active");
	const prevRow = activeRow.previousElementSibling;
	if (prevRow) {
		tbody.insertBefore(activeRow, prevRow);
	}
};
let deleteRow = () => {
	const activeRow = tbody.querySelector(".active");
	if (activeRow) {
		activeRow.parentNode.removeChild(activeRow);
	}
};
let saveTable = () => {
	const tableRows = tbody.querySelectorAll("tr");
	let tableData = [];
	for (let i = 0; i < tableRows.length; i++) {
		let row = tableRows[i];
		let rowData = {};
		let cells = row.querySelectorAll("td:not(:first-child)");
		for (let j = 0; j < cells.length; j++) {
			let cell = cells[j];
			if (cell.firstChild.tagName === "INPUT") {
				rowData[th[j + 1].id] = cell.firstChild.value;
			} else {
				rowData[th[j + 1].id] = cell.innerHTML;
			}
		}
		tableData.push(rowData);
	}
	alert("JSON data in console");
	console.log(JSON.stringify(tableData));
};

let mapRows = (array) => {
	array.forEach((product) => {
		let newRow = document.createElement("tr");
		newRow.setAttribute("id", `row-${product.id}`);
		let tableHeadings = Object.keys(product);
		let checkMarkData = document.createElement("td");
		checkMarkData.innerHTML = `<i class="bi bi-check2"></i>`;
		newRow.appendChild(checkMarkData);
		tableHeadings.map((headings) => {
			let newTableData = document.createElement("td");
			if (headings === "qty" || headings === "visco" || headings === "density") {
				newTableData.innerHTML = `<input value="${product[headings]}"/>`;
			} else {
				newTableData.innerHTML = product[headings];
			}
			newRow.appendChild(newTableData);
		});
		tbody.appendChild(newRow);
	});
};

let sortData = (array, objectID, sortOrder) => {
	if (isAscending !== true && isAscending !== false) {
		sortOrder === "asc";
	}
	tbody.innerHTML = "";
	let sortedData =
		sortOrder === "asc"
			? [...array].sort((firstElement, secondElement) => {
					if (firstElement[objectID] > secondElement[objectID]) {
						return 1;
					} else if (firstElement[objectID] < secondElement[objectID]) {
						return -1;
					} else return 0;
			  })
			: [...array].sort((firstElement, secondElement) => {
					if (firstElement[objectID] > secondElement[objectID]) {
						return -1;
					} else if (firstElement[objectID] < secondElement[objectID]) {
						return 1;
					} else return 0;
			  });
	mapRows(sortedData);
};
const loadData = async () => {
	try {
		const response = await fetch("../data/chemicalsData.json");
		if (response.ok) {
			const data = await response.json();

			mapRows(data);
			const tr = table.getElementsByTagName("tr");
			const thead = document.querySelectorAll("th");

			for (let i = 1; i < tr.length; i++) {
				tr[i].addEventListener("click", function () {
					for (let j = 0; j < tr.length; j++) {
						tr[j].classList.remove("active");
					}
					this.classList.add("active");
				});
			}

			const addNewRow = document.getElementById("addRow");
			const refresh = document.getElementById("refreshTable");
			const save = document.getElementById("saveTable");

			save.addEventListener("click", () => {
				saveTable();
			});

			refresh.addEventListener("click", () => {
				tbody.innerHTML = "";
				mapRows(data);
			});
			// moveRowDown.addEventListener("click", () => {
			// 	rowDown();
			// });
			// moveRowUp.addEventListener("click", () => {
			// 	rowUp();
			// });

			addNewRow.addEventListener("click", () => {
				addRow(data);
			});
			thead.forEach((header) => {
				header.addEventListener("click", (header) => {
					let sortOrder = isAscending ? "asc" : "desc";
					sortData(data, header.target.id, sortOrder);
					isAscending = !isAscending;
				});
			});
		} else {
			throw new Error("Failed to load JSON file");
		}
	} catch (error) {
		console.log(error);
	}
};
loadData();
