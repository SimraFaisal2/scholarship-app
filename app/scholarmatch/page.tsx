"use client";

import { useState, useMemo } from 'react';
import {
  Search,
  Bell,
  User,
  Filter,
  Clock,
  MapPin,
  GraduationCap,
  ChevronDown,
  Bookmark,
  BookmarkCheck,
  Grid3x3,
  KanbanSquare
} from 'lucide-react';

interface Scholarship {
  id: number;
  title: string;
  provider: string;
  country: string;
  region: string;
  deadline: string;
  matchScore: number;
  fullyFunded: boolean;
  fundingType: string;
  major: string[];
  description: string;
  status?: 'saved' | 'in-progress' | 'applied';
}

const mockScholarships: Scholarship[] = [
  {
    id: 1,
    title: "MEXT Japanese Government Scholarship",
    provider: "Japanese Government",
    country: "Japan",
    region: "Asia",
    deadline: "2026-05-15",
    matchScore: 95,
    fullyFunded: true,
    fundingType: "Fully Funded",
    major: ["Engineering", "Sciences", "Humanities"],
    description: "Full tuition, monthly allowance, and airfare for undergraduate studies in Japan"
  },
  {
    id: 2,
    title: "DAAD Undergraduate Scholarship",
    provider: "DAAD Germany",
    country: "Germany",
    region: "Europe",
    deadline: "2026-04-30",
    matchScore: 92,
    fullyFunded: true,
    fundingType: "Fully Funded",
    major: ["Engineering", "Computer Science", "Natural Sciences"],
    description: "Complete funding for undergraduate degrees at German universities"
  },
  {
    id: 3,
    title: "Eiffel Excellence Scholarship",
    provider: "French Ministry of Europe",
    country: "France",
    region: "Europe",
    deadline: "2026-03-20",
    matchScore: 88,
    fullyFunded: true,
    fundingType: "Fully Funded",
    major: ["Engineering", "Economics", "Law"],
    description: "Full funding including monthly stipend and cultural activities"
  },
  {
    id: 4,
    title: "Australian Awards Scholarship",
    provider: "Australian Government",
    country: "Australia",
    region: "Oceania",
    deadline: "2026-04-10",
    matchScore: 90,
    fullyFunded: true,
    fundingType: "Fully Funded",
    major: ["All Fields"],
    description: "Comprehensive support for undergraduate studies in Australia"
  },
  {
    id: 5,
    title: "Swiss Government Excellence Scholarships",
    provider: "Swiss Confederation",
    country: "Switzerland",
    region: "Europe",
    deadline: "2026-06-01",
    matchScore: 87,
    fullyFunded: true,
    fundingType: "Fully Funded",
    major: ["Arts", "Sciences", "Engineering"],
    description: "Full tuition and generous monthly allowance for Swiss universities"
  },
  {
    id: 6,
    title: "Korean Government Scholarship Program",
    provider: "Korean Government",
    country: "South Korea",
    region: "Asia",
    deadline: "2026-03-31",
    matchScore: 93,
    fullyFunded: true,
    fundingType: "Fully Funded",
    major: ["Technology", "Business", "Korean Studies"],
    description: "Complete financial support including language training"
  },
  {
    id: 7,
    title: "Netherlands Fellowship Programme",
    provider: "Dutch Government",
    country: "Netherlands",
    region: "Europe",
    deadline: "2026-05-01",
    matchScore: 85,
    fullyFunded: true,
    fundingType: "Fully Funded",
    major: ["Social Sciences", "Engineering", "Agriculture"],
    description: "Full scholarship for studies at Dutch institutions"
  },
  {
    id: 8,
    title: "New Zealand International Scholarship",
    provider: "New Zealand Government",
    country: "New Zealand",
    region: "Oceania",
    deadline: "2026-04-15",
    matchScore: 89,
    fullyFunded: true,
    fundingType: "Fully Funded",
    major: ["Environmental Sciences", "Agriculture", "Technology"],
    description: "Comprehensive funding for undergraduate programs"
  }
];

export default function ScholarMatchPro() {
  const [currentView, setCurrentView] = useState<'discover' | 'tracker'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [smartMatch, setSmartMatch] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedMajor, setSelectedMajor] = useState('all');
  const [deadlineFilter, setDeadlineFilter] = useState<string[]>([]);
  const [regionFilter, setRegionFilter] = useState<string[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<Set<number>>(new Set());
  const [scholarshipStatuses, setScholarshipStatuses] = useState<Map<number, string>>(new Map());

  const handleSaveScholarship = (id: number) => {
    setSavedScholarships(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        setScholarshipStatuses(prev => {
          const newMap = new Map(prev);
          newMap.delete(id);
          return newMap;
        });
      } else {
        newSet.add(id);
        setScholarshipStatuses(prev => {
          const newMap = new Map(prev);
          newMap.set(id, 'saved');
          return newMap;
        });
      }
      return newSet;
    });
  };

  const getDeadlineDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredScholarships = useMemo(() => {
    return mockScholarships.filter(scholarship => {
      const matchesSearch = searchQuery === '' ||
        scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholarship.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCountry = selectedCountry === 'all' || scholarship.country === selectedCountry;
      const matchesMajor = selectedMajor === 'all' || scholarship.major.includes(selectedMajor);

      const daysRemaining = getDeadlineDaysRemaining(scholarship.deadline);
      const matchesDeadline = deadlineFilter.length === 0 ||
        (deadlineFilter.includes('30days') && daysRemaining <= 30) ||
        (deadlineFilter.includes('3months') && daysRemaining <= 90);

      const matchesRegion = regionFilter.length === 0 || regionFilter.includes(scholarship.region);

      return matchesSearch && matchesCountry && matchesMajor &&
             (deadlineFilter.length === 0 || matchesDeadline) &&
             (regionFilter.length === 0 || matchesRegion);
    });
  }, [searchQuery, selectedCountry, selectedMajor, deadlineFilter, regionFilter]);

  const countries = ['all', ...Array.from(new Set(mockScholarships.map(s => s.country)))];
  const majors = ['all', 'Engineering', 'Computer Science', 'Business', 'Sciences', 'Humanities', 'Arts'];

  const toggleDeadlineFilter = (filter: string) => {
    setDeadlineFilter(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const toggleRegionFilter = (filter: string) => {
    setRegionFilter(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const savedScholarshipsList = mockScholarships.filter(s =>
    scholarshipStatuses.get(s.id) === 'saved'
  );
  const inProgressList = mockScholarships.filter(s =>
    scholarshipStatuses.get(s.id) === 'in-progress'
  );
  const appliedList = mockScholarships.filter(s =>
    scholarshipStatuses.get(s.id) === 'applied'
  );

  const moveScholarship = (id: number, newStatus: string) => {
    setScholarshipStatuses(prev => {
      const newMap = new Map(prev);
      newMap.set(id, newStatus);
      return newMap;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                ScholarMatch
              </h1>
              <div className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => setCurrentView('discover')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentView === 'discover'
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Grid3x3 size={18} />
                  Discover
                </button>
                <button
                  onClick={() => setCurrentView('tracker')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentView === 'tracker'
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <KanbanSquare size={18} />
                  My Tracker
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <User size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {currentView === 'discover' && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Discover Your Path to Success
            </h2>
            <p className="text-lg text-gray-600">
              Find fully-funded undergraduate scholarships tailored to your profile
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search scholarships by title, country, or provider..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="flex flex-wrap md:flex-nowrap gap-3">
                <label className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={smartMatch}
                    onChange={(e) => setSmartMatch(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Smart Match</span>
                </label>

                <div className="relative">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none cursor-pointer transition-all text-sm font-medium text-gray-700 min-w-[140px]"
                  >
                    {countries.map(country => (
                      <option key={country} value={country}>
                        {country === 'all' ? 'All Countries' : country}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>

                <div className="relative">
                  <select
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none cursor-pointer transition-all text-sm font-medium text-gray-700 min-w-[140px]"
                  >
                    {majors.map(major => (
                      <option key={major} value={major}>
                        {major === 'all' ? 'All Majors' : major}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <aside className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Filter size={20} className="text-gray-700" />
                  <h3 className="font-bold text-gray-900">Filters</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Deadline</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={deadlineFilter.includes('30days')}
                          onChange={() => toggleDeadlineFilter('30days')}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">Next 30 days</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={deadlineFilter.includes('3months')}
                          onChange={() => toggleDeadlineFilter('3months')}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">Next 3 months</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Region</h4>
                    <div className="space-y-2">
                      {['Asia', 'Europe', 'Oceania', 'Americas'].map(region => (
                        <label key={region} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={regionFilter.includes(region)}
                            onChange={() => toggleRegionFilter(region)}
                            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                          />
                          <span className="text-sm text-gray-700">{region}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Funding Type</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">Fully Funded</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <main className="flex-1">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Found <span className="font-semibold text-gray-900">{filteredScholarships.length}</span> scholarships
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {filteredScholarships.map(scholarship => (
                  <div
                    key={scholarship.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-600">{scholarship.provider}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                          {scholarship.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                        Fully Funded
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <GraduationCap size={14} />
                        {scholarship.matchScore}% Match
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {scholarship.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-amber-500" />
                        <span className="text-gray-700 font-medium">
                          {new Date(scholarship.deadline).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <button
                        onClick={() => handleSaveScholarship(scholarship.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          savedScholarships.has(scholarship.id)
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {savedScholarships.has(scholarship.id) ? (
                          <>
                            <BookmarkCheck size={16} />
                            Saved
                          </>
                        ) : (
                          <>
                            <Bookmark size={16} />
                            Save
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredScholarships.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No scholarships found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms</p>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {currentView === 'tracker' && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              My Scholarship Tracker
            </h2>
            <p className="text-lg text-gray-600">
              Manage your scholarship applications in one place
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Saved</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                  {savedScholarshipsList.length}
                </span>
              </div>
              <div className="space-y-4">
                {savedScholarshipsList.map(scholarship => (
                  <div
                    key={scholarship.id}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
                      {scholarship.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">{scholarship.provider}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={14} className="text-amber-500" />
                      <span className="text-xs text-gray-700">
                        {new Date(scholarship.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <button
                      onClick={() => moveScholarship(scholarship.id, 'in-progress')}
                      className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Start Application
                    </button>
                  </div>
                ))}
                {savedScholarshipsList.length === 0 && (
                  <div className="text-center py-8">
                    <Bookmark size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No saved scholarships yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">In Progress</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {inProgressList.length}
                </span>
              </div>
              <div className="space-y-4">
                {inProgressList.map(scholarship => (
                  <div
                    key={scholarship.id}
                    className="bg-blue-50 rounded-xl p-4 border border-blue-200 hover:shadow-md transition-all"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
                      {scholarship.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">{scholarship.provider}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={14} className="text-amber-500" />
                      <span className="text-xs text-gray-700">
                        {new Date(scholarship.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <button
                      onClick={() => moveScholarship(scholarship.id, 'applied')}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                    >
                      Mark as Applied
                    </button>
                  </div>
                ))}
                {inProgressList.length === 0 && (
                  <div className="text-center py-8">
                    <KanbanSquare size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No applications in progress</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Applied</h3>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                  {appliedList.length}
                </span>
              </div>
              <div className="space-y-4">
                {appliedList.map(scholarship => (
                  <div
                    key={scholarship.id}
                    className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 hover:shadow-md transition-all"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
                      {scholarship.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">{scholarship.provider}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={14} className="text-amber-500" />
                      <span className="text-xs text-gray-700">
                        {new Date(scholarship.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium">
                      <BookmarkCheck size={14} />
                      Application Submitted
                    </div>
                  </div>
                ))}
                {appliedList.length === 0 && (
                  <div className="text-center py-8">
                    <BookmarkCheck size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No applications submitted yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
