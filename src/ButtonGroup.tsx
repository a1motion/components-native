import React, { Children, useContext, useMemo } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { isFragment } from "react-is";
import Button, { ButtonProps } from "./Button";

const context = React.createContext("vertical");

export type ButtonGroupProps = {
  direction?: "vertical" | "horizontal";
} & ViewProps;
export interface Option {
  keepEmpty?: boolean;
}
function toArray(children: React.ReactNode, option: Option = {}): React.ReactElement[] {
  let ret: React.ReactElement[] = [];

  React.Children.forEach(children, (child: any) => {
    if ((child === undefined || child === null) && !option.keepEmpty) {
      return;
    }

    if (Array.isArray(child)) {
      ret = ret.concat(toArray(child));
    } else if (isFragment(child) && child.props) {
      ret = ret.concat(toArray(child.props.children, option));
    } else {
      ret.push(child);
    }
  });

  return ret;
}

// eslint-disable-next-line @typescript-eslint/no-use-before-define
const ButtonGroup: React.FC<ButtonGroupProps> & { Button: typeof ButtonGroupButton } = ({
  direction = "vertical",
  style,
  children,
  ...props
}) => {
  const child = toArray(children);
  const total = child.length;
  return (
    <context.Provider value={direction}>
      <View {...props} style={[{ flexDirection: direction === "vertical" ? "column" : "row" }, style]}>
        {Children.map(child, (a, i) => {
          return React.cloneElement(a as any, {
            index: i,
            total,
          });
        })}
      </View>
    </context.Provider>
  );
};

const ButtonGroupButtonStyles = StyleSheet.create({
  verticalFirst: {
    marginBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  horizontalFirst: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: 0,
  },
  verticalItem: {
    marginBottom: 0,
    marginTop: 0,
    borderTopWidth: 0,
    borderRadius: 0,
  },
  horizontalItem: {
    marginLeft: 0,
    marginRight: 0,
    borderLeftWidth: 0,
    borderRadius: 0,
  },
  verticalLast: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 0,
    marginTop: 0,
  },
  horizontalLast: {
    marginLeft: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 0,
  },
});

export const ButtonGroupButton: React.FC<ButtonProps> = ({ style, ...props }: ButtonProps) => {
  const direction = useContext(context);
  const { index, total }: { index: number; total: number } = props as any;
  const styles = useMemo(() => {
    const styles: ButtonProps["style"] = [];
    if (total === 1) {
      return styles;
    }

    if (index === 0) {
      styles.push(
        direction === "vertical" ? ButtonGroupButtonStyles.verticalFirst : ButtonGroupButtonStyles.horizontalFirst
      );
    } else if (index === total - 1) {
      styles.push(
        direction === "vertical" ? ButtonGroupButtonStyles.verticalLast : ButtonGroupButtonStyles.horizontalLast
      );
    } else {
      styles.push(
        direction === "vertical" ? ButtonGroupButtonStyles.verticalItem : ButtonGroupButtonStyles.horizontalItem
      );
    }

    return styles;
  }, [direction, index, total]);
  return <Button {...props} animated={false} style={[styles, style] as any} />;
};

ButtonGroup.Button = ButtonGroupButton;

export default ButtonGroup;
