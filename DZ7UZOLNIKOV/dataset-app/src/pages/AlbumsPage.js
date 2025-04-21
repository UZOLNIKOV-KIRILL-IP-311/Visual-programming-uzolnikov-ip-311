import React, { useEffect, useState } from 'react';
import DataSet from '../components/DataSet';
import { useOptimistic } from '../hooks/useOptimistic';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AlbumsPage = () => {
  const [albums, setAlbums, optimisticUpdate] = useOptimistic([]);
  const [editingAlbum, setEditingAlbum] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/albums')
      .then(res => res.json())
      .then(data => setAlbums(data))
      .catch(err => console.error('Ошибка загрузки альбомов:', err));
  }, [setAlbums]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Требуется название альбома')
  });

  const handleAddAlbum = (values, { resetForm }) => {
    const tempId = Date.now();
    const albumToAdd = { ...values, id: tempId, userId: 1 };
    optimisticUpdate(
      prev => [...prev, albumToAdd],
      async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/albums', {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(values)
        });
        if (!response.ok) {
          throw new Error('Ошибка при добавлении альбома');
        }
        const returnedAlbum = await response.json();
        setAlbums(prev => prev.map(alb => alb.id === tempId ? returnedAlbum : alb));
      }
    );
    resetForm();
  };

  const handleDeleteAlbum = (albumId) => {
    const newAlbums = albums.filter(album => album.id !== albumId);
    optimisticUpdate(
      prev => newAlbums,
      async () => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Ошибка при удалении альбома');
        }
      }
    );
  };

  const handleEditAlbum = (album) => {
    setEditingAlbum(album);
  };

  const handleSaveEdit = () => {
    if (!editingAlbum) return;
    optimisticUpdate(
      prev => prev.map(alb => alb.id === editingAlbum.id ? editingAlbum : alb),
      async () => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/albums/${editingAlbum.id}`, {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(editingAlbum)
        });
        if (!response.ok) {
          throw new Error('Ошибка при обновлении альбома');
        }
      }
    );
    setEditingAlbum(null);
  };

  const headers = ['ID', 'Title', 'Actions'];
  const data = albums.map(album => ({
    id: album.id,
    title: album.title,
    actions: (
      <>
        <button onClick={() => handleEditAlbum(album)}>Редактировать</button>
        <button onClick={() => handleDeleteAlbum(album.id)}>Удалить</button>
      </>
    )
  }));

  return (
    <div>
      <h1>Albums</h1>

      {editingAlbum && (
        <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '20px' }}>
          <h2>Редактировать альбом</h2>
          <input 
            type="text" 
            value={editingAlbum.title} 
            onChange={e => setEditingAlbum({ ...editingAlbum, title: e.target.value })}
            placeholder="Название альбома"
          />
          <div>
            <button onClick={handleSaveEdit}>Сохранить</button>
            <button onClick={() => setEditingAlbum(null)}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h2>Добавить новый альбом</h2>
        <Formik
          initialValues={{ title: '' }}
          validationSchema={validationSchema}
          onSubmit={handleAddAlbum}
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

export default AlbumsPage;