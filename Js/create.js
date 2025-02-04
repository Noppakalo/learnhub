const videoUrl = document.getElementById("video");
const comment = document.getElementById("text");
const rating = document.querySelector(".star-rating i");
const submit = document.getElementById("sendForm");

const createContent = async () => {
  try {
    if (!videoUrl.value.trim() || !comment.value.trim() || !rating.getAttribute("data-rating")) {
      alert("กรุณาใส่ข้อมูลให้ครบก่อนอัพโหลด");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("กรุณาเข้าสู่ระบบก่อนอัพโหลด");
      window.location.href = "login.html";
      return;
    }

    const createRes = await fetch("https://api.learnhub.thanayut.in.th/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        videoUrl: videoUrl.value.trim(),
        comment: comment.value.trim(),
        rating: Number(rating.getAttribute("data-rating")) || 0,
      }),
    });

    if (!createRes.ok) {
      const errorData = await createRes.json();
      throw new Error(errorData.message || "การอัพโหลดล้มเหลว");
    }

    videoUrl.value = "";
    comment.value = "";
    rating.setAttribute("data-rating", "0");

    if (rating.classList) {
      rating.classList.remove("active");
    }

    alert("อัพโหลดข้อมูลสำเร็จ");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Upload error:", error);
    alert(error.message || "การอัพโหลดล้มเหลว กรุณาอัพโหลดใหม่อีกครั้ง");
  }
};

document.querySelectorAll(".star-rating i").forEach((star, index) => {
  star.addEventListener("click", () => {
    const ratingValue = index + 1;
    document.querySelectorAll(".star-rating i").forEach((s, i) => {
      if (i < ratingValue) {
        s.classList.add("active");
      } else {
        s.classList.remove("active");
      }
    });
    rating.setAttribute("data-rating", ratingValue.toString());
  });
});

submit?.addEventListener("click", async (e) => {
  e.preventDefault();
  await createContent();
});
