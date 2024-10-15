import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import StudentHome from './components/StudentHome';
import TeacherHome from './components/TeacherHome';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/student" element={<StudentHome />} />
          <Route path="/teacher" element={<TeacherHome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;