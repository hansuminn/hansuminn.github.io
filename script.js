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
   DRAG SWIPE
========================= */

let dragStartX = 0;
let dragCurrentX = 0;
let isDragging = false;

lightboxImage.addEventListener("touchstart", (event) => {
    if (!lightbox.classList.contains("active")) return;

    isDragging = true;

    dragStartX = event.touches[0].clientX;
    dragCurrentX = dragStartX;

    lightboxImage.style.transition = "none";
});


lightboxImage.addEventListener("touchmove", (event) => {
    if (!isDragging) return;

    dragCurrentX = event.touches[0].clientX;

    const moveX = dragCurrentX - dragStartX;

    lightboxImage.style.transform =
        `translateX(${moveX}px)`;

    lightboxImage.style.opacity =
        Math.max(0.55, 1 - Math.abs(moveX) / 500);
});


lightboxImage.addEventListener("touchend", () => {
    if (!isDragging) return;

    isDragging = false;

    const moveX = dragCurrentX - dragStartX;

    lightboxImage.style.transition =
        "transform 0.28s ease, opacity 0.28s ease";


    /* 왼쪽으로 충분히 밀었을 때 → 다음 작품 */

    if (moveX < -70) {

        lightboxImage.style.transform =
            "translateX(-120%)";

        lightboxImage.style.opacity = "0";

        setTimeout(() => {

            currentIndex =
                (currentIndex + 1) % artworks.length;

            showArtwork(currentIndex);

            lightboxImage.style.transition = "none";
            lightboxImage.style.transform =
                "translateX(120%)";

            requestAnimationFrame(() => {

                requestAnimationFrame(() => {

                    lightboxImage.style.transition =
                        "transform 0.28s ease, opacity 0.28s ease";

                    lightboxImage.style.transform =
                        "translateX(0)";

                    lightboxImage.style.opacity = "1";

                });

            });

        }, 280);

    }


    /* 오른쪽으로 충분히 밀었을 때 → 이전 작품 */

    else if (moveX > 70) {

        lightboxImage.style.transform =
            "translateX(120%)";

        lightboxImage.style.opacity = "0";

        setTimeout(() => {

            currentIndex =
                (currentIndex - 1 + artworks.length)
                % artworks.length;

            showArtwork(currentIndex);

            lightboxImage.style.transition = "none";
            lightboxImage.style.transform =
                "translateX(-120%)";

            requestAnimationFrame(() => {

                requestAnimationFrame(() => {

                    lightboxImage.style.transition =
                        "transform 0.28s ease, opacity 0.28s ease";

                    lightboxImage.style.transform =
                        "translateX(0)";

                    lightboxImage.style.opacity = "1";

                });

            });

        }, 280);

    }


    /* 조금만 밀었으면 원래 자리로 복귀 */

    else {

        lightboxImage.style.transform =
            "translateX(0)";

        lightboxImage.style.opacity = "1";

    }

});