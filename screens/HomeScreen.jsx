import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  Button,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Logo } from "../assets";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";

const HomeScreen = () => {
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState(null);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [password, setPassword] = useState();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const chatQuery = query(
      collection(firestoreDB, "chats"),
      orderBy("_id", "desc")
    );
    const unsubscribe = onSnapshot(chatQuery, (querySnapShot) => {
      const chatRooms = querySnapShot.docs.map((doc) => doc.data());
      setChats(chatRooms);
      setIsLoading(false);
    });

    // Return the unsubcribe funciton to stop listening to the updates
    return unsubscribe;
  }, []);

  const openPasswordModal = (room) => {
    setSelectedRoom(room);
    setIsPasswordModalVisible(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalVisible(false);
    setSelectedRoom(null);
    setPassword("");
  };

  const handleJoinChat = () => {
    if (selectedRoom) {
      if (!selectedRoom.password || selectedRoom.password === password) {
        navigation.navigate("ChatScreen", { room: selectedRoom });
        closePasswordModal();
      } else {
        alert("Incorrect password");
      }
    }
  };

  return (
    <View className="flex-1">
      <SafeAreaView>
        <View className="w-full flex-row items-center justify-between px-4 py-10">
          <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
          <TouchableOpacity
            onPress={() => navigation.navigate("profileScreen")}
            className="w-12 h-12 rounded-full border border-primary flex items-center justify-center"
          >
            <Image
              source={{ uri: user?.profilePic }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
        {/* Scrolling area */}
        <ScrollView className="w-full px-4 pt-4">
          <View className="w-full">
            {/* Message title */}
            <View className="w-full flex-row items-center justify-between px-2">
              <Text className="text-primaryText text-base font-extrabold pb-2">
                Messages
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("AddToChatScreen")}
              >
                <Ionicons name="chatbox" size={28} color="#555" />
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <>
                <View className="w-full flex items-center justify-center">
                  <ActivityIndicator size={"large"} color={"#43C651"} />
                </View>
              </>
            ) : (
              <>
                {chats && chats?.length > 0 ? (
                  <>
                    {chats?.map((room) => (
                      <MessageCart
                        key={room._id}
                        room={room}
                        openPasswordModal={openPasswordModal}
                      />
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      {selectedRoom && (
        <PasswordModal
          isVisible={isPasswordModalVisible}
          onClose={closePasswordModal}
          onJoin={handleJoinChat}
          onChangePassword={setPassword}
        />
      )}
    </View>
  );
};

const MessageCart = ({ room, openPasswordModal }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => openPasswordModal(room)}
      className="w-full flex-row items-center justify-start py-2"
    >
      {/* Images  sau này muốn thay thế ảnh thì làm ở phần này*/}
      <View className="w-16 h-16 rounded-full flex items-center border-2 border-primary p-1 justify-center">
        <FontAwesome5 name="users" size={24} color="#555" />
      </View>
      {/* Content */}
      <View className="flex-1 flex items-start justify-center ml-4">
        <Text className="text-[#333] text-base font-semibold capitalize">
          {room.chatName}
        </Text>
        <Text className="text-primaryText text-sm">
          Nơi hội tụ của tinh hoa thế giới chứa sự vĩ đại của miku
        </Text>
      </View>
      {/* Time text */}
      <Text className="text-primary px-4 text-base font-semibold">7 min</Text>
    </TouchableOpacity>
  );
};

const PasswordModal = ({ isVisible, onClose, onJoin, onChangePassword }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View className="flex-1 items-center justify-center">
        <View
          className="p-5  bg-white rounded-2xl"
          style={{
            width: "80%",
            elevation: 5,
          }}
        >
          <Text className="text-primaryText text-sm mb-2">
            Enter Chat Password
          </Text>
          <TextInput
            className=" border border-inherit p-2 mb-2 rounded-xl"
            placeholder="Password"
            secureTextEntry
            onChangeText={onChangePassword}
          />
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={onClose}
              className="w-20 h-10 bg-red-500 items-center flex justify-center rounded-2xl"
            >
              <Text className="text-white">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onJoin}
              className="w-20 h-10 bg-primary items-center flex justify-center rounded-2xl"
            >
              <Text className="text-white">Join</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default HomeScreen;
