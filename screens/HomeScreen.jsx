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
import { firestoreDB } from "../config/firebase.config";
import {
  addDoc,
  collection,
  where,
  doc,
  query,
  getDocs,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
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

    return unsubscribe;
  }, []);

  const openPasswordModal = async (room) => {
    try {
      // Tìm xem có người dùng trong danh sách Participants không
      const participantQuery = query(
        collection(firestoreDB, "chats", room._id, "Participants"),
        where("id", "==", user._id)
      );

      const participantSnapshot = await getDocs(participantQuery);

      if (!participantSnapshot.empty) {
        // Người dùng đã có trong Participants, điều hướng vào phòng trực tiếp
        navigation.navigate("ChatScreen", { room });
      } else {
        // Người dùng chưa có trong Participants, mở modal nhập mật khẩu
        setSelectedRoom(room);
        setIsPasswordModalVisible(true);
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra Participants:", error);
      // Xử lý lỗi nếu có
    }
  };

  const closePasswordModal = () => {
    setIsPasswordModalVisible(false);
    setSelectedRoom(null);
    setPassword("");
  };

  const handleJoinChat = async () => {
    if (selectedRoom) {
      if (!selectedRoom.password || selectedRoom.password === password) {
        // Tạo một id mới cho collection Participants
        const participantId = `${Date.now()}`;

        // Tạo một document mới trong collection Participants
        const participantDoc = {
          _id: participantId,
          id: user._id,
        };

        try {
          // Thêm document mới vào collection Participants
          await addDoc(
            collection(
              doc(firestoreDB, "chats", selectedRoom._id),
              "Participants"
            ),
            participantDoc
          );

          // Tiến hành chuyển hướng và đóng modal
          navigation.navigate("ChatScreen", { room: selectedRoom });
          closePasswordModal();
        } catch (err) {
          console.error("Lỗi khi thêm người dùng vào phòng:", err);
          alert("Có lỗi xảy ra khi tham gia phòng.");
        }
      } else {
        alert("Mật khẩu không chính xác");
      }
    }
  };

  return (
    <View className="flex-1">
      <ScrollView>
        <SafeAreaView>
          <View className="w-full flex-row items-center justify-between px-4 py-10">
            <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
            <TouchableOpacity
              onPress={() => navigation.navigate("ProfileScreen")}
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
      </ScrollView>
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
        <Text className="text-primaryText text-sm">{room.title}</Text>
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
