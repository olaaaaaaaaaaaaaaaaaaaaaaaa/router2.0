import React, { useEffect, useState } from "react";
import { ControlPanel, Todo } from "./components";
import { createTodo, readTodos } from "./api";
import {
  addTodoInTodos,
  findTodo,
  removeTodoInTodos,
  setTodoInTodos,
} from "./utils";
import { NEW_TODO_ID } from "./constants";
import styles from "./app.module.css";
import { Link, Route, Routes } from "react-router-dom";
import TaskDetail from "./components/task-detail/TaskDetail";
import NotFound from "./components/not-found/not-found";

export const App = () => {
  const [todos, setTodos] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [isAlphabetSorting, setIsAlphabetSorting] = useState(false);

  const onTodoAdd = () => {
    setTodos(addTodoInTodos(todos));
  };

  const onTodoTitleChange = (id, newTitle) => {
    setTodos(setTodoInTodos(todos, { id, title: newTitle }));
  };

  useEffect(() => {
    readTodos(searchPhrase, isAlphabetSorting).then((loadedTodos) =>
      setTodos(loadedTodos)
    );
  }, [searchPhrase, isAlphabetSorting]);

  const onTodoSave = (todoId) => {
    const { title, completed } = findTodo(todos, todoId) || {};

    if (todoId === NEW_TODO_ID) {
      createTodo({ title, completed }).then((todo) => {
        let updatedTodos = setTodoInTodos(todos, {
          id: NEW_TODO_ID,
          isEditing: false,
        });
        updatedTodos = removeTodoInTodos(updatedTodos, NEW_TODO_ID);
        updatedTodos = addTodoInTodos(updatedTodos, todo);
        setTodos(updatedTodos);
      });
    }
  };

  const onTodoCompletedChange = (id, newCompleted) => {
    setTodos(setTodoInTodos(todos, { id, completed: newCompleted }));
  };

  return (
    <div className={styles.app}>
      <Link to="/">Главная</Link>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <ControlPanel
                onTodoAdd={onTodoAdd}
                onSearch={setSearchPhrase}
                onSorting={setIsAlphabetSorting}
              />
              <div>
                {todos.map(({ id, title, completed, isEditing = false }) => (
                  <Todo
                    key={id}
                    id={id}
                    title={title}
                    completed={completed}
                    isEditing={isEditing}
                    onTitleChange={(newTitle) =>
                      onTodoTitleChange(id, newTitle)
                    }
                    onCompletedChange={(newCompleted) =>
                      onTodoCompletedChange(id, newCompleted)
                    }
                    onSave={() => onTodoSave(id)}
                    todos={todos}
                    setTodos={setTodos}
                  />
                ))}
              </div>
            </>
          }
        />
        <Route
          path="/:id"
          element={<TaskDetail todos={todos} setTodos={setTodos} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};
