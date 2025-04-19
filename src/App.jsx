import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    file: null,
    options: []
  });

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const optionsList = [
    "EMAIL_ADDRESS",
    "PHONE_NUMBER",
    "US_SSN",
    "CREDIT_CARD",
    "IBAN_CODE",
    "PASSPORT",
    "DRIVER_LICENSE",
    "US_BANK_ACCOUNT",
    "US_ITIN",
    "IP_ADDRESS"
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      file: selectedFile,
    }));
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleOptionClick = (option) => {
    setFormData((prev) => {
      const alreadySelected = prev.options.includes(option);
      const updatedOptions = alreadySelected
        ? prev.options.filter((item) => item !== option)
        : [...prev.options, option];
      return {
        ...prev,
        options: updatedOptions,
      };
    });
  };

  const handleRemoveTag = (option) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((item) => item !== option),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.file) {
      alert("Please select a file.");
      return;
    }
    
    if (formData.options.length === 0) {
      alert("Please select at least one option.");
      return;
    }
  
    const formPayload = new FormData();
    formPayload.append("file", formData.file);  
    formPayload.append("options", JSON.stringify(formData.options));
  
    try {
      const response = await fetch('/sendfile', {
        method: 'POST',
        body: formPayload,
      });
  
      const result = await response.json();
      console.log("Response:", result);
      alert("File sent successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow-md space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Upload File</h1>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select File
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
     
        <div ref={dropdownRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Options
          </label>

          <div
            className="w-full border border-gray-300 rounded px-3 py-2 flex flex-wrap gap-2 min-h-[3rem] cursor-pointer"
            onClick={toggleDropdown}
          >
            {formData.options.length === 0 && (
              <span className="text-gray-400">Select options...</span>
            )}
            {formData.options.map((option) => (
              <span
                key={option}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"
              >
                {option}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(option)}
                  className="ml-1 text-blue-500 hover:text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-auto">
              {optionsList.map((option) => (
                <div
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                    formData.options.includes(option) ? 'bg-blue-50' : ''
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
