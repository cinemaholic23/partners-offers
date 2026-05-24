const partnerCards = [
  {
    title: "Успей купить",
    background: "#FFCBB3",
    image: {
      src: "assets/images/banner-podborki.avif",
      alt: ""
    },
    timer: {
      label: "До конца акции",
      remainingSeconds: 3610
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
    title: "Кэшбэк до\u00a040% на\u00a0товары в\u00a0Lamoda",
    background: "#E4F0FF",
    image: {
      src: "assets/images/lamoda.png",
      alt: ""
    },
    timer: {
      variant: "inline",
      label: "До конца акции",
      remainingSeconds: 3610
    }
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

  if (timerConfig.variant === "inline") {
    meta.append(createInlineTimer(timerConfig));
    return meta;
  }

  meta.append(createSegmentedTimer(timerConfig));
  return meta;
}

function createSegmentedTimer(timerConfig) {
  const timer = createElement("div", "fomo-timer");
  const segments = createElement("div", "fomo-timer__segments");

  timer.dataset.timerType = "segmented";
  timer.dataset.remainingSeconds = timerConfig.remainingSeconds;
  timer.append(createElement("div", "fomo-timer__label", timerConfig.label));

  renderTimerSegments(segments, timerConfig.remainingSeconds);
  timer.append(segments);
  return timer;
}

function createInlineTimer(timerConfig) {
  const timer = createElement("div", "fomo-timer-inline");
  const value = createElement("div", "fomo-timer-inline__value");

  timer.dataset.timerType = "inline";
  timer.dataset.remainingSeconds = timerConfig.remainingSeconds;

  timer.append(createElement("div", "fomo-timer__label", timerConfig.label));
  value.append(createElement("span", "fomo-timer-inline__dot"));
  value.append(createElement("span", "fomo-timer-inline__main"));
  value.append(createElement("span", "fomo-timer-inline__seconds"));
  timer.append(value);

  renderInlineTimer(timer, timerConfig.remainingSeconds);
  return timer;
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

function updateFomoTimer(timer) {
  const current = Number(timer.dataset.remainingSeconds || 0);
  const next = Math.max(0, current - 1);

  timer.dataset.remainingSeconds = next;

  if (timer.dataset.timerType === "inline") {
    renderInlineTimer(timer, next);
    pulseInlineTimerDot(timer);
    return;
  }

  const previousSegments = getCurrentTimerSegments(timer);
  renderTimerSegments(timer.querySelector(".fomo-timer__segments"), next, previousSegments);
}

function getInlineTimerParts(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return {
    main: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
    seconds: String(seconds).padStart(2, "0")
  };
}

function renderInlineTimer(timer, totalSeconds) {
  const parts = getInlineTimerParts(totalSeconds);
  timer.querySelector(".fomo-timer-inline__main").textContent = parts.main;
  timer.querySelector(".fomo-timer-inline__seconds").textContent = parts.seconds;
}

function pulseInlineTimerDot(timer) {
  const dot = timer.querySelector(".fomo-timer-inline__dot");

  if (!dot) {
    return;
  }

  dot.classList.remove("fomo-timer-inline__dot--pulse");
  void dot.offsetWidth;
  dot.classList.add("fomo-timer-inline__dot--pulse");
}

function startFomoTimers() {
  window.setInterval(() => {
    document.querySelectorAll(".fomo-timer, .fomo-timer-inline").forEach(updateFomoTimer);
  }, 1000);
}

function PartnerCard(card) {
  const article = createElement("article", "partner-card");
  article.style.background = card.background || "var(--surface-muted)";

  article.append(createElement("h2", "partner-card__title", card.title));

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

partnerCards.forEach((card) => {
  offersCarousel.append(PartnerCard(card));
});

cashbackCategories.forEach((category) => {
  cashbackCategoriesCarousel.append(CashbackCategory(category));
});

startFomoTimers();

function getCarouselSnapPoints() {
  const cards = [...offersCarousel.querySelectorAll(".partner-card")];
  const leftInset = 16;
  const maxScroll = offersViewport.scrollWidth - offersViewport.clientWidth;

  return cards.map((card) => Math.min(card.offsetLeft - leftInset, maxScroll));
}

function snapOffersCarousel() {
  const snapPoints = getCarouselSnapPoints();

  if (!snapPoints.length) {
    return;
  }

  const current = offersViewport.scrollLeft;
  const delta = current - carouselGestureStartScroll;
  const currentIndex = snapPoints.reduce((closestIndex, point, index) => {
    return Math.abs(point - carouselGestureStartScroll) < Math.abs(snapPoints[closestIndex] - carouselGestureStartScroll)
      ? index
      : closestIndex;
  }, 0);
  const threshold = 24;
  let targetIndex = currentIndex;

  if (Math.abs(delta) >= threshold) {
    targetIndex = currentIndex + Math.sign(delta);
  }

  targetIndex = Math.max(0, Math.min(snapPoints.length - 1, targetIndex));

  const target = snapPoints[targetIndex];

  if (Math.abs(target - current) < 1) {
    return;
  }

  animateCarouselScroll(current, target);
}

let carouselSnapTimer;
let carouselAnimationFrame;
let isCarouselAnimating = false;
let carouselGestureStartScroll = 0;

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

["pointerdown", "touchstart", "wheel"].forEach((eventName) => {
  offersViewport.addEventListener(eventName, () => {
    stopCarouselAnimation();
    carouselGestureStartScroll = offersViewport.scrollLeft;
  }, { passive: true });
});

offersViewport.addEventListener("scroll", () => {
  if (isCarouselAnimating) {
    return;
  }

  window.clearTimeout(carouselSnapTimer);
  carouselSnapTimer = window.setTimeout(snapOffersCarousel, 260);
});

window.addEventListener("resize", () => {
  stopCarouselAnimation();
  window.clearTimeout(carouselSnapTimer);
  carouselSnapTimer = window.setTimeout(snapOffersCarousel, 180);
});
