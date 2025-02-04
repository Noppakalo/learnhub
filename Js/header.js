export const createHeader = () => {
  const headerHTML = `<header id="header-main">
        <div class="header-container">
          <div class="header-logo">
            <a href="index.html">
              <img src="logo/logo.svg" alt="โลโก้ LearnHub" />
              <span>LearnHub</span>
            </a>
          </div>
          <nav class="header-nav">
            <a class="loginBtn" href="login.html">Login</a>
            <a class="registerBtn" href="register.html">Register</a>
          </nav>
        </div>
      </header>`;

  const getDefaultNavHTML = () => `
      <a class="loginBtn" href="login.html">Login</a>
      <a class="registerBtn" href="register.html">Register</a>
    `;

  const updateHeaderUI = async () => {
    const headerNav = document.querySelector(".header-nav");
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      try {
        const userRes = await fetch("https://api.learnhub.thanayut.in.th/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          headerNav.innerHTML = `
              <span class="username">สวัสดี, ${userData.username}</span>
              <a class="logoutBtn" href="#" onclick="handleLogout()">Logout</a>
            `;
        } else {
          localStorage.removeItem("accessToken");
          headerNav.innerHTML = getDefaultNavHTML();
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        localStorage.removeItem("accessToken");
        headerNav.innerHTML = getDefaultNavHTML();
      }
    } else {
      headerNav.innerHTML = getDefaultNavHTML();
    }
  };

  window.handleLogout = () => {
    localStorage.removeItem("accessToken");
    updateHeaderUI();
    window.location.href = "index.html";
  };

  return {
    render: () => {
      document.body.insertAdjacentHTML("afterbegin", headerHTML);
      updateHeaderUI();
    },
  };
};
