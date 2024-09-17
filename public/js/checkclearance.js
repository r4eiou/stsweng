document.addEventListener("DOMContentLoaded", function() {
    const names = ["Clarissa Albarracin", "Charlize Brodeth", "Amor De Guzman", "Reina Althea Garcia", "Rachel Manlapig", "Miko Santos", "Alliyah Zulueta"];

    /* Search Function */
    function searchClicked() {
        const searchBox = document.getElementById("search-box");
        const query = searchBox.value.toLowerCase();
        if (query.trim() === "") {
            clearResults();
            searchBox.placeholder = "Search Name";
        } else {
            const results = names.filter(name => name.toLowerCase().includes(query));
            displayResults(results);
        }
        updatePlaceholder();
    }

    /* Display results */
    function displayResults(results) {
        const resultsContainer = document.getElementById("results-container");
        resultsContainer.innerHTML = "";
        const listElement = document.createElement("ul");
        listElement.className = "results-list";

        if (results.length > 0) {
            results.forEach(result => {
                const listItem = document.createElement("li");
                listItem.className = "result-item";
                listItem.textContent = result;
                listItem.addEventListener("click", function() {
                    searchBox.value = result;
                    searchBox.placeholder = result;
                    clearResults();
                });
                listElement.appendChild(listItem);
            });
        } else {
            const listItem = document.createElement("li");
            listItem.className = "result-item";
            listItem.textContent = "No results found";
            listElement.appendChild(listItem);
        }

        resultsContainer.appendChild(listElement);
    }

    /*  Clears Results */
    function clearResults() {
        const resultsContainer = document.getElementById("results-container");
        resultsContainer.innerHTML = "";
    }

    /* Updates Placeholder and Save Search Text to LocalStorage */
    function updatePlaceholder() {
        let searchText = document.getElementById("search-box").value;
        localStorage.setItem("searchText", searchText);
    }

    /* Search Button Event Listener */
    const searchButtonContainer = document.getElementById("search-button-container");
    searchButtonContainer.addEventListener("click", searchClicked);

    /* Search Box (Input Change) Event Listener */
    const searchBox = document.getElementById("search-box");
    searchBox.addEventListener("input", function() {
        clearResults();
        const query = searchBox.value.toLowerCase();
        if (query.trim() === "") {
            clearResults();
            searchBox.placeholder = "Search Name";
        } else {
            const results = names.filter(name => name.toLowerCase().includes(query));
            displayResults(results);
        }
    });

    /*  Sets Placeholder to 'Search Name' and update from LocalStorage on focus */
    searchBox.placeholder = "Search Name";
    searchBox.addEventListener("focus", () => {
        const savedSearchText = localStorage.getItem("searchText");
        if (savedSearchText) {
            searchBox.placeholder = savedSearchText;
        }
    });

    /*  Enter and Arrow keys listeners */
    searchBox.addEventListener("keydown", function(event) {
        const resultsContainer = document.getElementById("results-container");
        const activeItem = resultsContainer.querySelector(".result-item.active");
        if (event.key === "ArrowDown") {
            if (activeItem) {
                const nextItem = activeItem.nextElementSibling;
                if (nextItem) {
                    activeItem.classList.remove("active");
                    nextItem.classList.add("active");
                }
            } else {
                const firstItem = resultsContainer.querySelector(".result-item");
                if (firstItem) {
                    firstItem.classList.add("active");
                }
            }
        } else if (event.key === "ArrowUp") {
            if (activeItem) {
                const previousItem = activeItem.previousElementSibling;
                if (previousItem) {
                    activeItem.classList.remove("active");
                    previousItem.classList.add("active");
                }
            }
        } else if (event.key === "Enter") {
            if (activeItem) {
                searchBox.value = activeItem.textContent;
                clearResults();
                updatePlaceholder();
            }
        }
    });
});
