/** @format */
let username = "";
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
let data;
document.getElementById("search").addEventListener("click", handleSearch);
document.getElementById("img").addEventListener("mouseenter", handleImgEnter);
document.getElementById("img").addEventListener("mouseleave", handleImgLeave);

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
axios.defaults.headers.common["username"] = username;
async function isCought(pokemon) {
    let res = await catchPokemon(pokemon);
    if (res.status === 200) return true;
    return false;
}
async function catchPokemon(pokemon) {
    try {
        const res = await axios.put(
            `http://localhost:5000/pokemon/catch/${pokemon}`
        );
        return res;
    } catch (err) {
        console.log(err.status);
    }
}
async function log() {
    console.log(await catchPokemon("pika"));
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
function handleSearch() {
    displayThisPokemon(document.getElementById("name").value.toLowerCase());
}
function displayThisPokemon(name) {
    manageDisplayResult(name.toLowerCase());
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
    //if(isCatched())
}

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
async function ListFromType(result, type) {
    let list = [];
    for (let pokemon of result.results) {
        result = await getChar(pokemon.url, "");
        let listOfTypes = [];
        for (let Type in result.types) {
            listOfTypes.push(result.types[Type].type.name);
        }
        if (listOfTypes.includes(type)) list.push(result.name);
    }
    return list;
}
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
    response = await getChar("https://pokeapi.co/api/v2/pokemon/?limit=1000");
    list = await ListFromType(response, type);
    return list;
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
    username = document.getElementById("usernameInput").value;
    localStorage["username"] = username;
    document.getElementById("title").innerText = username + "'s pokedex";
    togglelogInOut();
}
function logout() {
    username = "";
    localStorage["username"] = "";
    document.getElementById("title").innerText = username + "pokedex";
    togglelogInOut();
}

function togglelogInOut() {
    // document.getElementById("info").classList.toggle("hide");
    document.getElementById("login").classList.toggle("hide");
    document.getElementById("logout").classList.toggle("hide");
    document.getElementById("usernameInput").classList.toggle("hide");
}
