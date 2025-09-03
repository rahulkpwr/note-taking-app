import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notesAPI } from '../services/api';
import { Note } from '../types';
import './Dashboard.css';
import blueBg from '../assets/blue-bg.png';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getNotes();
      setNotes(response.notes);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    try {
      const response = await notesAPI.createNote(newNote);
      setNotes([response.note, ...notes]);
      setNewNote({ title: '', content: '' });
      setShowCreateForm(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create note');
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await notesAPI.deleteNote(id);
      setNotes(notes.filter(note => note.id !== id));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete note');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="login-split-container">
      <div className="login-split-card">
        <div className="login-form-section">
          <div className="login-logo-placeholder">NT</div>
          <header className="dashboard-header">
            <div className="user-info">
              <h1>Welcome, {user?.name}!</h1>
              <p>{user?.email}</p>
            </div>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </header>

          {error && <div className="error-message">{error}</div>}

          <div className="dashboard-content">
            <div className="notes-header">
              <h2>Your Notes</h2>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="create-note-button"
              >
                + New Note
              </button>
            </div>

            {showCreateForm && (
              <div className="create-note-form">
                <form onSubmit={handleCreateNote}>
                  <input
                    type="text"
                    placeholder="Note title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Note content"
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    required
                  />
                  <div className="form-actions">
                    <button type="submit">Create Note</button>
                    <button 
                      type="button" 
                      onClick={() => setShowCreateForm(false)}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="notes-grid">
              {notes.length === 0 ? (
                <div className="empty-state">
                  <p>No notes yet. Create your first note!</p>
                </div>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="note-card">
                    <div className="note-header">
                      <h3>{note.title}</h3>
                      <button 
                        onClick={() => handleDeleteNote(note.id)}
                        className="delete-button"
                      >
                        ×
                      </button>
                    </div>
                    <p className="note-content">{note.content}</p>
                    <div className="note-footer">
                      <span>Created: {formatDate(note.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="login-image-section">
          <img src={blueBg} alt="Blue background" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 