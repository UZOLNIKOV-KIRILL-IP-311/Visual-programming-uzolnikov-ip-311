import React, { useEffect, useState } from 'react';
import DataSet from '../components/DataSet';
import { useOptimistic } from '../hooks/useOptimistic';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const TodosPage = () => {
  const [todos, setTodos, optimisticUpdate] = useOptimistic([]);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error('Ошибка загрузки задач:', err));
  }, [setTodos]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Требуется название задачи')
  });

  const handleAddTodo = (values, { resetForm }) => {
    const tempId = Date.now();
    const todoToAdd = { ...values, id: tempId, userId: 1, completed: false };
    optimisticUpdate(
      prev => [...prev, todoToAdd],
      async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(values)
        });
        if (!response.ok) {
          throw new Error('Ошибка при добавлении задачи');
        }
        const returnedTodo = await response.json();
        setTodos(prev => prev.map(td => td.id === tempId ? returnedTodo : td));
      }
    );
    resetForm();
  };

  const handleDeleteTodo = (todoId) => {
    const newTodos = todos.filter(td => td.id !== todoId);
    optimisticUpdate(
      prev => newTodos,
      async () => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Ошибка при удалении задачи');
        }
      }
    );
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
  };

  const handleSaveEdit = () => {
    if (!editingTodo) return;
    optimisticUpdate(
      prev => prev.map(td => td.id === editingTodo.id ? editingTodo : td),
      async () => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${editingTodo.id}`, {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(editingTodo)
        });
        if (!response.ok) {
          throw new Error('Ошибка при обновлении задачи');
        }
      }
    );
    setEditingTodo(null);
  };

  const headers = ['ID', 'Title', 'Completed', 'Actions'];
  const data = todos.map(td => ({
    id: td.id,
    title: td.title,
    completed: td.completed ? 'Да' : 'Нет',
    actions: (
      <>
        <button onClick={() => handleEditTodo(td)}>Редактировать</button>
        <button onClick={() => handleDeleteTodo(td.id)}>Удалить</button>
      </>
    )
  }));

  return (
    <div>
      <h1>Todos</h1>

      {editingTodo && (
        <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '20px' }}>
          <h2>Редактировать задачу</h2>
          <input 
            type="text" 
            value={editingTodo.title} 
            onChange={e => setEditingTodo({ ...editingTodo, title: e.target.value })}
            placeholder="Название задачи"
          />
          <div style={{ margin: '10px 0' }}>
            <label>
              <input 
                type="checkbox" 
                checked={editingTodo.completed}
                onChange={e => setEditingTodo({ ...editingTodo, completed: e.target.checked })}
              />
              Выполнено
            </label>
          </div>
          <div>
            <button onClick={handleSaveEdit}>Сохранить</button>
            <button onClick={() => setEditingTodo(null)}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h2>Добавить новую задачу</h2>
        <Formik
          initialValues={{ title: '' }}
          validationSchema={validationSchema}
          onSubmit={handleAddTodo}
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <label htmlFor="title">Title:</label>
                <Field type="text" name="title" id="title" />
                <ErrorMessage name="title" component="div" style={{ color: 'red' }} />
              </div>
              <button type="submit" disabled={isSubmitting}>Добавить</button>
            </Form>
          )}
        </Formik>
      </div>

      <DataSet 
        headers={headers}
        data={data}
        renderHeader={header => <strong>{header}</strong>}
        renderRow={value => <span>{value}</span>}
      />
    </div>
  );
};

export default TodosPage;