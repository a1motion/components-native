import React from "react";
import { AndroidNativeProps, IOSNativeProps, WindowsNativeProps } from "@react-native-community/datetimepicker";
import Input from "./Input";

// Who knew Date/Time pickers could be so hard to implement.
// This file is used for type checking, see actual
// platform-specific implementations.

export type DateTimePickerProps = {
  value: Date;
  mode: "date" | "time" | "datetime";
  caption?: string;
  hideCaption?: boolean;
  inputProps?: React.ComponentProps<typeof Input>;
} & (IOSNativeProps | AndroidNativeProps | WindowsNativeProps);

const DateTimePicker: React.FC<DateTimePickerProps> = () => {
  throw new Error("Platform not supported.");
};

export default DateTimePicker;
