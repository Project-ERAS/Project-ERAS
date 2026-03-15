import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type UpdatePost = {
  id: number;
  name: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
};

const updatePosts: UpdatePost[] = [];

export default function UserUpdatesScreen() {
  const router = useRouter();
  const [updateText, setUpdateText] = useState("");
  const [, setSelectedImageUri] = useState<string | null>(null);

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled) return;
    setSelectedImageUri(result.assets[0]?.uri ?? null);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={30} color="#2D3E2D" />
        </Pressable>
        <Text style={styles.headerTitle}>User updates</Text>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.shareLabel}>Share an update</Text>

        <TextInput
          value={updateText}
          onChangeText={setUpdateText}
          style={styles.shareInput}
          multiline
          textAlignVertical="top"
          placeholder=""
        />

        <Pressable
          onPress={handlePickImage}
          style={({ pressed }) => [styles.uploadButton, pressed && styles.uploadButtonPressed]}
        >
          <Text style={styles.uploadButtonText}>Upload image</Text>
        </Pressable>

        <ImageBackground
          source={require("../assets/images/user updates.png")}
          resizeMode="cover"
          style={styles.updatesBackground}
          imageStyle={styles.updatesBackgroundImage}
        >
          {updatePosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={38} color="#fff" />
              </View>

              <View style={styles.postMain}>
                <View style={styles.postHeaderRow}>
                  <Text style={styles.postName}>{post.name}</Text>
                  <Text style={styles.postTime}>{post.time}</Text>
                </View>

                <Text style={styles.postContent}>{post.content}</Text>

                <View style={styles.postFooterRow}>
                  <View style={styles.reactionGroup}>
                    <Feather name="heart" size={20} color="#2D3E2D" />
                    <Text style={styles.reactionText}>{post.likes}</Text>
                  </View>

                  <View style={styles.reactionGroup}>
                    <Feather name="message-square" size={19} color="#2D3E2D" />
                    <Text style={styles.reactionText}>{post.comments}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F5F3",
  },


  header: {
    height: 92,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8",
  },
  backButton: {
    position: "absolute",
    left: 20,
    bottom: 10,
    zIndex: 2,
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E8EEE8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2D3E2D",
    marginTop: 1,
  },

  body: {
  flex: 1,
  backgroundColor: "#F2F5F3",
},

bodyContent: {
  paddingHorizontal: 22,
  paddingTop: 28,
  paddingBottom: 34,
  flexGrow: 1,
},

shareLabel: {
  fontSize: 20,
  color: "#2D3E2D",
  fontWeight: "800",
  marginBottom: 14,
},

uploadButton: {
  backgroundColor: "#93cc72",
  borderRadius: 16,
  paddingVertical: 12,
  paddingHorizontal: 16,
  marginTop: 14,
  alignSelf: "flex-end",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.12,
  shadowRadius: 12,
  elevation: 5,
},

uploadButtonPressed: {
  backgroundColor: "#4c9c3e",
},

uploadButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "800",
},

updatesBackground: {
  marginTop: 16,
  width: "100%",
  flex: 1,
  minHeight: 240,
  backgroundColor: "#F2F5F3",
},

updatesBackgroundImage: {
  opacity: 0.35,
  backgroundColor: "#F2F5F3",
},

postCard: {
  marginTop: 34,
  borderRadius: 20,
  paddingVertical: 18,
  paddingHorizontal: 16,
  backgroundColor: "#FFFFFF",
  borderWidth: 1,
  borderColor: "#F0F4F0",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 16,
  elevation: 6,
  flexDirection: "row",
  gap: 14,
},

avatarCircle: {
  width: 72,
  height: 72,
  borderRadius: 36,
  backgroundColor: "#93cc72",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 4,
},

postMain: {
  flex: 1,
},
postHeaderRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},
postName: {
  color: "#2D3E2D",
  fontSize: 16,
  fontWeight: "800",
},
postTime: {
  color: "#7A8A7A",
  fontSize: 12,
  fontWeight: "700",
  marginRight: 8,
},