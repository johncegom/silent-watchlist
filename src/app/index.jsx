import { StyleSheet, View } from "react-native";
import WatchList from "../components/Watchlist";

const Home = () => {
  return (
    <View style={styles.container}>
      <WatchList />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
