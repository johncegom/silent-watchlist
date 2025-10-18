import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import axios from "axios";
import { GOLD_API_URL } from "../constants/api";

const convertToVND = (amount) => {
  if (!amount) return "";

  // Keep digits, dots, commas and minus sign
  const cleaned = amount.replace(/[^\d,.\-]/g, "");

  // Normalize numbers like "1.234,56" -> "1234.56", or "1,234.56" -> "1234.56"
  let normalized = cleaned;
  if (/,/.test(cleaned) && /\./.test(cleaned)) {
    // assume dot as thousand separator and comma as decimal
    normalized = cleaned.replace(/\./g, "").replace(/,/g, ".");
  } else {
    // remove any grouping commas or dots
    normalized = cleaned.replace(/[.,]/g, "");
  }

  const value = parseFloat(normalized);
  if (isNaN(value)) return amount;

  const toThoundsand = Math.round(value * 1000);

  return toThoundsand.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
};

const WatchList = () => {
  const [goldPrice, setGoldPrice] = useState(null);
  const goldPriceIntervalRef = useRef(null);

  useEffect(() => {
    loadGoldPrice();
    startGoldMonitor();

    return () => {
      stopGoldMonitor();
    };
  }, []);

  const startGoldMonitor = () => {
    goldPriceIntervalRef.current = setInterval(() => {
      loadGoldPrice();
    }, 5 * 60 * 1000);
  };

  const stopGoldMonitor = () => {
    if (goldPriceIntervalRef.current) {
      clearInterval(goldPriceIntervalRef.current);
    }
  };

  const loadGoldPrice = async () => {
    try {
      const response = await axios.get(GOLD_API_URL, {
        responseType: "text",
      });
      const parser = new XMLParser({ ignoreAttributes: false });
      const data = parser.parse(response.data);
      const rows = data?.GoldList?.DGPlist?.Row || [];

      const goldPrice = rows.find((item) => item["@_Name"] === "DOJI HCM lẻ");

      if (!goldPrice) {
        console.warn("No data.");
        return null;
      }

      setGoldPrice(goldPrice);
    } catch (error) {
      console.error("Error fetching gold price:", error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", paddingTop: 50 }}>
      <Text style={[{ fontSize: 40 }]}>Gold Price (Doji): </Text>
      <Text style={styles.text}>
        Buy Price:{" "}
        {goldPrice ? (
          convertToVND(goldPrice["@_Buy"])
        ) : (
          <ActivityIndicator size="large" color="gray" />
        )}
      </Text>
      <Text style={styles.text}>
        Sell Price:{" "}
        {goldPrice ? (
          convertToVND(goldPrice["@_Sell"])
        ) : (
          <ActivityIndicator size="large" color="gray" />
        )}
      </Text>
    </View>
  );
};

export default WatchList;

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
  },
});
