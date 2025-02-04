// learnHubApi
const learnLoad = async () => {
  try {
    const response = await fetch("https://api.learnhub.thanayut.in.th/content", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("ไม่มีข้อมูล LearnHub");
    }
    const learndata = await response.json();
    return learndata.data;
  } catch (error) {
    console.log("เกิดข้อผิดพลาด", error);
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

const main = async () => {
  const section = document.getElementById("main-learnhub");
  const spinner = document.getElementById("loading-spinner");
  const contentCard = (content) => {
    const {
      thumbnailUrl,
      videoTitle,
      creatorName,
      comment,
      postedBy: { name },
      rating,
      id,
    } = content;
    return `<a href="content.html?id=${id}" class="card-link">
            <article class="content-card">
              <div class="content-image">
                <img src="${thumbnailUrl}" alt="${videoTitle}" />
              </div>
              <div class="content-text">
              <div class="content-info">
                <h3 class="videoTitle">${videoTitle}</h3>
                <h4 class="creatorName">${creatorName}</h4>
                <p>${comment}</p>
              </div>
              <div class="content-footer">
                <p>${name}</p>
                <p class="rating">${createStarRating(rating)}</p>
              </div>
              </div>
            </article>
          </a>`;
  };

  try {
    spinner.classList.remove("hidden");
    const cardLearn = await learnLoad();
    const contentHTML = cardLearn.map((content) => contentCard(content)).join("");
    const createContent = document.getElementById("create-content");
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
          createContent.innerHTML = `<div class="content-btn">
              <a href="create.html" class="btn btn-primary">
                Create new content
              </a>
            </div>`;
          section.innerHTML = contentHTML;
        } else {
          section.innerHTML = contentHTML;
        }
      } catch (error) {
        localStorage.removeItem("accessToken");
        section.innerHTML = contentHTML;
      }
    } else {
      localStorage.removeItem("accessToken");
      section.innerHTML = contentHTML;
    }
  } catch (error) {
    console.error("Error checking auth status:", error);
    localStorage.removeItem("accessToken");
    section.innerHTML = contentHTML;
  } finally {
    spinner.classList.add("hidden");
  }
};

document.addEventListener("DOMContentLoaded", main);
