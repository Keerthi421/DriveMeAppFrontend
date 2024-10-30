import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { fetchSuggestions } from "./locationUtils";

const Autocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query.length > 2) {
      fetchSuggestions(query, setSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSelectSuggestion = (suggestion) => {
    const { full_address, geometry } = suggestion;
    setQuery(full_address);
    onSelect({
      address: full_address,
      coordinates: geometry.coordinates,
    });
    setSuggestions([]);
  };

  return (
    <View>
      <TextInput
        placeholder="Type a location"
        value={query}
        onChangeText={(text) => setQuery(text)}
        style={styles.inner}
      />
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.properties.osm_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectSuggestion(item)}>
              <Text style={{ padding: 20 }}>{item.full_address}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default Autocomplete;

const styles = StyleSheet.create({
  inner: {
    height: 40,
    borderWidth: 1,
    padding: 5,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 10,
    color: "#000000",
  },
});
