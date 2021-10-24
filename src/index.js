/** @format */

let data;
document.getElementById("search").addEventListener("click", handleSearch);
document.getElementById("img").addEventListener("mouseenter", handleImgEnter);
document.getElementById("img").addEventListener("mouseleave", handleImgLeave);
const baseURL = "https://localhost:3000/";
let username = "";
if (localStorage.username) {
    username = localStorage.username;
    document.getElementById("username").innerText = username;
    document.getElementById("login").classList.add("hide");
    document.getElementById("logout").classList.remove("hide");
    document.getElementById("usernameInput").classList.add("hide");
} else {
    document.getElementById("logout").classList.add("hide");
}
const getChar = async (baseURL, name = "") => {
    try {
        const response = await axios.get(baseURL + "pokemon/" + name);
        const json = response.data;
        return json;
    } catch (error) {
        return undefined;
    }
};
async function manageDisplayResult(searchName) {
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
        let typeElem = createElement("button", [line.type.name]);
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
    displayThisPokemon(e.target.innerText);
}
async function displayThisType(type) {
    return await ListFromType(await getChar(baseURL + "?limit=1000"), type);
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
    document.getElementById("username").innerText = "hello " + username;
    togglelogInOut();
}
function logout() {
    username = "";
    localStorage["username"] = "";
    document.getElementById("username").innerText = username;
    togglelogInOut();
}

function togglelogInOut() {
    document.getElementById("login").classList.toggle("hide");
    document.getElementById("logout").classList.toggle("hide");
    document.getElementById("usernameInput").classList.toggle("hide");
}
