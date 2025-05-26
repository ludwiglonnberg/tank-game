const apiBase = "http://localhost:5166/api/user";

function showMessage(msg: string, isError = false) {
  const messageDiv = document.getElementById("message")!;
  messageDiv.textContent = msg;
  messageDiv.style.color = isError ? "red" : "green";
}

document.getElementById("login-form")!.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = (document.getElementById("login-email") as HTMLInputElement)
    .value;
  const password = (
    document.getElementById("login-password") as HTMLInputElement
  ).value;

  try {
    const res = await fetch(`${apiBase}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      showMessage(errorText, true);
      return;
    }

    const data = await res.json();
    showMessage(`Välkommen, ${data.username}!`);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("userName", data.username);
    setTimeout(() => {
      window.location.href = "/home.html";
    }, 1000);
  } catch (error) {
    showMessage("Something went wrong", true);
  }
});
