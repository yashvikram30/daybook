/** Tells the sync layer which localStorage key a store just wrote, so signed-in users get it saved to the server. */
type Listener = (key: string) => void;
const listeners = new Set<Listener>();

export function onPersist(cb: Listener): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function notifyPersist(key: string) {
  listeners.forEach((l) => l(key));
}
