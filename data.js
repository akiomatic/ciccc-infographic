const moob = [];
const details = [];

const names = [];
const categories = {};

const cates = fetch("mobs.json")
  .then((response) => response.json())
  .then((data) => {
    return data;
  });

cates.then((result) => {
  const body = document.querySelector("#categories");

  let firstMob;

  for (const cat in result) {
    let data = result[cat];
    const name = cat.toLowerCase();
    const title = data["Title"];
    const descriptipn = data["Description"];

    let html = ``;
    html += `<div id="${name}" class="category"> <section class="category-title">${title}</section> <section class="category-introduction">${descriptipn}</section> <div class="mobs"> <div class="mob-carousel"> <div clas="gallery"> <ul id="${name}-cards" class="cards">`;

    data = data["Mobs"];

    const mobs = {};

    for (const mob in data) {
      if (Object.hasOwnProperty.call(data, mob)) {
        const element = data[mob];

        html += `<li><img src="assets/image/${mob
          .toLocaleLowerCase()
          .replaceAll(" ", "")}.png" alt="Mob image of ${mob}"></li>`;

        console.log(mob, element);

        mobs[mob] = element;
      }
    }

    names.push(name);
    categories[name] = mobs;

    firstMob = mobs[Object.keys(mobs)[0]];

    html += `</ul> </div> <div class="drag-proxy"></div> </div> <div class="mob-description"> <div class="name fade-effect"> <p id="name" class="fade-effect">${
      Object.keys(mobs)[0]
    }</p> </div> <div class="mob-information"> <!-- Health --> <p class="mob-information-field">Health:</p> <p id="health" class="mob-information-value fade-effect">${
      firstMob.HP
    }</p> <!-- Type --> <p class="mob-information-field">Type:</p> <p id="type" class="mob-information-value fade-effect">${
      firstMob.Classification
    }</p> <!-- Detail --> <p class="mob-information-field">Detail:</p> <p id="detail" class="mob-information-value fade-effect">${
      firstMob.Description
    }</p> <!-- Trivia --> <p class="mob-information-field">Trivia:</p> <p id="trivia" class="mob-information-value fade-effect">${
      firstMob.Trivia
    }</p> </div> </div> </div> </div>`;

    body.innerHTML += html;
  }
});

// // Function to log current scroll position
// function logScrollPosition() {
//   var scrollX = window.scrollX; // Horizontal scroll position
//   var scrollY = window.scrollY; // Vertical scroll position
//   console.log("Scroll position - X: " + scrollX + ", Y: " + scrollY);
// }

// // Add the event listener
// window.addEventListener("scroll", logScrollPosition);

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

function changeContent(parentElement, ids, newContent) {
  let section = document.getElementById(parentElement);

  console.log(newContent);

  ids.forEach((id, index) => {
    let element = section.querySelector("#" + id);
    // console.log(index, element);
    element.classList.add("fade-out");
  });

  setTimeout(() => {
    ids.forEach((id, index) => {
      let element = section.querySelector("#" + id);
      element.innerHTML = "";

      element = section.querySelector("#" + id);

      element.innerHTML = newContent[index];

      element.classList.remove("fade-out");
      element.classList.add("fade-in");
    });

    setTimeout(() => {
      ids.forEach((id, index) => {
        let element = section.querySelector("#" + id);
        element.classList.remove("fade-in");
      });
    }, 300);
  }, 300);
}
