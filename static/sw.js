// Firefox shows a generic "site updated in the background" notice if a push
// event finishes without one, so always show something.
self.addEventListener("push", (event) => {
  let note = {};
  try {
    note = event.data ? event.data.json() : {};
  } catch {
    note = { title: event.data ? event.data.text() : "thibault.uk" };
  }

  event.waitUntil(
    self.registration.showNotification(note.title || "thibault.uk", {
      body: note.body || "",
      icon: "/images/icon.svg",
      data: { url: note.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      const open = wins.find((w) => w.url === url);
      return open ? open.focus() : clients.openWindow(url);
    })
  );
});
