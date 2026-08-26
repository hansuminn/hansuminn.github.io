/* =========================================
   HAN SUMIN PORTFOLIO
   SERIES LIGHTBOX + CAROUSEL
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const artworks = Array.from(
        document.querySelectorAll(".artwork img")
    );

    /* 상세페이지가 아닌 경우 아무것도 실행하지 않음 */
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

    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let moved = false;


    /* =====================================
       이미지 3장 준비
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
       현재 썸네일
    ===================================== */

    function updateThumbnail() {

        const thumbs =
            document.querySelectorAll(
                ".lightbox-thumb"
            );

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

        image.addEventListener(
            "click",
            () => {

                lightbox.classList.add(
                    "active"
                );

                document.body.classList.add(
                    "lightbox-open"
                );

                showArtwork(index);
            }
        );
    });


    /* =====================================
       닫기
    ===================================== */

    function closeLightbox() {

        lightbox.classList.remove(
            "active"
        );

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


    /* 배경 클릭 */

    lightbox.addEventListener(
        "click",
        (event) => {

            if (event.target === lightbox) {

                closeLightbox();
            }
        }
    );


    /* =====================================
       다음 작품
    ===================================== */

    function nextArtwork() {

        currentIndex =
            (currentIndex + 1) %
            artworks.length;

        showArtwork(currentIndex);
    }


    /* =====================================
       이전 작품
    ===================================== */

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
                !lightbox.classList.contains(
                    "active"
                )
            ) {
                return;
            }


            if (
                event.key === "ArrowRight"
            ) {

                nextArtwork();
            }


            if (
                event.key === "ArrowLeft"
            ) {

                previousArtwork();
            }


            if (
                event.key === "Escape"
            ) {

                closeLightbox();
            }
        }
    );


    /* =====================================
       작은 썸네일 생성
    ===================================== */

    thumbnailContainer.innerHTML = "";


    artworks.forEach(
        (image, index) => {

            const thumb =
                document.createElement(
                    "img"
                );

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
        }
    );


       /* =====================================
       SWIPE / DRAG
       모바일 + 데스크톱 공용
    ===================================== */

    let dragStartX = 0;
    let dragCurrentX = 0;
    let dragging = false;

    function startDrag(clientX) {
        dragging = true;

        dragStartX = clientX;
        dragCurrentX = clientX;

        sliderTrack.style.transition = "none";
    }

    function moveDrag(clientX) {
        if (!dragging) return;

        dragCurrentX = clientX;

        const distance =
            dragCurrentX - dragStartX;

        sliderTrack.style.transform =
            `translateX(calc(-100% + ${distance}px))`;
    }

    function endDrag() {
        if (!dragging) return;

        dragging = false;

        const distance =
            dragCurrentX - dragStartX;

        sliderTrack.style.transition =
            "transform 0.28s ease";

        /* 다음 작품 */
        if (distance < -60) {

            sliderTrack.style.transform =
                "translateX(-200%)";

            setTimeout(() => {

                currentIndex =
                    (currentIndex + 1) %
                    artworks.length;

                showArtwork(currentIndex);

            }, 280);

        }

        /* 이전 작품 */
        else if (distance > 60) {

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

            }, 280);

        }

        /* 조금만 움직였으면 원위치 */
        else {

            sliderTrack.style.transform =
                "translateX(-100%)";
        }
    }


    /* =====================================
       DESKTOP — MOUSE
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

            endDrag();
        }
    );


    /* =====================================
       MOBILE — TOUCH
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

            moveDrag(
                event.touches[0].clientX
            );
        },
        { passive: true }
    );

    sliderTrack.addEventListener(
        "touchend",
        () => {

            endDrag();
        },
        { passive: true }
    );

});