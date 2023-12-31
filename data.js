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
  // const body = document.querySelector(".footer");

  let firstMob;

  for (const cat in result) {
    let data = result[cat];
    const name = cat.toLowerCase();
    const title = data["Title"];
    const descriptipn = data["Description"];

    let html = ``;
    html += `<div id="${name}" class="category"> <section class="category-title">${title}</section> <section class="category-introduction">${descriptipn}</section> <div class="mobs"> <div class="indicator" id="${name}-indicator"></div> <div class="mob-carousel"> <div clas="gallery"> <ul id="${name}-cards" class="cards">`;

    data = data["Mobs"];

    const mobs = {};

    for (const mob in data) {
      if (Object.hasOwnProperty.call(data, mob)) {
        const element = data[mob];

        html += `<li><img src="/image/${mob
          .toLocaleLowerCase()
          .replaceAll(" ", "")}.webp" alt="Mob image of ${mob}"></li>`;

        mobs[mob] = element;
      }
    }

    names.push(name);
    categories[name] = mobs;

    firstMob = mobs[Object.keys(mobs)[0]];

    html += `</ul> </div> <div class="drag-proxy"></div> </div> <div class="mob-description"> <div class="name fade-effect"> <p id="name" class="fade-effect">${
      Object.keys(mobs)[0]
    }</p> </div> <div class="mob-information"> <!-- Health --> <p class="mob-information-field">Health:</p> <div id="health" class="mob-information-value fade-effect"> ${formatHealthDisplay(
      firstMob.HP
    )} </div> <!-- Type --> <p class="mob-information-field">Type:</p> <p id="type" class="mob-information-value fade-effect">${
      firstMob.Classification
    }</p> <!-- Detail --> <p class="mob-information-field">Detail:</p> <p id="detail" class="mob-information-value fade-effect">${
      firstMob.Description
    }</p> <!-- Trivia --> <p class="mob-information-field">Trivia:</p> <p id="trivia" class="mob-information-value fade-effect">${
      firstMob.Trivia
    }</p> </div> </div> </div> </div>`;

    body.innerHTML += html;
    // body.insertAdjacentHTML("beforebegin", html);
  }
});

function formatHealthDisplay(hp) {
  let output = "",
    number,
    full,
    fullHearts,
    halfHeart;
  const hps = hp.split("-");
  for (let i = 0; i < hps.length; i++) {
    hp = hps[i];
    number = `<p>${hp}</p> <div class="bracket-start">(</div>`;

    full = `<i class="bi-heart-fill"></i>`;
    fullHearts = Math.round((hp / 2) * 100) / 100;
    halfHeart = fullHearts % 1 !== 0 ? `<i class="bi-heart-half"></i>` : "";

    if (hp <= 10) {
      number += `${full.repeat(fullHearts)}${halfHeart}`;
    } else {
      number += `${full} <div>&nbsp;&nbsp;x&nbsp;&nbsp;${fullHearts}</div>`;
    }

    number += `<div class="bracket-end">)</div>`;
    output += number;

    if (hps.length > 1 && i !== hps.length - 1) {
      output += `<div class="bracket-separator">${
        hps.length === 2 ? "to" : "-"
      }</div>`;
    }
  }

  return output;
}

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

function changeContent(parentElement, ids, newContent) {
  let section = document.getElementById(parentElement);

  ids.forEach((id, index) => {
    let element = section.querySelector("#" + id);
    element.classList.add("fade-out");
  });

  setTimeout(() => {
    ids.forEach((id, index) => {
      let element = section.querySelector("#" + id);
      element.innerHTML = "";

      element = section.querySelector("#" + id);

      element.innerHTML =
        id === "health"
          ? formatHealthDisplay(newContent[index])
          : newContent[index];

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
