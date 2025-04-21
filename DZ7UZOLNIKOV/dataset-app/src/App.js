import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import CommentsPage from './pages/CommentsPage';
import PostsPage from './pages/PostsPage';
import AlbumsPage from './pages/AlbumsPage';
import TodosPage from './pages/TodosPage';
import UsersPage from './pages/UsersPage';

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* Сайдбар для навигации */}
        <Sidebar />

        {/* Основная область, в которой будут переключаться страницы */}
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            {/* Если пользователь заходит на "/", то перенаправляем его на /comments */}
            <Route path="/" element={<Navigate to="/comments" replace />} />

            <Route path="/comments" element={<CommentsPage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/todos" element={<TodosPage />} />
            <Route path="/users" element={<UsersPage />} />

            {/* Можно добавить Route для 404, если хотите */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;