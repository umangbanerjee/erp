'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
// import 'tailwindcss/tailwind.css';  // Ensure this is in globals.css

const roles = ['admin', 'professor', 'guestLecturer', 'student'];

const initialClasses = [
  { id: 1, course: 'Physics', department: 'Science', professor: 'Prof. John', guest: false, time: '2025-04-28T10:00:00' },
  { id: 2, course: 'Marketing 101', department: 'Business', professor: 'Guest Mr. Smith', guest: true, time: '2025-04-29T13:00:00' },
  { id: 3, course: 'Calculus', department: 'Maths', professor: 'Prof. Alice', guest: false, time: '2025-04-30T09:00:00' },
];

export default function Home() {
  const [userRole, setUserRole] = useState('student');
  const [userId, setUserId] = useState(''); // Eroll number or Professor name
  const [classes, setClasses] = useState(initialClasses);
  const [newClass, setNewClass] = useState({ course: '', department: '', professor: '', time: '' });

  const filteredClasses = () => {
    if (userRole === 'admin') return classes;
    if (userRole === 'student') return classes; // In real case, match with Eroll
    if (userRole === 'professor') return classes.filter(c => c.professor.includes(userId));
    if (userRole === 'guestLecturer') return classes.filter(c => c.guest && c.professor.includes(userId));
    return [];
  };

  const addClass = () => {
    if (!newClass.course || !newClass.department || !newClass.professor || !newClass.time) {
      alert('Fill all details');
      return;
    }
    const updatedClasses = [...classes, { id: Date.now(), ...newClass, guest: false }];
    setClasses(updatedClasses);
    setNewClass({ course: '', department: '', professor: '', time: '' });
  };

  const handleDateClick = (info) => {
    if (userRole !== 'admin') return;
    const course = prompt('Enter Course Name:');
    const department = prompt('Enter Department:');
    const professor = prompt('Enter Professor Name:');
    if (course && department && professor) {
      const updatedClasses = [...classes, { id: Date.now(), course, department, professor, time: info.dateStr, guest: false }];
      setClasses(updatedClasses);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-800 to-purple-900 p-8">
      <h1 className="text-4xl font-bold text-center text-white mb-6">🎓 University Timetable ERP</h1>

      {/* Role Selection */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
          className="p-2 rounded-lg border border-gray-500 text-white bg-gray-700 focus:ring-2 focus:ring-indigo-500"
        >
          {roles.map(role => (
            <option key={role} value={role} className="text-black">{role.toUpperCase()}</option>
          ))}
        </select>

        {/* ID input */}
        {(userRole === 'student' || userRole === 'professor' || userRole === 'guestLecturer') && (
          <input
            type="text"
            placeholder={userRole === 'student' ? "Enter Eroll Number" : "Enter Your Name"}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="p-2 rounded-lg border border-gray-500 text-white bg-gray-700"
          />
        )}
      </div>

      {/* Admin New Class Section */}
      {userRole === 'admin' && (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">➕ Add New Class</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="Course" value={newClass.course} onChange={(e) => setNewClass({ ...newClass, course: e.target.value })}
              className="p-2 rounded-lg border text-white bg-gray-700" />
            <input type="text" placeholder="Department" value={newClass.department} onChange={(e) => setNewClass({ ...newClass, department: e.target.value })}
              className="p-2 rounded-lg border text-white bg-gray-700" />
            <input type="text" placeholder="Professor" value={newClass.professor} onChange={(e) => setNewClass({ ...newClass, professor: e.target.value })}
              className="p-2 rounded-lg border text-white bg-gray-700" />
            <input type="datetime-local" value={newClass.time} onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
              className="p-2 rounded-lg border text-white bg-gray-700" />
          </div>
          <button onClick={addClass} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Add Class</button>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-xl">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={filteredClasses().map((c) => ({
            id: c.id,
            title: `${c.course} (${c.professor})`,
            start: c.time,
            backgroundColor: c.guest ? '#e11d48' : '#6366f1', // Red for guests, Blue for professors
            textColor: '#ffffff', // White text for better contrast
            borderColor: '#ffffff',
          }))}
          dateClick={handleDateClick}
          height="auto"
        />
      </div>
    </div>
  );
}
