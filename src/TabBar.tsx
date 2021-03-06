import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Pressable, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "./theme";
import { AnimatedText } from "./Text";

type TabBarItemProps = {
  route: BottomTabBarProps["state"]["routes"][number];
  descriptor: BottomTabBarProps["descriptors"][string];
  isFocused: boolean;
  navigation: BottomTabBarProps["navigation"];
};

const HorizontalTabBarItem: React.FC<TabBarItemProps> = ({ route, descriptor, isFocused, navigation }) => {
  const theme = useTheme();
  const labelHeight = useRef(12);
  const [maxSize, setMaxSize] = useState(-1);
  const labelOpacity = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const iconTranslation = useRef(new Animated.Value(isFocused ? 0 : 6)).current;
  const buttonHover = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(labelOpacity, {
        toValue: isFocused ? 1 : 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(iconTranslation, {
        toValue: isFocused ? 0 : labelHeight.current / 2,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);
  const { options } = descriptor;
  const label =
    options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
  const onPress = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
  };

  const onPressIn = useCallback(() => {
    Animated.timing(buttonHover, {
      toValue: 0.075,
      isInteraction: true,
      useNativeDriver: true,
      duration: 200,
    }).start();
  }, []);

  const onPressOut = useCallback(() => {
    setTimeout(() => {
      Animated.timing(buttonHover, {
        toValue: 0,
        isInteraction: true,
        useNativeDriver: true,
        duration: 100,
      }).start();
    }, 200);
  }, []);

  return (
    <Pressable
      key={route.key}
      accessibilityRole={"button"}
      accessibilityState={{
        selected: isFocused,
      }}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onLongPress={onLongPress}
      onLayout={({ nativeEvent: { layout } }) => {
        const max = Math.max(layout.height, layout.width);
        if (maxSize === -1 || maxSize !== max) {
          setMaxSize(max);
        }
      }}
      style={{
        flex: 0,
        alignItems: "center",
        position: "relative",
        justifyContent: "center",
        flexDirection: "row",
        marginVertical: 12,
      }}>
      <Animated.View
        style={[
          {
            borderRadius: maxSize,
          },
          {
            position: "absolute",
            zIndex: -1,
            width: maxSize * 1.5,
            height: maxSize * 1.5,
            backgroundColor: theme.ButtonPressColor,
            opacity: buttonHover,
          },
        ]}
      />
      <Animated.View
        style={[
          {
            transform: [{ translateX: iconTranslation }],
          },
        ]}>
        {options.tabBarIcon?.({
          focused: isFocused,
          size: 24,
          color: isFocused ? theme.PrimaryColor : theme.TabBarInactiveColor,
        }) || null}
      </Animated.View>
      <View
        style={{
          flex: 0,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "stretch",
        }}>
        <AnimatedText
          style={[
            {
              color: isFocused ? theme.PrimaryColor : theme.TabBarInactiveColor,
              marginLeft: 4,
              marginBottom: 0,
            },
            { opacity: labelOpacity },
          ]}
          onLayout={({ nativeEvent: { layout } }) => {
            labelHeight.current = layout.width;
            if (!isFocused) {
              iconTranslation.setValue(-(layout.width / 2));
            }
          }}>
          {label}
        </AnimatedText>
      </View>
    </Pressable>
  );
};

const VerticalTabBarItem: React.FC<TabBarItemProps> = ({ route, isFocused, descriptor, navigation }) => {
  const theme = useTheme();
  const labelHeight = useRef(12);
  const [maxSize, setMaxSize] = useState(-1);
  const labelOpacity = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const iconTranslation = useRef(new Animated.Value(isFocused ? 0 : 6)).current;
  const buttonHover = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(labelOpacity, {
        toValue: isFocused ? 1 : 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(iconTranslation, {
        toValue: isFocused ? 0 : labelHeight.current / 2,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);
  const { options } = descriptor;
  const label =
    options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
  const onPress = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
  };

  const onPressIn = useCallback(() => {
    Animated.timing(buttonHover, {
      toValue: 0.075,
      isInteraction: true,
      useNativeDriver: true,
      duration: 200,
    }).start();
  }, []);

  const onPressOut = useCallback(() => {
    setTimeout(() => {
      Animated.timing(buttonHover, {
        toValue: 0,
        isInteraction: true,
        useNativeDriver: true,
        duration: 100,
      }).start();
    }, 200);
  }, []);

  return (
    <Pressable
      key={route.key}
      accessibilityRole={"button"}
      accessibilityState={{
        selected: isFocused,
      }}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onLongPress={onLongPress}
      onLayout={({ nativeEvent: { layout } }) => {
        const max = Math.max(layout.height, layout.width);
        if (maxSize === -1 || maxSize !== max) {
          setMaxSize(max);
        }
      }}
      style={{
        flex: 0,
        marginTop: 8,
        alignItems: "center",
        aspectRatio: 1,
        position: "relative",
        alignContent: "center",
        justifyContent: "center",
      }}>
      <Animated.View
        style={[
          {
            borderRadius: maxSize,
          },
          {
            position: "absolute",
            zIndex: -1,
            width: maxSize * 1.5,
            height: maxSize * 1.5,
            top: -(maxSize * 0.4),
            backgroundColor: theme.ButtonPressColor,
            opacity: buttonHover,
          },
        ]}
      />
      <Animated.View
        style={[
          {
            transform: [{ translateY: iconTranslation }],
          },
        ]}>
        {options.tabBarIcon?.({
          focused: isFocused,
          size: 24,
          color: isFocused ? theme.PrimaryColor : theme.TabBarInactiveColor,
        }) || null}
      </Animated.View>
      <AnimatedText
        style={[
          { color: isFocused ? theme.PrimaryColor : theme.TabBarInactiveColor, marginTop: 4 },
          { opacity: labelOpacity },
        ]}
        onLayout={({ nativeEvent: { layout } }) => {
          labelHeight.current = layout.height;
          if (!isFocused) {
            iconTranslation.setValue(layout.height / 2);
          }
        }}>
        {label}
      </AnimatedText>
    </Pressable>
  );
};

const TabBarItem: React.FC<TabBarItemProps & { isTablet?: boolean }> = ({ isTablet = false, ...props }) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  if (isLandscape || isTablet) {
    return <HorizontalTabBarItem {...props} />;
  }

  return <VerticalTabBarItem {...props} />;
};

const InternalTabBar: React.FC<BottomTabBarProps & { isTablet?: boolean }> = ({
  descriptors,
  state,
  navigation,
  isTablet,
}) => {
  const theme = useTheme();
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: theme.CardBackgroundColor,
        borderTopColor: theme.BasicBorderColor,
        borderTopWidth: 1,
        borderStyle: "solid",
        marginBottom: 4,
      }}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        return (
          <TabBarItem
            key={route.key}
            route={route}
            descriptor={descriptors[route.key]}
            isFocused={isFocused}
            navigation={navigation}
            isTablet={isTablet}
          />
        );
      })}
    </SafeAreaView>
  );
};

const TabBar = (props: BottomTabBarProps & { isTablet?: boolean }) => {
  return <InternalTabBar {...props} />;
};

export default TabBar;
