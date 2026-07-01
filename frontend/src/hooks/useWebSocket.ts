import { useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";
import useWsStore from "../store/wsStore";

export function useWebSocket() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const { setConnected, addAlert } = useWsStore();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<number>();

  useEffect(() => {
    if (!token || !user) return;

    function connect() {
      const protocol = location.protocol === "https:" ? "wss:" : "ws:";
      const host = location.host;
      const url = `${protocol}//${host}/ws/${user.id}?token=${token}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        reconnectRef.current = window.setTimeout(connect, 3000);
      };
      ws.onmessage = (ev) => {
        const msg = JSON.parse(ev.data);
        if (msg.type === "alert") addAlert(msg);
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [token, user]);

  const sendMessage = (msg: object) => {
    wsRef.current?.send(JSON.stringify(msg));
  };

  return { sendMessage };
}
