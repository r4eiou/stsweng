document.addEventListener("DOMContentLoaded", function() {
    var checkboxes = document.getElementsByClassName("checkbox");

    Array.from(checkboxes).forEach(function(checkbox) {
        checkbox.addEventListener("click", function() {
            this.classList.toggle("clicked");
        });
    });



    var status_btns = document.getElementsByClassName("status");

    Array.from(status_btns).forEach(function(status_btns) {
        status_btns.addEventListener("click", function() {
            var currentState = this.classList[1];
            var img = this.querySelector('img');
            var text = this.querySelector('span');

            if (currentState == "resolved") {
                this.classList.remove('resolved');
                this.classList.add('ongoing');
                img.src="/images/ongoing-circle.png"
                text.textContent = "Ongoing";
            } else {
                this.classList.remove('ongoing');
                this.classList.add('resolved');
                img.src="/images/resolved-circle.png"
                text.textContent = "Resolved";
            }
        });
    });

    var sort_btns = document.getElementsByClassName("sort");

    Array.from(sort_btns).forEach(function(sort_btns) {
        sort_btns.addEventListener("click", function() {
            var currentState = this.classList[1];
            var img = this.querySelector('img');

            if (currentState == "descending") {
                this.classList.remove('descending');
                this.classList.add('ascending');
                img.src="../public/images/sort-ascending.png"
            } else {
                this.classList.remove('ascending');
                this.classList.add('descending');
                img.src="../public/images/sort-descending.png"
            }
        });
    });

    // TANOD
    const resolvedButton = document.getElementById('resolvedButton');
    const deleteButton = document.getElementById('deleteButton');
    if (resolvedButton) {
        resolvedButton.addEventListener('click', async () => {
            const checkedCheckboxes = document.querySelectorAll('button[name="caseIds"].clicked');
            const selectedCaseIds = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);

            console.log("Selected Case IDs:", selectedCaseIds); // Debugging log

            try {
                const response = await fetch('/mark-as-resolved', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ caseIds: selectedCaseIds })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log(result);
                location.reload(true);

            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        });
    }

    if (deleteButton) {
        deleteButton.addEventListener('click', async () => {
            const checkedCheckboxes = document.querySelectorAll('button[name="caseIds"].clicked');
            const selectedCaseIds = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);

            console.log("Selected Case IDs:", selectedCaseIds); // Debugging log
            try {
                const response = await fetch('/delete-cases', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ caseIds: selectedCaseIds })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log(result);
                location.reload(true);

            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        });
    }

    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(searchForm);
            const searchName = formData.get('search_name');
            
            try {
                if(searchName) {
                    const response = await fetch(`/search-cases/${searchName}`);

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const result = await response.json();
                    console.log(result); 

                    window.location.href = `/admin-tanod-db-view/${searchName}`;
                } else {
                    window.location.href = '/admin-tanod-db-view';
                }

            } catch (error) {
                console.error('There was a problem with the search operation:', error);
            }
        });
    }

    // LUPON
    const resolvedButtonLupon = document.getElementById('resolvedButtonLupon');
    const deleteButtonLupon = document.getElementById('deleteButtonLupon');
    if (resolvedButtonLupon) {
        resolvedButtonLupon.addEventListener('click', async () => {
            const checkedCheckboxes = document.querySelectorAll('button[name="caseIds"].clicked');
            const selectedCaseIds = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);

            console.log("Selected Case IDs:", selectedCaseIds); // Debugging log

            try {
                const response = await fetch('/mark-as-resolved-lupon', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ caseIds: selectedCaseIds })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log(result);
                location.reload(true);

            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        });
    }

    if (deleteButtonLupon) {
        deleteButtonLupon.addEventListener('click', async () => {
            const checkedCheckboxes = document.querySelectorAll('button[name="caseIds"].clicked');
            const selectedCaseIds = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);

            console.log("Selected Case IDs:", selectedCaseIds); // Debugging log
            try {
                const response = await fetch('/delete-cases-lupon', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ caseIds: selectedCaseIds })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log(result);
                location.reload(true);

            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        });
    }

    const searchFormLupon = document.getElementById('searchFormLupon');
    if (searchFormLupon) {
        searchFormLupon.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(searchFormLupon);
            const searchName = formData.get('search_name');
            
            try {
                if(searchName) {
                    const response = await fetch(`/search-cases-lupon/${searchName}`);

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const result = await response.json();
                    console.log(result); 

                    window.location.href = `/admin-lupon-db-view/${searchName}`;
                } else {
                    window.location.href = '/admin-lupon-db-view';
                }

            } catch (error) {
                console.error('There was a problem with the search operation:', error);
            }
        });
    }

    //CERTIFICATE
    const searchFormCertificate = document.getElementById('searchFormCertificate');
    if (searchFormCertificate) {
        searchFormCertificate.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(searchFormCertificate);
            const searchName = formData.get('search_name');
            
            try {
                if(searchName) {
                    const response = await fetch(`/search-cases-certificate/${searchName}`);

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const result = await response.json();
                    console.log(result); 

                    window.location.href = `/certificate-db/${searchName}`;
                } else {
                    window.location.href = '/certificate-db';
                }

            } catch (error) {
                console.error('There was a problem with the search operation:', error);
            }
        });
    }
});

function displayResults(results) {
    const checkboxForm = $('#checkboxForm');
    checkboxForm.empty(); // Clear previous results

    results.forEach(result => {
        const { _id, ReporteeInfo, Status } = result;

        // Create HTML elements for each case
        const caseElement = `
            <div class="db-main-box-content">
                <div class="checkboxCol-Content">
                    <input type="checkbox" name="caseIds" value="${_id}" class="checkbox margin">
                </div>
                <div class="nameCol-Content">${ReporteeInfo.FirstName} ${ReporteeInfo.MiddleInitial}. ${ReporteeInfo.LastName}</div>
                <div class="statusCol-Content">
                    <a href="/update-Status/${_id}/${Status}">
                        <button type="button" class="status ${Status.toLowerCase()}">
                            <img src="/images/${Status.toLowerCase()}-circle.png">
                            <span>${Status}</span>
                        </button>
                    </a>
                </div>
                <div class="viewCol-Content">
                    <a href="/A-tanod-view-case/${_id}" class="content-text-main underline">View Tanod Case</a>
                </div>
                
            </div>
        `;

        checkboxForm.append(caseElement); // Append each case element to the form
    });
}

function displayResultsLupon(results) {
    const checkboxForm = $('#checkboxForm');
    checkboxForm.empty(); // Clear previous results

    results.forEach(result => {
        const { _id, RespondentInfo, Status } = result;

        // Create HTML elements for each case
        const caseElement = `
            <div class="db-main-box-content">
                <div class="checkboxCol-Content">
                    <input type="checkbox" name="caseIds" value="${_id}" class="checkbox margin">
                </div>
                <div class="nameCol-Content">${RespondentInfo.FirstName} ${RespondentInfo.MiddleInitial}. ${RespondentInfo.LastName}</div>
                <div class="statusCol-Content">
                    <a href="/update-Status/${_id}/${Status}">
                        <button type="button" class="status ${Status.toLowerCase()}">
                            <img src="/images/${Status.toLowerCase()}-circle.png">
                            <span>${Status}</span>
                        </button>
                    </a>
                </div>
                <div class="viewCol-Content">
                    <a href="/A-tanod-view-case/${_id}" class="content-text-main underline">View Tanod Case</a>
                </div>
            </div>
        `;

        checkboxForm.append(caseElement); // Append each case element to the form
    });
}
