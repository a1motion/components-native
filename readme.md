# @a1motion/components-native

## Install

```shell
yarn add @a1motion/components-native react-native-appearance react-native-safe-area-context
```

## Setup

Wrap your code in a ThemeProvider, AppearanceProvider and SafeAreaContext

```jsx
<SafeAreaProvider initialMetrics={initialWindowMetrics}>
  <AppearanceProvider>
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  </AppearanceProvider>
</SafeAreaProvider>
```

Then use the hook `useColorScheme` to set the theme for your `NavigationContainer`

```jsx
const Root = () => {
  const theme = useColorScheme();
  return (
    <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />
      <App />
    </NavigationContainer>
  );
}
```