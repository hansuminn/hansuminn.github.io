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

            if (sliderTrack) {
        prepareSlides();
    }
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
   3-SLIDE MOBILE CAROUSEL
========================= */

const sliderTrack = document.getElementById("slider-track");
const prevImage = document.getElementById("prev-image");
const nextImage = document.getElementById("next-image");

let swipeStartX = 0;
let swipeCurrentX = 0;
let swiping = false;


/* 이전 / 현재 / 다음 이미지 준비 */

function prepareSlides() {

    const prevIndex =
        (currentIndex - 1 + artworks.length) % artworks.length;

    const nextIndex =
        (currentIndex + 1) % artworks.length;

    prevImage.src = artworks[prevIndex].src;
    lightboxImage.src = artworks[currentIndex].src;
    nextImage.src = artworks[nextIndex].src;

    sliderTrack.style.transition = "none";
    sliderTrack.style.transform = "translateX(-33.3333%)";
}


/* 손가락을 댔을 때 */

sliderTrack.addEventListener("touchstart", (event) => {

    swipeStartX = event.touches[0].clientX;
    swipeCurrentX = swipeStartX;

    swiping = true;

    sliderTrack.style.transition = "none";
});


/* 손가락을 움직이는 동안 */

sliderTrack.addEventListener("touchmove", (event) => {

    if (!swiping) return;

    swipeCurrentX = event.touches[0].clientX;

    const moveX = swipeCurrentX - swipeStartX;

    sliderTrack.style.transform =
        `translateX(calc(-33.3333% + ${moveX}px))`;
});


/* 손을 놓았을 때 */

sliderTrack.addEventListener("touchend", () => {

    if (!swiping) return;

    swiping = false;

    const moveX = swipeCurrentX - swipeStartX;

    sliderTrack.style.transition = "transform 0.28s ease";


    /* 왼쪽으로 넘김 → 다음 작품 */

    if (moveX < -60) {

        sliderTrack.style.transform =
            "translateX(-66.6666%)";

        setTimeout(() => {

            currentIndex =
                (currentIndex + 1) % artworks.length;

            showArtwork(currentIndex);

            prepareSlides();

        }, 280);
    }


    /* 오른쪽으로 넘김 → 이전 작품 */

    else if (moveX > 60) {

        sliderTrack.style.transform =
            "translateX(0%)";

        setTimeout(() => {

            currentIndex =
                (currentIndex - 1 + artworks.length)
                % artworks.length;

            showArtwork(currentIndex);

            prepareSlides();

        }, 280);
    }


    /* 조금만 움직였으면 다시 가운데 */

    else {

        sliderTrack.style.transform =
            "translateX(-33.3333%)";
    }

});