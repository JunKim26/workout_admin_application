import {
  createManyToManyTable,
  completeExercisesSelectOptions,
  resetSelectElement,
  updateTableDataInputValuesListener,
  deleteButtonListenerManyToMany,
  destroyAndRecreateTable,
} from './modules/common.mjs';

const MUSCLE_GROUP_EXERCISES_API_URL = "http://127.0.0.1:5000/muscle-groups-exercises-api";
const TABLE_ID = "#many-to-many-table";

const dataAttributes = {
  "muscle_group_id": {
    "type": "number",
    "name": "muscle_group_id"
  },
  "exercise_id": {
    "type": "number",
    "name": "exercise_id"
  },
  "muscle_group_name": {
    "type": "text",
    "name": "muscle_group_name"
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
        MUSCLE_GROUP_EXERCISES_API_URL,
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
      MUSCLE_GROUP_EXERCISES_API_URL,
      {
        method: "POST",
        body: JSON.stringify({
          muscle_group_name: data.muscle_group_name,
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
      MUSCLE_GROUP_EXERCISES_API_URL,
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

const deleteRow = async (muscle_group_id, exercise_id) => {
  try {
    const res = await fetch(
      MUSCLE_GROUP_EXERCISES_API_URL,
      {
        method: "DELETE",
        body: JSON.stringify({
          muscle_group_id: muscle_group_id,
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

const getMuscleGroupsData = async () => {
  try {
      const res = await fetch(
        "http://127.0.0.1:5000/muscle-groups-api",
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
  this.getMuscleGroupsData = getMuscleGroupsData;
  this.getExercisesData = getExercisesData;
};

function addButtonSendAPICall(apiCallsObj, dataAttributes, idArray) {
  let addButton = document.querySelector("#mtm-add-button");
  addButton.addEventListener("click", () => {
    let selectElement = document.querySelector("#muscle-group-select");
    let muscleGroupID = selectElement.options[selectElement.selectedIndex].value;
    let muscleGroupName = selectElement.options[selectElement.selectedIndex].text;

    selectElement = document.querySelector("#exercise-select");
    let exerciseText = selectElement.options[selectElement.selectedIndex].text;
    const exerciseArray = exerciseText.split(", ");

    let data = {
      muscle_group_name: muscleGroupName,
      exercise_name: exerciseArray[1],
      weight: exerciseArray[2],
      set_count: exerciseArray[3],
      rep_count: exerciseArray[4],
    };

    // sending data to flask server via API
    let response = apiCallsObj.addRow(data);
    response.then(success => {
      if (success) {
        // clear data in select element after Add button clicked
        resetSelectElement("#muscle-group-select");
        resetSelectElement("#exercise-select");
        destroyAndRecreateTable(apiCallsObj, dataAttributes, idArray);
      }
    });
  });
};

function createEventListeners(idArray) {
  // update 'value' attribute when user changes input in table
  updateTableDataInputValuesListener(TABLE_ID);

  // event listeners for clicks on update and delete buttons
  let apiCallsObj = new apiCalls();
  deleteButtonListenerManyToMany(apiCallsObj, dataAttributes, idArray);

  // event listener for adding new exercise via form
  addButtonSendAPICall(apiCallsObj, dataAttributes, idArray);
};

function completeMuscleGroupsSelectOptions(dataRowsArray) {
  let usersSelectElement = document.querySelector("#muscle-group-select");
  for (let rowIndex = 0; rowIndex < dataRowsArray.length; rowIndex++) {
    let optionElement = document.createElement("option");
    let muscleGroupID = dataRowsArray[rowIndex].muscle_group_id;
    optionElement.setAttribute("value", muscleGroupID);
    optionElement.innerText = dataRowsArray[rowIndex].muscle_group_name;
    usersSelectElement.appendChild(optionElement);
  }
};

function main() {
  let responseData = getData();
  let idArray = ["muscle_group_id", "exercise_id"];
  responseData.then(dataRowsArray => {
    createManyToManyTable(
      dataRowsArray,
      dataAttributes,
      idArray
    );
  });
  
  let muscleGroupsData = getMuscleGroupsData();
  muscleGroupsData.then(muscleGroupsDataArray => {
    completeMuscleGroupsSelectOptions(muscleGroupsDataArray);
  });
  
  let exercisesData = getExercisesData();
  exercisesData.then(exercisesDataArray => {
    completeExercisesSelectOptions(exercisesDataArray);
  });
  
  resetSelectElement("#muscle-group-select");
  resetSelectElement("#exercise-select");
  createEventListeners(idArray);
};

main();