document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("inputBook");
    const searchForm = document.getElementById("searchBook");
    const inputBookIsComplete = document.getElementById("inputBookIsComplete");
    const bookSubmit = document.getElementById("bookSubmit");
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if(bookSubmit.hasAttribute("edit")){
            changeBook();
        }
        else{
            addBook();
        }
    });
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        filterBook();
    });
    inputBookIsComplete.addEventListener("change", function (event){
        if(inputBookIsComplete.checked){
            bookSubmit.innerHTML = "Masukkan Buku ke rak <span>Selesai dibaca</span>";
        }
        else{
            bookSubmit.innerHTML = "Masukkan Buku ke rak <span>Belum selesai dibaca</span>";
        }
    });
    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil di simpan.");
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});
