const EXERCISES_API_URL = "http://127.0.0.1:5000/exercises-api";

function Exercise(id, exercise_name, weight, set_count, rep_count, equipment) {
    this.id = id;
    this.exercise_name = exercise_name;
    this.weight = weight;
    this.set_count = set_count;
    this.rep_count = rep_count;
    this.equipment = equipment;
};

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
    "equipment_name": {
        "type": "text",
        "name": "equipment_name"
    },
};

const getData = async () => {
  try {
      const res = await fetch(
        EXERCISES_API_URL,
      {
          method: "GET"
      }
      );
      const data = await res.json();
      return data;
  } catch (e) {
      let msg = "GET error!";
      console.log(msg);
      console.log(e);
  }
};

const addRow = async (data) => {
  try {
    const res = await fetch(
      EXERCISES_API_URL,
      {
        method: "POST",
        body: JSON.stringify({
          exercise_name: data.exercise_name,
          weight: data.weight,
          set_count: data.set_count,
          rep_count: data.rep_count,
          equipment_required: data.equipment_required,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }
    );
    return true;
  } catch (err) {
    let msg = "ADD error!";
    console.log(msg);
    console.log(e);
    return false;
  }
};

const updateData = async (data) => {
  try {
    const res = await fetch(
      EXERCISES_API_URL,
      {
        method: "PUT",
        body: JSON.stringify({
          exercise_id: data.exercise_id,
          exercise_name: data.exercise_name,
          weight: data.weight,
          set_count: data.set_count,
          rep_count: data.rep_count,
          equipment_required: data.equipment_required
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }
    );
    return true;
  } catch (e) {
    let msg = "PATCH error!";
    console.log(msg);
    console.log(e);
  }
};

const deleteRow = async (rowID) => {
  try {
    const res = await fetch(
      EXERCISES_API_URL,
      {
        method: "DELETE",
        body: JSON.stringify({
          exercise_id: rowID
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }
    );
    return true;
  } catch (e) {
    let msg = "DELETE error!";
    console.log(msg);
    console.log(e);
    return false;
  }
};

function updateButtonAPICall(tdElementsArray) {
  let data = {
    exercise_id: tdElementsArray[0].innerText,
    exercise_name: tdElementsArray[1].firstChild.value,
    weight: tdElementsArray[2].firstChild.value,
    set_count: tdElementsArray[3].firstChild.value,
    rep_count: tdElementsArray[4].firstChild.value,
    equipment_required: tdElementsArray[5].firstChild.value,
  };
  
  let response = updateData(data);
  response.then(success => {
    if (success) {
      clearFormInputs();
      destroyAndRecreateTable();
    }
  });
};

function addButtonSendAPICall() {
  let addButton = document.querySelector("#add_button");
  addButton.addEventListener("click", () => {
    let formElement = addButton.parentElement.parentElement;
    
    let data = {
      exercise_name: formElement[0].value,
      weight: formElement[1].value,
      set_count: formElement[2].value,
      rep_count: formElement[3].value,
      equipment_required: formElement[4].value,
    };

    // sending data to flask server via API
    let response = addRow(data);
    response.then(success => {
      if (success) {
        // clear data in form after Add button clicked
        clearFormInputs();
        destroyAndRecreateTable();
      }
    });
  });
};

function createTable(dataRowsArray) {
  let tableElement = document.querySelector("#table");
  let tableBodyElement = document.createElement("tbody");
  tableBodyElement.setAttribute("id", "table_body");
  tableElement.appendChild(tableBodyElement);

  for (let row = 0; row < dataRowsArray.length; row++) {
    let tableRowElement = document.createElement("tr");
    tableBodyElement.appendChild(tableRowElement)

    let jsonDataRow = dataRowsArray[row];
    let keysArray = Object.keys(jsonDataRow);

    // create id table data
    let idTDElement = document.createElement("td");
    idTDElement.innerText = jsonDataRow.exercise_id;
    idTDElement.setAttribute("class", "db_id");
    tableRowElement.appendChild(idTDElement);

    // populate table with exercise data
    for (let index = 1; index < keysArray.length; index++) {
      let tdElement = document.createElement("td");
      let inputElement = document.createElement("input");
      let key = keysArray[index];
      inputElement.setAttribute("type", dataAttributes[key].type);
      inputElement.setAttribute("name", dataAttributes[key].name);
      inputElement.setAttribute("value", jsonDataRow[key]);
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
    let tableElement = document.querySelector("#table");
    
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
    let tableElement = document.querySelector("#table");
    
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
    let tableElement = document.querySelector("#table");
    
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
    let formElement = document.querySelector("#form");
    formElement.addEventListener("input", event => {
      event.target.setAttribute("value", event.target.value);
    });
}

function updateTableDataInputValues() {
    let tableElement = document.querySelector("#table");
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
    let formElement = document.querySelector("#form");
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
  // createTable(exercises);
  // clearFormInputs();
  // createEventListeners();

  let responseData = getData();
  responseData.then(dataRowsArray => {
    createTable(dataRowsArray);
  });
  clearFormInputs();
  createEventListeners();
}

main();