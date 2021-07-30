-- Create tables

CREATE TABLE USERS (
user_id INT NOT NULL AUTO_INCREMENT,
user_name VARCHAR(255) NOT NULL,
PRIMARY KEY (user_id)
) ENGINE=InnoDB;

CREATE TABLE MUSCLE_GROUPS (
  muscle_group_id INT NOT NULL AUTO_INCREMENT,
  muscle_group_name VARCHAR(255) NOT NULL,
  PRIMARY KEY (muscle_group_id)
) ENGINE=InnoDB;

CREATE TABLE EQUIPMENTS (
  equipment_id INT NOT NULL AUTO_INCREMENT,
  equipment_name VARCHAR(255) NOT NULL,
  PRIMARY KEY (equipment_id)
) ENGINE=InnoDB;

CREATE TABLE EXERCISES (
  exercise_id INT NOT NULL AUTO_INCREMENT,
  exercise_name VARCHAR(255) NOT NULL,
  weight DECIMAL,
  set_count INT NOT NULL,
  rep_count INT NOT NULL,
  equipment_required INT,
  PRIMARY KEY(exercise_id),
  FOREIGN KEY(equipment_required) REFERENCES EQUIPMENTS(equipment_id)
) ENGINE=InnoDB;

CREATE TABLE MUSCLES (
  muscle_id INT NOT NULL AUTO_INCREMENT,
  muscle_name VARCHAR(255) NOT NULL,
  muscle_group INT,
  PRIMARY KEY (muscle_id),
  FOREIGN KEY (muscle_group) REFERENCES MUSCLE_GROUPS (muscle_group_id)
) ENGINE=InnoDB;

CREATE TABLE USERS_MUSCLEGROUPS (
  user_id INT,
  muscle_group_id INT,
  FOREIGN KEY(user_id) REFERENCES USERS(user_id),
  FOREIGN KEY(muscle_group_id) REFERENCES MUSCLE_GROUPS(muscle_group_id)
) ENGINE=InnoDB;

CREATE TABLE MUSCLEGROUPS_EXERCISES (
  muscle_group_id INT,
  exercise_id INT,
  FOREIGN KEY(muscle_group_id) REFERENCES MUSCLE_GROUPS(muscle_group_id),
  FOREIGN KEY(exercise_id) REFERENCES EXERCISES(exercise_id)
) ENGINE=InnoDB;

CREATE TABLE USERS_EXERCISES(
  user_id INT,
  exercise_id INT,
  FOREIGN KEY(user_id) REFERENCES USERS(user_id),
  FOREIGN KEY(exercise_id) REFERENCES EXERCISES(exercise_id)
) ENGINE=InnoDB;

-- Sample data

INSERT INTO USERS
  (user_name)
VALUES
  ("michaelbstearns"),
  ("thr0wawaygrbg3"),
  ("junkim9000");

INSERT INTO MUSCLE_GROUPS
  (muscle_group_name)
VALUES
  ("legs"),
  ("chest and shoulders"),
  ("arms"),
  ("core"),
  ("upper back");

INSERT INTO EQUIPMENTS
  (equipment_name)
VALUES
  ("barbell"),
  ("dumbbell"),
  ("pullup bar");

INSERT INTO EXERCISES
  (exercise_name, weight, set_count, rep_count, equipment_required)
VALUES
  ("barbell bench press", 105.00, 5, 5, (SELECT equipment_id FROM EQUIPMENTS WHERE equipment_name="barbell")),
  ("barbell squat", 165.00, 3, 5, (SELECT equipment_id FROM EQUIPMENTS WHERE equipment_name="barbell")),
  ("wide-grip pullup", 0, 4, 8, (SELECT equipment_id FROM EQUIPMENTS WHERE equipment_name="pullup bar")),
  ("dumbbell bicep curl", 25, 4, 10, (SELECT equipment_id FROM EQUIPMENTS WHERE equipment_name="dumbbell"));

INSERT INTO MUSCLES
  (muscle_name, muscle_group)
VALUES
  ("quadriceps", (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="legs")),
  ("gastrocnemius", (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="legs")),
  ("hamstrings", (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="legs")),
  ("gluteal group", (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="legs")),
  ("lower back", (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="core")),
  ("abdominal muscle", (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="core")),
  ("oblique", (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="core")),
  ("pectoralis major", (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="chest and shoulders")),
  ("pectoralis minor", (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="chest and shoulders")),
  ("deltoids", (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="chest and shoulders")),
  ("biceps brachii", (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="arms")),
  ("triceps brachii", (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="arms")),
  ("forearms", (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="arms")),
  ("latissimus dorsi", (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="upper back")),
  ("trapezius", (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="upper back"));

INSERT INTO MUSCLEGROUPS_EXERCISES
  (muscle_group_id, exercise_id)
VALUES
  (
    (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="legs"),
    (SELECT exercise_id FROM EXERCISES WHERE exercise_name="barbell squat")
  ),
  (
    (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="core"),
    (SELECT exercise_id FROM EXERCISES WHERE exercise_name="barbell squat")
  ),
  (
    (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="chest and shoulders"),
    (SELECT exercise_id FROM EXERCISES WHERE exercise_name="wide-grip pullup")
  ),
  (
    (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="chest and shoulders"),
    (SELECT exercise_id FROM EXERCISES WHERE exercise_name="barbell bench press")
  ),
  (
    (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="arms"),
    (SELECT exercise_id FROM EXERCISES WHERE exercise_name="wide-grip pullup")
  ),
  (
    (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="arms"),
    (SELECT exercise_id FROM EXERCISES WHERE exercise_name="dumbbell bicep curl")
  );

INSERT INTO USERS_MUSCLEGROUPS
  (user_id, muscle_group_id)
VALUES
  (
    (SELECT user_id FROM USERS WHERE user_name="michaelbstearns"),
    (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="legs")
  ),
  (
    (SELECT user_id FROM USERS WHERE user_name="michaelbstearns"),
    (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="chest and shoulders")
  ),
  (
    (SELECT user_id FROM USERS WHERE user_name="thr0wawaygrbg3"),
    (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="core")
  ),
  (
    (SELECT user_id FROM USERS WHERE user_name="thr0wawaygrbg3"),
    (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="arms")
  ),
  (
    (SELECT user_id FROM USERS WHERE user_name="michaelbstearns"),
    (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name="arms")
  );

INSERT INTO USERS_EXERCISES
  (user_id, exercise_id)
VALUES
  (
    (SELECT user_id FROM USERS WHERE user_name="michaelbstearns"),
    (SELECT exercise_id FROM EXERCISES WHERE exercise_name="barbell squat")
  ),
  (
    (SELECT user_id FROM USERS WHERE user_name="michaelbstearns"),
    (SELECT exercise_id FROM EXERCISES WHERE exercise_name="wide-grip pullup")
  ),
  (
    (SELECT user_id FROM USERS WHERE user_name="thr0wawaygrbg3"),
    (SELECT exercise_id FROM EXERCISES WHERE exercise_name="barbell squat")
  ),
  (
    (SELECT user_id FROM USERS WHERE user_name="thr0wawaygrbg3"),
    (SELECT exercise_id FROM EXERCISES WHERE exercise_name="wide-grip pullup")
  ),
  (
    (SELECT user_id FROM USERS WHERE user_name="michaelbstearns"),
    (SELECT exercise_id FROM EXERCISES WHERE exercise_name="dumbbell bicep curl")
  );