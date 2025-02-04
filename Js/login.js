const loginUser = document.getElementById("usernameLogin");
const loginPass = document.getElementById("passwordLogin");
const submitLogin = document.querySelector(".btn-login");

const login = async () => {
  try {
    if (!loginUser?.value?.trim() || !loginPass?.value?.trim()) {
      alert("กรุณากรอก Username และ Password");
      return;
    }

    const loginRes = await fetch("https://api.learnhub.thanayut.in.th/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: loginUser.value,
        password: loginPass.value,
      }),
    });
    if (!loginRes.ok) {
      throw new Error("Username หรือ Password ไม่ถูกต้อง");
    }

    const loginData = await loginRes.json();
    if (!loginData.accessToken) {
      alert("กรุณากรอก Username และ Password ให้ถูกต้อง");
      return;
    }
    localStorage.setItem("accessToken", loginData.accessToken);

    const userRes = await fetch("https://api.learnhub.thanayut.in.th/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginData.accessToken}`,
      },
    });
    if (!userRes.ok) {
      throw new Error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
    }

    const userData = await userRes.json();
    loginUser.value = "";
    loginPass.value = "";
    alert("เข้าสู่ระบบสำเร็จ");

    window.location.href = "index.html";
    return userData;
  } catch (error) {
    console.error("Login error:", error);
    alert(error.message || "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่");
  }
};

submitLogin.addEventListener("click", async (e) => {
  e.preventDefault();
  await login();
});
