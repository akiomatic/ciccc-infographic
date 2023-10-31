const moob = [];
const details = [];

const categories = fetch("mobs.json")
  .then((response) => response.json())
  .then((data) => {
    return data["Passive"];
    // const container = document.getElementById("dataContainer");
    // container.innerHTML = `
    //       <p>Name: ${data.name}</p>
    //       <p>Age: ${data.age}</p>
    //       <p>Address: ${data.address}</p>
    //   `;
  });

categories.then((data) => {
  for (const mob in data) {
    if (Object.hasOwnProperty.call(data, mob)) {
      const element = data[mob];

      const container = document.getElementById("passive-cards");
      container.innerHTML += `<li><img src="assets/image/${mob.toLocaleLowerCase()}.png" alt="""></li>`;
      moob.push(mob);
      details.push(element);
    }
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
