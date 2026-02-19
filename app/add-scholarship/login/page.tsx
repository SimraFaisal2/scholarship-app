"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  LayoutGrid, 
  Medal, 
  Search, 
  Calendar, 
  User, 
  LogOut, 
  FlaskConical 
} from 'lucide-react';

export default function Home() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();
  }, []);

  const fetchScholarships = async () => {
    setLoading(true);
    let query = supabase.from('scholarships').select('*');
    if (searchTerm) query = query.ilike('title', `%${searchTerm}%`);
    const { data, error } = await query;
    if (!error) setScholarships(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchScholarships();
  }, [searchTerm]);

  const handleSave = async (scholarshipId: number) => {
    if (!user) {
      alert("Please log in to save scholarships!");
      window.location.href = '/login'; 
      return;
    }
    const { error } = await supabase.from('saved_scholarships').insert([
      { user_id: user.id, scholarship_id: scholarshipId }
    ]);
    if (error) {
      error.code === '23505' ? alert("Already saved!") : alert("Error saving.");
    } else {
      alert("Scholarship saved! 🎉");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const navItems = [
    { name: 'Overview', icon: <LayoutGrid size={20} /> },
    { name: 'Scholarships', icon: <Medal size={20} /> },
    { name: 'Research', icon: <FlaskConical size={20} /> },
    { name: 'Calendar', icon: <Calendar size={20} /> },
    { name: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0B0E14] text-gray-400 flex flex-col fixed h-full p-6">
        <div className="flex items-center gap-1 mb-10 px-2">
          <span className="text-2xl font-bold text-white">UC</span>
          <span className="w-2 h-2 rounded-full bg-purple-500 mt-2"></span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group
                ${activeTab === item.name 
                  ? 'bg-gradient-to-r from-purple-900/20 to-transparent text-white border-l-4 border-purple-500 shadow-[inset_10px_0px_20px_-10px_rgba(139,92,246,0.3)]' 
                  : 'hover:text-gray-200'}`}
            >
              <span className={activeTab === item.name ? 'text-purple-400' : 'group-hover:text-gray-200'}>
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Find Your Scholarship</h1>
            <p className="text-gray-500 mt-1">Explore opportunities curated for your profile.</p>
          </div>
          
          {user ? (
            <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-full shadow-sm border">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                {user.email?.[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{user.email}</span>
            </div>
          ) : (
            <a href="/login" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition">
              Sign In
            </a>
          )}
        </header>

        <section className="mb-10">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by title, field, or provider..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </div>
        </section>

        {loading && <div className="animate-pulse text-gray-400">Loading scholarships...</div>}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {scholarships.map((scholarship) => (
            <div key={scholarship.id} className="group bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{scholarship.title}</h2>
              <p className="text-gray-500 text-sm mt-1">{scholarship.provider_name || 'Global Provider'}</p>
              
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">${scholarship.amount_min.toLocaleString()}</span>
                <span className="text-gray-400 text-sm">/ funding</span>
              </div>
              
              <div className="mt-auto pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Deadline</span>
                  <span className="text-sm font-medium text-gray-700">
                    {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'Rolling'}
                  </span>
                </div>
                <button 
                  onClick={() => handleSave(scholarship.id)}
                  className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-purple-600 transition-colors"
                >
                  Save to Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}