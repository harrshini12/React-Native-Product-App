import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text
} from "react-native";
import { Appbar, FAB } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { selectors, actions } from "./store/inventory";
import { RootState } from "./store";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "./App";
import { useFonts } from "expo-font";

export default (props: StackScreenProps<StackParamList, "Home">) => {
  const fetching = useSelector((state: RootState) => state.inventory.fetching);
  const inventory = useSelector(selectors.selectInventory);
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState<number[]>([]);

  // Function to toggle expansion state
  const toggleExpansion = (index: number) => {
    if (expanded.includes(index)) {
      setExpanded(expanded.filter((item) => item !== index));
    } else {
      setExpanded([...expanded, index]);
    }
  };

  // Loading custom fonts using Expo Fonts
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("./fonts/Roboto-Regular.ttf"),
    "Roboto-Black": require("./fonts/Roboto-Black.ttf")
  });

  // Function to format date
  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}.${month}.${year}`;
  }

   // Check if each record is within the last 7 days
  const isWithinLast7DaysArray = inventory.map((record) => {
    return (
      Date.now() - new Date(record.fields.Posted).getTime() <=
      7 * 24 * 60 * 60 * 1000
    );
  });

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      dispatch(actions.fetchInventory());
    });
    return unsubscribe;
  }, [props.navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Appbar.Header>
        <Appbar.Content
          title="Inventory"
          titleStyle={{ textAlign: "center" }}
        />
      </Appbar.Header>
      <ScrollView
        style={{ flex: 1, margin: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={fetching}
            onRefresh={() => dispatch(actions.fetchInventory())}
          />
        }
      >
        {inventory.map((record, index) => (
          <View
            style={[
              styles.container,
              expanded.includes(index) ? styles.expandedContainer : null
            ]}
            key={index}
          >
            <View style={styles.imageContainer}>
              <Image
                source={
                  record.fields["Product Image"]
                    ? { uri: record.fields["Product Image"] }
                    : require("./images/placeholder.png")
                }
                style={[
                  styles.image,
                  expanded.includes(index) ? styles.expandedImage : null
                ]}
              />
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.details}>
                <Text style={styles.name}>
                  {record.fields["Product Name"]
                    ? record.fields["Product Name"]
                    : "Product Name Missing"}
                </Text>
                {isWithinLast7DaysArray[index] && (
                  <View style={styles.newIconContainer}>
                    <Text style={styles.newIcon}> New </Text>
                  </View>
                )}

                {record.fields["Product Categories"] &&
                  record.fields["Product Categories"].trim() !== "" && (
                    <TouchableOpacity onPress={() => toggleExpansion(index)}>
                      <Image
                        source={
                          expanded.includes(index)
                            ? require("./images/chevron-up.png")
                            : require("./images/chevron-down.png")
                        }
                        style={styles.arrowIcon}
                      />
                    </TouchableOpacity>
                  )}
              </View>
              <Text style={styles.date}>
                {formatDate(record.fields.Posted)}
              </Text>
              {expanded.includes(index) && (
                <View style={styles.expandedTag}>
                  {record.fields["Product Categories"]
                    .split(/,\s*|\s*,\s*/)
                    .map((category, catIndex) => (
                      <Text key={catIndex} style={styles.tag}>
                        {category.trim()}
                      </Text>
                    ))}
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      <SafeAreaView style={styles.fab}>
        <FAB
          icon={() => (
            <MaterialCommunityIcons
              name="barcode-scan"
              size={24}
              color="#0B5549"
            />
          )}
          label="Scan Product"
          onPress={() => props.navigation.navigate("Camera")}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 16,
    width: "100%",
    flex: 1,
    alignItems: "center"
  },
  container: {
    height: 80,
    flexDirection: "row",
    backgroundColor: "#F8F9FC",
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
    shadowColor: "#1B2633",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3
  },
  expandedContainer: {
    height: undefined
  },
  imageContainer: {
    width: 85,
    justifyContent: "flex-start",
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  expandedImage: {
    height: 112,
    width: "100%"
  },
  detailsContainer: {
    marginLeft: 16,
    flex: 1
  },
  details: { 
    flexDirection: "row",
  },
  newIcon: {
    fontSize: 13,
    fontWeight: "700",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase"
  },
  newIconContainer: {
    width: 53,
    height: 26,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: "#333333",
    borderTopLeftRadius: 9,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    overflow: "hidden",
    marginRight: 5
  },
  name: {
    fontFamily: "Roboto-Black",
    fontSize: 18,
    textAlign: "left",
    color: "#1B2633",
    flex: 1,
  },
  date: {
    fontFamily: "Roboto-Regular",
    fontSize: 12,
    textAlign: "left",
    color: "#1B2633"
  },
  categories: {
    flexDirection: "row",
    marginTop: 8
  },
  tag: {
    backgroundColor: "#D4E5FF",
    borderRadius: 10,
    overflow: "hidden",
    paddingTop: 2,
    paddingRight: 12,
    paddingBottom: 2,
    paddingLeft: 12,
    marginTop: 6,
    marginBottom: 4,
    marginRight: 4,
    color: "black",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontSize: 12,
    fontWeight: "400"
  },
  expandedTag: {
    flexDirection: "row",
    width: 245,
    flexWrap: "wrap"
  },
  arrowIcon: {
    marginLeft: 10,
    width: 24,
    height: 24
  }
});
