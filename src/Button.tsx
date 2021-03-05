import React, { useCallback, useMemo, useRef } from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewProps,
} from "react-native";
import Text from "./Text";
import { useTheme } from "./theme";

export type ButtonProps = PressableProps & {
  status?: "default" | "primary" | "danger" | "control";
  animated?: boolean;
  containerStyles?: ViewProps["style"];
};

const styles = StyleSheet.create({
  base: {
    alignSelf: "stretch",
    marginVertical: 10,
    marginHorizontal: 8,
    paddingHorizontal: 8,
    paddingVertical: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: "solid",
  },
});

const Button: React.FC<ButtonProps> = ({
  animated = true,
  style,
  children,
  disabled,
  onPressIn,
  onPressOut,
  status,
  containerStyles,
  ...props
}) => {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const _onPressIn = useCallback(
    (e) => {
      if (animated) {
        Animated.timing(scale, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
          delay: 50,
        }).start();
      }

      onPressIn?.(e);
    },
    [onPressIn, animated]
  );
  const _onPressOut = useCallback(
    (e) => {
      if (animated) {
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
          delay: 50,
        }).start();
      }

      onPressOut?.(e);
    },
    [onPressOut, animated]
  );
  const backgroundColor = useMemo(() => {
    if (status === "primary") {
      return [theme.PrimaryColor, theme.PrimaryColors[5]];
    }

    if (status === "danger") {
      return [theme.DangerColor, theme.DangerColors[5]];
    }

    return [theme.BasicColors[1], theme.BasicColors[2]];
  }, [theme.BasicColors[1], theme.BasicColors[2], status]);
  const textColor = useMemo(() => {
    if (status === "danger" || status === "primary") {
      return theme.Colors[4];
    }

    return theme.TextColor;
  }, [theme, status]);
  return (
    <Animated.View style={[{ alignSelf: "stretch", transform: [{ scale }] }, containerStyles]}>
      <Pressable
        onPressIn={_onPressIn}
        onPressOut={_onPressOut}
        {...props}
        style={(state) => {
          return [
            styles.base,
            {
              opacity: disabled ? 0.5 : 1,
              backgroundColor: state.pressed ? backgroundColor[1] : backgroundColor[0],
              borderColor: theme.BasicBorderColor,
            },
            typeof style === "function" ? style(state) : style,
          ];
        }}>
        {typeof children === "string" ? (
          <Text
            style={{
              fontSize: 15,
              lineHeight: 15,
              fontWeight: "700",
              textAlign: "center",
              color: textColor,
            }}>
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    </Animated.View>
  );
};

export const TextButton: React.FC<TouchableOpacityProps> = ({ children, ...props }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity {...props}>
      <Text style={{ fontSize: 18, lineHeight: 1.25 * 15, fontWeight: "700", color: theme.PrimaryColor }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
