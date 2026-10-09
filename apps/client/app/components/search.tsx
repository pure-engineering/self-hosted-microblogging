interface SearchProps {
  value: string;
  onChange: (value: string) => void;
}

function Search({ value, onChange }: SearchProps) {
  return (
    <div className="col-span-12 w-full pb-6">
      <input
        type="search"
        aria-label="Search posts"
        className="rounded-l border border-blue-700 px-5 py-1 disabled:bg-gray-100"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <button
        type="button"
        className="fill rounded-r border border-blue-700 bg-blue-700 px-5 py-1 text-white"
      >
        Search
      </button>
    </div>
  );
}

export default Search;
