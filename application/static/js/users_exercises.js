const USERS_EXERCISES_API_URL = "http://127.0.0.1:5000/users-exercises-api";

import {
  createManyToManyTable,
  completeUsersSelectOptions,
  completeExercisesSelectOptions,
  resetSelectElements,
  updateTableDataInputValues,
  deleteButtonListener,
  addButtonSendAPICall,
} from './modules/common.mjs';

const dataAttributes = {
    "user_id": {
        "type": "number",
        "name": "user_id"
    },
    "exercise_id": {
        "type": "number",
        "name": "exercise_id"
    },
    "user_name": {
        "type": "text",
        "name": "user_name"
    },
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
        "name": "equipment_required"
    },
};


const getData = async () => {
  try {
      const res = await fetch(
        USERS_EXERCISES_API_URL,
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
      USERS_EXERCISES_API_URL,
      {
        method: "POST",
        body: JSON.stringify({
          user_name: data.user_name,
          exercise_name: data.exercise_name,
          weight: data.weight,
          set_count: data.set_count,
          rep_count: data.rep_count,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }
    );
    return true;
  } catch (e) {
    let msg = "ADD error!";
    console.log(msg);
    console.log(e);
    return false;
  }
};

const updateData = async (data) => {
  try {
    const res = await fetch(
      USERS_EXERCISES_API_URL,
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

const deleteRow = async (user_id, exercise_id) => {
  try {
    const res = await fetch(
      USERS_EXERCISES_API_URL,
      {
        method: "DELETE",
        body: JSON.stringify({
          user_id: user_id,
          exercise_id: exercise_id
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

const getUsersData = async () => {
  try {
      const res = await fetch(
        "http://127.0.0.1:5000/users-api",
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

const getExercisesData = async () => {
  try {
      const res = await fetch(
        "http://127.0.0.1:5000/exercises-api",
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

function apiCalls() {
  this.getData = getData;
  this.addRow = addRow;
  this.updateData = updateData;
  this.deleteRow = deleteRow;
  this.getUsersData = getUsersData;
  this.getExercisesData = getExercisesData;
}

function createEventListeners() {
  // update 'value' attribute when user changes input in table
  updateTableDataInputValues();

  // event listeners for clicks delete button
  let apiCallsObj = new apiCalls();
  deleteButtonListener(apiCallsObj, createManyToManyTable, dataAttributes);

  // event listener for adding new exercise via form
  addButtonSendAPICall(apiCallsObj, createManyToManyTable, dataAttributes);
};

function main() {
  let responseData = getData();
  responseData.then(dataRowsArray => {
    // createManyToManyTable(dataRowsArray, dataAttributes);
    // let apiCallsAndDataAttributesObj = new APICallssAndDataAttributes();
    // createManyToManyTable(dataRowsArray, apiCallsAndDataAttributesObj);
    createManyToManyTable(dataRowsArray, dataAttributes);
  });
  
  let usersData = getUsersData();
  usersData.then(usersDataArray => {
    completeUsersSelectOptions(usersDataArray);
  });
  
  let exercisesData = getExercisesData();
  exercisesData.then(exercisesDataArray => {
    completeExercisesSelectOptions(exercisesDataArray);
  });
  
  resetSelectElements();
  createEventListeners();
}

main();