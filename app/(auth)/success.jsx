import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, useRouter } from "expo-router";
import { StyleSheet, Text, View, Image, TouchableOpacity , Button, Linking, Alert, Platform} from "react-native";

const success = () => {
  const handlePress = async () => {
    try {
      if (Platform.OS === 'ios') {
        const emailUrl = 'message:';
        const canOpen = await Linking.canOpenURL(emailUrl);
        if (!canOpen) {
          Alert.alert('Error', 'No email client available');
        } else {
          await Linking.openURL(emailUrl);
        }
      } else if (Platform.OS === 'android') {
        // Try to open the Gmail app
        const gmailPackage = 'com.google.android.gm';
        const canOpenGmail = await Linking.canOpenURL(`android-app://${gmailPackage}`);
        
        if (canOpenGmail) {
          await Linking.openURL(`android-app://${gmailPackage}`);
        } else {
          // If Gmail is not available, try to open the default email client
          const emailIntent = 'intent://#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_EMAIL;end';
          const canOpenEmail = await Linking.canOpenURL(emailIntent);
          if (canOpenEmail) {
            await Linking.openURL(emailIntent);
          } else {
            Alert.alert('Error', 'No email client available');
          }
        }
      }
    } catch (error) {
      console.error('Error opening email client:', error);
      Alert.alert('Error', 'Failed to open email client');
    }
  };

  return (
    <SafeAreaView>
        <View>
        <Text style={styles.title}>Success!</Text>
        </View>
        <View>
        <Image source = {require("../../assets/images/tick.png")} style={styles.image}></Image>
        </View>
        <View style ={styles.wrapper} >
        <Text style={styles.smalltexttitle}>Verification Link has been successfully sent to your email address, Please Verify!</Text>
        </View>
    
        <TouchableOpacity style={styles.button} onPress={""}>
          <Text style={styles.buttonText} onPress={handlePress}> Check Email</Text>
        </TouchableOpacity>

        <Link href={"/"} style={styles.signupText}>
          Go Back
        </Link>
        
        
    </SafeAreaView>
  )
}

export default success


const styles = StyleSheet.create({
    
    title: {
      fontSize: 45,
      fontWeight: "bold",
      marginBottom: 340,
      paddingLeft: 20,
    },
    smalltext: {
      fontSize: 14,
      color: "#888",
      marginBottom: 20,
    },
    wrapper:{
        backgroundColor: "#F8faec",
        borderRadius:20,
        marginBottom:18,
        padding:20,
        marginHorizontal:20,
    },
    highlight: {
      color: "#4CAF50",
      fontWeight: "bold",
    },
    image: {
        marginTop:50,
        marginBottom:20,
        marginHorizontal: 130,

    },
    button: {
      
      paddingVertical: 15,
      paddingHorizontal: 40,
      backgroundColor: "#4CAF50",
      borderRadius: 10,
      marginHorizontal:20,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
      justifyContent: "center",
      alignContent: "center",
      textAlign: "center",
    },
    loginText: {
      marginTop: 300,
      color: "#888",
      fontSize: 14,
      textAlign: "center",
    },
    signupText: {
      marginTop: 10,
      color: "#888",
      fontSize: 14,
      textAlign: "center",
    },
    signupLink: {
      color: "#4CAF50",
      fontWeight: "bold",
      textAlign: "center",
    },
  });
  