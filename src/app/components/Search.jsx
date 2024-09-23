import axios from "axios";
import React, { useState } from "react";
import { debounce } from "../utils/helper";

const Search = ({ restaurants, setRestaurants }) => {
  const [keyword, setKeyword] = useState("");
  const [listSuggestLocation, setListSuggestLocation] = useState([]);
  const API_KEY = process.env.GOONG_MAP_API_KEY;
  const fetchSuggesstLocation = async (keyword) => {
    const data = await axios.get(
      `https://rsapi.goong.io/Place/AutoComplete?api_key=${API_KEY}&input=${keyword}`
    );
    if (data.status === 200) {
      setListSuggestLocation(data.data.predictions);
    }
  };

  const addRestaurant = (value) => async () => {
    const seleted = listSuggestLocation.filter(item => item.structured_formatting?.main_text == value);
    const geo = await axios.get(
      `https://rsapi.goong.io/geocode?place_id=${seleted[0].place_id}&api_key=${API_KEY}`
    );
    const newItem = {
      name: seleted[0].structured_formatting?.main_text,
      lat: geo.data.results[0].geometry.location.lat,
      lng: geo.data.results[0].geometry.location.lng,
      address: seleted[0].structured_formatting?.secondary_text,
    }
    const updatedRestaurants = [...restaurants, newItem];
    setRestaurants(updatedRestaurants);
    localStorage.setItem("restaurants", JSON.stringify(updatedRestaurants));
  };

  return (
    <div className="form-add-restaurant mt-4 h-full items-center justify-center">
      <input
        placeholder="Search restaurant..."
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          debounce(() => {
            fetchSuggesstLocation(e.target.value);
          }, 3000)();
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
