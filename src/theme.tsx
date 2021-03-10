import React, { useContext } from "react";
// @ts-ignore
import { useColorScheme } from "react-native-appearance";

// To provide consistency between these components and the web ones,
// we add a undefined value at the front of the array so color indexes
// start a 1.
type ColorArray = [undefined, string, string, string, string, string, string, string, string, string, string];

type Theme = {
  ColorScheme: "dark" | "light";
  LayoutBackgroundColor: string;
  CardBackgroundColor: string;
  PrimaryColor: string;
  TabBarInactiveColor: string;
  TextColor: string;
  ButtonPressColor: string;
  InputBorderColor: string;
  ButtonControlColor: string;
  BasicBorderColor: string;
  Colors: ColorArray;
  BasicColors: ColorArray;
  PrimaryColors: ColorArray;
  DangerColor: string;
  DangerColors: ColorArray;
  SuccessColor: string;
  SuccessColors: ColorArray;
  TextFontFamily?: string;
  SubTextColor?: string;
};

const lightBasicColors = [
  "#FFFFFF",
  "#F8F8F8",
  "#F2F2F2",
  "#f5f5f5",
  "#EDEDED",
  "#DADADA",
  "#858585",
  "#757575",
  "#666666",
  "#454545",
  "#222222",
];

const primaryColors = [
  undefined,
  "#f0f6ff",
  "#c9dcff",
  "#a1bfff",
  "#7296f2",
  "#476fe6",
  "#2148d9",
  "#122fb3",
  "#071b8c",
  "#000c66",
  "#000540",
];

const successColors = [
  undefined,
  "#f0fff3",
  "#ccffd7",
  "#9df5b3",
  "#6fe892",
  "#46db75",
  "#21cf5e",
  "#13a84c",
  "#08823b",
  "#015c2a",
  "#00361a",
];

const dangerColors = [
  undefined,
  "#fff3f0",
  "#ffd8cf",
  "#ffb5a6",
  "#ff8e7d",
  "#ff6554",
  "#ff392b",
  "#d9201a",
  "#b30c0c",
  "#8c0307",
  "#660108",
];

const darkBasicColors = lightBasicColors.slice();
darkBasicColors.reverse();

const _theme = {
  default: {
    Colors: [undefined, ...lightBasicColors],
    PrimaryColor: primaryColors[6],
    PrimaryColors: primaryColors,
    DangerColor: dangerColors[6],
    DangerColors: dangerColors,
    SuccessColor: successColors[6],
    SuccessColors: successColors,
  },
  light: {
    ColorScheme: "light",
    LayoutBackgroundColor: "rgb(242, 242, 242)",
    CardBackgroundColor: "rgb(255, 255, 255)",
    TabBarInactiveColor: "rgb(2, 2, 2)",
    TextColor: "rgb(14, 14, 15)",
    SubTextColor: lightBasicColors[8],
    ButtonPressColor: "rgb(20, 20, 20)",
    InputBorderColor: "rgb(217, 217, 217)",
    ButtonControlColor: "#F8F8F8",
    BasicBorderColor: "rgb(216, 216, 216)",
    BasicColors: [undefined, ...lightBasicColors],
  },
  dark: {
    ColorScheme: "dark",
    LayoutBackgroundColor: "rgb(3, 3, 3)",
    CardBackgroundColor: "rgb(22, 22, 22)",
    TabBarInactiveColor: "rgb(225, 225, 225)",
    TextColor: "rgb(229, 229, 231)",
    SubTextColor: darkBasicColors[5],
    ButtonPressColor: "rgb(255, 255, 255)",
    InputBorderColor: "rgb(117, 117, 117)",
    ButtonControlColor: "#222222",
    BasicBorderColor: "rgb(39, 39, 41)",
    BasicColors: [undefined, ...darkBasicColors],
  },
};

export const theme = {
  light: {
    ..._theme.default,
    ..._theme.light,
  },
  dark: {
    ..._theme.default,
    ..._theme.dark,
  },
} as {
  light: Theme;
  dark: Theme;
};
export const ThemeContext = React.createContext(theme.light);
export const ThemeProvider: React.FC<{
  theme?: Partial<Theme>;
}> = ({ children, theme: userTheme }) => {
  const scheme = useColorScheme();
  return (
    <ThemeContext.Provider value={Object.assign({}, scheme === "dark" ? theme.dark : theme.light, userTheme)}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const withTheme = <P extends any>(Component: React.ComponentType<P>) =>
  // eslint-disable-next-line react/prefer-stateless-function
  class WithTheme extends React.Component<P> {
    static contextType = ThemeContext;
    render() {
      return <Component theme={this.context} {...this.props} />;
    }
  };
