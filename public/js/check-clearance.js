document.addEventListener("DOMContentLoaded", function() {
    const searchBox = document.getElementById("search-box");

    searchBox.addEventListener('input', function() {
        if (searchBox.value.trim() === '') {
            clearResults();
            searchBox.placeholder = "Search Name";
        }
    });

    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(searchForm);
            const searchName = formData.get('search_name');
            
            try {
                if (searchName) {
                    const response = await fetch(`/search-cases-employee/${searchName}`);
                    const responseLupon = await fetch(`/search-cases-employeeLupon/${searchName}`);

                    if (!response.ok) {
                        throw new Error('Network response for Employee was not ok');
                    }
                
                    if (!responseLupon.ok) {
                        throw new Error('Network response for Lupon was not ok');
                    }
                
                    const result = await response.json();
                    const resultLupon = await responseLupon.json();
                    
                    if (result.results.length > 0 && resultLupon.results.length > 0) {
                        // Display both sets of results
                        displayResults(result.results);
                        console.log("im here")
                    } else if (result.results.length > 0) {
                        // Display only Tanod results
                        displayResults(result.results);
                        console.log("RAWR")
                    } else if (resultLupon.results.length > 0) {
                        // Display only Lupon results
                        displayResultsLupon(resultLupon.results);
                        console.log("HERE")
                    } else {
                        displayNoResult();
                    }
                } else {
                    clearResults(); 
                    searchBox.placeholder = "Search Name";
                }
            } catch (error) {
                console.error('There was a problem with the search operation:', error);
            }
        });
    }
    // Existing code for other functionalities (displayResults, clearResults, etc.) remains the same
});

function displayNoResult() {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ""; // Clear previous results
    
    const listItem = document.createElement("li");
    listItem.className = "result-item";
    listItem.textContent = "No results found.";
    

    // Create an anchor element for the link
    const link = document.createElement("a");
    link.href = "/employee-input-page-clearance";
    link.textContent = "Continue to Certificate Generation?";

    // Create a div to wrap the elements and apply flexbox
    const wrapper = document.createElement("div");
    wrapper.className = "flex-container";

    // Append the text and link to the wrapper
    wrapper.appendChild(listItem);
    wrapper.appendChild(link);

    resultsContainer.appendChild(wrapper);
}

function displayResults(results) {
    const searchBox = document.getElementById("search-box");
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ""; // Clear previous results

    if (results.length > 0) {
        const listElement = document.createElement("ul");
        listElement.className = "results-list";

        results.forEach(result => {
            const { ReporteeInfo } = result;

            const listItem = document.createElement("li");
            listItem.className = "result-item";

            const linkElement = document.createElement("a");
            linkElement.href = `/employee-onClick-print/${ReporteeInfo.FirstName}/${ReporteeInfo.MiddleInitial}/${ReporteeInfo.LastName}`;
            linkElement.textContent = `${ReporteeInfo.FirstName} ${ReporteeInfo.MiddleInitial ? `${ReporteeInfo.MiddleInitial}. ` : ''}${ReporteeInfo.LastName}`;
            
            linkElement.classList.add("result-link");

            // Add click event listener to the link element
            linkElement.addEventListener("click", function(event) {
                event.preventDefault(); 
                searchBox.value = linkElement.textContent; 
                searchBox.placeholder = linkElement.textContent; 
                clearResults(); 
                window.location.href = linkElement.href; 
            });

            listItem.appendChild(linkElement);
            listElement.appendChild(listItem);
        });

        resultsContainer.appendChild(listElement);
    } else {
        const listItem = document.createElement("li");
        listItem.className = "result-item";
        listItem.textContent = "No results found";
        resultsContainer.appendChild(listItem);
    }
}

function displayResultsLupon(results) {
    const searchBox = document.getElementById("search-box");
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ""; // Clear previous results

    if (results.length > 0) {
        const listElement = document.createElement("ul");
        listElement.className = "results-list";

        results.forEach(result => {
            const { _id, RespondentInfo } = result;

            const listItem = document.createElement("li");
            listItem.className = "result-item";

            const linkElement = document.createElement("a");
            linkElement.href = `/employee-onClick-print/${RespondentInfo.FirstName}/${RespondentInfo.MiddleInitial}/${RespondentInfo.LastName}`;; // Update this path as needed
            linkElement.textContent = `${RespondentInfo.FirstName} ${RespondentInfo.MiddleInitial ? `${RespondentInfo.MiddleInitial}. ` : ''}${RespondentInfo.LastName}`;

            linkElement.classList.add("result-link");

            // Add click event listener to the link element
            linkElement.addEventListener("click", function(event) {
                event.preventDefault(); 
                searchBox.value = linkElement.textContent;
                searchBox.placeholder = linkElement.textContent; 
                clearResults(); 
                window.location.href = linkElement.href; 
            });

            listItem.appendChild(linkElement);
            listElement.appendChild(listItem);
        });

        resultsContainer.appendChild(listElement);
    } else {
        const listItem = document.createElement("li");
        listItem.className = "result-item";
        listItem.textContent = "No results found."; 
        resultsContainer.appendChild(listItem);
    }
}

function clearResults() {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ""; // Clear previous results
}

