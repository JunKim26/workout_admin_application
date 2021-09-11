function createManyToManyTable(dataRowsArray, dataAttributes, idArray) {
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
    //idTDElement.innerText = jsonDataRow.user_id;
    idTDElement.innerText = jsonDataRow[idArray[0]]
    idTDElement.setAttribute("class", "db_id");
    tableRowElement.appendChild(idTDElement);
    
    // create exercise id table data
    idTDElement = document.createElement("td");
    //idTDElement.innerText = jsonDataRow.exercise_id;
    idTDElement.innerText = jsonDataRow[idArray[1]]
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

function createTable(dataRowsArray, dataAttributes) {
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
    // Typically id should always be index 0, but 
    // we'll do a search for the key with substring of
    // "id" just to be safe
    let idTDElement = document.createElement("td");
    let id_index = 0;
    for (; id_index < keysArray.length; id_index++) {
      if (keysArray[id_index].includes("id")) {
        break
      }
    }
    idTDElement.innerText = jsonDataRow[keysArray[id_index]];
    idTDElement.setAttribute("class", "db_id");
    tableRowElement.appendChild(idTDElement);

    // populate table with data
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
    let tdElement = document.createElement("td");
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
};

function destroyAndRecreateTable(apiCalls, dataAttributes, idArray = []) {
  // destroy table
  let tableBodyElement = document.querySelector("#table_body");
  tableBodyElement.remove();
  // create brand new table (entire table)
  let responseData = apiCalls.getData();
  responseData.then(dataRowsArray => {
    if (idArray.length > 0) {
      createManyToManyTable(
        dataRowsArray,
        dataAttributes,
        idArray,
      );
    } else {
      createTable(dataRowsArray, dataAttributes)
    }
  });
};

function deleteButtonListenerManyToMany(apiCalls, dataAttributes, idArray) {
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
      let response = apiCalls.deleteRow(user_id, exercise_id);
      response.then(success => {
        if (success) {
          destroyAndRecreateTable(apiCalls, dataAttributes, idArray);
        }
      });
    }
  });
};

function deleteButtonListener(apiCalls, dataAttributes) {
  let tableElement = document.querySelector("#table");
  
  tableElement.addEventListener("click", event => {
    let targetElement = event.target;

    // update button behavior
    let buttonClass = targetElement.getAttribute("class");
    if(buttonClass === "delete-button") {
      let trElement = targetElement.parentElement.parentElement;
      let databaseID = trElement.firstChild.innerText;
      
      // send delete command to node server via API
      let response = apiCalls.deleteRow(databaseID);
      response.then(success => {
        if (success) {
          destroyAndRecreateTable(apiCalls, dataAttributes);
        }
      });
    }
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

function updateButtonListener(updateButtonAPICall) {
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
};

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

function updateTableDataInputValuesListener(tableID) {
  let tableElement = document.querySelector(tableID);
  tableElement.addEventListener("input", event => {
    event.target.setAttribute("value", event.target.value);
    let classes = event.target.classList;
    classes.add("field-updated");
  });
};

function resetSelectElement(selectID) {
  let selectElement = document.querySelector(selectID);
  selectElement.selectedIndex = 0;
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

function clearFormInputs() {
  let formElement = document.querySelector("#form");
  for (let index = 0; index < formElement.length - 1; index++) {
    formElement[index].value = "";
  }
}

function updateFormInputValuesListener() {
  let formElement = document.querySelector("#form");
  formElement.addEventListener("input", event => {
    event.target.setAttribute("value", event.target.value);
  });
}

export {
  createTable,
  createManyToManyTable,
  completeUsersSelectOptions,
  completeExercisesSelectOptions,
  resetSelectElement,
  clearFormInputs,
  updateTableDataInputValuesListener,
  updateFormInputValuesListener,
  editButtonListener,
  updateButtonListener,
  deleteButtonListener,
  deleteButtonListenerManyToMany,
  destroyAndRecreateTable,
};