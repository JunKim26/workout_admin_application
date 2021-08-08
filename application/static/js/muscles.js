const MUSCLE_URL = "http://127.0.0.1:5000/muscles"

function Muscle(id, muscle_name, muscle_group) {
    this.id = id;
    this.muscle_name = muscle_name;
    this.muscle_group = muscle_group;
}

const dataAttributes = {
    "muscle_name": {
        "type": "text",
        "name": "muscle_name"
    },
    "muscle_group_name": {
      "type": "text",
      "name": "muscle_group_name"
    }
}

const getData = async () => {
    try {
        const res = await fetch(
        //"http://flip1.engr.oregonstate.edu:3319/",
        MUSCLE_URL,
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
  console.log("---- look here!!! ------")
  console.log(data);
  console.log(data.muscle_name);
  console.log(data.muscle_group);
  try {
    const res = await fetch(
      //"http://flip1.engr.oregonstate.edu:3319/",
      MUSCLE_URL,
      {
        method: "POST",
        body: JSON.stringify({
            muscle_name: data.muscle_name,
            muscle_group: data.muscle_group,
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
}

const updateData = async (data) => {
  console.log(data);
  try {
    const res = await fetch(
      MUSCLE_URL,
      {
        method: "PUT",
        body: JSON.stringify({
            muscle_id: data.muscle_id,
            muscle_name: data.muscle_name,
            muscle_group: data.muscle_group_name,
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
      MUSCLE_URL,
      {
        method: "DELETE",
        body: JSON.stringify({
            muscle_id: rowID
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
    muscle_id: tdElementsArray[0].innerText,
    muscle_name: tdElementsArray[1].firstChild.value,
    muscle_group: tdElementsArray[2].firstChild.value,
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
      muscle_name: formElement[0].value,
      muscle_group: formElement[1].value,
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
  let tableElement = document.querySelector("#muscles_table");
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
    idTDElement.innerText = jsonDataRow.muscle_id;
    idTDElement.setAttribute("class", "db_id");
    tableRowElement.appendChild(idTDElement);

    // populate table with muscle data
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
  let tableElement = document.querySelector("#muscles_table");
  
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
  let tableElement = document.querySelector("#muscles_table");
  
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
  let tableElement = document.querySelector("#muscles_table");
  
  // undisable row when muscle clicks Edit button
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
  let formElement = document.querySelector("#muscles_form");
  formElement.addEventListener("input", event => {
    event.target.setAttribute("value", event.target.value);
  });
}

function updateTableDataInputValues() {
  let tableElement = document.querySelector("#muscles_table");
  tableElement.addEventListener("input", event => {
    event.target.setAttribute("value", event.target.value);
    let classes = event.target.classList;
    classes.add("field-updated");
  });
}

function createEventListeners() {
  // update 'value' attribute when muscle changes input in form
  updateFormInputValues();
  
  // update 'value' attribute when muscle changes input in table
  updateTableDataInputValues();

  // event listeners for clicks on update and delete buttons
  //createButtonListeners();
  editButtonListener();
  updateButtonListener();
  deleteButtonListener();

  // event listener for adding new user via form
  addButtonSendAPICall();
}

function clearFormInputs() {
  let formElement = document.querySelector("#muscles_form");
  for (let index = 0; index < formElement.length - 1; index++) {
    formElement[index].value = "";
  }
}

function main() {
  let muscles = [
      new Muscle(
          1,
          "Biceps",
          1
      ),
      new Muscle(
          2,
          "Triceps",
          1
      ),
      new Muscle(
          3,
          "Deltoids",
          1
      ),
  ];

  let responseData = getData();
  responseData.then(dataRowsArray => {
    createTable(dataRowsArray);
  });
  clearFormInputs();
  createEventListeners();
}

main();
