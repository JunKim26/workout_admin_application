---------------------USERS-----------------------------
-- View USERS
SELECT *
FROM USERS;

-- Search USERS
SELECT *
FROM USERS
WHERE user_name = :user_name_input;

-- Add USERS
INSERT INTO USERS
  (user_name)
VALUES
  (:user_name_input);

-- Edit USERS
UPDATE USERS
SET user_name = :user_name_input
WHERE user_id = :user_id_input;

-- Delete USERS
DELETE FROM USERS
WHERE user_id = :user_id_input;

--------------------END OF USERS----------------------------

---------------------EQUIPMENTS-----------------------------

-- View EQUIPMENTS
SELECT *
FROM EQUIPMENTS;

-- Search EQUIPMENTS
SELECT *
FROM EQUIPMENTS
WHERE equipment_name = :equipment_name_input;

-- Add EQUIPMENTS
INSERT INTO EQUIPMENTS
  (equipment_name)
VALUES
  (:equipment_name_input);

-- Edit EQUIPMENTS
UPDATE EQUIPMENTS
SET equipment_name = :equipment_name_input
WHERE equipment_id = :equipment_id_input;

-- Delete EQUIPMENTS
DELETE FROM EQUIPMENTS
WHERE equipment_id = :equipment_id_input;

-----------------END OF EQUIPMENTS-----------------------

---------------------MUSCLES-----------------------------

-- View MUSCLES
SELECT *
FROM MUSCLES;

-- Search MUSCLES
SELECT *
FROM MUSCLES
WHERE muscle_name = :muscle_name_input;

-- Add MUSCLES
INSERT INTO USERS
  (
    muscle_name,
    muscle_group
  )
VALUES
  (
    :muscle_name_input,
    (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name=:muscle_group_name_input)
  );

-- Edit MUSCLES
UPDATE MUSCLES
SET
  muscle_name = :muscle_name_input,
	muscle_group = (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name=:muscle_group_name_input)
WHERE
  muscle_id = :muscle_id_input;

-- Delete MUSCLES
DELETE FROM MUSCLES
WHERE muscle_id = :muscle_id_input;

-----------------END OF MUSCLES-----------------------

---------------------EXERCISES-----------------------------
-- View EXERCISES
SELECT * FROM EXERCISES;

-- Search EXERCISES
SELECT * FROM EXERCISES WHERE exercise_name=:exercise_name_input;

-- Add EXERCISES
INSERT INTO EXERCISES
  (
    exercise_name,
    weight,
    set_count,
    rep_count,
    equipment_required
  )
VALUES
  (
    :exercise_name_input,
    :weight_input,
    :set_count_input,
    :rep_count_input,
    (SELECT equipment_id FROM EQUIPMENTS WHERE equipment_name=:equipment_name_input) 
  );

-- Edit EXERCISES
UPDATE EXERCISES
SET
  exercise_name = :exercise_name_input,
  weight = :weight_input,
  set_count = :set_count_input,
  rep_count = :rep_count_input,
  equipment_required = (SELECT equipment_id FROM EQUIPMENTS WHERE equipment_name=:equipment_name_input)
WHERE
  exercise_id = :exercise_id_input;

-- Delete EXERCISES
DELETE FROM EXERCISES
WHERE exercise_id = :exercise_id_input;

-----------------END OF EXERCISES-----------------------

---------------------MUSCLE_GROUPS-----------------------------
-- View MUSCLE_GROUPS
SELECT * FROM MUSCLE_GROUPS;

-- Search MUSCLE_GROUPS
SELECT * FROM MUSCLE_GROUPS WHERE muscle_group_name=:muscle_group_name_input;

-- Add MUSCLE_GROUPS
INSERT INTO MUSCLE_GROUPS
  (muscle_group_name)
VALUES
  (:muscle_group_name_input);

-- Edit MUSCLE_GROUPS
UPDATE MUSCLE_GROUPS
SET
  muscle_group_name = :muscle_group_name_input
WHERE
  muscle_group_id = muscle_group_id_input;

-----------------END OF EXERCISES-----------------------

---------------------USERS_MUSCLEGROUPS-----------------------------
-- View USERS_MUSCLEGROUPS
SELECT user_name, muscle_group_name
FROM MUSCLE_GROUPS mg
INNER JOIN USERS_MUSCLEGROUPS um ON mg.muscle_group_id = um.muscle_group_id
INNER JOIN USERS ON um.user_id = USERS.user_id;

-- Search USERS_MUSCLEGROUPS
SELECT user_name, muscle_group_name
FROM MUSCLE_GROUPS mg
INNER JOIN USERS_MUSCLEGROUPS um ON mg.muscle_group_id = um.muscle_group_id
INNER JOIN USERS ON um.user_id = USERS.user_id
WHERE USERS.user_name = :user_name_input;

-- add USERS_MUSCLEGROUPS
INSERT INTO USERS_MUSCLEGROUPS
  (user_id, muscle_group_id)
VALUES
  (
    (SELECT user_id FROM USERS WHERE user_name=:user_name_input),
    (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name=:muscle_group_name_input)
  );

-- Edit USERS_MUSCLEGROUPS
UPDATE USERS_MUSCLEGROUPS
SET
  user_id = (SELECT user_id FROM USERS WHERE user_name=:new_user_name_input),
  muscle_group_id = (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_id=:new_muscle_group_name_input)
WHERE
  user_id = (SELECT user_id FROM USERS WHERE user_name=:old_user_name_input),
  muscle_group_id = (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name=:old_muscle_group_name_input);

---------------------END OF USERS_MUSCLEGROUPS-----------------------------

---------------------MUSCLEGROUPS_EXERCISES-----------------------------
-- View MUSCLEGROUPS_EXERCISES
SELECT
	e.exercise_id,
	mg.muscle_group_id,
	muscle_group_name,
	exercise_name,
	weight,
	set_count,
	rep_count,
	eq.equipment_name
FROM
	EQUIPMENTS eq
RIGHT JOIN
	EXERCISES e ON eq.equipment_id = e.equipment_required
INNER JOIN
	MUSCLEGROUPS_EXERCISES me ON e.exercise_id = me.exercise_id
INNER JOIN
	MUSCLE_GROUPS mg ON me.muscle_group_id = mg.muscle_group_id;


-- add MUSCLEGROUPS_EXERCISES
INSERT INTO MUSCLEGROUPS_EXERCISES
	(muscle_group_id, exercise_id)
VALUES
	(
		(SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name=%s),
		(
			SELECT
				exercise_id
			FROM
				EXERCISES
			WHERE
				exercise_name = %s AND
				weight = %s AND
				set_count = %s AND
				rep_count = %s
		)
	);

---------------------END OF MUSCLEGROUPS_EXERCISES-----------------------------

---------------------USERS_EXERCISES-----------------------------
-- View USERS_EXERCISES
SELECT
	u.user_id,
	e.exercise_id,
	user_name,
	exercise_name,
	weight,
	set_count,
	rep_count,
	eq.equipment_name
FROM
	EQUIPMENTS eq
RIGHT JOIN
	EXERCISES e ON eq.equipment_id = e.equipment_required
INNER JOIN
	USERS_EXERCISES ue ON e.exercise_id = ue.exercise_id
RIGHT JOIN
	USERS u ON ue.user_id = u.user_id;

-- add USERS_EXERCISES
INSERT INTO USERS_EXERCISES
	(user_id, exercise_id)
VALUES
	(
		(SELECT user_id FROM USERS WHERE user_name=%s),
		(
			SELECT
				exercise_id
			FROM
				EXERCISES
			WHERE
				exercise_name = %s AND
				weight = %s AND
				set_count = %s AND
				rep_count = %s
		)
	);


---------------------END OF USERS_EXERCISES-----------------------------