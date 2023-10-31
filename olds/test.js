let counter = 0;
let proCount = 0;
let lastScrollTime = 0;
const debounceDelay = 860;
let isCustomScrollActive = true;

function handleRotation(event) {
  // Prevent default scroll as long as we're doing custom scroll
  if (isCustomScrollActive) {
    event.preventDefault();
  }

  const currentTime = new Date().getTime();

  console.log(currentTime - lastScrollTime);

  if (currentTime - lastScrollTime < debounceDelay) {
    return;
  }

  const deltaY = event.originalEvent
    ? event.originalEvent.deltaY
    : event.deltaY;

  if (deltaY > 0 && proCount < 7) {
    counter += 45;
    proCount++;
  } else if (deltaY < 0 && proCount > 0) {
    counter -= 45;
    proCount--;
  } else {
    isCustomScrollActive = false;
    gsap.utils.toArray(".scroll-container").forEach((elem) => {
      elem.removeEventListener("wheel", handleRotation);
    });
    return;
  }

  gsap.to(".main_box", {
    duration: 0.25,
    rotation: counter,
    ease: "power2.out",
  });

  gsap.utils.toArray(".proBox").forEach((box, index) => {
    if (index === proCount) {
      box.classList.add("active");
    } else {
      box.classList.remove("active");
    }
  });

  lastScrollTime = currentTime;
}

// GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const toggleCustomScroll = (state) => {
  if (state) {
    gsap.utils.toArray(".scroll-container").forEach((elem) => {
      elem.addEventListener("wheel", handleRotation);
    });
  } else {
    gsap.utils.toArray(".scroll-container").forEach((elem) => {
      elem.removeEventListener("wheel", handleRotation);
    });
  }
};

ScrollTrigger.create({
  trigger: ".scroll-content",
  pin: true,
  start: "top top",
  end: "bottom 50%",
  markers: true,
  anticipatePin: 1,
  onEnter: () => {
    isCustomScrollActive = true;
    toggleCustomScroll(true);
  },
  onLeaveBack: () => {
    isCustomScrollActive = true;
    toggleCustomScroll(false);
  },
  onLeave: () => {
    isCustomScrollActive = true;
    toggleCustomScroll(false);
  },
  onEnterBack: () => {
    isCustomScrollActive = true;
    toggleCustomScroll(true);
  },
});
