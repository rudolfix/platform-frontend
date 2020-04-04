import { StackActions } from "@react-navigation/native";
import { StackHeaderProps } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, View } from "react-native";
import { silverLighter2 } from "../../styles/colors";
import { spacingStyles } from "../../styles/spacings";
import { getTopPadding } from "../../styles/utils";
import { ButtonIcon } from "./buttons/ButtonIcon";
import { EIconType } from "./Icon";
import { LineBreak } from "./LineBreak";
import { EHeadlineLevel, Headline } from "./typography/Headline";

const Spacer: React.FunctionComponent<React.ComponentProps<typeof View>> = ({
  style,
  ...props
}) => <View style={[styles.spacer, style]} {...props} />;

const ModalStackHeader: React.FunctionComponent<StackHeaderProps> = ({
  scene,
  insets,
  previous,
  navigation,
}) => {
  const { options } = scene.descriptor;

  const statusBarHeight = options.headerStatusBarHeight ?? insets.top;

  const title =
    typeof options.headerTitle !== "function" && options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

  const container = styles.container;

  const goBack = () => {
    if (navigation.isFocused() && navigation.canGoBack()) {
      navigation.dispatch({
        ...StackActions.pop(),
        source: scene.route.key,
      });
    }
  };

  return (
    <View style={{ ...container, paddingTop: getTopPadding(container) + statusBarHeight }}>
      {previous && (
        <Spacer>
          <ButtonIcon icon={EIconType.HOME} accessibilityLabel="Go back" onPress={goBack} />
        </Spacer>
      )}
      <Headline
        style={styles.header}
        level={EHeadlineLevel.LEVEL3}
        accessibilityRole="header"
        numberOfLines={1}
      >
        {title}
      </Headline>
      {/* Add spacer on both sides of headline to keep it always centered */}
      {previous && (
        <Spacer>
          <LineBreak />
        </Spacer>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: silverLighter2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  header: {
    ...spacingStyles.p3,
    textAlign: "center",
    flex: 3,
  },
  spacer: {
    flex: 1,
    alignItems: "flex-start",
  },
});

export { ModalStackHeader };
