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
   PC + 모바일
===================================== */

function openLightbox(index) {

    lightbox.classList.add("active");

    document.body.classList.add(
        "lightbox-open"
    );

    showArtwork(index);
}


artworks.forEach((image, index) => {

    /* PC 클릭 */
    image.addEventListener("click", () => {

        openLightbox(index);

    });


    /* 아이폰 / 모바일 탭 */
    image.addEventListener("pointerup", (event) => {

        if (event.pointerType === "touch") {

            event.preventDefault();

            openLightbox(index);
        }

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
       SWIPE / DRAG
       PC + 아이폰 공용
    ===================================== */

    let dragging = false;
    let dragStartX = 0;
    let dragCurrentX = 0;


    function startDrag(x) {

        dragging = true;

        dragStartX = x;
        dragCurrentX = x;

        sliderTrack.style.transition = "none";
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


        /* 왼쪽으로 밀기 → 다음 작품 */

        if (distance < -50) {

            sliderTrack.style.transform =
                "translateX(-200%)";

            setTimeout(() => {

                currentIndex =
                    (currentIndex + 1) %
                    artworks.length;

                showArtwork(currentIndex);

            }, 280);
        }


        /* 오른쪽으로 밀기 → 이전 작품 */

        else if (distance > 50) {

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
       POINTER EVENTS
       마우스 + 아이폰 공용
    ===================================== */

    sliderTrack.addEventListener(
        "pointerdown",
        (event) => {

            startDrag(event.clientX);

            try {

                sliderTrack.setPointerCapture(
                    event.pointerId
                );

            } catch (error) {}
        }
    );


    sliderTrack.addEventListener(
        "pointermove",
        (event) => {

            if (!dragging) return;

            moveDrag(event.clientX);
        }
    );


    sliderTrack.addEventListener(
        "pointerup",
        (event) => {

            finishDrag();

            try {

                sliderTrack.releasePointerCapture(
                    event.pointerId
                );

            } catch (error) {}
        }
    );


    sliderTrack.addEventListener(
        "pointercancel",
        () => {

            finishDrag();
        }
    );


});