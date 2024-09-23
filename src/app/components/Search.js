import React from "react";

const Search = ({ keyword, setKeyword, fetchSuggesstLocation, listSuggestLocation, addRestaurant }) => {
  return (
    <div className="form-add-restaurant mt-4 h-full items-center justify-center">
      <input
        placeholder="Search restaurant..."
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          fetchSuggesstLocation(e.target.value);
        }}
        className="border p-2 w-full"
      />
      {listSuggestLocation?.length > 0 && keyword.length > 0 && (
        <div className="list-locations">
          {listSuggestLocation.map((item, idx) => (
            <p
              key={idx}
              onClick={addRestaurant(item?.structured_formatting?.main_text)}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {item.description}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
