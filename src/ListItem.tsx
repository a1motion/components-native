import React, { useMemo } from "react";
import { Pressable, PressableProps, StyleSheet, ViewProps } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useTheme } from "./theme";

type ListItemProps = ViewProps & {
  onPress: PressableProps["onPress"];
};

const ListItem: React.FC<ListItemProps> = ({ children, onPress, ...props }) => {
  const theme = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        paddingHorizontal: 12,
        paddingVertical: 18,
      },
    });
  }, [theme]);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: pressed ? theme.BasicColors[1] : theme.CardBackgroundColor },
      ]}>
      <SafeAreaView forceInset={{ horizontal: "always", vertical: "never" }} {...props}>
        {children}
      </SafeAreaView>
    </Pressable>
  );
};

export default ListItem;
