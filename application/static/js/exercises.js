const EXERCISES_API_URL = "http://127.0.0.1:5000/exercises-api";
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

function apiCalls() {
  this.getData = getData;
  this.addRow = addRow;
  this.updateData = updateData;
  this.deleteRow = deleteRow;
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
      let apiCallsObj = new apiCalls();
      destroyAndRecreateTable(apiCallsObj, dataAttributes);
    }
  });
};

function addButtonSendAPICall(apiCallsObj, dataAttributes) {
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
        destroyAndRecreateTable(apiCallsObj, dataAttributes);
      }
    });
  });
};

function createEventListeners() {
  let apiCallsObj = new apiCalls();
  // update 'value' attribute when user changes input in form
  // updateFormInputValues();
  updateFormInputValuesListener();
  
  // update 'value' attribute when user changes input in table
  // updateTableDataInputValues();
  updateTableDataInputValuesListener(TABLE_ID);

  // event listeners for clicks on update and delete buttons
  //createButtonListeners();
  editButtonListener();
  updateButtonListener(updateButtonAPICall);
  //deleteButtonListener();
  deleteButtonListener(apiCallsObj, dataAttributes);
  
  // event listener for adding new exercise via form
  //addButtonSendAPICall();
  addButtonSendAPICall(apiCallsObj, dataAttributes);
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