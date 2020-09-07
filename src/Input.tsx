import React, { useCallback, useEffect, useRef, useState, forwardRef } from "react";
import { TextInput, View, Animated, TouchableWithoutFeedback, StyleProp, ViewStyle } from "react-native";
import useCombinedRefs from "./utils/useCombinedRefs";
import { AnimatedText } from "./Text";
import { useTheme } from "./theme";

export type InputProps = {
  label?: string;
  status?: "success" | "error";
  caption?: string | null;
  prefix?: React.ReactNode | ((focused: boolean) => React.ReactNode);
  suffix?: React.ReactNode | ((focused: boolean) => React.ReactNode);
  containerStyles?: Animated.AnimatedProps<StyleProp<ViewStyle>>;
  hideCaption?: boolean;
} & React.ComponentProps<typeof TextInput>;

const Input: React.ForwardRefRenderFunction<TextInput, InputProps> = (
  {
    label,
    style,
    value,
    defaultValue,
    status,
    onChangeText,
    caption,
    prefix,
    suffix,
    onFocus,
    onBlur,
    containerStyles,
    hideCaption,
    ...props
  },
  ref
) => {
  const innerRef = React.useRef<TextInput>(null);
  const combinedRef = useCombinedRefs(ref, innerRef);
  const theme = useTheme();
  const labelActive = useRef(new Animated.Value(value || defaultValue ? 1 : 0)).current;
  const captionPosition = useRef(new Animated.Value(caption && caption.length > 0 ? 1 : 0)).current;
  const [captionActive, setCaptionActive] = useState(caption && caption.length > 0);
  const [active, setActive] = useState<boolean>(!!(value || defaultValue));
  const [focused, setFocused] = useState(false);
  const _onChangeText = useCallback(
    (e) => {
      setActive(e.length !== 0);
      onChangeText?.(e);
    },
    [onChangeText]
  );
  useEffect(() => {
    setCaptionActive(caption && caption.length > 0);
  }, [caption]);
  useEffect(() => {
    Animated.timing(labelActive, {
      toValue: active ? 1 : 0,
      duration: 250,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, [active]);
  useEffect(() => {
    Animated.timing(captionPosition, {
      toValue: captionActive ? 1 : 0,
      duration: 250,
      delay: 50,
      useNativeDriver: true,
    }).start();
  }, [captionActive]);
  return (
    <Animated.View style={containerStyles as any}>
      <View
        style={{
          position: "relative",
          marginHorizontal: 8,
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            innerRef.current?.focus();
          }}>
          <View
            style={{
              borderRadius: 6,
              paddingHorizontal: 12,
              borderWidth: 2,
              borderStyle: "solid",
              borderColor:
                status === "success"
                  ? theme.SuccessColor
                  : status === "error"
                  ? theme.DangerColor
                  : focused
                  ? theme.PrimaryColor
                  : theme.InputBorderColor,
              backgroundColor: theme.CardBackgroundColor,
              marginTop: label && label.length > 0 ? 18 : 0,
            }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {prefix && typeof prefix === "function" ? prefix(focused) : prefix}
              <View style={{ flex: 1, minHeight: 44, position: "relative", paddingHorizontal: 4 }}>
                {label && label.length > 0 && (
                  <Animated.View
                    style={[
                      {
                        zIndex: 10,
                        position: "absolute",
                        top: 0,
                        left: -2,
                        backgroundColor: "transparent",
                        paddingHorizontal: 4,
                      },
                      {
                        transform: [
                          {
                            translateY: labelActive.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -18],
                            }),
                          },
                        ],
                      },
                    ]}>
                    <AnimatedText
                      style={[
                        {
                          color:
                            status === "success"
                              ? theme.SuccessColor
                              : status === "error"
                              ? theme.DangerColor
                              : focused
                              ? theme.PrimaryColor
                              : theme.TextColor,
                          fontWeight: "800",
                          backgroundColor: "transparent",
                        },
                        {
                          opacity: labelActive,
                        },
                      ]}>
                      {label}
                    </AnimatedText>
                  </Animated.View>
                )}
                <TextInput
                  {...props}
                  ref={combinedRef}
                  accessibilityLabel={label}
                  onFocus={(e) => {
                    setFocused(true);
                    onFocus?.(e);
                  }}
                  onBlur={(e) => {
                    setFocused(false);
                    onBlur?.(e);
                  }}
                  placeholder={label}
                  value={value}
                  defaultValue={defaultValue}
                  onChangeText={_onChangeText}
                  placeholderTextColor={
                    status === "success" ? theme.SuccessColor : status === "error" ? theme.DangerColor : undefined
                  }
                  style={[
                    {
                      color: theme.TextColor,
                      flex: 1,
                    },
                    style,
                  ]}
                />
              </View>
              {suffix && typeof suffix === "function" ? suffix(focused) : suffix}
            </View>
          </View>
        </TouchableWithoutFeedback>
        {!hideCaption && (
          <AnimatedText
            style={{
              marginTop: 4,
              marginLeft: 16,
              height: 16,
              color:
                status === "success"
                  ? theme.SuccessColor
                  : status === "error"
                  ? theme.DangerColor
                  : theme.BasicColors[8],
              transform: [
                {
                  translateY: captionPosition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-16, 0],
                  }),
                },
              ],
            }}>
            {caption}
          </AnimatedText>
        )}
      </View>
    </Animated.View>
  );
};

export default forwardRef(Input);
