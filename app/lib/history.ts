"use client";

export interface HistoryLog {
  id: string;
  timestamp: string;
  toolName: string;
  actionType: string;
  details: string;
  link: string;
}

export function addHistoryLog(toolName: string, actionType: string, details: string, link: string) {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem("cybro_history");
    const logs: HistoryLog[] = raw ? JSON.parse(raw) : [];

    const newLog: HistoryLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      toolName,
      actionType,
      details,
      link,
    };

    // Prepend and limit to latest 100 items
    const updated = [newLog, ...logs].slice(0, 100);
    localStorage.setItem("cybro_history", JSON.stringify(updated));

    // Dispatch custom event so listeners know history updated
    window.dispatchEvent(new Event("cybro_history_updated"));
  } catch (error) {
    console.error("Error writing to history log", error);
  }
}

export function getHistoryLogs(): HistoryLog[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem("cybro_history");
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Error reading history logs", error);
    return [];
  }
}

export function clearHistoryLogs() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem("cybro_history");
    window.dispatchEvent(new Event("cybro_history_updated"));
  } catch (error) {
    console.error("Error clearing history logs", error);
  }
}
