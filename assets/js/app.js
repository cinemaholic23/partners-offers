const partnerCards = [
  {
    title: "Кэшбэк до\u00a040% на\u00a0товары в\u00a0Lamoda",
    background: "#E4F0FF",
    href: "offer-detail.html",
    image: {
      src: "assets/images/lamoda.png",
      alt: ""
    },
    timer: {
      id: "lamoda",
      label: "Осталось",
      remainingSeconds: 1805
    }
  },
  {
    title: "Успей купить",
    background: "#FFCBB3",
    image: {
      src: "assets/images/banner-podborki.avif",
      alt: ""
    },
    timer: {
      label: "Осталось",
      remainingSeconds: 3610
    }
  },
  {
    title: "Альфа-Пятница",
    background: "#EF272E",
    textTone: "inverse",
    image: {
      src: "assets/images/alfa-friday.avif",
      alt: ""
    },
    timer: {
      state: "upcoming",
      label: "Начнётся",
      startsAt: "29 мая, 12:30"
    }
  },
  {
    title: "Привилегии в ресторанах",
    background: "#F0F2F5",
    image: {
      src: "assets/images/icecream.avif",
      alt: ""
    },
    logos: [
      { label: "WRF", image: "assets/images/wrf.png" },
      { label: "Rappoport", image: "assets/images/rappoport.png" },
      { label: "+11", kind: "more" }
    ]
  },
  {
    title: "Промокоды",
    background: "rgb(255, 202, 199)",
    image: {
      src: "assets/images/banner-podborki_promocodes.avif",
      alt: ""
    },
    logos: [
      { label: "Иви", image: "assets/images/logo-yp-ivi.avif" }
    ]
  }
];

const cashbackCategories = [
  { title: "Избранное", image: "assets/images/categories/like.png" },
  { title: "Новое", image: "assets/images/categories/new.png" },
  { title: "Продукты", image: "assets/images/categories/products.png" },
  { title: "Кафе и\u00a0рестораны", image: "assets/images/categories/cafe.png" }
];

const detailOfferTimer = {
  id: "lamoda",
  label: "Осталось",
  remainingSeconds: 1805
};

const timerStoragePrefix = "partners-offers:timer:";

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}

function createPartnerImage(image) {
  if (!image) {
    return null;
  }

  if (image.type === "mock") {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "partner-card__image");
    svg.setAttribute("viewBox", "0 0 144 144");
    svg.setAttribute("fill", "none");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = `
      <rect x="40" y="40" width="64" height="64" rx="18" fill="#1745F5"></rect>
      <path d="M58 76h28" stroke="#fff" stroke-width="6" stroke-linecap="round"></path>
      <path d="M58 61h19" stroke="#fff" stroke-width="6" stroke-linecap="round"></path>
      <circle cx="100" cy="91" r="22" fill="#FFF6A9"></circle>
    `;
    return svg;
  }

  const img = createElement("img", "partner-card__image");
  img.src = image.src;
  img.alt = image.alt || "";
  return img;
}

function createPartnerMeta(card) {
  if (card.logos) {
    const logos = createElement("div", "partner-card__meta partner-logos");
    logos.setAttribute("aria-label", "Партнёры");

    card.logos.slice(0, 3).forEach((logo) => {
      const classNames = ["partner-logo"];

      if (logo.kind === "more") {
        classNames.push("partner-logo--more");
      }

      if (logo.kind === "counter") {
        classNames.push("partner-logo--counter");
      }

      const logoElement = createElement("span", classNames.join(" "), logo.image ? "" : logo.label);

      if (logo.image) {
        logoElement.style.backgroundImage = `url("${logo.image}")`;
        logoElement.setAttribute("aria-label", logo.label);
      }

      logos.append(logoElement);
    });

    return logos;
  }

  if (card.timer) {
    return createTimerMeta(card.timer);
  }

  return null;
}

function createTimerMeta(timerConfig) {
  const meta = createElement("div", "partner-card__meta");

  meta.append(createSegmentedTimer(timerConfig));
  return meta;
}

function createSegmentedTimer(timerConfig) {
  const timer = createElement("div", "fomo-timer");
  const segments = createElement("div", "fomo-timer__segments");

  timer.append(createElement("div", "fomo-timer__label", timerConfig.label));

  if (timerConfig.state === "upcoming") {
    timer.dataset.timerState = "upcoming";
    timer.append(createElement("div", "fomo-timer__badge", timerConfig.startsAt));
    return timer;
  }

  timer.dataset.timerState = "active";
  timer.dataset.timerEndsAt = getTimerEndsAt(timerConfig);

  if (timerConfig.id) {
    timer.dataset.timerId = timerConfig.id;
  }

  timer.dataset.remainingSeconds = getTimerRemainingSeconds(Number(timer.dataset.timerEndsAt));

  renderTimerSegments(segments, Number(timer.dataset.remainingSeconds));
  timer.append(segments);
  return timer;
}

function getTimerStorageKey(timerId) {
  return `${timerStoragePrefix}${timerId}`;
}

function getTimerEndsAt(timerConfig) {
  if (!timerConfig.id) {
    return Date.now() + timerConfig.remainingSeconds * 1000;
  }

  const key = getTimerStorageKey(timerConfig.id);
  const storedEndsAt = Number(window.localStorage.getItem(key));

  if (storedEndsAt && storedEndsAt > Date.now()) {
    return storedEndsAt;
  }

  const endsAt = Date.now() + timerConfig.remainingSeconds * 1000;
  window.localStorage.setItem(key, String(endsAt));
  return endsAt;
}

function getTimerRemainingSeconds(endsAt) {
  return Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
}

function getTimerSegments(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return [
    { unit: "hours", value: String(hours).padStart(2, "0") },
    { unit: "minutes", value: String(minutes).padStart(2, "0") },
    { unit: "seconds", value: String(seconds).padStart(2, "0") }
  ];
}

function getVisibleTimerSegments(totalSeconds) {
  return getTimerSegments(totalSeconds);
}

function getCurrentTimerSegments(timer) {
  return [...timer.querySelectorAll(".fomo-timer__segment")].reduce((segments, element) => {
    segments[element.dataset.unit] = element.dataset.value;
    return segments;
  }, {});
}

function createTimerSegment(segment, previousValue) {
  const segmentElement = createElement("span", "fomo-timer__segment");
  segmentElement.setAttribute("data-unit", segment.unit);
  segmentElement.dataset.value = segment.value;

  segment.value.split("").forEach((digit, index) => {
    const previousDigit = previousValue ? previousValue[index] : null;
    const digitSlot = createElement("span", "fomo-timer__digit-slot");

    if (previousDigit && previousDigit !== digit) {
      digitSlot.append(createElement("span", "fomo-timer__digit fomo-timer__digit--old", previousDigit));
      digitSlot.append(createElement("span", "fomo-timer__digit fomo-timer__digit--new", digit));
    } else {
      digitSlot.append(createElement("span", "fomo-timer__digit", digit));
    }

    segmentElement.append(digitSlot);
  });

  return segmentElement;
}

function renderTimerSegments(container, totalSeconds, previousSegments = {}) {
  container.innerHTML = "";

  getVisibleTimerSegments(totalSeconds).forEach((segment, index) => {
    if (index > 0) {
      container.append(createElement("span", "fomo-timer__separator", ":"));
    }

    container.append(createTimerSegment(segment, previousSegments[segment.unit]));
  });
}

function updateFomoTimer(timer, syncedRemainingSeconds) {
  const next = typeof syncedRemainingSeconds === "number"
    ? syncedRemainingSeconds
    : getTimerRemainingSeconds(Number(timer.dataset.timerEndsAt));
  const current = Number(timer.dataset.remainingSeconds || 0);

  if (next === current) {
    return;
  }

  timer.dataset.remainingSeconds = next;

  const previousSegments = getCurrentTimerSegments(timer);
  renderTimerSegments(timer.querySelector(".fomo-timer__segments"), next, previousSegments);
}

function syncFomoTimers() {
  const activeTimers = [...document.querySelectorAll('.fomo-timer[data-timer-state="active"]')];
  const remainingByTimerKey = new Map();

  activeTimers.forEach((timer) => {
    const key = timer.dataset.timerId || timer.dataset.timerEndsAt;

    if (!remainingByTimerKey.has(key)) {
      remainingByTimerKey.set(key, getTimerRemainingSeconds(Number(timer.dataset.timerEndsAt)));
    }

    updateFomoTimer(timer, remainingByTimerKey.get(key));
  });
}

function startFomoTimers() {
  syncFomoTimers();

  window.setInterval(() => {
    syncFomoTimers();
  }, 1000);
}

function PartnerCard(card) {
  const article = createElement(card.href ? "a" : "article", "partner-card");
  article.style.background = card.background || "var(--surface-muted)";

  if (card.href) {
    article.href = card.href;
  }

  if (card.textTone === "inverse") {
    article.classList.add("partner-card--text-inverse");
  }

  if (card.timer?.state === "upcoming") {
    article.classList.add("partner-card--has-indicator");
  }

  article.append(createElement("h2", "partner-card__title", card.title));

  if (card.timer?.state === "upcoming") {
    article.append(createElement("span", "partner-card__indicator", "Скоро"));
  }

  const meta = createPartnerMeta(card);
  if (meta) {
    article.append(meta);
  }

  const image = createPartnerImage(card.image);
  if (image) {
    article.append(image);
  }

  return article;
}

function CashbackCategory(category) {
  const item = createElement("article", "cashback-category");
  const image = createElement("div", "cashback-category__image");

  if (category.image) {
    image.style.backgroundImage = `url("${category.image}")`;
  }

  item.append(image);
  item.append(createElement("h3", "cashback-category__title", category.title));

  return item;
}

const offersCarousel = document.querySelector("#offersCarousel");
const offersViewport = document.querySelector(".offers-viewport");
const cashbackCategoriesCarousel = document.querySelector("#cashbackCategories");
const offerFooterTimer = document.querySelector("#offerFooterTimer");

if (offersCarousel) {
  partnerCards.forEach((card) => {
    offersCarousel.append(PartnerCard(card));
  });
}

if (cashbackCategoriesCarousel) {
  cashbackCategories.forEach((category) => {
    cashbackCategoriesCarousel.append(CashbackCategory(category));
  });
}

if (offerFooterTimer) {
  const timer = createSegmentedTimer(detailOfferTimer);
  timer.classList.add("fomo-timer--footer");
  offerFooterTimer.append(timer);
}

startFomoTimers();

function getCarouselSnapPoints() {
  const cards = [...offersCarousel.querySelectorAll(".partner-card")];
  const firstCard = cards[0];
  const leftInset = firstCard ? parseFloat(window.getComputedStyle(firstCard).marginLeft) || 0 : 0;
  const maxScroll = offersViewport.scrollWidth - offersViewport.clientWidth;

  return cards.map((card) => Math.min(Math.max(0, card.offsetLeft - offersCarousel.offsetLeft - leftInset), maxScroll));
}

function clampCarouselIndex(index) {
  const snapPoints = getCarouselSnapPoints();
  return Math.max(0, Math.min(snapPoints.length - 1, index));
}

function goToCarouselCard(index) {
  const snapPoints = getCarouselSnapPoints();

  if (!snapPoints.length) {
    return;
  }

  const targetIndex = clampCarouselIndex(index);
  const target = snapPoints[targetIndex];

  if (Math.abs(target - offersViewport.scrollLeft) < 1) {
    return;
  }

  carouselCurrentIndex = targetIndex;
  animateCarouselScroll(offersViewport.scrollLeft, target);
}

let carouselAnimationFrame;
let isCarouselAnimating = false;
let carouselCurrentIndex = 0;
let carouselWheelLocked = false;
let carouselWheelUnlockTimer;
let carouselPointerStartX = 0;
let carouselPointerStartY = 0;
let carouselPointerActive = false;

function easeOutCubic(progress) {
  return 1 - Math.pow(1 - progress, 3);
}

function stopCarouselAnimation() {
  if (carouselAnimationFrame) {
    window.cancelAnimationFrame(carouselAnimationFrame);
    carouselAnimationFrame = null;
  }

  isCarouselAnimating = false;
}

function animateCarouselScroll(from, to) {
  stopCarouselAnimation();

  const duration = 420;
  const startedAt = performance.now();
  isCarouselAnimating = true;

  function tick(now) {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = easeOutCubic(progress);

    offersViewport.scrollLeft = from + (to - from) * eased;

    if (progress < 1) {
      carouselAnimationFrame = window.requestAnimationFrame(tick);
      return;
    }

    offersViewport.scrollLeft = to;
    stopCarouselAnimation();
  }

  carouselAnimationFrame = window.requestAnimationFrame(tick);
}

if (offersViewport && offersCarousel) {
offersViewport.addEventListener("wheel", (event) => {
  const dominantDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

  if (Math.abs(dominantDelta) < 2) {
    return;
  }

  event.preventDefault();

  window.clearTimeout(carouselWheelUnlockTimer);
  carouselWheelUnlockTimer = window.setTimeout(() => {
    carouselWheelLocked = false;
  }, 220);

  if (carouselWheelLocked || isCarouselAnimating) {
    return;
  }

  carouselWheelLocked = true;
  goToCarouselCard(carouselCurrentIndex + Math.sign(dominantDelta));
}, { passive: false });

offersViewport.addEventListener("pointerdown", (event) => {
  stopCarouselAnimation();
  carouselPointerActive = true;
  carouselPointerStartX = event.clientX;
  carouselPointerStartY = event.clientY;
  offersViewport.setPointerCapture(event.pointerId);
});

offersViewport.addEventListener("pointerup", (event) => {
  if (!carouselPointerActive) {
    return;
  }

  carouselPointerActive = false;

  const deltaX = event.clientX - carouselPointerStartX;
  const deltaY = event.clientY - carouselPointerStartY;
  const threshold = 24;

  if (Math.abs(deltaX) < threshold || Math.abs(deltaX) < Math.abs(deltaY)) {
    goToCarouselCard(carouselCurrentIndex);
    return;
  }

  goToCarouselCard(carouselCurrentIndex + (deltaX < 0 ? 1 : -1));
});

offersViewport.addEventListener("pointercancel", () => {
  carouselPointerActive = false;
  goToCarouselCard(carouselCurrentIndex);
});

window.addEventListener("resize", () => {
  stopCarouselAnimation();
  goToCarouselCard(carouselCurrentIndex);
});
}
