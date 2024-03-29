var pokemon = [];
var indexEdit = -1;

async function ajaxPromise(url, method, body) {
    return new Promise(function (resolve, reject) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    resolve(this.responseText);
                } else {
                    reject(this);
                }
            }
        };
        xhttp.open(method, url, true);
        xhttp.send(body);
    });
}

async function getObj(param) {

    var responseText = await ajaxPromise("https://proiect-final-df239.firebaseio.com/.json", "GET")
    window.pokemon = JSON.parse(responseText)
    if (param == "main") {
        console.log("ajunge in getObj main")
        draw()
        drawCarousel()
    } else if (param === "table") {
        console.log("ajunge in getObj table")
        drawTable()
    } else if (param === "cos") {
        console.log("ajunge in getObj cos")
        drawCos()
    } else if (param === "detalii") {
        console.log("ajunge in getObj detalii")
        drawDetalii()
    }
    console.log("obiectul inainte de cumpraturi  este: ", pokemon)

}

function hiddenDiv(idx) {
    document.querySelector(".alertDiv.divHidden").innerHTML = `ai pus in cos un ${pokemon[idx].name}`

    document.querySelector(".alertDiv").classList.remove("divHidden")
    setTimeout(() => {
        console.log("merge set timeout")
        document.querySelector(".alertDiv").classList.add("divHidden")
    }, 500) 
}


function draw() {
    var content = ""
    for (var i in pokemon) {
        content += `
        <div class="produseWrap">
        <div class="produse">
        
            <img src="${pokemon[i].scr}}" alt="">
            <h3>${pokemon[i].name} <br>
            </h3>
            <h3>${pokemon[i].price} $</h3>

            <button id="btnCumpUnProdus" onclick="adaugaInCos('${i}')">Cumpara</button>
            <button onclick="detaliiProba('${i}')"  type="button">Detalii</button>
        </div>
        <div class="container ${pokemon[i].tip}" style="position:absolute;"></div>
    </div>
                `
    }
    document.querySelector(".content").innerHTML = content
    document.querySelector(".loader").classList.add("hidden")
}

function detaliiProba(idx) {
    location.href = 'detalii.html'
    localStorage.setItem("idx", idx)
}

function drawTable() {
    var createRows = ''
    for (var i in pokemon) {
        createRows +=
            `<tr>
                <td  class="tableimg"> <img src= "${pokemon[i].scr}"> </td>
                <td class="tableName" onclick="detaliiProba('${i}')">${pokemon[i].name}</td>
                <td class="tableTip"> <div class="container ${pokemon[i].tip}"></div></td>
                <td class="tableTipTxt"> <div> ${pokemon[i].tip} </div></td>
                <td class="tablePrice">${pokemon[i].price}</td>
                <td class="tableCantitate">${pokemon[i].cantitate} buc</td>

                <td align="right">
                <div  id="${i}" class="editButton" onclick="edit('${i}')">  </div>
                <div  id="${i}" class="deleteButton" onclick="del('${i}')">  </div>
                </td>
            </tr>`
    }
    document.querySelector("table tbody").innerHTML = createRows
    document.querySelector(".loader").classList.add("hidden")
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function edit(idx) {
    showForm()
    topFunction()
    var form = document.querySelector("#myForm");
    form.querySelector("[name=\"numePokemon\"]").value = pokemon[idx].name;
    form.querySelector("[name=\"srcPokemon\"]").value = pokemon[idx].scr;
    form.querySelector("[name=\"tipPokemon\"]").value = pokemon[idx].tip;
    form.querySelector("[name=\"cost\"]").value = pokemon[idx].price;
    form.querySelector("[name=\"cantitatePokemon\"]").value = pokemon[idx].cantitate;
    form.querySelector("[name=\"descriere\"]").value = pokemon[idx].descriere;

    indexEdit = idx;
}

function showForm() {
    document.querySelector(".adaugaBtn").classList.add("hidden")
    document.querySelector("#myForm").classList.remove("hidden");
    document.querySelector("#myForm").reset();
    indexEdit = -1;
}

function hideForm() {
    document.querySelector("#myForm").classList.add("hidden");
    document.querySelector(".adaugaBtn").classList.remove("hidden")
}

async function add(event, form) {
    event.preventDefault();
    var obj = {
        name: form.querySelector("[name=\"numePokemon\"]").value,
        tip: form.querySelector("[name=\"tipPokemon\"]").value,
        cantitate: form.querySelector("[name=\"cantitatePokemon\"]").value,
        price: form.querySelector("[name=\"cost\"]").value,
        scr: form.querySelector("[name=\"srcPokemon\"]").value,
        descriere: form.querySelector("[name=\"descriere\"]").value
    };
    if (indexEdit === -1) {
        await ajaxPromise("https://proiect-final-df239.firebaseio.com/.json", "POST", JSON.stringify(obj))
    } else {
        await ajaxPromise(
            `https://proiect-final-df239.firebaseio.com/${indexEdit}.json`, "PUT", JSON.stringify(obj));
    }
    getObj("table")
    hideForm()
    form.reset()
}
async function del(idx) {
    if (confirm(`Are you sure you want to delete ${pokemon[idx].name} ?`)) {
        await ajaxPromise(`https://proiect-final-df239.firebaseio.com/${idx}.json`, "DELETE");
        getObj("table")
    }
}

////cosul de cumparaturi buton add

function numarProduse() {
    pokeCart = JSON.parse(localStorage.getItem("pokemon"))
    var numar = 0
    for (var i = 0; i < pokeCart.length; i++) {
        numar += pokeCart[i].cantitate
    }
    return numar
}


// document.querySelector(".alertDiv").classList.add("divHidden")


function adaugaInCos(idx) {
    if (localStorage.getItem("pokemon") === null) {
        pokeCart = []
    } else {
        pokeCart = JSON.parse(localStorage.getItem("pokemon"))
    }
    var gasit = false;
    for (var i = 0; i < pokeCart.length; i++) {
        if (pokeCart[i].name == pokemon[idx].name) {
            gasit = true;
            if (document.querySelector("#nrBuc") != null) {
                console.log("a intrat in for if")
                if (document.querySelector("#nrBuc").value * 1 <= pokemon[idx].cantitate * 1) {
                    pokeCart[i].cantitate += document.querySelector("#nrBuc").value * 1
                    location.href = 'cos.html'
                } else {
                    alertulMeuDet(idx)
                }
            }
            else {
                console.log("a intrat in else if")
                pokeCart[i].cantitate++
                // document.querySelector(".alertDiv.divHidden").innerHTML = `ai pus in cos un ${pokemon[idx].name}`
                hiddenDiv(idx)
            }

        }
    }
    if (!gasit) {
        if (document.querySelector("#nrBuc") != null) {
            if (document.querySelector("#nrBuc").value * 1 <= pokemon[idx].cantitate * 1) {
                pokeCart.push(
                    {
                        name: pokemon[idx].name,
                        price: pokemon[idx].price,
                        cantitate: document.querySelector("#nrBuc").value * 1,
                        index: idx
                    }
                )
                location.href = 'cos.html'
            } else {
                alertulMeuDet(idx)
            }

        } else if (document.querySelector("#btnCumpUnProdus").value != null) {
            pokeCart.push(
                {
                    name: pokemon[idx].name,
                    price: pokemon[idx].price,
                    cantitate: 1,
                    index: idx
                }
            )
            // document.querySelector(".alertDiv.divHidden").innerHTML = `ai pus in cos un ${pokemon[idx].name}`
            hiddenDiv(idx)


        }
    }

    localStorage.setItem("pokemon", JSON.stringify(pokeCart))
    document.querySelector("#cos").classList.remove("ascunde")
    document.querySelector("#cos").innerHTML = `&nbsp(${numarProduse()})`
}

function produseInCos() {
    if (localStorage.getItem("pokemon") !== null && numarProduse() != 0) {
        pokeCart = JSON.parse(localStorage.getItem("pokemon"))
        document.querySelector("#cos").classList.remove("ascunde")
        document.querySelector("#cos").innerHTML = `&nbsp(${numarProduse()})`
    } else {
        document.querySelector("#cos").classList.add("ascunde")
    }
}

produseInCos()

function drawCos() {
    if (localStorage.getItem("pokemon") === null) {
        localStorage.setItem("pokemon", "[]")
    }
    let pokeCart = JSON.parse(localStorage.getItem("pokemon"))
    console.log(pokeCart)
    var createRows = ''
    var totalCos = 0;
    var idPokemon = ''
    for (var i in pokeCart) {
        idPokemon = pokeCart[i].index
        totalCos += pokeCart[i].price * 1 * pokeCart[i].cantitate
        createRows +=
            `<tr>
                
                <td  class="tableimg"> <img src= "${pokemon[pokeCart[i].index].scr}"> 
                <a onclick="detaliiProba('${pokeCart[i].index}')">  ${pokeCart[i].name} </a>
                </td>
                <td class="tablePret">${pokeCart[i].price} $</td>
                <td class="tableCantitate" align="center">   
                <div class="flex">   
                   <div class="sageataStanga" onclick="delCart('${i}')"></div>
                   <div> ${pokeCart[i].cantitate} </div>
                    <div class="sageataDreapta" onclick="addCart('${i}')"></div>
                    </div>
                </td>
                <td class="tableSubtotal"> ${pokeCart[i].cantitate * 1 * pokeCart[i].price} $</td>

                <td align="right">
                <div  id="${i}" class="deleteButton" onclick="delCartProd('${i}')">  </div>
                </td>
            </tr>`
    }
    createRows += ` <tr style="background-color:red; color:white; align:center">
    <td class="tableData"></td>
    <td class="tableData"></td>
    <td class="tableData">Total cos</td>
    <td class="tableData">${totalCos} $</td>
    <td class="tableData">
    <div  class="cumparaButton" onclick="cumparaProduse()">  </div>
    </td>
</tr>`
    document.querySelector("#tabelCos tbody").innerHTML = createRows
    document.querySelector(".loader").classList.add("hidden")
}

function delCart(idx) {
    console.log("merge")
    let pokeCart = JSON.parse(localStorage.getItem("pokemon"))

    if (pokeCart[idx].cantitate > 1) {
        pokeCart[idx].cantitate = pokeCart[idx].cantitate * 1 - 1
    } else {
        pokeCart.splice(idx, 1)
    }
    localStorage.setItem("pokemon", JSON.stringify(pokeCart))
    drawCos()
    produseInCos()
}

function delCartProd(idx) {
    console.log("merge")
    let pokeCart = JSON.parse(localStorage.getItem("pokemon"))
    pokeCart.splice(idx, 1)
    localStorage.setItem("pokemon", JSON.stringify(pokeCart))
    drawCos()
    produseInCos()
}

function addCart(idx) {
    console.log("merge")

    let pokeCart = JSON.parse(localStorage.getItem("pokemon"))
    if (pokeCart[idx].cantitate >= 1) {
        if (pokemon[pokeCart[idx].index].cantitate > pokeCart[idx].cantitate) {
            pokeCart[idx].cantitate = pokeCart[idx].cantitate * 1 + 1
        } else {
            // alert(`Ai depasit stocul disponibil (${pokemon[pokeCart[idx].index].cantitate})`)
            alertulMeu(idx, pokeCart)
        }

    } else {
        pokeCart.splice(idx, 1)
    }
    localStorage.setItem("pokemon", JSON.stringify(pokeCart))
    drawCos()
    produseInCos()
}

function alertulMeu(idx, pokeCart) {

    var div = document.createElement("div");
    div.className = "fullscreen";
    div.innerHTML = `
    <div class="bgWhite">  <div class="spanAlert"> Ai depasit stocul disponibil </div>

    <hr style="height:15px; visibility:hidden;" />

    (${pokemon[pokeCart[idx].index].cantitate} buc)
    <button id="okBtn">Ok</button>
    </div>`;
    div.querySelector("#okBtn").addEventListener("click", function () {
        div.parentElement.removeChild(div)
    });
    document.body.appendChild(div);
}

function alertulMeuDet(idx) {

    var div = document.createElement("div");
    div.className = "fullscreen";
    div.innerHTML = `
    <div class="bgWhite">  <div class="spanAlert"> Ai depasit stocul disponibil </div>

    <hr style="height:15px; visibility:hidden;" />

    (${pokemon[idx].cantitate} buc)
    <button id="okBtn">Ok</button>
    </div>`;
    div.querySelector("#okBtn").addEventListener("click", function () {
        div.parentElement.removeChild(div)
    });
    document.body.appendChild(div);
}


function drawDetalii() {

    localIdx = localStorage.getItem("idx")
    console.log("id-ul din drawDetalii: ", localIdx)

    let detaliiPage = ''
    detaliiPage = `<div class="stanga">
    <img id="poza" src="${pokemon[localIdx].scr}" alt="">
    <br>
    <h2>Pret: ${pokemon[localIdx].price} $</h2> <br>
    <h3>In stoc: ${pokemon[localIdx].cantitate} buc</h3> <br>
    <input id="nrBuc" min="1" type="number" name="" id="" placeholder="Nr bucati" value="1" onkeypress="apasaEnter(event)" ><br> <br>
    <button id="btnDetCump" class="butonCumpara" onclick="adaugaInCos('${localIdx}')">
        Adauga in cos
    </button>
</div>

<div class="dreapta">
    <h1>${pokemon[localIdx].name}</h1>
    <br>
    <div class="tipPoke">
        <span class="container ${pokemon[localIdx].tip}" style="display:inline"></span>
        <h2 style="margin-left: 10px;"> Tip - ${pokemon[localIdx].tip} </h2>
    </div>
    <br>
    <hr> <br>
    <p class="coloane">
    ${pokemon[localIdx].descriere}
    </p><br>`

    document.querySelector("#detaliiPoke").innerHTML = detaliiPage
    document.querySelector(".loader").classList.add("hidden")
}


function apasaEnter(event) {
    if (event.keyCode === 13) {
        document.querySelector("#btnDetCump").click();
    }
}


async function cumparaProduse() {

    let pokeCart = JSON.parse(localStorage.getItem("pokemon"))
    let stocInsuficient = []
    let obj = {};
    for (var i in pokeCart) {
        if (pokemon[pokeCart[i].index].cantitate >= pokeCart[i].cantitate) {

            obj = {
                name: pokemon[pokeCart[i].index].name,
                tip: pokemon[pokeCart[i].index].tip,
                cantitate: pokemon[pokeCart[i].index].cantitate - pokeCart[i].cantitate,
                price: pokemon[pokeCart[i].index].price,
                scr: pokemon[pokeCart[i].index].scr,
                descriere: pokemon[pokeCart[i].index].descriere
            };
            await ajaxPromise(`https://proiect-final-df239.firebaseio.com/${pokeCart[i].index}.json`, "PUT", JSON.stringify(obj));
        } else {
            stocInsuficient.push(`${pokemon[pokeCart[i].index].name} (${pokemon[pokeCart[i].index].cantitate})`)
        }
    }
    if (stocInsuficient.length != 0) {
        alert("Stoc insuficient de: \r" + stocInsuficient.join("\r"))
    } else {
        // drawCos()
        drawCeAiCumparat()
        localStorage.removeItem("pokemon")
    }
}

function drawCeAiCumparat() {
    let pokeCart = JSON.parse(localStorage.getItem("pokemon"))
    let ceAiCumparat = ''
    ceAiCumparat = `<div class="stanga">
    <img id="pozaShop" src="pokeballBig.png" alt="" onclick="location.href='index.html'"> <br>
    <h2 style="color:white; font-family:arial;" ">Multumim </h2>
    <h2 style="color:white; font-family:arial;"> pentru cumparaturi </h2>
`
    document.querySelector(".manage").innerHTML = ceAiCumparat
    document.querySelector(".loader").classList.add("hidden")
}



function drawCarousel() {



    let content = ""
    let arrayForCarousel = []

    for (var i in pokemon) {
        arrayForCarousel.push(i)
    }

    console.log(arrayForCarousel)

    let randomOne = 0
    let randomTwo = 0
    let randomThree = 0


    while (randomOne === randomTwo || randomOne === randomThree || randomTwo === randomThree) {
        randomOne = Math.floor(Math.random() * arrayForCarousel.length)
        randomTwo = Math.floor(Math.random() * arrayForCarousel.length)
        randomThree = Math.floor(Math.random() * arrayForCarousel.length)
    }

    console.log(`numerele randomizate sunt ${randomOne} ${randomTwo} ${randomThree}`)


    content = `
        <button class="carousel__button carousel__button--left is-hidden">
        <div class="sageataStanga"></div>
    </button>
    <div class="carousel__track-container">
        <ul class="carousel__track">
<li class="carousel__slide current-slide">
<div class="divCarousel">
    <div class="container ${pokemon[arrayForCarousel[randomOne]].tip}" onclick="detaliiProba('1')"></div>
    <h1 onclick="detaliiProba('${arrayForCarousel[randomOne]}')"> ${pokemon[arrayForCarousel[randomOne]].name} </h1>
    <img class="carousel__image" src="${pokemon[arrayForCarousel[randomOne]].scr}" alt="" onclick="detaliiProba('${arrayForCarousel[randomOne]}')">
</div>

<li class="carousel__slide ">
<div class="divCarousel">
    <div class="container ${pokemon[arrayForCarousel[randomTwo]].tip}" onclick="detaliiProba('1')"></div>
    <h1 onclick="detaliiProba('${arrayForCarousel[randomTwo]}')"> ${pokemon[arrayForCarousel[randomTwo]].name} </h1>
    <img class="carousel__image" src="${pokemon[arrayForCarousel[randomTwo]].scr}" alt="" onclick="detaliiProba('${arrayForCarousel[randomTwo]}')">
</div>

<li class="carousel__slide ">
<div class="divCarousel">
    <div class="container ${pokemon[arrayForCarousel[randomThree]].tip}" onclick="detaliiProba('1')"></div>
    <h1 onclick="detaliiProba('${arrayForCarousel[randomThree]}')"> ${pokemon[arrayForCarousel[randomThree]].name} </h1>
    <img class="carousel__image" src="${pokemon[arrayForCarousel[randomThree]].scr}" alt="" onclick="detaliiProba('${arrayForCarousel[randomThree]}')">
</div>
</ul>
</div>
<div class="carousel__nav">
    <button class="carousel__indicator current-slide"></button>
    <button class="carousel__indicator"></button>
    <button class="carousel__indicator"></button>
</div>
<button class="carousel__button carousel__button--right">
    <div class="sageataDreapta"></div>
</button>

`

    document.querySelector(".carousel").innerHTML = content

    carouselBehaviour()
}



function carouselBehaviour() {


    const track = document.querySelector('.carousel__track')
    const slides = Array.from(track.children)

    const nextButton = document.querySelector(".carousel__button--right")
    const prevButton = document.querySelector(".carousel__button--left")
    const dotsNav = document.querySelector(".carousel__nav")
    const dots = Array.from(dotsNav.children)

    const slideWidth = slides[0].getBoundingClientRect().width

    // console.log(slideSize)
    // slides[0].style.left = slideWidth * 0 + "px"
    // slides[1].style.left = slideWidth * 1 + "px"
    // slides[2].style.left = slideWidth * 2 + "px"

    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + "px"
    }
    slides.forEach(setSlidePosition)


    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translatex(-' + targetSlide.style.left + ')'
        currentSlide.classList.remove('current-slide')
        targetSlide.classList.add('current-slide')
    }


    const updateDots = (currentDot, targetDot) => {
        currentDot.classList.remove('current-slide')
        targetDot.classList.add('current-slide')
    }


    const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
        if (targetIndex === 0) {
            prevButton.classList.add('is-hidden')
            nextButton.classList.remove('is-hidden')
        } else if (targetIndex === slides.length - 1) {
            nextButton.classList.add('is-hidden')
            prevButton.classList.remove('is-hidden')
        } else {
            prevButton.classList.remove('is-hidden')
            nextButton.classList.remove('is-hidden')
        }
    }


    prevButton.addEventListener("click", e => {
        const currentSlide = track.querySelector(".current-slide")
        const prevSlide = currentSlide.previousElementSibling
        const currentDot = dotsNav.querySelector('.current-slide')
        const prevDot = currentDot.previousElementSibling
        const prevIndex = slides.findIndex(slide => slide === prevSlide)


        moveToSlide(track, currentSlide, prevSlide)
        updateDots(currentDot, prevDot)
        hideShowArrows(slides, prevButton, nextButton, prevIndex)

    })


    nextButton.addEventListener("click", e => {
        const currentSlide = track.querySelector(".current-slide")
        const nextSlide = currentSlide.nextElementSibling
        const currentDot = dotsNav.querySelector('.current-slide')
        const nextDot = currentDot.nextElementSibling
        const nextIndex = slides.findIndex(slide => slide === nextSlide)

        moveToSlide(track, currentSlide, nextSlide)
        updateDots(currentDot, nextDot)
        hideShowArrows(slides, prevButton, nextButton, nextIndex)

    })

    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button')

        if (!targetDot) return;

        const currentSlide = track.querySelector('.current-slide')
        const currentDot = dotsNav.querySelector('.current-slide')
        const targetIndex = dots.findIndex(dot => dot === targetDot)
        const targetSlide = slides[targetIndex]

        moveToSlide(track, currentSlide, targetSlide)
        updateDots(currentDot, targetDot)
        hideShowArrows(slides, prevButton, nextButton, targetIndex)
    })

    produseInCos()
}


function searchPoke() {

    var input = document.getElementById('search')
    var filter = input.value.toLowerCase()
    var list = document.querySelectorAll(".produse:first-child h3:first-of-type")

    console.log(list)
    console.log('list de 2 ar trbuisa fie pikachu: ' + list[2].textContent.toLocaleLowerCase())
    console.log(filter)

    console.log(list[2].textContent.toLocaleLowerCase().indexOf(filter))

    for (var i in list) {
        if (list[i].textContent.toLocaleLowerCase().indexOf(filter) == -1) {
            list[i].parentElement.parentElement.classList.add('hide')
        } else {
            list[i].parentElement.parentElement.classList.remove('hide')
        }
    }
}


function cautaTip() {
    var tipSearch = document.querySelector("[name=\"tipPokemon\"]").value
    console.log("este ce caut eu: " + tipSearch)
    var list = document.querySelectorAll(".produseWrap div:nth-child(2)")
    console.log(list[1].classList[1])
    console.log(list[0].parentElement.classList.add('hide'))

    for (var i in list) {


        if (list[i].classList[1] != tipSearch && tipSearch != 0) {
            list[i].parentElement.classList.add('hide')
        } else {
            list[i].parentElement.classList.remove('hide')
        }

    }
}