/* =========================================
   HAN SUMIN PORTFOLIO
   SERIES LIGHTBOX + CAROUSEL
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const artworks = Array.from(
        document.querySelectorAll(".artwork img")
    );

    /* 메인페이지에서는 실행하지 않음 */
    if (artworks.length === 0) return;

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeButton = document.getElementById("lightbox-close");

    const sliderWindow = document.querySelector(".slider-window");
    const sliderTrack = document.getElementById("slider-track");

    const prevImage = document.getElementById("prev-image");
    const nextImage = document.getElementById("next-image");

    const thumbnailContainer =
        document.getElementById("lightbox-thumbnails");

    /* 필요한 요소가 없으면 중단 */
    if (
        !lightbox ||
        !lightboxImage ||
        !lightboxCaption ||
        !closeButton ||
        !sliderWindow ||
        !sliderTrack ||
        !prevImage ||
        !nextImage ||
        !thumbnailContainer
    ) {
        console.error("Lightbox HTML structure is incomplete.");
        return;
    }

    let currentIndex = 0;

    let startX = 0;
    let currentX = 0;
    let dragging = false;
    let moved = false;
    let animating = false;


    /* =====================================
       SLIDES 준비
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
            "translate3d(-100%, 0, 0)";
    }


    /* =====================================
       CAPTION
    ===================================== */

    function updateCaption() {

        const artwork = artworks[currentIndex];

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
       THUMBNAIL 상태
    ===================================== */

    function updateThumbnail() {

        const thumbs =
            thumbnailContainer.querySelectorAll(
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
       현재 작품 표시
    ===================================== */

    function showArtwork(index) {

        currentIndex = index;

        prepareSlides();
        updateCaption();
        updateThumbnail();
    }


    /* =====================================
       LIGHTBOX 열기
    ===================================== */

    function openLightbox(index) {

        currentIndex = index;

        lightbox.classList.add("active");

        document.body.classList.add(
            "lightbox-open"
        );

        showArtwork(index);
    }


    /* 작품 클릭 */

    artworks.forEach((image, index) => {

        image.addEventListener("click", () => {
            openLightbox(index);
        });

    });


    /* =====================================
       LIGHTBOX 닫기
    ===================================== */

    function closeLightbox() {

        lightbox.classList.remove("active");

        document.body.classList.remove(
            "lightbox-open"
        );

        dragging = false;
        animating = false;
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

    function goNext() {

        if (animating) return;

        animating = true;

        sliderTrack.style.transition =
            "transform 0.28s ease";

        sliderTrack.style.transform =
            "translate3d(-200%, 0, 0)";

        window.setTimeout(() => {

            currentIndex =
                (currentIndex + 1) %
                artworks.length;

            showArtwork(currentIndex);

            animating = false;

        }, 280);
    }


    function goPrevious() {

        if (animating) return;

        animating = true;

        sliderTrack.style.transition =
            "transform 0.28s ease";

        sliderTrack.style.transform =
            "translate3d(0%, 0, 0)";

        window.setTimeout(() => {

            currentIndex =
                (
                    currentIndex -
                    1 +
                    artworks.length
                ) %
                artworks.length;

            showArtwork(currentIndex);

            animating = false;

        }, 280);
    }


    /* =====================================
       KEYBOARD
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

            if (event.key === "ArrowRight") {
                goNext();
            }

            if (event.key === "ArrowLeft") {
                goPrevious();
            }

            if (event.key === "Escape") {
                closeLightbox();
            }
        }
    );


    /* =====================================
       THUMBNAILS 생성
    ===================================== */

    thumbnailContainer.innerHTML = "";

    artworks.forEach((image, index) => {

        const thumb =
            document.createElement("img");

        thumb.src = image.src;
        thumb.alt = "";
        thumb.className =
            "lightbox-thumb";

        thumb.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                if (animating) return;

                showArtwork(index);
            }
        );

        thumbnailContainer.appendChild(
            thumb
        );
    });


    /* =====================================
       DRAG 공통
    ===================================== */

    function beginDrag(x) {

        if (animating) return;

        dragging = true;
        moved = false;

        startX = x;
        currentX = x;

        sliderTrack.style.transition =
            "none";
    }


    function dragTo(x) {

        if (!dragging || animating) return;

        currentX = x;

        const distance =
            currentX - startX;

        if (Math.abs(distance) > 4) {
            moved = true;
        }

        /*
          현재 슬라이드는 -100%.
          손가락 이동 px만큼 추가.
        */

        sliderTrack.style.transform =
            `translate3d(calc(-100% + ${distance}px), 0, 0)`;
    }


    function endDrag() {

        if (!dragging || animating) return;

        dragging = false;

        const distance =
            currentX - startX;

        if (distance < -50) {

            goNext();

        } else if (distance > 50) {

            goPrevious();

        } else {

            sliderTrack.style.transition =
                "transform 0.22s ease";

            sliderTrack.style.transform =
                "translate3d(-100%, 0, 0)";
        }
    }


    /* =====================================
       DESKTOP MOUSE
    ===================================== */

    sliderWindow.addEventListener(
        "mousedown",
        (event) => {

            if (event.button !== 0) return;

            event.preventDefault();

            beginDrag(event.clientX);
        }
    );


    window.addEventListener(
        "mousemove",
        (event) => {

            if (!dragging) return;

            dragTo(event.clientX);
        }
    );


    window.addEventListener(
        "mouseup",
        () => {

            if (!dragging) return;

            endDrag();
        }
    );


    /* =====================================
       iPHONE / TOUCH
    ===================================== */

    sliderWindow.addEventListener(
        "touchstart",
        (event) => {

            if (event.touches.length !== 1) {
                return;
            }

            beginDrag(
                event.touches[0].clientX
            );

        },
        { passive: true }
    );


    sliderWindow.addEventListener(
        "touchmove",
        (event) => {

            if (!dragging) return;

            const x =
                event.touches[0].clientX;

            const distance =
                x - startX;

            /*
              좌우 움직임이 시작되면
              Safari 기본 제스처를 막음.
            */

            if (Math.abs(distance) > 5) {
                event.preventDefault();
            }

            dragTo(x);

        },
        { passive: false }
    );


    sliderWindow.addEventListener(
        "touchend",
        () => {

            if (!dragging) return;

            endDrag();

        },
        { passive: true }
    );


    sliderWindow.addEventListener(
        "touchcancel",
        () => {

            if (!dragging) return;

            endDrag();

        },
        { passive: true }
    );

});