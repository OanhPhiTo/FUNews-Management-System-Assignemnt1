function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
}) {
  return (
    <div className="search-box">
      <input
        type="text"
        className="input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onClear}
          title="Clear search"
          style={{ whiteSpace: 'nowrap' }}
        >
          Clear
        </button>
      )}
    </div>
  );
}

export default SearchBar;
