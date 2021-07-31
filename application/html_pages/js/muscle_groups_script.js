function Muscle_Group(id, muscle_group_name) {
    this.id = id;
    this.muscle_group_name = muscle_group_name;
}

const dataAttributes = {
    "muscle_group_name": {
        "type": "text",
        "name": "muscle_group_name"
    },
}


function createTable(dataRowsArray) {
    let tableElement = document.querySelector("#muscle_groups_table");
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
    let tableElement = document.querySelector("#muscle_groups_table");
    
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
    let tableElement = document.querySelector("#muscle_groups_table");
    
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
    let tableElement = document.querySelector("#muscle_groups_table");
    
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
    let formElement = document.querySelector("#muscle_groups_form");
    formElement.addEventListener("input", event => {
      event.target.setAttribute("value", event.target.value);
    });
}

function updateTableDataInputValues() {
    let tableElement = document.querySelector("#muscle_groups_table");
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
    let formElement = document.querySelector("#muscle_groups_form");
    for (let index = 0; index < formElement.length - 1; index++) {
        formElement[index].value = "";
    }
}

function main() {
    let muscle_groups = [
        new Muscle_Group(
            1,
            "abdomen"
        ),
        new Muscle_Group(
            2,
            "legs"
        ),
        new Muscle_Group(
            3,
            "chest"
        ),
    ];

    createTable(muscle_groups);
    clearFormInputs();
    createEventListeners();
}

main();