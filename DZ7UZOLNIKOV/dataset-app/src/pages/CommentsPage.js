import React, { useEffect, useState } from 'react';
import DataSet from '../components/DataSet';
import { useOptimistic } from '../hooks/useOptimistic';

const CommentsPage = () => {
  const [comments, setComments, optimisticUpdate] = useOptimistic([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [newComment, setNewComment] = useState({ name: '', email: '', body: '' });

  // Загрузка комментариев
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/comments')
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error(err));
  }, [setComments]);

  const handleSelectionChange = (indices) => {
    setSelectedIndices(indices);
  };

  // Добавление
  const handleAddComment = () => {
    const tempId = Date.now();
    const commentToAdd = { ...newComment, id: tempId };
    optimisticUpdate(
      prev => [...prev, commentToAdd],
      async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/comments', {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(newComment)
        });
        if (!response.ok) {
          throw new Error('Ошибка при добавлении комментария');
        }
        const returnedComment = await response.json();
        setComments(prev => prev.map(c => c.id === tempId ? returnedComment : c));
      }
    );
    setNewComment({ name: '', email: '', body: '' });
  };

  // Удаление выбранных
  const handleDeleteSelected = () => {
    const commentsToDelete = comments.filter((_, index) => selectedIndices.includes(index));
    const newComments = comments.filter((_, index) => !selectedIndices.includes(index));

    optimisticUpdate(
      prev => newComments,
      async () => {
        const responses = await Promise.all(
          commentsToDelete.map(comment =>
            fetch(`https://jsonplaceholder.typicode.com/comments/${comment.id}`, {
              method: 'DELETE'
            })
          )
        );
        for (const response of responses) {
          if (!response.ok) {
            throw new Error('Ошибка при удалении комментариев');
          }
        }
      }
    );
    setSelectedIndices([]);
  };

  // Редактирование
  const handleEditComment = (comment) => {
    setEditingComment(comment);
  };

  const handleSaveEdit = () => {
    if (!editingComment) return;
    const { id, name, email, body } = editingComment;
    optimisticUpdate(
      prev => prev.map(c => c.id === id ? editingComment : c),
      async () => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments/${id}`, {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ name, email, body })
        });
        if (!response.ok) {
          throw new Error('Ошибка при обновлении комментария');
        }
      }
    );
    setEditingComment(null);
  };

  const headers = ['ID', 'Name', 'Email', 'Comment', 'Actions'];
  const data = comments.map(comment => ({
    id: comment.id,
    name: comment.name,
    email: comment.email,
    body: comment.body,
    actions: <button onClick={() => handleEditComment(comment)}>Edit</button>
  }));

  return (
    <div>
      <h1>Comments</h1>

      {/* Форма редактирования */}
      {editingComment && (
        <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '20px' }}>
          <h2>Редактировать комментарий</h2>
          <input 
            type="text" 
            value={editingComment.name} 
            onChange={e => setEditingComment({ ...editingComment, name: e.target.value })}
            placeholder="Name"
          />
          <input 
            type="email" 
            value={editingComment.email} 
            onChange={e => setEditingComment({ ...editingComment, email: e.target.value })}
            placeholder="Email"
          />
          <textarea 
            value={editingComment.body} 
            onChange={e => setEditingComment({ ...editingComment, body: e.target.value })}
            placeholder="Comment"
          />
          <div>
            <button onClick={handleSaveEdit}>Сохранить</button>
            <button onClick={() => setEditingComment(null)}>Отмена</button>
          </div>
        </div>
      )}

      {/* Форма добавления */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Добавить комментарий</h2>
        <input 
          type="text" 
          placeholder="Name" 
          value={newComment.name} 
          onChange={e => setNewComment({ ...newComment, name: e.target.value })}
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={newComment.email} 
          onChange={e => setNewComment({ ...newComment, email: e.target.value })}
        />
        <textarea 
          placeholder="Comment" 
          value={newComment.body} 
          onChange={e => setNewComment({ ...newComment, body: e.target.value })}
        />
        <button onClick={handleAddComment}>Добавить</button>
      </div>

      <button onClick={handleDeleteSelected} style={{ marginBottom: '20px' }}>
        Удалить выделенные
      </button>

      <DataSet 
        headers={headers} 
        data={data} 
        renderHeader={(header) => <strong>{header}</strong>}
        renderRow={(value) => <span>{value}</span>}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};

export default CommentsPage;