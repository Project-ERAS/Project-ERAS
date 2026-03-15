import { useState } from "react";

export default function UserProfileScreen() {
  const [profile, setProfile] = useState({
    fullName: "Methuka Pathirana",
    email: "methuka108@gmail.com",
    phone: "+94 72 xxx xxxx",
  });
  const [draftProfile, setDraftProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
}

import { useThemeColor } from "@/hooks/use-theme-color";
import { Platform } from "react-native";

export default function UserProfileScreen() {
  const [profile, setProfile] = useState({
    fullName: "Methuka Pathirana",
    email: "methuka108@gmail.com",
    phone: "+94 72 xxx xxxx",
  });
  const [draftProfile, setDraftProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);

  const headerGreen = useThemeColor({}, "signupPrimaryButton");
  const backgroundGreen = useThemeColor({}, "signupBackground");
  const fieldBackground = useThemeColor({}, "signupInputBackground");
  const buttonText = useThemeColor({}, "signupButtonText");
  const shadowColor = useThemeColor({}, "signupShadow");
  const webOutlineNone =
    Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : null;

  function handleEditPress() {
    if (!isEditing) {
      setDraftProfile(profile);
      setIsEditing(true);
      return;
    }

    setProfile(draftProfile);
    setIsEditing(false);
  }
}
