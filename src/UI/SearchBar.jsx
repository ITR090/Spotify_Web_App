import { useState, forwardRef, useImperativeHandle,} from 'react';

const SearchBar = forwardRef(({styles,...props},ref) => {
  const [query, setQuery] = useState('');

  useImperativeHandle(ref, () => ({
    getValue: () => query
  }));
  
  return (
    <>
      <div className='rounded-md'>
      <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-96 p-2 rounded-md ${styles}`}
          {...props}
        />
      </div>
    </>
  );
});

export default SearchBar;
