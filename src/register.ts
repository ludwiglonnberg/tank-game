const apiBase = "http://localhost:5166/api/user";

function showMessage(msg: string, isError = false) {
  const messageDiv = document.getElementById("message")!;
  messageDiv.textContent = msg;
  messageDiv.style.color = isError ? "red" : "green";
}

document
  .getElementById("register-form")!
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = (
      document.getElementById("reg-username") as HTMLInputElement
    ).value;
    const email = (document.getElementById("reg-email") as HTMLInputElement)
      .value;
    const password = (
      document.getElementById("reg-password") as HTMLInputElement
    ).value;

    try {
      const res = await fetch(`${apiBase}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        showMessage(errorText, true);
        return;
      }

      const text = await res.text();
      showMessage(text);
      (document.getElementById("register-form") as HTMLFormElement).reset();
    } catch (error) {
      showMessage("Något gick fel vid registrering", true);
    }
  });
