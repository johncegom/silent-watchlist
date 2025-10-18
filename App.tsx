import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { XMLParser } from "fast-xml-parser";
import { useEffect, useRef, useState } from "react";

interface ApiResponse {
  GoldList: GoldList;
}
interface GoldList {
  DGPlist: DGPlist;
}

interface DGPlist {
  Row: GoldItem[];
}

interface GoldItem {
  "@_Name": string;
  "@_Sell": string;
  "@_Buy"?: string;
  // Add other properties as needed based on your API response
}

const API_URL =
  "https://giavang.doji.vn/api/giavang/?api_key=258fbd2a72ce8481089d88c678e9fe4f";

const convertToVND = (amount?: string | null): string => {
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

export default function App() {
  const [goldPrice, setGoldPrice] = useState<GoldItem | null>(null);
  const goldPriceIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
      const response = await axios.get(API_URL, {
        responseType: "text",
      });
      const parser = new XMLParser({ ignoreAttributes: false });
      const data: ApiResponse = parser.parse(response.data);
      const rows = data?.GoldList?.DGPlist?.Row || [];

      const goldPrice: GoldItem | undefined = rows.find(
        (item: GoldItem) => item["@_Name"] === "DOJI HCM lẻ"
      );

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
    <View style={styles.container}>
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
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 25,
  },
});
