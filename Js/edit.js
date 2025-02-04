const getIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
};

const comment = document.getElementById("text");
const rating = document.querySelector(".star-rating i");
const submit = document.getElementById("editForm");
const id = getIdFromUrl();

const fetchEdit = async () => {
  try {
    if (!id) {
      console.error("ไม่พบ ID");
      return;
    }
    if (!comment.value.trim() || !rating.getAttribute("data-rating")) {
      alert("กรุณาใส่ข้อมูลให้ครบก่อนอัพเดท");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("กรุณาเข้าสู่ระบบก่อนแก้ไข");
      window.location.href = "login.html";
      return;
    }

    const editRes = await fetch(`https://api.learnhub.thanayut.in.th/content/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        comment: comment.value.trim(),
        rating: Number(rating.getAttribute("data-rating")) || 0,
      }),
    });

    if (!editRes.ok) {
      const errorData = await createRes.json();
      throw new Error(errorData.message || "การอัพเดทล้มเหลว");
    }

    comment.value = "";
    rating.setAttribute("data-rating", "0");

    if (rating.classList) {
      rating.classList.remove("active");
    }

    alert("อัพโหลดข้อมูลสำเร็จ");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Upload error:", error);
    alert(error.message || "การอัพเดทล้มเหลว กรุณาอัพเดทใหม่อีกครั้ง");
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
  await fetchEdit();
});
