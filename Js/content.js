const getIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
};

const fetchContent = async () => {
  try {
    const id = getIdFromUrl();
    console.log(id);
    if (!id) {
      console.error("ไม่พบ ID");
      return;
    }

    const response = await fetch(`https://api.learnhub.thanayut.in.th/content/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }

    const contentData = await response.json();
    return contentData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const createStarRating = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - Math.ceil(rating);

  let stars = "";

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fa-solid fa-star"></i>';
  }
  if (hasHalfStar) {
    stars += '<i class="fa-solid fa-star-half"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="fa-regular fa-star"></i>';
  }
  return stars;
};

const getYoutubeEmbedUrl = (url) => {
  try {
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&#]+)/)?.[1];

    if (videoId?.length === 11) {
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`;
    }
    return url;
  } catch (error) {
    console.error("Error converting YouTube URL:", error);
    return url;
  }
};

const formatThaiDate = (isoDate) => {
  const date = new Date(isoDate);
  const thaiDays = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
  const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

  const day = thaiDays[date.getDay()];
  const month = thaiMonths[date.getMonth()];
  const thaiYear = date.getFullYear() + 543;

  return `${day} ${date.getDate()} ${month} ${thaiYear}`;
};

const renderContent = async () => {
  const section = document.getElementById("content-main");
  const spinner = document.getElementById("loading-spinner");
  const itemContent = (content) => {
    const {
      videoTitle,
      creatorName,
      videoUrl,
      comment,
      rating,
      postedBy: { name },
      createdAt,
    } = content;

    const embedUrl = getYoutubeEmbedUrl(videoUrl);
    const formattedDate = formatThaiDate(createdAt);

    return ` <div class="content-container">
          <div class="content-info">
            <h1>${videoTitle}</h1>
            <h2>${creatorName}</h2>
              <iframe "
  width="100%" 
  height="390" 
  src="${embedUrl}" 
  frameborder="0" 
  allowfullscreen>
</iframe>
          </div>
          <div class="review">
            <div class="content-comment">
              <p>"${comment}</p>
            </div>
            <div class="content-review">
              <p class="rating">${createStarRating(rating)}</p>
              <p>--${name}</p>
              <p>${formattedDate}</p>
            </div>
            <div class="content-edit"></div>
            <div class="content-delete"></div>
          </div>
        </div>`;
  };

  try {
    spinner.classList.remove("hidden");
    const content = await fetchContent();
    section.innerHTML = itemContent(content);
    const editcontent = document.querySelector(".content-edit");
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
          if (userData.id === content.postedBy.id) {
            editcontent.innerHTML = `
              <a href="edit.html?id=${content.id}">
                <i class="fa-solid fa-pen-to-square"></i> edit
              </a>`;
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("accessToken");
      }
    }
  } catch (error) {
    console.error("Error rendering content:", error);
    section.innerHTML = '<p class="error">ไม่สามารถโหลดข้อมูลได้</p>';
    localStorage.removeItem("accessToken");
  } finally {
    spinner.classList.add("hidden");
  }
};

document.addEventListener("DOMContentLoaded", renderContent);
