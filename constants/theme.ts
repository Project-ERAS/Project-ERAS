/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,

    // Signup screen (Figma)
    signupBackground: '#c8dbb3',
    signupCardBackground: '#f4f4f4',
    signupInputBackground: '#e5e5e5',
    signupSocialButtonBackground: '#ffffff',
    signupPrimaryButton: '#3f7047',
    signupMutedText: '#4a4a4a',
    signupInputText: '#11181C',
    signupLink: '#5aaccc',
    signupDivider: '#00000026',
    signupBorder: '#00000014',
    signupButtonText: '#ffffff',
    signupShadow: '#000000',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    // Signup screen (Figma) - keep the same palette as the mock
    signupBackground: '#c8dbb3',
    signupCardBackground: '#f4f4f4',
    signupInputBackground: '#e5e5e5',
    signupSocialButtonBackground: '#ffffff',
    signupPrimaryButton: '#3f7047',
    signupMutedText: '#4a4a4a',
    signupInputText: '#11181C',
    signupLink: '#5aaccc',
    signupDivider: '#00000026',
    signupBorder: '#00000014',
    signupButtonText: '#ffffff',
    signupShadow: '#000000',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
