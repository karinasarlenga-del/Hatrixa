document.addEventListener("DOMContentLoaded", () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryImages = Array.from(document.querySelectorAll('.gallery-grid img'));
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const closeBtn = document.getElementById('lightbox-close');
    const closeArea = document.getElementById('lightbox-close-area');
    
    let currentIndex = 0;

    function showImage(index) {
        if (index < 0) index = galleryImages.length - 1;
        if (index >= galleryImages.length) index = 0;
        currentIndex = index;
        lightboxImg.src = galleryImages[currentIndex].src;
    }

    galleryImages.forEach((img, idx) => {
        img.addEventListener('click', () => {
            showImage(idx);
            lightbox.classList.add('active');
        });
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex - 1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex + 1);
    });

    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    closeArea.addEventListener('click', (e) => {
        if (e.target === closeArea) {
            lightbox.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        if (e.key === 'Escape') lightbox.classList.remove('active');
    });
});
