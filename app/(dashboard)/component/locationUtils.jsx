
import axios from 'axios';

export const fetchSuggestions = async (input, setSuggestions) => {
  try {
    const response = await axios.get(`https://photon.komoot.io/api/?q=${input}&limit=10`);
    const filteredSuggestions = response.data.features
      .filter((item) => item.properties.country === 'Canada')
      .map((item) => ({
        ...item,
        full_address: `${item.properties.housenumber ? item.properties.housenumber + ' ' : ''}${item.properties.street ? item.properties.street + ', ' : ''}${item.properties.city ? item.properties.city + ', ' : ''}${item.properties.state ? item.properties.state + ', ' : ''}${item.properties.country}`
      }));
    setSuggestions(filteredSuggestions);
  } catch (error) {
    console.error(error);
  }
};
