/* ========================================
   기본 요소
======================================== */

const artworks = Array.from(
    document.querySelectorAll(".artwork img")
);

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const closeButton = document.getElementById("lightbox-close");

const sliderTrack = document.getElementById("slider-track");
const prevImage = document.getElementById("prev-image");
const nextImage = document.getElementById("next-image");

let currentIndex = 0;


/* ========================================
   OIL PASTEL 기존 캡션

   Color Pencil은 HTML의 data-caption을
   우선해서 사용하기 때문에 여기에 영향 없음
======================================== */

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
    "24 August 2026 - Oil pastel on paper 44 × 32 cm"
];


/* ========================================
   이전 / 현재 / 다음 이미지 준비
======================================== */

function prepareSlides() {

    if (!sliderTrack || !prevImage || !nextImage) return;
    if (artworks.length === 0) return;

    const prevIndex =
        (currentIndex - 1 + artworks.length) %
        artworks.length;

    const nextIndex =
        (currentIndex + 1) %
        artworks.length;

    prevImage.src =
        artworks[prevIndex].src;

    lightboxImage.src =
        artworks[currentIndex].src;

    nextImage.src =
        artworks[nextIndex].src;


    /* 항상 가운데 작품으로 초기화 */

    sliderTrack.style.transition = "none";

    sliderTrack.style.transform =
        "translateX(-33.3333%)";
}


/* ========================================
   확대 화면 작품 업데이트
======================================== */

function showArtwork(index) {

    currentIndex = index;

    lightboxImage.src =
        artworks[currentIndex].src;


    /* 제목 */

    const title =
        artworks[currentIndex].dataset.title || "";


    /* 캡션

       1순위 = HTML의 data-caption
       2순위 = 기존 Oil Pastel captions 배열
    */

    const caption =
        artworks[currentIndex].dataset.caption ||
        captions[currentIndex] ||
        "";


    /* 제목만 Bold */

    lightboxCaption.innerHTML =
        (title
            ? `<strong class="caption-title">${title}</strong>`
            : ""
        ) + caption;


    /* 아래 썸네일 현재 작품 표시 */

    document
        .querySelectorAll(".lightbox-thumb")
        .forEach((thumb, i) => {

            thumb.classList.toggle(
                "active-thumb",
                i === currentIndex
            );

        });


    /* 모바일 슬라이더 갱신 */

    prepareSlides();
}


/* ========================================
   작품 클릭 → 확대
======================================== */

artworks.forEach((image, index) => {

    image.style.cursor = "pointer";

    image.addEventListener("click", () => {

        lightbox.classList.add("active");

        showArtwork(index);

    });

});


/* ========================================
   닫기
======================================== */

if (closeButton) {

    closeButton.addEventListener("click", () => {

        lightbox.classList.remove("active");

    });

}


/* 회색 바깥 영역 클릭 */

if (lightbox) {

    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {

            lightbox.classList.remove("active");

        }

    });

}


/* ========================================
   키보드 이동
======================================== */

document.addEventListener("keydown", (event) => {

    if (!lightbox) return;

    if (!lightbox.classList.contains("active")) {
        return;
    }


    /* 다음 */

    if (event.key === "ArrowRight") {

        const nextIndex =
            (currentIndex + 1) %
            artworks.length;

        showArtwork(nextIndex);
    }


    /* 이전 */

    if (event.key === "ArrowLeft") {

        const prevIndex =
            (currentIndex - 1 + artworks.length) %
            artworks.length;

        showArtwork(prevIndex);
    }


    /* 닫기 */

    if (event.key === "Escape") {

        lightbox.classList.remove("active");

    }

});


/* ========================================
   아래 작은 썸네일 만들기
======================================== */

const thumbnailContainer =
    document.createElement("div");

thumbnailContainer.className =
    "lightbox-thumbnails";


artworks.forEach((image, index) => {

    const thumb =
        document.createElement("img");

    thumb.src = image.src;

    thumb.className =
        "lightbox-thumb";


    thumb.addEventListener("click", (event) => {

        /* 클릭이 lightbox 바깥 클릭으로 인식되지 않게 */

        event.stopPropagation();

        showArtwork(index);

    });


    thumbnailContainer.appendChild(thumb);

});


const lightboxContent =
    document.querySelector(".lightbox-content");

if (lightboxContent) {

    lightboxContent.appendChild(
        thumbnailContainer
    );

}


/* ========================================
   MOBILE 3-SLIDE CAROUSEL
======================================== */

let swipeStartX = 0;
let swipeCurrentX = 0;

let swiping = false;


/* 손가락을 처음 댔을 때 */

if (sliderTrack) {

    sliderTrack.addEventListener(
        "touchstart",
        (event) => {

            swipeStartX =
                event.touches[0].clientX;

            swipeCurrentX =
                swipeStartX;

            swiping = true;


            /* 손가락을 따라 바로 움직이도록 */

            sliderTrack.style.transition =
                "none";

        },
        { passive: true }
    );


    /* ------------------------------------
       손가락을 움직이는 동안
    ------------------------------------ */

    sliderTrack.addEventListener(
        "touchmove",
        (event) => {

            if (!swiping) return;


            swipeCurrentX =
                event.touches[0].clientX;


            const moveX =
                swipeCurrentX - swipeStartX;


            /*
                가운데 위치 -33.3333%를 기준으로
                손가락 이동 px만큼 같이 움직임
            */

            sliderTrack.style.transform =
                `translateX(calc(-33.3333% + ${moveX}px))`;

        },
        { passive: true }
    );


    /* ------------------------------------
       손을 놓았을 때
    ------------------------------------ */

    sliderTrack.addEventListener(
        "touchend",
        () => {

            if (!swiping) return;

            swiping = false;


            const moveX =
                swipeCurrentX - swipeStartX;


            sliderTrack.style.transition =
                "transform 0.32s ease";


            /* ============================
               왼쪽으로 밀기 → 다음 작품
            ============================ */

            if (moveX < -60) {

                sliderTrack.style.transform =
                    "translateX(-66.6666%)";


                setTimeout(() => {

                    currentIndex =
                        (currentIndex + 1) %
                        artworks.length;


                    showArtwork(currentIndex);

                }, 320);

            }


            /* ============================
               오른쪽으로 밀기 → 이전 작품
            ============================ */

            else if (moveX > 60) {

                sliderTrack.style.transform =
                    "translateX(0%)";


                setTimeout(() => {

                    currentIndex =
                        (
                            currentIndex -
                            1 +
                            artworks.length
                        ) %
                        artworks.length;


                    showArtwork(currentIndex);

                }, 320);

            }


            /* ============================
               조금만 움직임 → 원위치
            ============================ */

            else {

                sliderTrack.style.transform =
                    "translateX(-33.3333%)";

            }

        },
        { passive: true }
    );


    /* 손가락 동작이 중간에 취소됐을 경우 */

    sliderTrack.addEventListener(
        "touchcancel",
        () => {

            swiping = false;

            sliderTrack.style.transition =
                "transform 0.32s ease";

            sliderTrack.style.transform =
                "translateX(-33.3333%)";

        }
    );

}