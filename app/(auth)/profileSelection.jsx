import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const ProfileSelection = () => {
  const handleSelectRole = (role) => {
    // console.log(role);
    router.push({
      pathname : "/sign-up",
      params : {
        userRole : role
      }
    })
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Text style = {styles.textStyle}>Choose you preference</Text>
        <TouchableOpacity style={styles.view1} onPress={() => handleSelectRole('Driver')}>
          <Image source={require('../../assets/images/driver.jpg')} style={styles.imageStyle} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.view2} onPress={() => handleSelectRole('Passenger')}>
          <Image source={require('../../assets/images/passenger.jpg')} style={styles.imageStyle} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileSelection;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  view1: {
    borderWidth: 2,
    borderColor: 'black',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // padding: 20,
    marginBottom: 20,
  },
  view2: {
    borderWidth: 2,
    borderColor: 'black',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // padding: 20,
  },
  imageStyle: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  textStyle : {
    position : 'absolute',
    top : 20,
    fontSize : 20,
    fontWeight : 'bold'
  }
});
