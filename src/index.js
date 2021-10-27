/** @format */

let username = "";

let allCought = [];
if (localStorage.username) {
    username = localStorage.username;
    document.getElementById("title").innerText = username + "'s pokedex";
    document.getElementById("login").classList.add("hide");
    document.getElementById("logout").classList.remove("hide");
    document.getElementById("usernameInput").classList.add("hide");
} else {
    document.getElementById("logout").classList.add("hide");
}
const baseURL = "http://localhost:5000/pokemon/get/";
const Headers = {
    username: username,
};
axios.defaults.headers.common["username"] = username;
let data;
document.getElementById("search").addEventListener("click", handleSearch);
document.getElementById("img").addEventListener("mouseenter", handleImgEnter);
document.getElementById("img").addEventListener("mouseleave", handleImgLeave);
document
    .getElementById("showAllCought")
    .addEventListener("click", showAllCought);
getAllCought();
showAllCought();
async function getChar(baseURL, name = "") {
    try {
        const response = await axios.get(baseURL + name, {
            username: username,
        });

        const json = response.data;
        return json;
    } catch (error) {
        return undefined;
    }
}

function isCought(chek) {
    for (let pokemon of allCought) {
        if (chek === pokemon.name) return true;
    }
    return false;
}
async function handleRelesePokemon() {
    await relesePokemon(data.pokemonName);
}
async function relesePokemon(pokemon) {
    try {
        const res = await axios.delete(
            `http://localhost:5000/pokemon/release/${pokemon}`
        );
        return res;
    } catch (err) {
        console.log(err.status);
    }
    getAllCought();
}

function handleCatchPokemon() {
    catchPokemon(data.pokemonName);
}
async function catchPokemon(pokemon) {
    try {
        const char = await getChar(baseURL, pokemon);
        const res = await axios.put(
            `http://localhost:5000/pokemon/catch/${pokemon}`,
            char
        );
        return res;
    } catch (err) {}
    getAllCought();
}
async function getAllCought() {
    let res = await axios.get(`http://localhost:5000/pokemon`);
    allCought = res.data;
}
async function showAllCought() {
    await getAllCought();
    cleanBoard();
    let container = document.getElementById("allCought");
    for (let pokemon of allCought) {
        try {
            let pic = createElement("img", []);
            pic.setAttribute("src", pokemon.front_pic);

            let elem = createElement("div", [pokemon.name, pic]);

            container.append(elem);
        } catch (err) {
            console.log(err);
        }
    }
}

async function manageDisplayResult(searchName) {
    cleanBoard();
    result = await getChar(baseURL, searchName); // because the api gets only lower cased name

    if (!result) {
        data = {};
        displayResult(undefined);
        return;
    } else {
        data = {
            height: result.height,
            weight: result.weight,
            pokemonName: result.name,
            frontImg: result["front_pic"],
            backImg: result["back_pic"],
            types: result.types,
            abilities: result.abilities,
        };

        displayResult(data);
    }
}
async function handleSearch() {
    await getAllCought();
    displayThisPokemon(document.getElementById("name").value.toLowerCase());
}
function displayThisPokemon(name) {
    manageDisplayResult(name.toLowerCase());
}

async function loadPokimons() {
    let ALL = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=1000");
    for (let pokemon in ALL) {
        console.log(pokemon.name);
        // let list = [];
        // let newPok = axios.get(baseURL + pokemon.name, {
        //     username: username,
        // });
        // newPok.then((pok) => {
        //     console.log(pok);
        // });
    }
}

function displayResult(data) {
    if (!data) {
        document.getElementById("error").innerText = "No such pokimon exsist!";
        return;
    }
    showInfo();
}
function showInfo() {
    document.getElementById("types").append("Types: ");
    for (let line of data.types) {
        let typeElem = createElement("button", [line]);
        typeElem.addEventListener("click", handleshowThisType);
        document.getElementById("types").append(typeElem);
    }
    document.getElementById("pokemonName").innerText +=
        "Name: " + data["pokemonName"];
    document.getElementById("height").innerText += "Height: " + data["height"];
    document.getElementById("weight").innerText += "weight: " + data["weight"];
    document.getElementById("img").setAttribute("src", data.frontImg);

    let catchBtn = createElement("button");
    if (isCought(data["pokemonName"])) {
        catchBtn.innerText = "relese";
        catchBtn.addEventListener("click", handleRelesePokemon);
    } else {
        catchBtn.innerText = "catch";
        catchBtn.addEventListener("click", handleCatchPokemon);
    }
    document.getElementById("catch").append(catchBtn);
}

function handleImgEnter() {
    document.getElementById("img").setAttribute("src", data.backImg);
}
function handleImgLeave() {
    document.getElementById("img").setAttribute("src", data.frontImg);
}
function handleshowThisType(e) {
    document.getElementById("catch").innerHTML = "";
    document.getElementById("sameType").innerText = "";
    showThisType(e.target.innerText);
}
async function ListFromType(result, type) {
    let list = [];
    for (let pokemon of result.results) {
        pokemon = await getChar(pokemon.url, "");

        let listOfTypes = [];
        for (let type of pokemon.types) {
            listOfTypes.push(type.type.name);
        }
        if (listOfTypes.includes(type)) {
            list.push(pokemon.name);
        }
    }
    return list;
}
// let list = [];
// for (let pokemon of result.results) {
//     result = getChar(pokemon.url, "");
//     result.then((pokemon) => {
//         let listOfTypes = [];
//         for (let Type in pokemon.types) {
//             listOfTypes.push(pokemon.types[Type].type.name);
//         }
//         if (listOfTypes.includes(type)) list.push(pokemon.name);
//     });
// }
// return list;

async function showThisType(type) {
    let list = await getList(type);
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        let typeElem = createElement("div", [element]);
        typeElem.addEventListener("click", handleDisplayFromList);
        document.getElementById("sameType").append(typeElem);
    }
}

function handleDisplayFromList(e) {
    displayThisPokemon(e.target.innerText);
}
async function getList(type) {
    response = await getChar("https://pokeapi.co/api/v2/pokemon/?limit=100");
    list = await ListFromType(response, type);
    return list;
}
document.getElementById("hideAllCought").addEventListener("click", hideCought);
function hideCought() {
    document.getElementById("allCought").innerHTML = "";
}
function cleanBoard() {
    document.getElementById("name").value = "";
    document.getElementById("types").innerHTML = "";
    document.getElementById("pokemonName").innerText = "";
    document.getElementById("height").innerText = "";
    document.getElementById("weight").innerText = "";
    document.getElementById("img").setAttribute("src", "");
    document.getElementById("error").innerText = "";
    document.getElementById("sameType").innerText = "";
    document.getElementById("catch").innerHTML = "";
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
document.getElementById("login").addEventListener("click", login);
document.getElementById("logout").addEventListener("click", logout);
function login() {
    document.getElementById("catch").innerHTML = "";
    username = document.getElementById("usernameInput").value;
    localStorage["username"] = username;
    document.getElementById("title").innerText = username + "'s pokedex";
    axios.defaults.headers.common["username"] = username;
    getAllCought();
    togglelogInOut();
}
function logout() {
    document.getElementById("catch").innerHTML = "";
    username = "";
    localStorage["username"] = "";
    document.getElementById("title").innerText = username + "pokedex";
    axios.defaults.headers.common["username"] = username;
    togglelogInOut();
}

function togglelogInOut() {
    document.getElementById("infoSec").classList.toggle("hide");
    document.getElementById("login").classList.toggle("hide");
    document.getElementById("logout").classList.toggle("hide");
    document.getElementById("usernameInput").classList.toggle("hide");
}
