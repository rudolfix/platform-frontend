import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { roundness, shadowStyles } from "../../../../../styles/common";
import { SwitcherItem } from "./SwitcherItem";

type TItem = {
  id: string;
  title: string;
  subTitle?: string;
};

type TViewProps = React.ComponentProps<typeof View>;

type TExternalProps = {
  disabled?: boolean;
  invalid?: boolean;
  selectedItemId: string | undefined;
  items: TItem[];
  onChangeItem: (itemId: string) => void;
} & TViewProps;

const Switcher = React.forwardRef<{}, TExternalProps>(
  ({ selectedItemId, items, onChangeItem, style, ...props }, ref) => {
    // TODO: Expose consistent `ref`s for all inputs ('focus', 'blur', etc)
    React.useImperativeHandle(ref, () => ({}));

    return (
      <View style={[styles.container, style]} {...props}>
        <ScrollView style={[styles.list]} {...props}>
          {items.map(item => (
            <SwitcherItem
              key={item.id}
              onPress={() => onChangeItem(item.id)}
              isSelected={selectedItemId === item.id}
              {...item}
            />
          ))}
        </ScrollView>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    ...shadowStyles.s2,
  },
  list: {
    borderRadius: roundness,
  },
});

export { Switcher };
