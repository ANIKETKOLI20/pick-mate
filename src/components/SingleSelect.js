import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage"; 

export default function SingleSelect({ rowId, selectedOptions, updateSelectedOptions }) {

  // State to manage the selected option for this specific row
  const [selected, setSelected] = useLocalStorage(`singleSelectOption-${rowId}`, "");
  
  // State for available options after filtering out globally selected options
  const [availableOptions, setAvailableOptions] = useState([]);

  // Load available options and globally selected options on mount
  useEffect(() => {
    const defaultOptions = ["Option 1", "Option 2", "Option 3", "Option 4"];
    let storedOptions = JSON.parse(localStorage.getItem("defaultOptions")) || defaultOptions;
    
    const globallySelected = JSON.parse(localStorage.getItem("globallySelectedOptions")) || [];
    setAvailableOptions(storedOptions.filter(option => !globallySelected.includes(option)));
  }, []);

  // Function to handle change in selection and update global state
  const handleChange = (value) => {
    const globallySelected = JSON.parse(localStorage.getItem("globallySelectedOptions")) || [];
    if (value) {
      globallySelected.push(value);
    } else {
      const index = globallySelected.indexOf(selected);
      if (index > -1) globallySelected.splice(index, 1);
    }

    localStorage.setItem("globallySelectedOptions", JSON.stringify(globallySelected));
    setSelected(value);
    updateSelectedOptions(rowId, value);
  };

  return (
    <div>
      {selected ? (
        <button className="flex items-center gap-2 p-2 rounded-lg bg-gray-300 text-black hover:bg-gray-600" onClick={() => handleChange("")}>
          {selected} <span className="ml-2 text-black"><X size={16} /></span>
        </button>
      ) : (
        <select
          className="select select-bordered w-full"
          value={selected}
          onChange={(e) => handleChange(e.target.value)}
        >
          <option value="">Select Option</option>
          {availableOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
