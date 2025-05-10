import { useState,forwardRef, useImperativeHandle } from 'react';

const Dropdown = forwardRef(({ label, options, onSelect },ref) => {

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    onSelect?.(option);
    setIsOpen(false);
  };

  useImperativeHandle(ref, () => ({
    getValue: () => selected
  }));

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-between w-48 rounded-md border border-gray-700 bg-black px-4 py-2 text-sm text-white shadow-sm hover:bg-gray-800 focus:outline-none"
      >
        {selected ? selected.label : label}
        <svg
          className="ml-2 -mr-1 h-5 w-5 text-gray-300"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className="cursor-pointer px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
})

export default Dropdown;
