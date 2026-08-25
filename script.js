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
            "translateX(-33.333333%)";
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
       드래그 시작
       아이폰 + 마우스
    ===================================== */

    sliderTrack.addEventListener(
        "pointerdown",
        (event) => {

            isDragging = true;
            moved = false;

            startX =
                event.clientX;

            currentX =
                startX;


            sliderTrack.style.transition =
                "none";


            try {

                sliderTrack.setPointerCapture(
                    event.pointerId
                );

            } catch (error) {}
        }
    );


    /* =====================================
       드래그 중
    ===================================== */

    sliderTrack.addEventListener(
        "pointermove",
        (event) => {

            if (!isDragging) return;


            currentX =
                event.clientX;


            const distance =
                currentX - startX;


            if (
                Math.abs(distance) > 4
            ) {

                moved = true;
            }


            sliderTrack.style.transform =
                `translateX(calc(-33.333333% + ${distance}px))`;
        }
    );


    /* =====================================
       드래그 종료
    ===================================== */

    function finishDrag(event) {

        if (!isDragging) return;

        isDragging = false;


        const distance =
            currentX - startX;


        sliderTrack.style.transition =
            "transform 0.28s ease";


        /* -------------------------------
           다음 작품
        ------------------------------- */

        if (distance < -60) {

            sliderTrack.style.transform =
                "translateX(-66.666666%)";


            setTimeout(() => {

                currentIndex =
                    (currentIndex + 1) %
                    artworks.length;

                showArtwork(
                    currentIndex
                );

            }, 280);
        }


        /* -------------------------------
           이전 작품
        ------------------------------- */

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

                showArtwork(
                    currentIndex
                );

            }, 280);
        }


        /* -------------------------------
           충분히 안 밀었으면 복귀
        ------------------------------- */

        else {

            sliderTrack.style.transform =
                "translateX(-33.333333%)";
        }


        if (event) {

            try {

                sliderTrack.releasePointerCapture(
                    event.pointerId
                );

            } catch (error) {}
        }
    }


    sliderTrack.addEventListener(
        "pointerup",
        finishDrag
    );


    sliderTrack.addEventListener(
        "pointercancel",
        finishDrag
    );

});