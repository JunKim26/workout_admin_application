function createManyToManyTable(dataRowsArray, dataAttributes) {
  let tableElement = document.querySelector("#many-to-many-table");
  let tableBodyElement = document.createElement("tbody");
  tableBodyElement.setAttribute("id", "table_body");
  tableElement.appendChild(tableBodyElement);

  for (let row = 0; row < dataRowsArray.length; row++) {
    let tableRowElement = document.createElement("tr");
    tableBodyElement.appendChild(tableRowElement)

    let jsonDataRow = dataRowsArray[row];
    let keysArray = Object.keys(jsonDataRow);

    // create user id table data
    let idTDElement = document.createElement("td");
    idTDElement.innerText = jsonDataRow.user_id;
    idTDElement.setAttribute("class", "db_id");
    tableRowElement.appendChild(idTDElement);
    
    // create exercise id table data
    idTDElement = document.createElement("td");
    idTDElement.innerText = jsonDataRow.exercise_id;
    idTDElement.setAttribute("class", "db_id");
    tableRowElement.appendChild(idTDElement);

    // populate table with data
    for (let index = 2; index < keysArray.length; index++) {
    let tdElement = document.createElement("td");
    let inputElement = document.createElement("input");
    let key = keysArray[index];
    inputElement.setAttribute("type", dataAttributes[key].type);
    inputElement.setAttribute("name", dataAttributes[key].name);
    if (jsonDataRow[key]) {
      inputElement.setAttribute("value", jsonDataRow[key]);
    } else {
      inputElement.setAttribute("value", "None");
    }
    inputElement.disabled = true;
    tdElement.appendChild(inputElement);
    tableRowElement.appendChild(tdElement);
    }

    // add delete button
    let deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("class", "delete-button");
    deleteButton.setAttribute("id", `delete-button-${row}`);
    deleteButton.innerHTML = "Delete";
    let tdElement = document.createElement("td");
    tdElement.appendChild(deleteButton);
    tableRowElement.appendChild(tdElement);
  }
};

function destroyAndRecreateTable(apiCalls, createTableFunc, dataAttributes) {
  // destroy table
  let tableBodyElement = document.querySelector("#table_body");
  tableBodyElement.remove();
  // create brand new table (entire table)
  //let responseData = getDataFunc();
  let responseData = apiCalls.getData();
  responseData.then(dataRowsArray => {
    createTableFunc(dataRowsArray, dataAttributes);
  });
};

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
};

function deleteButtonListener(apiCalls, createTableFunc, dataAttributes) {
  let tableElement = document.querySelector("#many-to-many-table");
  tableElement.addEventListener("click", event => {
    let targetElement = event.target;

    // update button behavior
    let buttonClass = targetElement.getAttribute("class");
    if(buttonClass === "delete-button") {
      let trElement = targetElement.parentElement.parentElement;
      let TDElement = trElement.firstChild;
      let user_id = TDElement.innerText;
      TDElement = TDElement.nextElementSibling;
      let exercise_id = TDElement.innerText;
      
      // send delete command to server via API
      //let response = deleteRowFunc(user_id, exercise_id);
      let response = apiCalls.deleteRow(user_id, exercise_id);
      response.then(success => {
        if (success) {
          destroyAndRecreateTable(apiCalls, createTableFunc, dataAttributes);
        }
      });
    }
  });
};

function updateButtonListener() {
  let tableElement = document.querySelector("#many-to-many-table");
  
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
};

function editButtonListener() {
  let tableElement = document.querySelector("#many-to-many-table");
  
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
};

function updateTableDataInputValues() {
  let tableElement = document.querySelector("#many-to-many-table");
  tableElement.addEventListener("input", event => {
    event.target.setAttribute("value", event.target.value);
    let classes = event.target.classList;
    classes.add("field-updated");
  });
};

function resetSelectElements() {
  let selectElement = document.querySelector("#user-select");
  selectElement.selectedIndex = 0;
  selectElement = document.querySelector("#exercise-select");
  selectElement.selectedIndex = 0;
};

function addButtonSendAPICall(apiCallsObj, createTableFunc,dataAttributes) {
  let addButton = document.querySelector("#mtm-add-button");
  addButton.addEventListener("click", () => {
    let selectElement = document.querySelector("#user-select");
    let userID = selectElement.options[selectElement.selectedIndex].value;
    let user_name = selectElement.options[selectElement.selectedIndex].text;

    selectElement = document.querySelector("#exercise-select");
    let exerciseText = selectElement.options[selectElement.selectedIndex].text;
    const exerciseArray = exerciseText.split(", ");

    let data = {
      user_name: user_name,
      exercise_name: exerciseArray[1],
      weight: exerciseArray[2],
      set_count: exerciseArray[3],
      rep_count: exerciseArray[4],
    };

    // sending data to flask server via API
    //let response = addRow(data);
    let response = apiCallsObj.addRow(data);
    response.then(success => {
      if (success) {
        // clear data in select element after Add button clicked
        resetSelectElements();
        destroyAndRecreateTable(apiCallsObj, createTableFunc, dataAttributes);
      }
    });
  });
};

function createEventListeners() {
  // update 'value' attribute when user changes input in table
  updateTableDataInputValues();

  // event listeners for clicks delete button
  deleteButtonListener();

  // event listener for adding new exercise via form
  addButtonSendAPICall();
};

function completeUsersSelectOptions(dataRowsArray) {
  let usersSelectElement = document.querySelector("#user-select");
  for (let rowIndex = 0; rowIndex < dataRowsArray.length; rowIndex++) {
    let optionElement = document.createElement("option");
    let userID = dataRowsArray[rowIndex].user_id;
    optionElement.setAttribute("value", userID);
    optionElement.innerText = dataRowsArray[rowIndex].user_name;
    usersSelectElement.appendChild(optionElement);
  }
};

function completeExercisesSelectOptions(dataRowsArray) {
  let exerciseSelectElement = document.querySelector("#exercise-select");
  for (let rowIndex = 0; rowIndex < dataRowsArray.length; rowIndex++) {
    let exercise_data = dataRowsArray[rowIndex];
    let optionElement = document.createElement("option");
    let exerciseID = exercise_data.exercise_id;
    optionElement.setAttribute("value", exerciseID);
    let text = "";
    let keys = Object.keys(exercise_data);
    for (let i = 0; i < keys.length - 1; i++) {
      text += exercise_data[keys[i]] + ", ";
    }
    text += exercise_data["equipment_name"];
    optionElement.innerText = text;
    exerciseSelectElement.appendChild(optionElement);
  }
};

export {
  createManyToManyTable,
  completeUsersSelectOptions,
  completeExercisesSelectOptions,
  resetSelectElements,
  createEventListeners,
  updateTableDataInputValues,
  deleteButtonListener,
  addButtonSendAPICall,
};