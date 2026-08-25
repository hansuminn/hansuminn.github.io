const artworks = Array.from(document.querySelectorAll(".artwork img"));

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const closeButton = document.getElementById("lightbox-close");

let currentIndex = 0;


/* 작품 정보 */

const captions = [
    "22 August 2026 - Oil pastel on paper 44 × 32 cm",
    "22 August 2026 - Oil pastel on paper 44 × 32 cm",
    "22 August 2026 - Oil pastel on paper 44 × 32 cm",
    "22 August 2026 - Oil pastel on paper 44 × 32 cm",
    "22 August 2026 - Oil pastel on paper 44 × 32 cm",
    "22 August 2026 - Oil pastel on paper 44 × 32 cm",
    "22 August 2026 - Oil pastel on paper 44 × 32 cm",
    "22 August 2026 - Oil pastel on paper 44 × 32 cm",
    "22 August 2026 - Oil pastel on paper 44 × 32 cm",
    "22 August 2026 - Oil pastel on paper 44 × 32 cm",
    "22 August 2026 - Oil pastel on paper 44 × 32 cm",
    "24 August 2026 - Oil pastel on paper 44 × 32 cm",
    "24 August 2026 - Oil pastel on paper 44 × 32 cm",
    "24 August 2026 - Oil pastel on paper 44 × 32 cm",
    "24 August 2026 - Oil pastel on paper 44 × 32 cm",
    "24 August 2026 - Oil pastel on paper 44 × 32 cm",
    "24 August 2026 - Oil pastel on paper 44 × 32 cm",
    "24 August 2026 - Oil pastel on paper 44 × 32 cm",
];


/* 확대 화면 업데이트 */

function showArtwork(index) {
    currentIndex = index;

    lightboxImage.src = artworks[currentIndex].src;
    const title = artworks[currentIndex].dataset.title || "";
const caption =
    artworks[currentIndex].dataset.caption || captions[currentIndex] || "";

lightboxCaption.innerHTML =
    (title ? `<strong class="caption-title">${title}</strong>` : "") + caption;

    document.querySelectorAll(".lightbox-thumb").forEach((thumb, i) => {
        thumb.classList.toggle("active-thumb", i === currentIndex);
    });
}


/* 작품 클릭 */

artworks.forEach((image, index) => {
    image.style.cursor = "pointer";

    image.addEventListener("click", () => {
        lightbox.classList.add("active");
        showArtwork(index);
    });
});


/* 닫기 */

closeButton.addEventListener("click", () => {
    lightbox.classList.remove("active");
});

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        lightbox.classList.remove("active");
    }
});


/* 키보드 이동 */

document.addEventListener("keydown", (event) => {

    if (!lightbox.classList.contains("active")) return;

    if (event.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % artworks.length;
        showArtwork(currentIndex);
    }

    if (event.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + artworks.length) % artworks.length;
        showArtwork(currentIndex);
    }

    if (event.key === "Escape") {
        lightbox.classList.remove("active");
    }
});


/* 썸네일 만들기 */

const thumbnailContainer = document.createElement("div");
thumbnailContainer.className = "lightbox-thumbnails";

artworks.forEach((image, index) => {

    const thumb = document.createElement("img");

    thumb.src = image.src;
    thumb.className = "lightbox-thumb";

    thumb.addEventListener("click", () => {
        showArtwork(index);
    });

    thumbnailContainer.appendChild(thumb);
});

document.querySelector(".lightbox-content").appendChild(thumbnailContainer);
/* =========================
   MOBILE SWIPE
========================= */

let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
});

lightbox.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].screenX;

    const swipeDistance = touchEndX - touchStartX;

    /* 너무 살짝 움직인 건 무시 */
    if (Math.abs(swipeDistance) < 50) return;


    /* 왼쪽으로 밀기 → 다음 작품 */
    if (swipeDistance < 0) {

        currentIndex =
            (currentIndex + 1) % artworks.length;

        showArtwork(currentIndex);
    }


    /* 오른쪽으로 밀기 → 이전 작품 */
    if (swipeDistance > 0) {

        currentIndex =
            (currentIndex - 1 + artworks.length)
            % artworks.length;

        showArtwork(currentIndex);
    }
});