import React, { useCallback, useMemo, useRef, useState } from "react";
import { TextInput } from "react-native";
import InternalDateTimePicker, { AndroidEvent } from "@react-native-community/datetimepicker";
import Input from "./Input";
import { DateTimePickerProps } from "./DateTimePicker";

export type { DateTimePickerProps };

const DatePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  mode,
  caption,
  hideCaption,
  inputProps = {},
  ...props
}) => {
  const [state, setState] = useState<"none" | "date" | "time">("none");
  const inputRef = useRef<TextInput>(null);
  const onInputFocus = useCallback(() => {
    inputRef.current?.blur();
    console.log("focus");
    if (mode === "date" || mode === "datetime") {
      setState("date");
    } else {
      setState("time");
    }
  }, [mode]);

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

  const _onChange = useCallback(
    (e: AndroidEvent, d?: Date) => {
      if (e.type === "dismissed") {
        setState("none");
      } else if (e.type === "set") {
        onChange?.(e as any, d);
        if (state === "date" && mode === "datetime") {
          setState("time");
        } else {
          setState("none");
        }
      }
    },
    [onChange, state]
  );

  return (
    <>
      {state !== "none" && (
        <InternalDateTimePicker {...(props as any)} value={value} onChange={_onChange} mode={state} />
      )}
      <Input
        {...inputProps}
        onFocus={onInputFocus}
        ref={inputRef}
        value={renderText}
        caption={caption}
        hideCaption={hideCaption}
        {...({
          onPressIn: () => onInputFocus(),
        } as any)}
      />
    </>
  );
};

export default DatePicker;
