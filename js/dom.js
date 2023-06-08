const INCOMPLETED_LIST_BOOKSHELF_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOKSHELF_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

function makeBook(title, penulis, tahun, isCompleted){
    const textTitle = document.createElement("h3");
    textTitle.innerText = title;
    const textPenulis = document.createElement("p");
    textPenulis.innerText = "Penulis: " + penulis;
    const textTahun = document.createElement("p");
    textTahun.innerText = "Tahun: " + tahun;
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");
    const container = document.createElement("article");
    container.classList.add("book_item");
    if (isCompleted){
        buttonContainer.append(
            createUnfinishButton(),
            createDeleteButton(),
            createEditButton()
        );
    } else {
        buttonContainer.append(
            createFinishButton(),
            createDeleteButton(),
            createEditButton()
        );
    }
    container.append(textTitle, textPenulis, textTahun, buttonContainer);
    return container;
}

function createFinishButton(){
    return createButton("green", "Selesai dibaca", function (event){
        addBookToCompleted(event.target.parentElement.parentElement);
    });
}

function createUnfinishButton(){
    return createButton("green", "Belum selesai di Baca", function (event){
        unfinishBookFromCompleted(event.target.parentElement.parentElement);
    });
}

function createDeleteButton(){
    return createButton("red", "Hapus Buku", function (event){
        removeBookFromCompleted(event.target.parentElement.parentElement);
    });
}


function createEditButton(){
    return createButton("orange", "Edit Buku", function (event){
        editBook(event.target.parentElement.parentElement);
    });
}

function createButton(typeClass, text,  eventListener){
    const button = document.createElement("button");
    button.innerText = text;
    button.classList.add(typeClass);
    button.addEventListener("click", function (event){
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}

function addBook(){
    const incompleteBookshelfList = document.getElementById(INCOMPLETED_LIST_BOOKSHELF_ID);
    const completedBookshelfList = document.getElementById(COMPLETED_LIST_BOOKSHELF_ID);
    const inputTitle = document.getElementById("inputBookTitle").value;
    const inputAuthor = document.getElementById("inputBookAuthor").value;
    const inputYear = document.getElementById("inputBookYear").value;
    const inputComplete = document.getElementById("inputBookIsComplete").checked;
    const book = makeBook(inputTitle, inputAuthor, inputYear, inputComplete);
    const bookObject = composeBookObject(inputTitle, inputAuthor, inputYear, inputComplete);
    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);
    if(inputComplete){
        completedBookshelfList.append(book);
    }
    else{
        incompleteBookshelfList.append(book);
    }
    updateDataToStorage();
    clearInput();
}

function addBookToCompleted(bookElement){
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOKSHELF_ID);
    const bookTitle = bookElement.querySelector("h3").innerText;
    const bookAuthor = bookElement.querySelector("p").innerText;
    const bookYear = bookElement.querySelectorAll("p")[1].innerText;
    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isComplete = true;
    newBook[BOOK_ITEMID] = book.id;
    listCompleted.append(newBook);
    bookElement.remove();
    updateDataToStorage();
}

function removeBookFromCompleted(bookElement){
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);
    bookElement.remove();
    updateDataToStorage();
}

function unfinishBookFromCompleted(bookElement){
    const listIncompleted = document.getElementById(INCOMPLETED_LIST_BOOKSHELF_ID);
    const bookTitle = bookElement.querySelector("h3").innerText;
    const bookAuthor = bookElement.querySelector("p").innerText;
    const bookYear = bookElement.querySelectorAll("p")[1].innerText;
    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);
    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isComplete = false;
    newBook[BOOK_ITEMID] = book.id;
    listIncompleted.append(newBook);
    bookElement.remove();
    updateDataToStorage();
}

function editBook(bookElement){
    const inputSection = document.querySelector(".input_section");
    const searchSection = document.querySelector(".search_section");
    const book_shelf = document.querySelectorAll(".book_shelf");

    const judul = inputSection.querySelector("h2");
    searchSection.style.display = "none";
    for(shelf of book_shelf){
        shelf.style.display = "none";
    }

    const inputTitle = document.getElementById("inputBookTitle");
    const inputAuthor = document.getElementById("inputBookAuthor");
    const inputYear = document.getElementById("inputBookYear");
    const inputComplete = document.getElementById("inputBookIsComplete");

    const book = findBook(bookElement[BOOK_ITEMID]);
    judul.innerText = "Ubah Buku " + book.id;
    inputTitle.value = book.title;
    inputAuthor.value = book.author;
    inputYear.value = book.year;
    inputComplete.checked = book.isComplete;

    const bookSubmit = document.getElementById("bookSubmit");
    bookSubmit.setAttribute("edit", book.id);
}

function changeBook(){
    const inputTitle = document.getElementById("inputBookTitle").value;
    const inputAuthor = document.getElementById("inputBookAuthor").value;
    const inputYear = document.getElementById("inputBookYear").value;
    const inputComplete = document.getElementById("inputBookIsComplete").checked;
    const bookSubmit = document.getElementById("bookSubmit");
    const bookId = parseInt(bookSubmit.getAttribute("edit"));

    const book = findBook(bookId);
    book.title = inputTitle;
    book.author = inputAuthor;
    book.year = inputYear;
    book.isComplete = inputComplete;

    updateDataToStorage();
    refreshDataFromBooks();
    clearInput();
}

function filterBook(){
    const listIncompleted = document.getElementById(INCOMPLETED_LIST_BOOKSHELF_ID);
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOKSHELF_ID);

    listIncompleted.innerHTML = "";
    listCompleted.innerHTML = "";

    const searchBookTitle = document.getElementById("searchBookTitle").value;

    for (book of books){
        if(searchBookTitle != ""){
            if(book.title.toLowerCase().includes(searchBookTitle.toLowerCase())){
                const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
                newBook[BOOK_ITEMID] = book.id;
                if(book.isComplete){
                    listCompleted.append(newBook);
                } else {
                    listIncompleted.append(newBook);
                }
            }
        }
        else{
            const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
            newBook[BOOK_ITEMID] = book.id;
            if(book.isComplete){
                listCompleted.append(newBook);
            } else {
                listIncompleted.append(newBook);
            }
        }
    }
}

function refreshDataFromBooks(){
    const listIncompleted = document.getElementById(INCOMPLETED_LIST_BOOKSHELF_ID);
    listIncompleted.innerHTML = "";
    let listCompleted = document.getElementById(COMPLETED_LIST_BOOKSHELF_ID);
    listCompleted.innerHTML = "";

    for(book of books){
        const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
        newBook[BOOK_ITEMID] = book.id;
        if(book.isComplete){
            listCompleted.append(newBook);
        } else {
            listIncompleted.append(newBook);
        }
    }

    const inputSection = document.querySelector(".input_section");
    const searchSection = document.querySelector(".search_section");
    const book_shelf = document.querySelectorAll(".book_shelf");

    const judul = inputSection.querySelector("h2");
    searchSection.style.display = "flex";
    for(shelf of book_shelf){
        shelf.style.display = "block";
    }
    judul.innerText = "Masukkan Buku Baru";
}

function clearInput(){
    const inputTitle = document.getElementById("inputBookTitle");
    const inputAuthor = document.getElementById("inputBookAuthor");
    const inputYear = document.getElementById("inputBookYear");
    const inputComplete = document.getElementById("inputBookIsComplete");
    const bookSubmit = document.getElementById("bookSubmit");

    inputTitle.value = "";
    inputAuthor.value = "";
    inputYear.value = "";
    inputComplete.checked = false;
    if(bookSubmit.hasAttribute("edit")){
        bookSubmit.removeAttribute("edit");
    }
}