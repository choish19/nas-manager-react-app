import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Bookmarks from './pages/Bookmarks';
import History from './pages/History';
import Settings from './pages/Setting';
import Login from './pages/Login';
import { useStore } from './store/useStore';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useStore();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const { user, fetchUser } = useStore();

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className={`flex h-screen ${user.setting.darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/bookmarks" element={<PrivateRoute><Bookmarks /></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;