let data;
document
  .getElementById("search")
  .addEventListener("click", handleDisplayResult);
const baseURL = "https://pokeapi.co/api/v2/pokemon/";

const getChar = async (baseURL, name = "") => {
  try {
    const response = await axios.get(baseURL + name);
    const json = response.data;
    return json;
  } catch (error) {
    return undefined;
  }
};

async function handleDisplayResult() {
  const searchName = document.getElementById("name").value.toLowerCase();
  cleanBoard();
  result = await getChar(baseURL, searchName + "/"); // because the api gets only lower cased name
  if (!result) {
    data = {};
    displayResult(undefined);
    return;
  } else {
    data = {
      height: result.height,
      weight: result.weight,
      pokemonName: result.name,
      frontImg: result.sprites["front_default"],
      backImg: result.sprites["back_default"],
      types: result.types,
    };
    displayResult(data);
  }
}
async function handleDisplayResultFromList(name) {
  cleanBoard();
  const searchName = name.toLowerCase(); //the api gets only lower cased name
  result = await getChar(baseURL, searchName + "/");
  if (!result) {
    data = {};
    displayResult(undefined);
    return;
  } else {
    data = {
      height: result.height,
      weight: result.weight,
      pokemonName: result.name,
      frontImg: result.sprites["front_default"],
      backImg: result.sprites["back_default"],
      types: result.types,
    };
    displayResult(data);
  }
}

function displayResult(data) {
  if (!data) {
    document.getElementById("error").innerText = "No such pokimon exsist!";
    return;
  }
  document.getElementById("types").append("Types: ");
  for (let line of data.types) {
    let typeElem = createElement("button", [line.type.name]);
    typeElem.addEventListener("click", handleshowThisType);
    document.getElementById("types").append(typeElem);
  }
  showInfo();
}
function showInfo() {
  document.getElementById("pokemonName").innerText +=
    "Name: " + data["pokemonName"];
  document.getElementById("height").innerText += "Height: " + data["height"];
  document.getElementById("weight").innerText += "weight: " + data["weight"];
  document.getElementById("img").setAttribute("src", data.frontImg);
}
document.getElementById("img").addEventListener("mouseenter", handleImgEnter);
document.getElementById("img").addEventListener("mouseleave", handleImgLeave);
function handleImgEnter() {
  document.getElementById("img").setAttribute("src", data.backImg);
}
function handleImgLeave() {
  document.getElementById("img").setAttribute("src", data.frontImg);
}
function handleshowThisType(e) {
  document.getElementById("sameType").innerText = "";
  showThisType(e.target.innerText);
}
async function getFullList(result, type) {
  let list = [];
  for (let pokemon of result.results) {
    getChar(pokemon.url, "").then((result) => {
      let listOfTypes = [];
      for (let Type in result.types) {
        listOfTypes.push(result.types[Type].type.name);
      }
      if (listOfTypes.includes(type)) list.push(result.name);
    });
  }

  return list;
}
async function showThisType(type) {
  let list = await displayThisType(type);
  displayThisType(type).then(() => {
    for (let pokemon of list) {
      let typeElem = createElement("div", [pokemon]);
      typeElem.addEventListener("click", handleDisplayFromList);
      document.getElementById("sameType").append(typeElem);
    }
  });
}
function handleDisplayFromList(e) {
  let name = e.target.innerText;
  handleDisplayResultFromList(name);
}
async function displayThisType(type) {
  const result = await getChar(baseURL + "?limit=1000");
  //console.log(result);
  return await getFullList(result, type);
}
function cleanBoard() {
  // document.getElementById("info").innerText = "";
  document.getElementById("name").value = "";
  document.getElementById("types").innerHTML = "";
  document.getElementById("pokemonName").innerText = "";
  document.getElementById("height").innerText = "";
  document.getElementById("weight").innerText = "";
  document.getElementById("img").setAttribute("src", "");
  document.getElementById("error").innerText = "";
  document.getElementById("sameType").innerText = "";
}

function createElement(
  tagname,
  children = [],
  classes = [],
  attributes,
  events
) {
  //the most generic element builder.
  //we will build all the elements here.

  const el = document.createElement(tagname);

  //children

  for (let child of children) {
    if (typeof child === "string" || typeof child === "number") {
      child = document.createTextNode(child);
    }
    el.appendChild(child);
  }

  //classes

  for (const cls of classes) {
    el.classList.add(cls);
  }

  //attrubutes

  for (const attr in attributes) {
    el.setAttribute(attr, attributes[attr]);
  }

  //attrubutes

  for (const event in events) {
    el.addEventListener(event, events[event]);
  }

  return el;
}
