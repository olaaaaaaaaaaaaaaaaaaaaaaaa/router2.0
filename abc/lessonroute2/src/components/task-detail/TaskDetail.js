import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { setTodoInTodos, removeTodoInTodos } from "../../utils";
import { updateTodo, deleteTodo } from "../../api";
import styles from "./taskdetails.module.css";
import { Button } from "../button/button";
import { Routes, Route } from "react-router-dom";
import NotFound from "../not-found/not-found";

const TaskDetail = ({ todos, setTodos }) => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3009/todos/${id}`)
      .then((loaded) => {
        return loaded.json();
      })
      .then((data) => {
        setTask(data);
      });
  }, [id]);

  const onTodoEdit = () => {
    setTask({ ...task, isEditing: true });
  };

  const onTodoTitleChange = (newTitle) => {
    setTask({ ...task, title: newTitle });
  };

  // const onTodoCompletedChange = (newCompleted) => {
  //   updateTodo({ id, completed: newCompleted }).then(() => {
  //     setTask({ ...task, completed: newCompleted });
  //     setTodos(setTodoInTodos(todos, { id, completed: newCompleted }));
  //   });
  // };

  const onTodoRemove = (todoId) => {
    deleteTodo(todoId).then(() => {
      setTodos(removeTodoInTodos(todos, todoId));
      navigate("/");
    });
  };

  const onTodoSave = () => {
    updateTodo({
      id: task.id,
      title: task.title,
      completed: task.completed,
    }).then(() => {
      setTodos(setTodoInTodos(todos, { ...task, isEditing: false }));
      navigate("/");
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className={styles.todo}>
        {task ? (
          <>
            {task.isEditing ? (
              <>
                {/* <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => onTodoCompletedChange(e.target.checked)}
                /> */}

                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => onTodoTitleChange(e.target.value)}
                />

                <Button onClick={() => onTodoSave(id)}>📝</Button>
              </>
            ) : (
              <div>
                <p> {task.title}</p>
                <div className={styles.btn}>
                  <div className={styles.btn2}>
                    {" "}
                    <Button onClick={onTodoEdit}>Edit</Button>
                    <Button onClick={() => onTodoRemove(task.id)}>
                      ✖
                    </Button>{" "}
                  </div>

                  <div>
                    {" "}
                    <Button className={styles.btn} onClick={handleBack}>
                      ←
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <p></p>
        )}
      </div>
      <Routes>
        <Route
          path="/:id"
          element={<TaskDetail todos={todos} setTodos={setTodos} />}
        />
      </Routes>
    </div>
  );
};

export default TaskDetail;
