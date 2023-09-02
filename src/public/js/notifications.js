function createNotification(type, message, time) {
  const element = notificationElement(type, message);
  appendNotification(element, time);
}

function notificationElement(type, message) {
  const p = document.createElement("p");
  p.innerText = message;
  p.classList.add("notification");
  p.classList.add(type);
  return p;
}

function appendNotification(element, time) {
  clearNotification();
  notifications.append(element);

  if (time && time > 0)
    setTimeout(() => {
      clearNotification();
    }, time);
}

function clearNotification() {
  notifications.innerHTML = "";
}
