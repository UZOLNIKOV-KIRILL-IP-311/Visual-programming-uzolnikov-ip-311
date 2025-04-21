import React, { useEffect, useState } from 'react';
import DataSet from '../components/DataSet';
import { useOptimistic } from '../hooks/useOptimistic';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const PostsPage = () => {
  const [posts, setPosts, optimisticUpdate] = useOptimistic([]);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Ошибка загрузки постов:', err));
  }, [setPosts]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Требуется название'),
    body: Yup.string().required('Требуется текст')
  });

  const handleAddPost = (values, { resetForm }) => {
    const tempId = Date.now();
    const postToAdd = { ...values, id: tempId, userId: 1 };
    optimisticUpdate(
      prev => [...prev, postToAdd],
      async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(values)
        });
        if (!response.ok) {
          throw new Error('Ошибка при добавлении поста');
        }
        const returnedPost = await response.json();
        setPosts(prev => prev.map(p => p.id === tempId ? returnedPost : p));
      }
    );
    resetForm();
  };

  const handleDeletePost = (postId) => {
    const newPosts = posts.filter(p => p.id !== postId);
    optimisticUpdate(
      prev => newPosts,
      async () => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Ошибка при удалении поста');
        }
      }
    );
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
  };

  const handleSaveEdit = () => {
    if (!editingPost) return;
    optimisticUpdate(
      prev => prev.map(p => p.id === editingPost.id ? editingPost : p),
      async () => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${editingPost.id}`, {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(editingPost)
        });
        if (!response.ok) {
          throw new Error('Ошибка при обновлении поста');
        }
      }
    );
    setEditingPost(null);
  };

  const headers = ['ID', 'Title', 'Body', 'Actions'];
  const data = posts.map(post => ({
    id: post.id,
    title: post.title,
    body: post.body,
    actions: (
      <>
        <button onClick={() => handleEditPost(post)}>Редактировать</button>
        <button onClick={() => handleDeletePost(post.id)}>Удалить</button>
      </>
    )
  }));

  return (
    <div>
      <h1>Posts</h1>

      {editingPost && (
        <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '20px' }}>
          <h2>Редактировать пост</h2>
          <input 
            type="text" 
            value={editingPost.title} 
            onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
            placeholder="Title"
          />
          <textarea 
            value={editingPost.body} 
            onChange={e => setEditingPost({ ...editingPost, body: e.target.value })}
            placeholder="Body"
          />
          <div>
            <button onClick={handleSaveEdit}>Сохранить</button>
            <button onClick={() => setEditingPost(null)}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h2>Добавить новый пост</h2>
        <Formik
          initialValues={{ title: '', body: '' }}
          validationSchema={validationSchema}
          onSubmit={handleAddPost}
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <label htmlFor="title">Title:</label>
                <Field type="text" name="title" id="title" />
                <ErrorMessage name="title" component="div" style={{ color: 'red' }} />
              </div>
              <div>
                <label htmlFor="body">Body:</label>
                <Field as="textarea" name="body" id="body" />
                <ErrorMessage name="body" component="div" style={{ color: 'red' }} />
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

export default PostsPage;