/* =========================================
   HAN SUMIN PORTFOLIO
   SERIES LIGHTBOX + CAROUSEL
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const artworks = Array.from(
        document.querySelectorAll(".artwork img")
    );

    if (artworks.length === 0) return;


    const lightbox =
        document.getElementById("lightbox");

    const lightboxImage =
        document.getElementById("lightbox-image");

    const lightboxCaption =
        document.getElementById("lightbox-caption");

    const closeButton =
        document.getElementById("lightbox-close");

    const sliderTrack =
        document.getElementById("slider-track");

    const prevImage =
        document.getElementById("prev-image");

    const nextImage =
        document.getElementById("next-image");

    const thumbnailContainer =
        document.getElementById("lightbox-thumbnails");


    let currentIndex = 0;

    let dragStartX = 0;
    let dragCurrentX = 0;
    let dragging = false;


    /* =====================================
       이전 / 현재 / 다음 이미지 준비
    ===================================== */

    function prepareSlides() {

        const total = artworks.length;

        const previousIndex =
            (currentIndex - 1 + total) % total;

        const nextIndex =
            (currentIndex + 1) % total;


        prevImage.src =
            artworks[previousIndex].src;

        lightboxImage.src =
            artworks[currentIndex].src;

        nextImage.src =
            artworks[nextIndex].src;


        sliderTrack.style.transition = "none";

        sliderTrack.style.transform =
            "translateX(-100%)";
    }


    /* =====================================
       캡션
    ===================================== */

    function updateCaption() {

        const artwork =
            artworks[currentIndex];

        const title =
            artwork.dataset.title || "";

        const caption =
            artwork.dataset.caption || "";


        if (title) {

            lightboxCaption.innerHTML =
                `<strong class="caption-title">${title}</strong>` +
                `<span>${caption}</span>`;

        } else {

            lightboxCaption.textContent =
                caption;
        }
    }


    /* =====================================
       현재 썸네일 표시
    ===================================== */

    function updateThumbnail() {

        const thumbs =
            document.querySelectorAll(".lightbox-thumb");

        thumbs.forEach((thumb, index) => {

            thumb.classList.toggle(
                "active-thumb",
                index === currentIndex
            );

        });
    }


    /* =====================================
       작품 표시
    ===================================== */

    function showArtwork(index) {

        currentIndex = index;

        prepareSlides();
        updateCaption();
        updateThumbnail();
    }


    /* =====================================
       작품 클릭 → 확대
    ===================================== */

    artworks.forEach((image, index) => {

        image.addEventListener("click", () => {

            lightbox.classList.add("active");

            document.body.classList.add(
                "lightbox-open"
            );

            showArtwork(index);
        });

    });


    /* =====================================
       닫기
    ===================================== */

    function closeLightbox() {

        lightbox.classList.remove("active");

        document.body.classList.remove(
            "lightbox-open"
        );
    }


    closeButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            closeLightbox();
        }
    );


    lightbox.addEventListener(
        "click",
        (event) => {

            if (event.target === lightbox) {
                closeLightbox();
            }

        }
    );


    /* =====================================
       다음 / 이전
    ===================================== */

    function nextArtwork() {

        currentIndex =
            (currentIndex + 1) %
            artworks.length;

        showArtwork(currentIndex);
    }


    function previousArtwork() {

        currentIndex =
            (
                currentIndex -
                1 +
                artworks.length
            ) %
            artworks.length;

        showArtwork(currentIndex);
    }


    /* =====================================
       키보드
    ===================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                !lightbox.classList.contains("active")
            ) return;


            if (event.key === "ArrowRight") {
                nextArtwork();
            }


            if (event.key === "ArrowLeft") {
                previousArtwork();
            }


            if (event.key === "Escape") {
                closeLightbox();
            }

        }
    );


    /* =====================================
       작은 썸네일
    ===================================== */

    thumbnailContainer.innerHTML = "";


    artworks.forEach((image, index) => {

        const thumb =
            document.createElement("img");

        thumb.src = image.src;

        thumb.className =
            "lightbox-thumb";


        thumb.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                showArtwork(index);
            }
        );


        thumbnailContainer.appendChild(
            thumb
        );

    });


    /* =====================================
       공통 드래그 함수
    ===================================== */

    function startDrag(x) {

        dragging = true;

        dragStartX = x;
        dragCurrentX = x;

        sliderTrack.style.transition =
            "none";
    }


    function moveDrag(x) {

        if (!dragging) return;

        dragCurrentX = x;

        const distance =
            dragCurrentX - dragStartX;

        sliderTrack.style.transform =
            `translateX(calc(-100% + ${distance}px))`;
    }


    function finishDrag() {

        if (!dragging) return;

        dragging = false;

        const distance =
            dragCurrentX - dragStartX;

        sliderTrack.style.transition =
            "transform 0.28s ease";


        /* 왼쪽 → 다음 */

        if (distance < -60) {

            sliderTrack.style.transform =
                "translateX(-200%)";


            setTimeout(() => {

                nextArtwork();

            }, 280);

        }


        /* 오른쪽 → 이전 */

        else if (distance > 60) {

            sliderTrack.style.transform =
                "translateX(0%)";


            setTimeout(() => {

                previousArtwork();

            }, 280);

        }


        /* 조금 움직임 → 원래 자리 */

        else {

            sliderTrack.style.transform =
                "translateX(-100%)";
        }
    }


    /* =====================================
       데스크톱 마우스
    ===================================== */

    sliderTrack.addEventListener(
        "mousedown",
        (event) => {

            event.preventDefault();

            startDrag(event.clientX);
        }
    );


    window.addEventListener(
        "mousemove",
        (event) => {

            moveDrag(event.clientX);
        }
    );


    window.addEventListener(
        "mouseup",
        () => {

            finishDrag();
        }
    );


    /* =====================================
       아이폰 / 모바일
    ===================================== */

    sliderTrack.addEventListener(
        "touchstart",
        (event) => {

            startDrag(
                event.touches[0].clientX
            );

        },
        { passive: true }
    );


    sliderTrack.addEventListener(
        "touchmove",
        (event) => {

            /* Safari가 화면 제스처를 가져가지 못하게 함 */
            event.preventDefault();

            moveDrag(
                event.touches[0].clientX
            );

        },
        { passive: false }
    );


    sliderTrack.addEventListener(
        "touchend",
        () => {

            finishDrag();

        },
        { passive: true }
    );


    sliderTrack.addEventListener(
        "touchcancel",
        () => {

            finishDrag();

        },
        { passive: true }
    );

});