import React, { useEffect, useState } from 'react';
import DataSet from '../components/DataSet';
import { useOptimistic } from '../hooks/useOptimistic';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const UsersPage = () => {
  const [users, setUsers, optimisticUpdate] = useOptimistic([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Ошибка загрузки пользователей:', err));
  }, [setUsers]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Требуется имя'),
    username: Yup.string().required('Требуется имя пользователя'),
    email: Yup.string().email('Неверный формат email').required('Требуется email')
  });

  const handleAddUser = (values, { resetForm }) => {
    const tempId = Date.now();
    const userToAdd = { ...values, id: tempId };
    optimisticUpdate(
      prev => [...prev, userToAdd],
      async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(values)
        });
        if (!response.ok) {
          throw new Error('Ошибка при добавлении пользователя');
        }
        const returnedUser = await response.json();
        setUsers(prev => prev.map(u => u.id === tempId ? returnedUser : u));
      }
    );
    resetForm();
  };

  const handleDeleteUser = (userId) => {
    const newUsers = users.filter(u => u.id !== userId);
    optimisticUpdate(
      prev => newUsers,
      async () => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Ошибка при удалении пользователя');
        }
      }
    );
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    optimisticUpdate(
      prev => prev.map(u => u.id === editingUser.id ? editingUser : u),
      async () => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${editingUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(editingUser)
        });
        if (!response.ok) {
          throw new Error('Ошибка при обновлении пользователя');
        }
      }
    );
    setEditingUser(null);
  };

  const headers = ['ID', 'Name', 'Username', 'Email', 'Actions'];
  const data = users.map(user => ({
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    actions: (
      <>
        <button onClick={() => handleEditUser(user)}>Редактировать</button>
        <button onClick={() => handleDeleteUser(user.id)}>Удалить</button>
      </>
    )
  }));

  return (
    <div>
      <h1>Users</h1>

      {editingUser && (
        <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '20px' }}>
          <h2>Редактировать пользователя</h2>
          <input 
            type="text"
            value={editingUser.name}
            onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
            placeholder="Name"
          />
          <input 
            type="text"
            value={editingUser.username}
            onChange={e => setEditingUser({ ...editingUser, username: e.target.value })}
            placeholder="Username"
          />
          <input 
            type="email"
            value={editingUser.email}
            onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
            placeholder="Email"
          />
          <div>
            <button onClick={handleSaveEdit}>Сохранить</button>
            <button onClick={() => setEditingUser(null)}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h2>Добавить нового пользователя</h2>
        <Formik
          initialValues={{ name: '', username: '', email: '' }}
          validationSchema={validationSchema}
          onSubmit={handleAddUser}
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <label htmlFor="name">Name:</label>
                <Field type="text" name="name" id="name" />
                <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
              </div>
              <div>
                <label htmlFor="username">Username:</label>
                <Field type="text" name="username" id="username" />
                <ErrorMessage name="username" component="div" style={{ color: 'red' }} />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <Field type="email" name="email" id="email" />
                <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
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

export default UsersPage;