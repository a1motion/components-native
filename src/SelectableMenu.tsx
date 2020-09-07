import React, { useCallback, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColorScheme } from "react-native-appearance";
import Icon from "react-native-vector-icons/Ionicons";
import { ButtonProps } from "./Button";
import ButtonGroup, { ButtonGroupProps } from "./ButtonGroup";
import { useTheme } from "./theme";

const defaultRenderSelectIndicator = (selected: boolean) => {
  const theme = useTheme();
  const userTheme = useColorScheme();
  if (selected) {
    return (
      <View style={{ position: "relative" }}>
        <Icon name={"checkmark-circle-sharp"} size={18} color={theme.PrimaryColor} style={{ zIndex: 2 }} />
        {userTheme === "dark" && (
          <Icon name={"ellipse"} size={18} color={theme.BasicColors[9]} style={{ position: "absolute", zIndex: 1 }} />
        )}
      </View>
    );
  }

  return <Icon name={"ellipse-outline"} size={18} color={theme.TextColor} />;
};

type ContextType = {
  selected?: string | string[];
  onSelect?: (e: string) => void;
  renderSelectIndicator?: (selected: boolean) => React.ReactNode;
};

const Context = React.createContext<ContextType>({
  selected: undefined,
  onSelect: () => {},
  renderSelectIndicator: defaultRenderSelectIndicator,
});

export type SelectableMenuProps = {
  renderSelectIndicator?: (selected: boolean) => React.ReactNode;
  multiple?: boolean;
  unselectable?: boolean;
  selected?: string | string[];
  onSelect?: (e: string | string[] | null) => void;
};

const SelectableMenu: React.FC<SelectableMenuProps & ButtonGroupProps> & {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  Item: typeof SelectableMenuItem;
} = ({ children, selected, onSelect, renderSelectIndicator, multiple = false, unselectable = false, ...props }) => {
  const _onSelect = useCallback(
    (e) => {
      if (!multiple) {
        if (unselectable) {
          if (selected === e) {
            onSelect?.(null);
            return;
          }
        }

        onSelect?.(e);

        return;
      }

      const _selected = selected as string[];
      if (_selected.includes(e)) {
        onSelect?.(_selected.filter((a) => a !== e) as any);
      } else {
        onSelect?.(_selected.concat([e]) as any);
      }
    },
    [selected, multiple, onSelect]
  );
  return (
    <Context.Provider
      value={
        {
          selected,
          onSelect: _onSelect,
          renderSelectIndicator: renderSelectIndicator || defaultRenderSelectIndicator,
        } as any
      }>
      <ButtonGroup direction={"vertical"} {...props}>
        {children}
      </ButtonGroup>
    </Context.Provider>
  );
};

const ItemStyles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  itemLabel: {
    flex: 1,
  },
  itemIcon: {
    flex: 0,
  },
});

export type SelectableMenuItemProps = {
  value: string;
} & ButtonProps;

const SelectableMenuItem: React.FC<SelectableMenuItemProps> = ({ value, onPress, children, ...props }) => {
  const { onSelect, renderSelectIndicator, selected } = useContext(Context);
  const theme = useTheme();
  const _onPress = useCallback(
    (e) => {
      onPress?.(e);
      onSelect?.(value);
    },
    [onSelect, onPress]
  );
  return (
    <ButtonGroup.Button {...props} onPress={_onPress}>
      <View style={ItemStyles.itemContainer}>
        <View style={ItemStyles.itemLabel}>
          {typeof children === "string" ? (
            <Text
              style={{
                fontSize: 15,
                lineHeight: 1.25 * 15,
                fontWeight: "600",
                color: theme.TextColor,
              }}>
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
        <View style={ItemStyles.itemIcon}>
          {renderSelectIndicator!(Array.isArray(selected) ? selected.includes(value) : selected === value)}
        </View>
      </View>
    </ButtonGroup.Button>
  );
};

SelectableMenu.Item = SelectableMenuItem;

export default SelectableMenu;
