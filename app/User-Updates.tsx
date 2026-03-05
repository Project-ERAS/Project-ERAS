import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
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

const updatePosts: UpdatePost[] = [
	{
		id: 1,
		name: "Wathila gunarathna",
		time: "12 min ago",
		content: "Spotted a herd of 12 elephants near the tracker 10.",
		likes: 5,
		comments: 3,
	},
	{
		id: 2,
		name: "Tashmi fernando",
		time: "15 min ago",
		content: "Spotted an elephants near the tracker 2.",
		likes: 7,
		comments: 4,
	},
	{
		id: 3,
		name: "Imantha rathnayake",
		time: "30 min ago",
		content: "Saw a herd of 7 elephants near the tracker 5.",
		likes: 20,
		comments: 7,
	},
];

export default function UserUpdatesScreen() {
	const router = useRouter();
	const [updateText, setUpdateText] = useState("");

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			<StatusBar barStyle="light-content" />

			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => router.back()}
					activeOpacity={0.8}
				>
					<Ionicons name="chevron-back" size={36} color="#fff" />
				</TouchableOpacity>
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

				<TouchableOpacity style={styles.uploadButton} activeOpacity={0.85}>
					<Text style={styles.uploadButtonText}>Upload image</Text>
				</TouchableOpacity>

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
									<Feather name="heart" size={20} color="#000" />
									<Text style={styles.reactionText}>{post.likes}</Text>
								</View>

								<View style={styles.reactionGroup}>
									<Feather name="message-square" size={19} color="#000" />
									<Text style={styles.reactionText}>{post.comments}</Text>
								</View>

								<View style={styles.imageChip}>
									<Ionicons name="image" size={20} color="#5f6f8f" />
									<Text style={styles.imageChipText}>image</Text>
								</View>
							</View>
						</View>
					</View>
				))}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#a9c5a0",
	},
	header: {
		height: 100,
		backgroundColor: "#2f7a34",
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
	backButton: {
		position: "absolute",
		left: 20,
		top: 32,
		zIndex: 2,
	},
	headerTitle: {
		fontSize: 31,
		fontWeight: "700",
		color: "#fff",
		marginTop: 1,
	},
	body: {
		flex: 1,
		backgroundColor: "#a9c5a0",
	},
	bodyContent: {
		paddingHorizontal: 22,
		paddingTop: 28,
		paddingBottom: 34,
	},
	shareLabel: {
		fontSize: 20,
		color: "#2f7a34",
		fontWeight: "500",
		marginLeft: 10,
		marginBottom: 14,
	},
	shareInput: {
		minHeight: 210,
		borderRadius: 18,
		backgroundColor: "#ececec",
		padding: 16,
		fontSize: 16,
		color: "#2d2d2d",
	},
	uploadButton: {
		backgroundColor: "#2f7a34",
		borderRadius: 12,
		paddingVertical: 8,
		paddingHorizontal: 12,
		marginTop: 14,
		alignSelf: "flex-end",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.22,
		shadowRadius: 5,
		elevation: 5,
	},
	uploadButtonText: {
		color: "#fff",
		fontSize: 19,
		fontWeight: "500",
	},
	postCard: {
		marginTop: 34,
		borderRadius: 28,
		paddingVertical: 18,
		paddingHorizontal: 16,
		backgroundColor: "#99c39d",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 7,
		elevation: 6,
		flexDirection: "row",
		gap: 14,
	},
	avatarCircle: {
		width: 72,
		height: 72,
		borderRadius: 36,
		backgroundColor: "#5fb23b",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
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
		color: "#000",
		fontSize: 17,
		fontWeight: "500",
	},
	postTime: {
		color: "#f3f3f3",
		fontSize: 15,
		fontWeight: "500",
		marginRight: 8,
	},
	postContent: {
		color: "#2b6d35",
		fontSize: 18,
		marginTop: 6,
		lineHeight: 24,
		fontWeight: "500",
		maxWidth: "95%",
	},
	postFooterRow: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 10,
	},
	reactionGroup: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 16,
	},
	reactionText: {
		color: "#000",
		fontSize: 16,
		marginLeft: 5,
		fontWeight: "500",
	},
	imageChip: {
		marginLeft: "auto",
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#5fa56a",
		borderRadius: 12,
		paddingVertical: 6,
		paddingHorizontal: 10,
		minWidth: 104,
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 4,
	},
	imageChipText: {
		fontSize: 17,
		color: "#f0f0f0",
		marginLeft: 5,
		fontWeight: "500",
	},
});
