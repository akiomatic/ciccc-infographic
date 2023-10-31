gsap.registerPlugin(ScrollTrigger, Draggable);

const delays = 0.3;

function initGallery(gagaga, parentIndex) {
  gsap.set(gagaga, { autoAlpha: 1 });

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
  const trigger = ScrollTrigger.create({
    trigger: gagaga,
    start: "top top",
    ends: " bottom bottom",
    markers: true,
    onEnter: () => {
      setTimeout(() => {
        // your animation logic here
      }, 3000); // wait for 3 seconds before starting
    },
    onUpdate: function (self) {
      let scroll = self.scroll();

      // console.log(self.progress, scroll);

      // console.log(self);

      const offset = (iteration + self.progress) * seamlessLoop.duration();

      if (
        offset < delays ||
        offset > seamlessLoop.duration() - delays - spacing
      ) {
        return;
      } else {
        scrub.vars.offset = offset;
        scrub.invalidate().restart();
      }

      // if (scroll > self.end - 1) {
      //   console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      //   // console.log("scroll", scroll, self.end - 1);
      //   // wrap(1, 1);
      //   // console.log("wrap", 1, 1);
      // } else if (scroll < 1 && self.direction < 0) {
      //   // wrap(-1, self.end - 1);
      // } else {
      //   console.log("offset", scrub.vars.offset);
      //   scrub.invalidate().restart();
      // }

      const total = self.end - self.start;

      // calculate the actualy scroll y position after the delay
      const actualScrollY = scroll + total * (delays / seamlessLoop.duration());

      // console.log("actualScrollY", actualScrollY, scroll);

      // その他の通常のスクロール更新ロジック
      // ...
    },
    // onUpdate(self) {
    //   let scroll = self.scroll();

    //   // console.log("scroll");
    //   if (scroll > self.end - 1) {
    //     // console.log("scroll", scroll, self.end - 1);
    //     // wrap(1, 1);
    //     // console.log("wrap", 1, 1);
    //   } else if (scroll < 1 && self.direction < 0) {
    //     wrap(-1, self.end - 1);
    //   } else {
    //     scrub.vars.offset =
    //       (iteration + self.progress) * (seamlessLoop.duration() - 0.5);
    //     scrub.invalidate().restart(); // to improve performance, we just invalidate and restart the same tween. No need for overwrites or creating a new tween on each update.
    //   }
    // },
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

    // console.log(
    //   "start",
    //   actualScrollY,
    //   "end",
    //   actualEndScrollY,
    //   "progress",
    //   progress
    // );

    let a = gsap.utils.clamp(
      trigger.start + 1,
      trigger.end - 1,
      gsap.utils.wrap(0, 1, progress) * (actualEndScrollY - actualScrollY) +
        actualScrollY
    );

    // a = actualEndScrollY - actualScrollY + actualScrollY;

    console.log("test", progress, a);

    // console.log(
    //   "test",
    //   "start",
    //   trigger.start,
    //   "end",
    //   trigger.end,
    //   "actual Y",
    //   actualScrollY,
    //   "actual end Y",
    //   actualEndScrollY,
    //   "progress",
    //   progress,
    //   "scroll",
    //   a
    // );

    // Calculate the index of the current card by multiplying the progress by the number of cards
    let index = Math.abs(Math.ceil(progress * (cards.length - 1)));

    if (currentIndex !== index) {
      currentIndex = index;
      // console.log("The card is now ", index);

      changeContent(
        parentIndex === 0 ? "passive" : "active",
        ["name", "health", "type", "detail", "trivia"],
        [
          moob[index],
          details[index].HP,
          details[index].Classification,
          details[index].Description,
          details[index].Trivia,
        ]
      );
    }

    // calculate the index of the current card by multiplying the progress by the number of cards
    // let index = Math.floor(progress * cards.length - 1);
    // console.log("index", index);
    // console.log("cards", cards[index]);

    return a;
  };

  // progressToScroll = (progress) =>
  //   gsap.utils.clamp(
  //     trigger.start,
  //     trigger.end - 1,
  //     gsap.utils.wrap(0, 1, progress) * trigger.end
  //   ),
  const wrap = (iterationDelta, scrollTo) => {
    iteration += iterationDelta;
    trigger.scroll(scrollTo);
    trigger.update(); // by default, when we trigger.scroll(), it waits 1 tick to update().
  };

  // when the user stops scrolling, snap to the closest item.
  ScrollTrigger.addEventListener("scrollEnd", () => {
    const offset = scrub.vars.offset;
    if (
      offset < delays ||
      offset > seamlessLoop.duration() - delays - spacing
    ) {
      console.log("test is stopping");
      return;
    }
    // console.log("test2", offset, seamlessLoop.duration() - delays - spacing);
    scrollToOffset(scrub.vars.offset);
  });

  // feed in an offset (like a time on the seamlessLoop timeline, but it can exceed 0 and duration() in either direction; it'll wrap) and it'll set the scroll position accordingly. That'll call the onUpdate() on the trigger if there's a change.
  function scrollToOffset(offset) {
    if (!trigger.isActive) {
      return;
    }

    if (offset < delays) {
      console.log("今はdelay中だよ");
      return;
    }

    // Move the playhead to the specified offset on the timeline.
    // For more detail: https://gsap.com/docs/v3/GSAP/UtilityMethods/snap()#2-snapsnapincrement
    let snappedTime = snapTime(offset - delays);

    // console.log("Snapped time", snappedTime + delays);

    //
    let progress = Math.min(
      (snappedTime - (seamlessLoop.duration() - delays * 2) * iteration) /
        (seamlessLoop.duration() - delays * 2),
      2
    );

    console.log("SnappedTime", offset - 0.25, snappedTime, progress);

    // console.log(
    //   "progress",
    //   progress,
    //   "test",
    //   scrub.vars.offset,
    //   seamlessLoop.duration(),
    //   seamlessLoop.duration() - delays * 2
    // );

    //  0 0.2 0.4 0.6 | 2 | 0 0.1 0.2 0.3

    // console.log("progress", progress);

    let scroll = progressToScroll(progress);

    // if (offset > delays && offset < seamlessLoop.duration() - delays) {
    //   console.log(
    //     "snappedTime",
    //     snappedTime,
    //     "seamlessLoop Duration",
    //     seamlessLoop.duration(),
    //     "progress",
    //     progress,
    //     "scroll",
    //     scroll
    //   );
    // }

    // if (progress >= 1 || progress < 0) {
    //   return wrap(Math.floor(progress), scroll);
    // }

    // console.log("Seamless loop duration", seamlessLoop.duration() - 0.5);
    // console.log("wrap", offset, snappedTime, progress, scroll);

    // console.log(
    //   "scroll",
    //   trigger.start,
    //   trigger.startY,
    //   trigger.startOffset,
    //   scroll
    // );

    // console.log(scroll);

    trigger.scroll(scroll);
  }

  function buildSeamlessLoop(items, spacing, animateFunc) {
    let rawSequence = gsap.timeline({ paused: true }), // this is where all the "real" animations live
      seamlessLoop = gsap.timeline({
        // this merely scrubs the playhead of the rawSequence so that it appears to seamlessly loop
        paused: true,
        // repeat: -1, // to accommodate infinite scrolling/looping
        onRepeat() {
          // works around a super rare edge case bug that's fixed GSAP 3.6.1
          this._time === this._dur && (this._tTime += this._dur - 0.01);
        },
        onReverseComplete() {
          this.totalTime(this.rawTime() + this.duration() * 100); // seamless looping backwards
        },
      }),
      // ex) if spacing is 0.4 and the length of items is 5, we'll have 2 "extra" animations on either side of the start/end to accommodate the seamless looping
      cycleDuration = spacing * items.length,
      dur;
    items
      // .concat(items)
      // .concat(items)
      .forEach((item, i) => {
        let anim = animateFunc(items[i % items.length]);
        // console.log("anim", rawSequence.duration());
        rawSequence.add(anim, i * spacing);
        console.log(anim, i, i * spacing);
        dur || (dur = anim.duration());
        console.log(item, i);
      });

    console.log(
      "circle duration",
      cycleDuration,
      dur,
      cycleDuration + dur,
      cycleDuration + dur / 2,
      cycleDuration + dur / 3
    );

    rawSequence.time(3);

    // cycleDuration += dur / 2;
    // console.log(
    //   "start",
    //   cycleDuration + dur / 2,
    //   "duration",
    //   cycleDuration,
    //   "+=" + cycleDuration
    // );

    const customDuration = rawSequence.duration() - 0.2;

    console.log("raw", rawSequence.duration(), cycleDuration);

    // animate the playhead linearly from the start of the 2nd cycle to its end (so we'll have one "extra" cycle at the beginning and end)
    seamlessLoop
      .to({}, { duration: delays })
      .fromTo(
        rawSequence,
        {
          time: 0.5, //cycleDuration + dur / 2,
        },
        {
          time: "+=" + cycleDuration,
          duration: cycleDuration,
          ease: "none",
        }
      )
      .to({}, { duration: delays });

    console.log(seamlessLoop.duration(), cycleDuration, dur);

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
      scrub.invalidate().restart(); // same thing as we do in the ScrollTrigger's onUpdate
    },
    onDragEnd() {
      scrollToOffset(scrub.vars.offset);
    },
  });
}

// if you want a more efficient timeline, but it's a bit more complex to follow the code, use this function instead...
// function buildSeamlessLoop(items, spacing, animateFunc) {
// 	let overlap = Math.ceil(1 / spacing), // number of EXTRA animations on either side of the start/end to accommodate the seamless looping
// 		startTime = items.length * spacing + 0.5, // the time on the rawSequence at which we'll start the seamless loop
// 		loopTime = (items.length + overlap) * spacing + 1, // the spot at the end where we loop back to the startTime
// 		rawSequence = gsap.timeline({paused: true}), // this is where all the "real" animations live
// 		seamlessLoop = gsap.timeline({ // this merely scrubs the playhead of the rawSequence so that it appears to seamlessly loop
// 			paused: true,
// 			repeat: -1, // to accommodate infinite scrolling/looping
// 			onRepeat() { // works around a super rare edge case bug that's fixed GSAP 3.6.1
// 				this._time === this._dur && (this._tTime += this._dur - 0.01);
// 			}
// 		}),
// 		l = items.length + overlap * 2,
// 		time, i, index;
//
// 	// now loop through and create all the animations in a staggered fashion. Remember, we must create EXTRA animations at the end to accommodate the seamless looping.
// 	for (i = 0; i < l; i++) {
// 		index = i % items.length;
// 		time = i * spacing;
// 		rawSequence.add(animateFunc(items[index]), time);
// 		i <= items.length && seamlessLoop.add("label" + i, time); // we don't really need these, but if you wanted to jump to key spots using labels, here ya go.
// 	}
//
// 	// here's where we set up the scrubbing of the playhead to make it appear seamless.
// 	rawSequence.time(startTime);
// 	seamlessLoop.to(rawSequence, {
// 		time: loopTime,
// 		duration: loopTime - startTime,
// 		ease: "none"
// 	}).fromTo(rawSequence, {time: overlap * spacing + 1}, {
// 		time: startTime,
// 		duration: startTime - (overlap * spacing + 1),
// 		immediateRender: false,
// 		ease: "none"
// 	});
// 	return seamlessLoop;
// }

document.addEventListener("DOMContentLoaded", function () {
  let galleries = document.querySelectorAll(".category");
  galleries.forEach((gallery, i) => {
    initGallery(gallery, i);
  });
});

function getElementAtPosition(x, y) {
  // Check if the provided coordinates are numbers and not outside the viewport
  if (typeof x !== "number" || typeof y !== "number") {
    console.error("Please provide valid numbers for x and y coordinates.");
    return null;
  }

  // Attempt to retrieve the element at the specified position
  var elementAtPosition = document.elementFromPoint(x, y);

  // elementFromPoint returns null if the specified point is outside the visible bounds of the document or on the browser's interface itself.
  if (elementAtPosition) {
    // console.log("Element found:", elementAtPosition);
    return elementAtPosition;
  } else {
    // console.log("No element found at position (" + x + ", " + y + ").");
    return null;
  }
}
