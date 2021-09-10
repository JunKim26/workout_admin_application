const USERS_API_URL = "http://127.0.0.1:5000/users-api";
const TABLE_ID = "#table";

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

const dataAttributes = {
    "user_name": {
        "type": "text",
        "name": "user_name"
    },
}

const getData = async () => {
  try {
      const res = await fetch(
      //"http://flip1.engr.oregonstate.edu:3319/",
      USERS_API_URL,
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
      //"http://flip1.engr.oregonstate.edu:3319/",
      USERS_API_URL,
      {
        method: "POST",
        body: JSON.stringify({
          user_name: data.user_name,
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
  try {
    const res = await fetch(
      USERS_API_URL,
      {
        method: "PUT",
        body: JSON.stringify({
          user_id: data.user_id,
          user_name: data.user_name,
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
      USERS_API_URL,
      {
        method: "DELETE",
        body: JSON.stringify({
            user_id: rowID
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
    user_id: tdElementsArray[0].innerText,
    user_name: tdElementsArray[1].firstChild.value,
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
        user_name: formElement[0].value,
    };

    // sending data to flask server via API
    let response = apiCallsObj.addRow(data);
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
  //createButtonListeners();
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
