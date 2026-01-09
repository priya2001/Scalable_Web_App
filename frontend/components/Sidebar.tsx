'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Sidebar({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() !== '') {
      try {
        const res = await api(`/notes?search=${encodeURIComponent(value)}`);
        setSearchResults(Array.isArray(res.notes) ? res.notes : res);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Error searching notes:', error);
        setSearchResults([]);
      }
    } else {
      setShowSearchResults(false);
    }
  };

  const handleNoteClick = (noteId: string) => {
    setShowSearchResults(false);
    setSearchTerm('');
    // Scroll to the note on the page or navigate as needed
  };

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen sticky top-0 p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Notes App</h2>
      </div>
      
      <div className="mb-6 p-3 bg-gray-700 rounded-lg">
        <h3 className="font-semibold">{user?.name}</h3>
        <p className="text-sm text-gray-300 truncate">{user?.email}</p>
      </div>
      
      <nav className="flex-1">
        <ul>
          <li className="mb-2">
            <Link href="/dashboard" className="block p-2 hover:bg-gray-700 rounded">
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <button 
              onClick={() => document.getElementById('profile-modal-btn')?.click()}
              className="w-full text-left p-2 hover:bg-gray-700 rounded"
            >
              Profile
            </button>
          </li>
          <li className="mb-2">
            <button 
              onClick={onLogout}
              className="w-full text-left p-2 hover:bg-gray-700 rounded text-red-400"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="mt-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border border-gray-600 focus:border-blue-500"
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => searchTerm && setShowSearchResults(true)}
          />
          
          {showSearchResults && (
            <div className="absolute z-10 mt-2 w-full bg-white text-black rounded-lg shadow-xl max-h-60 overflow-y-auto border border-gray-200">
              {searchResults.length > 0 ? (
                searchResults.map((note) => (
                  <div 
                    key={note._id} 
                    className="p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                    onClick={() => handleNoteClick(note._id)}
                  >
                    <div className="font-medium text-gray-800 truncate">{note.title}</div>
                    <div className="text-xs text-gray-500 truncate mt-1">{note.content.substring(0, 50)}...</div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500 text-center">No notes found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}