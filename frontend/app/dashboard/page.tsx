"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const router = useRouter();

  // Load user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await api('/auth/profile', 'GET');
        setUser(profileRes);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    fetchProfile();
  }, []);

  const loadNotes = async (search = "") => {
    setLoading(true);
    try {
      const res = await api(`/notes${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      setNotes(Array.isArray(res.notes) ? res.notes : res);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }
    
    try {
      if (editingNote) {
        await api(`/notes/${editingNote._id}`, "PUT", { title, content });
        setEditingNote(null);
      } else {
        await api("/notes", "POST", { title, content });
      }
      setTitle("");
      setContent("");
      loadNotes(searchTerm);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note');
    }
  };

  const deleteNote = async (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await api(`/notes/${id}`, "DELETE");
        loadNotes(searchTerm);
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note');
      }
    }
  };

  const editNote = (note: any) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingNote(note);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    loadNotes(value);
  };

  const cancelEdit = () => {
    setTitle("");
    setContent("");
    setEditingNote(null);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          {user && (
            <p className="text-gray-600">Welcome, <span className="font-semibold">{user.name}</span></p>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowProfileModal(true)} 
            className="btn bg-gray-600 hover:bg-gray-700"
          >
            Profile
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/login');
            }} 
            className="btn self-end bg-red-600 hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button 
                onClick={() => setShowProfileModal(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const formData = new FormData(e.target as HTMLFormElement);
                const updatedData = {
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                };
                
                await api('/auth/profile', 'PUT', updatedData);
                setUser({...user, ...updatedData});
                setShowProfileModal(false);
                alert('Profile updated successfully');
              } catch (error) {
                console.error('Update profile error:', error);
                alert('Failed to update profile');
              }
            }}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                <input 
                  id="name" 
                  name="name" 
                  type="text" 
                  className="input w-full" 
                  defaultValue={user?.name || ''}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  className="input w-full" 
                  defaultValue={user?.email || ''}
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn flex-1">Save Changes</button>
                <button 
                  type="button" 
                  onClick={() => setShowProfileModal(false)} 
                  className="btn bg-gray-500 hover:bg-gray-600 flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{editingNote ? 'Edit Note' : 'Add New Note'}</h2>
        <form onSubmit={addNote}>
          <div className="mb-4">
            <input 
              placeholder="Note Title" 
              className="input w-full" 
              value={title}
              onChange={e=>setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <textarea 
              placeholder="Note Content" 
              className="input w-full min-h-[100px]" 
              value={content}
              onChange={e=>setContent(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn">
              {editingNote ? 'Update Note' : 'Add Note'}
            </button>
            {editingNote && (
              <button type="button" onClick={cancelEdit} className="btn bg-gray-500 hover:bg-gray-600">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 w-full">
            <input 
              type="text" 
              placeholder="Search notes..." 
              className="input w-full" 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading notes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.length > 0 ? (
            notes.map(note => (
              <div key={note._id} className="p-4 shadow rounded-lg bg-white border border-gray-200">
                <h3 className="font-bold text-lg mb-2 truncate">{note.title}</h3>
                <p className="text-gray-700 mb-3 line-clamp-3">{note.content}</p>
                <div className="text-xs text-gray-500 mb-3">
                  Created: {new Date(note.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => editNote(note)} 
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteNote(note._id)} 
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              {searchTerm ? 'No notes found matching your search.' : 'No notes available. Add a new note to get started!'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
