import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { syncPayload, useStore } from './store';

const TOKEN_KEY = 'df_token';

async function saveToken(token?: string) {
  if (Platform.OS === 'web') return;
  if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
  else await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function restoreToken() {
  if (Platform.OS === 'web') return;
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token && !useStore.getState().auth.token) useStore.getState().setAuth({ ...useStore.getState().auth, token });
}

const base = () => useStore.getState().settings.apiUrl.replace(/\/$/, '');

async function call(path: string, method: string, body?: unknown) {
  if (!base()) throw new Error('Set your server URL first (Settings → AI server).');
  const token = useStore.getState().auth.token;
  const res = await fetch(base() + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? `Request failed (${res.status})`);
  return json;
}

export async function register(email: string, password: string) {
  const r = await call('/auth/register', 'POST', { email, password });
  useStore.getState().setAuth({ token: r.token, email: r.email });
  await saveToken(r.token);
  await pushProgress();
}

export async function login(email: string, password: string) {
  const r = await call('/auth/login', 'POST', { email, password });
  useStore.getState().setAuth({ token: r.token, email: r.email });
  await saveToken(r.token);
  await pullProgress();
}

export async function logout() {
  useStore.getState().setAuth({});
  await saveToken(undefined);
}

export async function pushProgress() {
  if (!useStore.getState().auth.token) return;
  await call('/sync', 'PUT', { data: syncPayload(), updatedAt: Date.now() });
  useStore.setState({ lastSync: Date.now() });
}

export async function pullProgress() {
  if (!useStore.getState().auth.token) return;
  const r = await call('/sync', 'GET');
  if (r?.data) {
    const apiUrl = useStore.getState().settings.apiUrl;
    useStore.getState().importState(r.data);
    useStore.getState().set({ apiUrl });
  }
  useStore.setState({ lastSync: Date.now() });
}
