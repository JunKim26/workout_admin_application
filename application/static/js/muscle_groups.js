import {
  createTable,
  clearFormInputs,
  updateFormInputValuesListener,
  updateTableDataInputValuesListener,
  editButtonListener,
  updateButtonListener,
  deleteButtonListener,
  destroyAndRecreateTable,
} from './modules/common.mjs';

const MUSCLE_GROUP_API_URL = "http://127.0.0.1:5000/muscle-groups-api";
const TABLE_ID = "#table";

const dataAttributes = {
    "muscle_group_name": {
        "type": "text",
        "name": "muscle_group_name"
    },
};

const getData = async () => {
  try {
      const res = await fetch(
      MUSCLE_GROUP_API_URL,
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
      MUSCLE_GROUP_API_URL,
      {
        method: "POST",
        body: JSON.stringify({
          muscle_group_name: data.muscle_group_name,
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
      MUSCLE_GROUP_API_URL,
      {
        method: "PUT",
        body: JSON.stringify({
          muscle_group_id: data.muscle_group_id,
          muscle_group_name: data.muscle_group_name,
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
      MUSCLE_GROUP_API_URL,
      {
        method: "DELETE",
        body: JSON.stringify({
          muscle_group_id: rowID
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

function apiCalls() {
  this.getData = getData;
  this.addRow = addRow;
  this.updateData = updateData;
  this.deleteRow = deleteRow;
};

function updateButtonAPICall(tdElementsArray) {
  let data = {
    muscle_group_id: tdElementsArray[0].innerText,
    muscle_group_name: tdElementsArray[1].firstChild.value,
  };
  
  let response = updateData(data);
  response.then(success => {
    if (success) {
      clearFormInputs();
      let apiCallsObj = new apiCalls();
      destroyAndRecreateTable(apiCallsObj, createTable, dataAttributes);
    }
  });
};

function addButtonSendAPICall(apiCallsObj, createTable, dataAttributes) {
  let addButton = document.querySelector("#add_button");
  addButton.addEventListener("click", () => {
    let formElement = addButton.parentElement.parentElement;
    
    let data = {
      muscle_group_name: formElement[0].value,
    };

    // sending data to flask server via API
    let response = addRow(data);
    response.then(success => {
      if (success) {
        // clear data in form after Add button clicked
        clearFormInputs();
        destroyAndRecreateTable(apiCallsObj, createTable, dataAttributes);
      }
    });
  });
};

function createEventListeners() {
  let apiCallsObj = new apiCalls();
  // update 'value' attribute when user changes input in form
  updateFormInputValuesListener();
  
  // update 'value' attribute when user changes input in table
  updateTableDataInputValuesListener(TABLE_ID);

  // event listeners for clicks on update and delete buttons
  editButtonListener();
  updateButtonListener(updateButtonAPICall);
  deleteButtonListener(apiCallsObj, createTable, dataAttributes);

  // event listener for adding new exercise via form
  addButtonSendAPICall(apiCallsObj, createTable, dataAttributes);
};

function main() {
  let responseData = getData();
  responseData.then(dataRowsArray => {
    createTable(dataRowsArray, dataAttributes);
  });
  clearFormInputs();
  createEventListeners();
};

main();