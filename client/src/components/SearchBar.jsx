import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // optional, if you want to navigate on click

const SearchBar = () => {
  const [searchText, setSearchText] = useState('');
  const [dropdownResults, setDropdownResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const fetchMatches = async (text) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/campaign/all?title=${encodeURIComponent(text)}`);
      setDropdownResults(response.data.campaigns);
      setShowDropdown(true);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  useEffect(() => {
    if (searchText.trim() === '') {
      setDropdownResults([]);
      setShowDropdown(false);
      return;
    }
    const delayDebounce = setTimeout(() => {
      fetchMatches(searchText);
    }, 300); // debounce to avoid too many requests

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const handleSelect = (id) => {
    // Navigate to campaign detail page, or replace this with any action
    navigate(`/campaign/${id}`);
    setShowDropdown(false);
    setSearchText('');
  };

  return (
    <div className="py-12 bg-gray-50 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-cyan-900 mb-8">Find Campaigns to Support</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by campaign name..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />

          {/* Dropdown */}
          {showDropdown && dropdownResults.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-b-lg shadow max-h-60 overflow-y-auto mt-1">
              {dropdownResults.map((item) => (
                <li
                  key={item._id}
                  onClick={() => handleSelect(item._id)}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {item.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
