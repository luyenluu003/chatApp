import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { BGImage, Logo } from "../assets";
import { UserTextInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import { avatars } from "../utils/supports";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { doc, setDoc } from "firebase/firestore";

const SignUpScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const screenHeight = Math.round(Dimensions.get("window").height);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]?.image.asset.url);
  const [isAvatarMenu, setIsAvatarMenu] = useState(false);

  const navigation = useNavigation();

  const handleAvatar = (item) => {
    setAvatar(item?.image.asset.url);
    setIsAvatarMenu(false);
  };

  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);

  const handleSingUp = async () => {
    if (setGetEmailValidationStatus && email !== "") {
      await createUserWithEmailAndPassword(firebaseAuth, email, password).then(
        (userCred) => {
          const data = {
            _id: userCred?.user.uid,
            fullName: name,
            profilePic: avatar,
            providerData: userCred.user.providerData[0],
          };
          console.log("Full Name:", name);
          console.log("Email:", email);
          console.log("Password:", password);
          setDoc(doc(firestoreDB, "users", userCred?.user.uid), data).then(
            () => {
              navigation.navigate("LgoinScreen");
            }
          );
        }
      );
    }
  };

  return (
    <View className="flex-1 items-center jstufy-start">
      <Image
        source={BGImage}
        resizeMode="cover"
        className="h-96"
        style={{ width: screenWidth }}
      />

      {isAvatarMenu && (
        <>
          {/* List of  avatars sections */}
          <View
            className="absolute inset-0 z-10"
            style={{ width: screenWidth, height: screenHeight }}
          >
            <ScrollView>
              <BlurView
                className="w-full h-full px-4 py-4 flex-row flex-wrap items-center justify-evenly"
                tint="light"
                intensity={80}
                style={{ width: screenWidth, height: screenHeight }}
              >
                {avatars?.map((item) => (
                  <TouchableOpacity
                    onPress={() => handleAvatar(item)}
                    key={item._id}
                    className="w-20 m-3 h-20 p-1 rounded-full border-2 border-primary relative"
                  >
                    <Image
                      source={{ uri: item?.image.asset.url }}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
              </BlurView>
            </ScrollView>
          </View>
        </>
      )}

      {/* Main view */}
      <View className="w-full h-full bg-white rounded-tl-[90px] -mt-44 flex items-center justify-start py-6 px-6 space-y-6">
        <Image source={Logo} className="w-16 h-16" resizeMode="contain" />

        <Text className="py-2 text-primaryText text-xl font-semibold">
          Join with us!
        </Text>

        <View className="w-full flex items-center justify-center">
          {/* Avatar section */}
          <View className="w-full flex items-center justify-center relative -my-4">
            <TouchableOpacity
              onPress={() => setIsAvatarMenu(true)}
              className="w-20 h-20 p-1 mb-5 rounded-full border-2 border-primary relative"
            >
              <Image
                source={{ uri: avatar }}
                className="w-full h-full"
                resizeMode="contain"
              />
              <View className="w-6 h-6 bg-primary rounded-full absolute top-0 right-0 flex items-center justify-center">
                <MaterialIcons name="edit" size={18} color={"#fff"} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Full name */}
          <UserTextInput
            placeholder="Full Name"
            isPass={false}
            setStatValue={setName}
          />

          {/* Email */}
          <UserTextInput
            placeholder="Email"
            isPass={false}
            setStatValue={setEmail}
            setGetEmailValidationStatus={setGetEmailValidationStatus}
          />

          {/* Password */}
          <UserTextInput
            placeholder="Password"
            isPass={true}
            setStatValue={setPassword}
          />

          {/* Login Button */}

          <TouchableOpacity
            onPress={handleSingUp}
            className="w-full px-4 py-2 rounded-xl bg-primary my-3 flex items-center justify-center"
          >
            <Text className="py-2 text-white text-xl font-semibold">
              Sign Up
            </Text>
          </TouchableOpacity>

          <View className="w-full py-5 flex-row items-center justify-center space-x-2">
            <Text className="text-base text-primaryText">
              Have an account !
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("LgoinScreen")}
            >
              <Text className="text-base font-semibold text-primaryBold">
                Login Here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
