import React from "react";

// Who knew Date/Time pickers could be so hard to implement.
// This file is used for type checking, see actual
// platform-specific implementations.

export type DateTimePickerProps = {
  value: Date;
  onChange: (e: Date) => void;
  mode: "date" | "time" | "datetime";
  caption?: string;
  hideCaption?: boolean;
};

const DateTimePicker: React.FC<DateTimePickerProps> = () => {
  throw new Error("Platform not supported.");
};

export default DateTimePicker;
