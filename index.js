import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-c8aaf-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const wordsListInDB = ref(database, "wordsList")

const searchFieldEl = document.getElementById("search-field")
const addButtonEl = document.getElementById("add-button")
const wordsListEl = document.getElementById("words-list")
const wordFormEl = document.getElementById("word-form")

addButtonEl.addEventListener("click", function () {
    let language = document.getElementById("language-field").value
    let word = document.getElementById("word-field").value
    let translation = document.getElementById("translation-field").value

    event.preventDefault();

    if (language && word && translation) {
        let newWord = {
            language: language,
            word: word,
            translation: translation
        }

        push(wordsListInDB, newWord)
        clearInputFieldEl()
    }
})

onValue(wordsListInDB, function (snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())

        clearWordsListEl()

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]

            appendItemToWordsListEl(currentItem)
        }
    } else {
        wordsListEl.innerHTML = "No items here... yet"
    }
})

searchFieldEl.addEventListener("input", function () {

    if (searchFieldEl.value) {
        wordFormEl.style.display = "none"
    } else {
        wordFormEl.style.display = "block"
    }

    let searchTerm = searchFieldEl.value.toLowerCase()

    let items = wordsListEl.getElementsByTagName("li")

    for (let i = 0; i < items.length; i++) {
        let item = items[i]
        let itemValue = item.textContent.toLowerCase()

        if (itemValue.includes(searchTerm) ||
            itemValue.includes(searchTerm) ||
            itemValue.includes(searchTerm)) {
            item.style.display = ""
        } else {
            item.style.display = "none"
        }
    }
})

function clearWordsListEl() {
    wordsListEl.innerHTML = ""
}

function clearInputFieldEl() {
    document.getElementById("language-field").value = ""
    document.getElementById("word-field").value = ""
    document.getElementById("translation-field").value = ""
}

function appendItemToWordsListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")

    newEl.innerHTML = `<strong>${itemValue.language}:</strong> ${itemValue.word} - ${itemValue.translation}`

    newEl.addEventListener("click", function () {
        let exactLocationOfItemInDB = ref(database, `wordsList/${itemID}`)

        remove(exactLocationOfItemInDB)
    })

    wordsListEl.prepend(newEl)
}