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
  selectedItemId: string | undefined;
  items: TItem[];
  onChangeItem: (itemId: string) => void;
} & TViewProps;

const SelectList: React.FunctionComponent<TExternalProps> = ({
  selectedItemId,
  items,
  onChangeItem,
  style,
  ...props
}) => (
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

const styles = StyleSheet.create({
  container: {
    ...shadowStyles.s2,
  },
  list: {
    borderRadius: roundness,
  },
});

export { SelectList };
