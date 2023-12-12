import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import React from "react";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { firebaseAuth } from "../config/firebase.config";
import { SET_USER_NULL } from "../context/actions/userAction";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await firebaseAuth.signOut().then(() => {
      dispatch(SET_USER_NULL());
      navigation.replace("LgoinScreen");
    });
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-start">
      {/* Icons */}
      <View className="w-full flex-row items-center justify-between py-10 px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={32} color={"#555"} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Entypo name="dots-three-vertical" size={24} color={"#555"} />
        </TouchableOpacity>
      </View>
      {/* Profile */}
      <View className="items-center justify-center">
        <View className="relative border-2 border-primary p-1 rounded-full">
          <Image
            source={{ uri: user?.profilePic }}
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>
        <Text className="text-xl font-semibold text-primaryBold pt-3">
          {user?.fullName}
        </Text>
        <Text className="text-base font-semibold text-primaryText">
          {user?.providerData.email}
        </Text>
      </View>
      {/* Icons section */}
      <View className="w-full flex-row items-center justify-evenly py-6">
        <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12  h-12 rounded-lg bg-gray-200">
            <MaterialIcons name="messenger-outline" size={24} color={"#555"} />
          </TouchableOpacity>
          <Text className="text-sm text-primaryText py-1">Message</Text>
        </View>

        <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12  h-12 rounded-lg bg-gray-200">
            <Ionicons name="ios-videocam-outline" size={24} color={"#555"} />
          </TouchableOpacity>
          <Text className="text-sm text-primaryText py-1">Video Call</Text>
        </View>

        <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12  h-12 rounded-lg bg-gray-200">
            <Ionicons name="call-outline" size={24} color={"#555"} />
          </TouchableOpacity>
          <Text className="text-sm text-primaryText py-1">call</Text>
        </View>

        <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12  h-12 rounded-lg bg-gray-200">
            <Entypo name="dots-three-horizontal" size={24} color={"#555"} />
          </TouchableOpacity>
          <Text className="text-sm text-primaryText py-1">More</Text>
        </View>
      </View>
      {/* Medias share */}
      <View className="w-full px-6 space-y-3">
        <View className="w-full flex-row items-center justify-between">
          <Text className="text-base font-semibold  text-primaryText">
            Media Shared
          </Text>
          <TouchableOpacity>
            <Text className="text-base font-semibold uppercase text-primaryText">
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-full flex-row items-center justify-between">
          <TouchableOpacity className="w-24 h-24 m-1 rounded-xl bg-gray-300 overflow-hidden">
            <Image
              source={{
                uri: "https://i.pinimg.com/736x/9f/1d/d1/9f1dd1098f987e36dcb54238de6911bb.jpg",
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity className="w-24 h-24 m-1 rounded-xl bg-gray-300 overflow-hidden">
            <Image
              source={{
                uri: "https://i.pinimg.com/736x/5b/83/5a/5b835a06ed26036f160557f18d8f2bc7.jpg",
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity className="w-24 h-24 m-1 rounded-xl bg-gray-300 overflow-hidden">
            <Image
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8KwH-smxFBU00P3r3a7ZbsqCefGnePD7Rfw&usqp=CAU",
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute w-full h-full items-center justify-center bg-[#00000068]">
              <Text className="text-base text-white font-semibold">250+</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/* Setting options */}
      <View className="w-full  px-6 py-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <MaterialIcons name="security" size={24} color={"#555"} />
          <Text className="text-base font-semibold text-primaryText px-3">
            Privacy
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={"#555"} />
      </View>

      <View className="w-full  px-6 py-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <MaterialIcons name="message" size={24} color={"#555"} />
          <Text className="text-base font-semibold text-primaryText px-3">
            Groups
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={"#555"} />
      </View>

      <View className="w-full  px-6 py-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <MaterialIcons name="music-note" size={24} color={"#555"} />
          <Text className="text-base font-semibold text-primaryText px-3">
            Media's & Downloads
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={"#555"} />
      </View>

      <View className="w-full  px-6 py-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <MaterialIcons name="person" size={24} color={"#555"} />
          <Text className="text-base font-semibold text-primaryText px-3">
            Accout
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={"#555"} />
      </View>
      <TouchableOpacity
        onPress={handleLogout}
        className="w-full px-6 py-4 flex-row items-center justify-center"
      >
        <Text className="text-lg font-semibold text-primaryBold px-3">
          Logout
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;
