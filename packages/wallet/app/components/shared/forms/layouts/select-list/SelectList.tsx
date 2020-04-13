import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { roundness, shadowStyles } from "../../../../../styles/common";
import { SelectListItem } from "./SelectListItem";

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

const SelectList = React.forwardRef<{}, TExternalProps>(
  ({ selectedItemId, items, onChangeItem, style, ...props }, ref) => {
    // TODO: Expose consistent `ref`s for all inputs ('focus', 'blur', etc)
    React.useImperativeHandle(ref, () => ({}));

    return (
      <View style={[styles.container, style]} {...props}>
        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <SelectListItem
              onPress={() => onChangeItem(item.id)}
              isSelected={selectedItemId === item.id}
              {...item}
            />
          )}
        />
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

export { SelectList };
