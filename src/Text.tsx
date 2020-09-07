import React from "react";
import { StyleSheet, Text as RNText, Animated, TextStyle } from "react-native";
import { useTheme } from "./theme";

type TextProps = {
  type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
};

const fontSizes = {
  h1: 30,
  h2: 28,
  h3: 24,
  h4: 22,
  h5: 20,
  h6: 16,
  p: 14,
};

const fontWeights: { [key: string]: TextStyle["fontWeight"] } = {
  h1: "800",
  h2: "700",
  h3: "700",
  h4: "700",
  h5: "700",
  h6: "700",
  p: "500",
};

const Text: React.FC<TextProps & React.ComponentProps<typeof RNText>> = ({ style, type = "p", ...props }) => {
  const theme = useTheme();
  return (
    <RNText
      {...props}
      style={StyleSheet.compose(
        {
          color: theme.TextColor,
          fontSize: fontSizes[type],
          fontWeight: fontWeights[type],
          marginBottom: 1,
          fontFamily: theme.TextFontFamily,
        },
        style
      )}
    />
  );
};

Text.defaultProps = {
  type: "p",
};

export const AnimatedText: React.FC<TextProps & React.ComponentProps<typeof Animated.Text>> = ({
  style,
  type = "p",
  ...props
}) => {
  const theme = useTheme();
  return (
    <Animated.Text
      {...(props as any)}
      style={[
        {
          color: theme.TextColor,
          fontSize: fontSizes[type],
          lineHeight: fontSizes[type],
          fontWeight: fontWeights[type],
          marginBottom: 2,
        },
        style,
      ]}
    />
  );
};

AnimatedText.defaultProps = {
  type: "p",
};

export default Text;
