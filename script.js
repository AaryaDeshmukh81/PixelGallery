
const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const counter = document.getElementById("counter");

const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// 50 images with category filters
const categoryList = [
  "Nature",
  "Animals",
  "Architecture",
  "Technology",
  "Nature"
];

const images = Array.from({ length: 50 }, (_, i) => ({
  category: categoryList[i % categoryList.length],
  thumbnail: `https://picsum.photos/seed/photo${i + 1}/600/450`,
  full: `https://picsum.photos/seed/photo${i + 1}/1400/1000`
}));

let filteredImages = [...images];
let currentIndex = 0;
let previousFocus = null;

// Display images without titles or tags
function displayImages(items) {
  gallery.innerHTML = "";

  items.forEach((image, index) => {
    const item = document.createElement("div");
    item.className = "gallery-item";
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", "Open photograph");

    const img = document.createElement("img");
    img.src = image.thumbnail;
    img.alt = "Photograph";
    img.loading = "lazy";

    item.appendChild(img);

    item.addEventListener("click", () => {
      openLightbox(index);
    });

    item.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });

    gallery.appendChild(item);
  });
}

// Category filtering
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active")
      ?.classList.remove("active");

    button.classList.add("active");

    const category = button.dataset.category;

    filteredImages = category === "All"
      ? [...images]
      : images.filter(image => image.category === category);

    displayImages(filteredImages);
  });
});

// Open lightbox
function openLightbox(index) {
  currentIndex = index;
  previousFocus = document.activeElement;

  lightbox.hidden = false;
  document.body.style.overflow = "hidden";

  updateLightbox();
  closeBtn.focus();
}

// Update the selected image
function updateLightbox() {
  const image = filteredImages[currentIndex];

  lightboxImage.src = image.full;
  lightboxImage.alt = "Photograph";
  counter.textContent =
    `${currentIndex + 1} / ${filteredImages.length}`;
}

// Next image
function nextImage() {
  currentIndex =
    (currentIndex + 1) % filteredImages.length;

  updateLightbox();
}

// Previous image
function previousImage() {
  currentIndex =
    (currentIndex - 1 + filteredImages.length)
    % filteredImages.length;

  updateLightbox();
}

// Close lightbox
function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";

  if (previousFocus && document.contains(previousFocus)) {
    previousFocus.focus();
  }
}

nextBtn.addEventListener("click", nextImage);
prevBtn.addEventListener("click", previousImage);
closeBtn.addEventListener("click", closeLightbox);

// Close by clicking the background
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Keyboard controls
document.addEventListener("keydown", event => {
  if (lightbox.hidden) return;

  if (event.key === "ArrowRight") {
    nextImage();
  }

  if (event.key === "ArrowLeft") {
    previousImage();
  }

  if (event.key === "Escape") {
    closeLightbox();
  }
});

// Load all 50 images
displayImages(images);
