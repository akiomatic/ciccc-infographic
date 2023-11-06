gsap.registerPlugin(ScrollTrigger, Draggable);

const delays = 0.3;

function initGallery(gagaga, parentIndex) {
  gsap.set(gagaga, { autoAlpha: 1 });

  const indicator = document.getElementById(gagaga.id + "-indicator");

  /**
   * The number of iterations that have occurred.
   * Incremented when the user scrolls past the end of the gallery.
   * @type {number}
   */
  let iteration = 0;

  /**
   * The current index of the card that is being displayed.
   * @type {number}
   */
  let currentIndex = 0;

  // Set the initial content by making all the cards invisible
  gsap.set(gagaga.querySelectorAll(".cards li"), {
    yPercent: 400,
    opacity: 0,
    scale: 0,
  });

  // Set the spacing between the cards
  const spacing = 0.2;

  // Return a function that, when called with a numerical value, will round that value to the nearest multiple of a specified "snap" value.
  // Ex) snapTime(0.3) returns 0.4, snapTime(4.198) returns 4.2, etc.
  const snapTime = gsap.utils.snap(spacing);

  // Get the cards and create an array of them
  const cards = gsap.utils.toArray(gagaga.querySelectorAll(".cards li"));

  indicator.style.width = (1 / cards.length) * 100 + "%";

  // Create a timeline that will be used to animate the cards
  // This function will get called for each element in the buildSeamlessLoop() function, and we just need to return an animation that'll get inserted into a master timeline, spaced
  const animateFunc = (element) => {
    const tl = gsap.timeline();
    tl.fromTo(
      element,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        zIndex: 100,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: "power1.in",
        immediateRender: false,
      }
    ).fromTo(
      element,
      { yPercent: 400 },
      {
        yPercent: -400,
        duration: 1,
        ease: "none",
        immediateRender: false,
      },
      0
    );
    return tl;
  };
  const seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc);

  // To
  const playhead = { offset: 0 };
  const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());
  const scrub = gsap.to(playhead, {
    offset: 0,
    onUpdate() {
      seamlessLoop.time(wrapTime(playhead.offset));
    },
    duration: 0.5,
    ease: "power3",
    paused: true,
  });
  let previous = true;
  const trigger = ScrollTrigger.create({
    trigger: gagaga,
    start: "top top",
    ends: " bottom bottom",
    markers: true,
    onUpdate: function (self) {
      // let scroll = self.scroll();
      const offset = (iteration + self.progress) * seamlessLoop.duration();

      // Move the playhead to the specified offset on the timeline.
      // For more detail: https://gsap.com/docs/v3/GSAP/UtilityMethods/snap()#2-snapsnapincrement
      let snappedTime = snapTime(offset - delays);

      // Calculate the progress of the current card
      let progress = Math.min(
        (snappedTime - (seamlessLoop.duration() - delays * 2) * iteration) /
          (seamlessLoop.duration() - delays * 2),
        2
      );

      if (offset < delays) return;

      let shouldUpdate =
        seamlessLoop.duration() - delays - spacing - offset > 0;

      if (shouldUpdate) {
        scrub.vars.offset = offset;
        previous = true;
      } else if (previous) {
        scrub.vars.offset = offset;
        previous = false;
      }
      scrub.invalidate().restart();

      // Calculate the index of the current card by multiplying the progress by the number of cards
      let index = Math.abs(Math.ceil(progress * (cards.length - 1)));

      if (index > cards.length - 1) return;

      indicator.style.width = ((index + 1) / cards.length) * 100 + "%";

      if (currentIndex !== index) {
        currentIndex = index;

        const categoryName = names[parentIndex];
        const mobDetail =
          categories[categoryName][
            Object.keys(categories[categoryName])[index]
          ];

        changeContent(
          categoryName,
          ["name", "health", "type", "detail", "trivia"],
          [
            Object.keys(categories[categoryName])[index],
            mobDetail.HP,
            mobDetail.Classification,
            mobDetail.Description,
            mobDetail.Trivia,
          ]
        );
      }
    },
    onLeaveBack: ({ progress, direction, isActive }) => {
      scrollToOffset(scrub.vars.offset);
    },
    onLeave: ({ progress, direction, isActive }) => {
      scrollToOffset(scrub.vars.offset);
    },
    pin: true,
  });

  // converts a progress value (0-1, but could go outside those bounds when wrapping) into a "safe" scroll value that's at least 1 away from the start or end because we reserve those for sensing when the user scrolls ALL the way up or down, to wrap.
  const progressToScroll = (progress) => {
    const actualScrollY =
      trigger.start +
      1 +
      (trigger.end - 1 - trigger.start + 1) *
        (delays / seamlessLoop.duration());
    const actualEndScrollY =
      trigger.end -
      1 -
      (trigger.end - 1 - trigger.start + 1) *
        (delays / seamlessLoop.duration());

    let a = gsap.utils.clamp(
      trigger.start + 1,
      trigger.end - 1,
      gsap.utils.wrap(0, 1, progress) * (actualEndScrollY - actualScrollY) +
        actualScrollY
    );

    return a;
  };

  const wrap = (iterationDelta, scrollTo) => {
    iteration += iterationDelta;
    trigger.scroll(scrollTo);
    trigger.update();
  };

  // when the user stops scrolling, snap to the closest item
  ScrollTrigger.addEventListener("scrollEnd", () => {
    scrollToOffset(scrub.vars.offset);
  });

  // feed in an offset (like a time on the seamlessLoop timeline, but it can exceed 0 and duration() in either direction; it'll wrap) and it'll set the scroll position accordingly. That'll call the onUpdate() on the trigger if there's a change.
  function scrollToOffset(offset) {
    if (!trigger.isActive) {
      return;
    }

    if (offset < delays) {
      return;
    }

    // Move the playhead to the specified offset on the timeline.
    // For more detail: https://gsap.com/docs/v3/GSAP/UtilityMethods/snap()#2-snapsnapincrement
    let snappedTime = snapTime(offset - delays);

    // Calculate the progress of the current card
    let progress = Math.min(
      (snappedTime - (seamlessLoop.duration() - delays * 2) * iteration) /
        (seamlessLoop.duration() - delays * 2),
      2
    );

    // Calculate the scroll position to move to based on the progress
    let scroll = progressToScroll(progress);

    trigger.scroll(scroll);
  }

  function buildSeamlessLoop(items, spacing, animateFunc) {
    let rawSequence = gsap.timeline({ paused: true }),
      seamlessLoop = gsap.timeline({
        paused: true,
        onRepeat() {
          this._time === this._dur && (this._tTime += this._dur - 0.01);
        },
        onReverseComplete() {
          this.totalTime(this.rawTime() + this.duration() * 100);
        },
      }),
      // ex) if spacing is 0.4 and the length of items is 5, we'll have 2 "extra" animations on either side of the start/end to accommodate the seamless looping
      cycleDuration = spacing * items.length,
      dur;
    items.forEach((item, i) => {
      let anim = animateFunc(items[i % items.length]);
      rawSequence.add(anim, i * spacing);
      dur || (dur = anim.duration());
    });

    seamlessLoop
      .to({}, { duration: delays })
      .fromTo(
        rawSequence,
        {
          time: 0.5,
        },
        {
          time: "+=" + cycleDuration,
          duration: cycleDuration,
          ease: "none",
        }
      )
      .to({}, { duration: delays });

    return seamlessLoop;
  }

  // below is the dragging functionality (mobile-friendly too)...
  Draggable.create(gagaga.querySelector(".drag-proxy"), {
    type: "y",
    trigger: ".cards",
    onPress() {
      this.startOffset = scrub.vars.offset;
    },
    onDrag() {
      scrub.vars.offset = this.startOffset + (this.startY - this.y) * 0.001;
      scrub.invalidate().restart();
    },
    onDragEnd() {
      scrollToOffset(scrub.vars.offset);
    },
  });
}

document.addEventListener("DOMContentLoaded", function () {
  let galleries = document.querySelectorAll(".category");
  galleries.forEach((gallery, i) => {
    initGallery(gallery, i);
  });
});
