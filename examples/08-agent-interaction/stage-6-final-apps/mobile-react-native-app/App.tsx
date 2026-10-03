import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type RunItem = {
  id: number;
  created_at: string;
  trigger_mode: string;
  answer: string;
};

const baseUrl =
  process.env.EXPO_PUBLIC_AGENT_BASE_URL?.trim() || "http://localhost:8787";
const isLocalhostUrl =
  baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");

export default function App() {
  const [memory, setMemory] = useState<string[]>([]);
  const [runs, setRuns] = useState<RunItem[]>([]);
  const [message, setMessage] = useState("Send me a small habit reminder for today.");
  const [latestAnswer, setLatestAnswer] = useState("Loading your coach...");
  const [status, setStatus] = useState("Connecting...");
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setStatus("Refreshing...");
    const [memoryResponse, runsResponse] = await Promise.all([
      fetch(`${baseUrl}/agent/memory`),
      fetch(`${baseUrl}/agent/runs?limit=5`),
    ]);

    if (!memoryResponse.ok || !runsResponse.ok) {
      throw new Error("Could not load agent data.");
    }

    const memoryData = (await memoryResponse.json()) as { memory: string[] };
    const runsData = (await runsResponse.json()) as { runs: RunItem[] };
    setMemory(memoryData.memory);
    setRuns(runsData.runs);
    if (runsData.runs[0]?.answer) {
      setLatestAnswer(runsData.runs[0].answer);
    }
    setStatus("Connected.");
  }

  useEffect(() => {
    void loadData().catch((error: unknown) => {
      setStatus(error instanceof Error ? error.message : "Unknown loading error.");
    });
  }, []);

  async function submit(path: "/agent/run" | "/agent/notify") {
    setLoading(true);
    setStatus(path === "/agent/notify" ? "Sending reminder..." : "Asking the agent...");

    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("The cloud agent returned an error.");
      }

      const data = (await response.json()) as { answer: string };
      setLatestAnswer(data.answer);
      setStatus(path === "/agent/notify" ? "Reminder requested." : "Answer ready.");
      await loadData();
    } catch (error: unknown) {
      setStatus(error instanceof Error ? error.message : "Unknown request error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>Stage 6</Text>
        <Text style={styles.title}>Better Me</Text>
        <Text style={styles.subtitle}>A tiny coaching app powered by the cloud agent.</Text>
        <Text style={styles.backendHint}>Backend: {baseUrl}</Text>

        {isLocalhostUrl ? (
          <View style={styles.warningCard}>
            <Text style={styles.warningTitle}>Backend needs a reachable URL</Text>
            <Text style={styles.warningText}>
              This app is using localhost, which points to the phone itself. Use your
              Mac&apos;s LAN IP or the deployed Cloudflare Worker URL instead.
            </Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Today</Text>
          <Text style={styles.answer}>{latestAnswer}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Ask The Agent</Text>
          <TextInput
            style={styles.input}
            multiline
            value={message}
            onChangeText={setMessage}
          />
          <View style={styles.buttonRow}>
            <Pressable style={styles.primaryButton} onPress={() => void submit("/agent/run")}>
              <Text style={styles.buttonText}>Ask again</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => void submit("/agent/notify")}
            >
              <Text style={styles.buttonText}>Send reminder</Text>
            </Pressable>
          </View>
          <Text style={styles.status}>{status}</Text>
          {loading ? <ActivityIndicator color="#236d52" /> : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Memory</Text>
          {memory.map((item) => (
            <View key={item} style={styles.memoryChip}>
              <Text style={styles.memoryText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Recent Runs</Text>
          {runs.map((run) => (
            <View key={run.id} style={styles.runItem}>
              <Text style={styles.runMeta}>{run.trigger_mode}</Text>
              <Text style={styles.runAnswer}>{run.answer}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff9f1",
  },
  container: {
    padding: 18,
    gap: 14,
    backgroundColor: "#fff9f1",
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 12,
    color: "#7b6d59",
    marginTop: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: "#1f2018",
  },
  subtitle: {
    color: "#4c4a41",
    fontSize: 16,
    marginBottom: 4,
  },
  backendHint: {
    color: "#5d584c",
    marginBottom: 8,
  },
  warningCard: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#fff1dc",
    borderWidth: 1,
    borderColor: "#efc27f",
  },
  warningTitle: {
    color: "#8a5310",
    fontWeight: "700",
    marginBottom: 6,
  },
  warningText: {
    color: "#7a5a33",
    lineHeight: 20,
  },
  card: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  cardLabel: {
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 12,
    color: "#7b6d59",
    marginBottom: 10,
  },
  answer: {
    fontSize: 18,
    lineHeight: 28,
    color: "#24231d",
  },
  input: {
    minHeight: 110,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#f7f4ee",
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    marginBottom: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#236d52",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#d98934",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  status: {
    color: "#4c4a41",
  },
  memoryChip: {
    backgroundColor: "#f5efe3",
    borderRadius: 18,
    padding: 12,
    marginBottom: 8,
  },
  memoryText: {
    color: "#493f34",
  },
  runItem: {
    backgroundColor: "#f8f6ef",
    borderRadius: 18,
    padding: 12,
    marginBottom: 8,
  },
  runMeta: {
    color: "#766c5e",
    textTransform: "uppercase",
    fontSize: 12,
    marginBottom: 4,
  },
  runAnswer: {
    color: "#282720",
    lineHeight: 22,
  },
});
