// register
const regUser = document.getElementById("usernameRegister");
const regName = document.getElementById("nameRegister");
const regPass = document.getElementById("passwordRegister");
const regConfPass = document.getElementById("confirmPassword");
const regBtn = document.querySelector(".btn-register");

const register = async () => {
  try {
    if (!regUser.value || !regName.value || !regPass.value || !regConfPass.value) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (regPass.value !== regConfPass.value) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    const regRes = await fetch("https://api.learnhub.thanayut.in.th/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: regUser.value,
        name: regName.value,
        password: regPass.value,
      }),
    });
    if (!regRes) {
      alert("การลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      return;
    }

    const regData = await regRes.json();
    if (!regData) {
      alert("ยังไม่มีการลงทะเบียน");
      return;
    }
    alert("ลงทะเบียนสำเร็จ");
    regUser.value = "";
    regName.value = "";
    regPass.value = "";
    regConfPass.value = "";
    window.location.href = "login.html";
  } catch (error) {
    console.error("Register error:", error);
    alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
  }
};

regBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await register();
});

// updateHeader
const headerNav = document.querySelector(".header-nav");
const accessToken = localStorage.getItem("accessToken");

const updateHeader = async () => {
  if (accessToken) {
    headerNav.innerHTML = `<a class="loginBtn" href="login.html">Logout</a>`;

    document.getElementById("logoutBtn").addEventListener("click", (e) => {
      e.preventDefault();

      localStorage.removeItem("accessToken");
      window.location.href = "login.html";
    });
  } else {
    headerNav.innerHTML = `<a class="loginBtn" href="login.html">Login</a>
          <a class="registerBtn" href="register.html">Register</a>`;
  }
};
document.addEventListener("DOMContentLoaded", updateHeader);
