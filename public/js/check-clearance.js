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
                        // displayResults(result.results);
                        displayResultsLupon(resultLupon.results);
                        console.log("HERE-BOTH")
                    } else if (result.results.length > 0) {
                        // Display only Tanod results
                        displayResults(result.results);
                        console.log("HERE-TANOD")
                    } else if (resultLupon.results.length > 0) {
                        // Display only Lupon results
                        displayResultsLupon(resultLupon.results);
                        console.log("HERE-LUPON")
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

const resultsPerPage = 10; // Number of results to show per page
let currentPage = 1; // Current page

function displayResults(results) {
    const searchBox = document.getElementById("search-box");
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ""; // Clear previous results

    if (results.length > 0) {
        const totalPages = Math.ceil(results.length / resultsPerPage);
        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = Math.min(startIndex + resultsPerPage, results.length);
        const paginatedResults = results.slice(startIndex, endIndex);

        const listElement = document.createElement("ul");
        listElement.className = "results-list";

        paginatedResults.forEach(result => {
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

        // Add pagination controls
        const paginationControls = document.createElement("div");
        paginationControls.className = "pagination-controls";

        if (currentPage > 1) {
            const prevLink = document.createElement("a");
            prevLink.textContent = "Previous";
            prevLink.href = "#";
            prevLink.style.textDecoration = "underline"; 
            prevLink.style.cursor = "pointer";
            prevLink.style.marginLeft = "35px";
            prevLink.style.color = "gray"

            prevLink.addEventListener("click", function() {
                currentPage--;
                displayResults(results); // Redisplay results for previous page
            });
            paginationControls.appendChild(prevLink);
        }

        if (currentPage < totalPages) {
            const nextLink = document.createElement("a");
            nextLink.textContent = "Next";
            nextLink.href = "#";
            nextLink.style.textDecoration = "underline"; 
            nextLink.style.cursor = "pointer"; 
            nextLink.style.marginLeft = "35px";
            nextLink.style.color = "gray"
        
            nextLink.addEventListener("click", function(event) {
                event.preventDefault(); // Prevent default anchor behavior
                currentPage++;
                displayResults(results); // Redisplay results for next page
            });
            
            paginationControls.appendChild(nextLink);
        }
        

        resultsContainer.appendChild(paginationControls);
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
        const totalPages = Math.ceil(results.length / resultsPerPage);
        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = Math.min(startIndex + resultsPerPage, results.length);
        const paginatedResults = results.slice(startIndex, endIndex);

        const listElement = document.createElement("ul");
        listElement.className = "results-list";

        paginatedResults.forEach(result => {
            const { RespondentInfo } = result;

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

        // Add pagination controls
        const paginationControls = document.createElement("div");
        paginationControls.className = "pagination-controls";

        if (currentPage > 1) {
            const prevLink = document.createElement("a");
            prevLink.textContent = "Previous";
            prevLink.href = "#";
            prevLink.style.textDecoration = "underline"; 
            prevLink.style.cursor = "pointer";
            prevLink.style.marginLeft = "35px";
            prevLink.style.color = "gray"

            prevLink.addEventListener("click", function() {
                currentPage--;
                displayResultsLupon(results); // Redisplay results for previous page
            });
            paginationControls.appendChild(prevLink);
        }

        if (currentPage < totalPages) {
            const nextLink = document.createElement("a");
            nextLink.textContent = "Next";
            nextLink.href = "#";
            nextLink.style.textDecoration = "underline"; 
            nextLink.style.cursor = "pointer"; 
            nextLink.style.marginLeft = "35px";
            nextLink.style.color = "gray"
        
            nextLink.addEventListener("click", function(event) {
                event.preventDefault(); // Prevent default anchor behavior
                currentPage++;
                displayResultsLupon(results); // Redisplay results for next page
            });
            
            paginationControls.appendChild(nextLink);
        }
        

        resultsContainer.appendChild(paginationControls);
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

