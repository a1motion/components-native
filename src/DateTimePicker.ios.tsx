import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform, TextInput, Modal, View, StyleSheet, Animated, TouchableWithoutFeedback } from "react-native";
import InternalDateTimePicker, { DatePickerOptions } from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Input from "./Input";
import { useTheme } from "./theme";

export type DateTimePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
  mode: "date" | "datetime" | "time";
  caption?: string;
  hideCaption?: boolean;
};

// For iOS we take two different paths for rendering out the DatePicker.
// If the user is on iOS 14 or higher, we inline the native date picker.
// The view appears to the user as a native input box, which pops up with the actual date picker.
//
// If the user is on iOS 13 or lower, then the only DatePicker is the old spinner style.
// In this case we render out a Input that contains the formatted Date. And once the user
// clicks the Input, a fullscreen short modal will appear with the spinner.

const IOS_VERSION = Number.parseInt(Platform.Version as string, 10);

type DateTimePickerModalProps = DatePickerOptions & {
  onClose: () => void;
  visible: boolean;
  mode: DateTimePickerProps["mode"];
};

const DatePickerModal: React.FC<DateTimePickerModalProps> = ({ visible, value, onChange, onClose, mode }) => {
  const [_visible, _setVisible] = useState(visible);
  const viewTransform = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const height = (IOS_VERSION >= 14 && mode === "date" ? 368 : 220) + insets.bottom;
  useEffect(() => {
    if (visible) {
      _setVisible(true);
    } else {
      Animated.timing(viewTransform, {
        duration: 200,
        toValue: 0,
        useNativeDriver: true,
      }).start(() => {
        _setVisible(false);
      });
    }
  }, [visible]);
  return (
    <Modal
      transparent
      visible={_visible}
      onShow={() => {
        Animated.timing(viewTransform, {
          duration: 200,
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }}>
      <View style={{ flex: 1, position: "relative" }}>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={onClose}>
          <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "#000", opacity: 0.4 }} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height,
            paddingBottom: insets.bottom,
            backgroundColor: theme.CardBackgroundColor,
            transform: [
              {
                translateY: viewTransform.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height, 0],
                }),
              },
            ],
          }}>
          <InternalDateTimePicker
            value={value}
            onChange={onChange}
            display={mode === "date" ? "inline" : "spinner"}
            mode={mode}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const DatePicker: React.FC<DateTimePickerProps> = ({ value, onChange, mode, caption, hideCaption }) => {
  const _onChange = useCallback(
    (_, e) => {
      onChange?.(e);
    },
    [onChange]
  );
  const [modalShown, setModalShown] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const onInputFocus = useCallback(() => {
    inputRef.current?.blur();
    setModalShown(true);
  }, []);

  const renderText = useMemo(() => {
    switch (mode) {
      case "date":
        return value.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      case "time":
        return value.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "numeric",
        });
      case "datetime":
        return value.toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
      default:
        throw new Error("Unreachable");
    }
  }, [mode, value]);

  return (
    <>
      <DatePickerModal
        value={value}
        onChange={_onChange}
        onClose={() => setModalShown(false)}
        visible={modalShown}
        mode={mode}
      />
      <Input onFocus={onInputFocus} ref={inputRef} value={renderText} caption={caption} hideCaption={hideCaption} />
    </>
  );
};

export default DatePicker;
