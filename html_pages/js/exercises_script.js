function Exercise(id, exercise_name, weight, set_count, rep_count, equipment) {
    this.id = id;
    this.exercise_name = exercise_name;
    this.weight = weight;
    this.set_count = set_count;
    this.rep_count = rep_count;
    this.equipment = equipment;
}

const dataAttributes = {
    "exercise_name": {
        "type": "text",
        "name": "exercise_name"
    },
    "weight": {
        "type": "number",
        "name": "weight"
    },
    "set_count": {
        "type": "number",
        "name": "set_count"
    },
    "rep_count": {
        "type": "number",
        "name": "rep_count"
    },
    "equipment": {
        "type": "text",
        "name": "equipment"
    },
}


function createTable(dataRowsArray) {
    let tableElement = document.querySelector("#exercises_table");
    let tableBodyElement = document.createElement("tbody");
    tableBodyElement.setAttribute("id", "table_body");
    tableElement.appendChild(tableBodyElement);

    for (let row = 0; row < dataRowsArray.length; row++) {
        let tableRowElement = document.createElement("tr");
        tableBodyElement.appendChild(tableRowElement)

        let exercise = dataRowsArray[row];
        let keysArray = Object.keys(exercise);

        // create id table data
        let idTDElement = document.createElement("td");
        idTDElement.innerText = exercise.id;
        idTDElement.setAttribute("class", "db_id");
        tableRowElement.appendChild(idTDElement);

        // populate table with exercise data
        for (let index = 1; index < keysArray.length; index++) {
            let tdElement = document.createElement("td");
            let inputElement = document.createElement("input");
            let key = keysArray[index];
            inputElement.setAttribute("type", dataAttributes[key].type);
            inputElement.setAttribute("name", dataAttributes[key].name);
            inputElement.setAttribute("value", exercise[key]);
            inputElement.disabled = true;
            tdElement.appendChild(inputElement);
            tableRowElement.appendChild(tdElement);
        }

        // add edit button
        let updateButton = document.createElement("button");
        updateButton.setAttribute("type", "button");
        updateButton.setAttribute("class", "edit-button");
        updateButton.setAttribute("id", `edit-button-${row}`);
        updateButton.innerHTML = "Edit";
        tdElement = document.createElement("td");
        tdElement.appendChild(updateButton);
        tableRowElement.appendChild(tdElement);

        // add delete button
        let deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.setAttribute("class", "delete-button");
        deleteButton.setAttribute("id", `delete-button-${row}`);
        deleteButton.innerHTML = "Delete";
        tdElement = document.createElement("td");
        tdElement.appendChild(deleteButton);
        tableRowElement.appendChild(tdElement);
    }
}

function destroyAndRecreateTable() {
    // destroy table
    let tableBodyElement = document.querySelector("#table_body");
    tableBodyElement.remove();
    // create brand new table (entire table)
    let responseData = getData();
    responseData.then(dataRowsArray => {
        createTable(dataRowsArray);
    });
}

function checkRowForUpdates(childTDElements) {
    let updates = false;
    for (let rowIndex = 1; rowIndex < childTDElements.length - 2; rowIndex++) {
        let classStr = childTDElements[rowIndex].firstChild.getAttribute("class");
        if (classStr) {
            if (classStr.includes("field-updated")) {
                updates = true;
                break;
            }
        }
    }
    return updates;
}

function deleteButtonListener() {
    let tableElement = document.querySelector("#exercises_table");
    
    tableElement.addEventListener("click", event => {
        let targetElement = event.target;
    
        // update button behavior
        let buttonClass = targetElement.getAttribute("class");
        if(buttonClass === "delete-button") {
            let trElement = targetElement.parentElement.parentElement;
            let databaseID = trElement.firstChild.innerText;
            
            // send delete command to node server via API
            let response = deleteRow(databaseID);
            response.then(success => {
                if (success) {
                    destroyAndRecreateTable();
                }
            });
        }
    });
}

function updateButtonListener() {
    let tableElement = document.querySelector("#exercises_table");
    
    tableElement.addEventListener("click", event => {
        let targetElement = event.target;
    
        // update button behavior
        let buttonClass = targetElement.getAttribute("class");
        if(buttonClass === "update-button") {
            let trElement = targetElement.parentElement.parentElement;
            let childTDElements = trElement.children;
    
            // check if anything was changed before starting update process
            let updates = checkRowForUpdates(childTDElements);
            if (updates) {
            // update API call here
            updateButtonAPICall(childTDElements);
            }
        }
    });
}

function editButtonListener() {
    let tableElement = document.querySelector("#exercises_table");
    
    // undisable row when user clicks Edit button
    tableElement.addEventListener("click", event => {
        let targetElement = event.target;
        let buttonClass = targetElement.getAttribute("class");
        if(buttonClass === "edit-button") {
            let trElement = targetElement.parentElement.parentElement;
            let childTDElements = trElement.children;
    
            for (let rowIndex = 1; rowIndex < childTDElements.length - 2; rowIndex++) {
            childTDElements[rowIndex].firstChild.disabled = false;
            }
            targetElement.innerText = "Update";
            targetElement.className = "update-button";
        }
    });
}

function updateFormInputValues() {
    let formElement = document.querySelector("#exercises_form");
    formElement.addEventListener("input", event => {
      event.target.setAttribute("value", event.target.value);
    });
}

function updateTableDataInputValues() {
    let tableElement = document.querySelector("#exercises_table");
    tableElement.addEventListener("input", event => {
      event.target.setAttribute("value", event.target.value);
      let classes = event.target.classList;
      classes.add("field-updated");
    });
}

function createEventListeners() {
    // update 'value' attribute when user changes input in form
    updateFormInputValues();
    
    // update 'value' attribute when user changes input in table
    updateTableDataInputValues();
  
    // event listeners for clicks on update and delete buttons
    //createButtonListeners();
    editButtonListener();
    updateButtonListener();
    deleteButtonListener();
  
    // event listener for adding new exercise via form
    addButtonSendAPICall();
}

function clearFormInputs() {
    let formElement = document.querySelector("#exercises_form");
    for (let index = 0; index < formElement.length - 1; index++) {
        formElement[index].value = "";
    }
}

function createSearchFields(exercise) {
    let keysArray = Object.keys(exercise);

    // create table
    // create table head
    // create table headers

    // create table body
    // create td and input elements -> input inside of td

    // create search button
    // TODO create event listener when search button is clicked

    // create id table data
    let idTDElement = document.createElement("td");
    idTDElement.innerText = exercise.id;
    idTDElement.setAttribute("class", "db_id");
    tableRowElement.appendChild(idTDElement);

    // populate table with exercise data
    for (let index = 1; index < keysArray.length; index++) {
        let tdElement = document.createElement("td");
        let inputElement = document.createElement("input");
        let key = keysArray[index];
        inputElement.setAttribute("type", dataAttributes[key].type);
        inputElement.setAttribute("name", dataAttributes[key].name);
        inputElement.setAttribute("value", exercise[key]);
        inputElement.disabled = true;
        tdElement.appendChild(inputElement);
        tableRowElement.appendChild(tdElement);
    }
}

function main() {
    let exercises = [
        new Exercise(
            1,
            "Barbell Squat",
            165,
            4,
            5,
            "barbell"
        ),
        new Exercise(
            2,
            "Kettlebell Deadlift",
            70,
            4,
            8,
            "kettlebell"
        ),
        new Exercise(
            3,
            "1-minute Plank",
            0,
            4,
            0,
            "n/a"
        ),
    ];

    //createSearchFields(exercises[0]);
    createTable(exercises);
    clearFormInputs();
    createEventListeners();
}

main();