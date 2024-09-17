document.addEventListener("DOMContentLoaded", function() {
    var checkboxes = document.getElementsByClassName("checkbox");
    var deleteButton = document.getElementById("delete-btn");
    var resolveButton = document.getElementById("resolve-btn");
    var resolveOnclick = document.getElementsByClassName("markResolve");

    //Code for sorting
    var sortEntryNumButton = document.getElementById("sortEntryNum");
    var sortDateButton = document.getElementById('sortDate');

    function getCurrentSortState(){
        const urlParams = new URLSearchParams(window.location.search);
        const sortField = urlParams.get('sort_field') || 'EntryNo';
        const sortOrder  = urlParams.get('sort_order') || 'desc';
        return {sortField, sortOrder};
    }

    function handleSort(field){
        const {sortField, sortOrder} = getCurrentSortState();
        const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        window.location.href = `?sort_field=${field}&sort_order=${newSortOrder}`;
    }

    sortEntryNumButton.addEventListener("click", function(){
        handleSort('EntryNo');
    });

    sortDateButton.addEventListener("click", function(){
        handleSort('Date');
    });

    function updateSortButtonDesign(){
        const {sortField, sortOrder} = getCurrentSortState();

        sortEntryNumButton.classList.add('descending');
        sortEntryNumButton.querySelector('img').src = '/images/sort-descending.png';
        sortDateButton.classList.add('descending');
        sortDateButton.querySelector('img').src = '/images/sort-descending.png';

        if(sortField === 'EntryNo'){
            sortEntryNumButton.classList.add(sortOrder);
            sortEntryNumButton.querySelector('img').src = sortOrder === 'asc' ? '/images/sort-ascending.png' : '/images/sort-descending.png';
        }else if(sortField === 'Date'){
            sortDateButton.classList.add(sortOrder);
            sortDateButton.querySelector('img').src = sortOrder === 'asc' ? '/images/sort-ascending.png' : '/images/sort-descending.png';
        }
    }

    updateSortButtonDesign();

    //Code for sorting

    
    Array.from(checkboxes).forEach(function(checkbox) {
        checkbox.addEventListener("click", function() {
            this.classList.toggle("clicked");
        });
    });
    

    Array.from(resolveOnclick).forEach(function(button){
        button.addEventListener("click", function(){
            var caseId = this.getAttribute("data-case-id");

            fetch('/tanod-resolve-onClick', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({caseId : caseId})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success){
                    window.location.reload();
                } else{
                    alert('Error marking case as resolved');
                }
            })
            .catch(error => {
                console.error('Error: ', error);
            });
        });
    });

    function getSelectedCaseIds() {
        var selectedCases = [];
        Array.from(checkboxes).forEach(function(checkbox) {
            if (checkbox.classList.contains("clicked")) {
                selectedCases.push(checkbox.getAttribute("data-case-id"));
            }
        });
        return selectedCases;
    }


    deleteButton.addEventListener("click", function() {
        console.log("clicked");
        var selectedCases = getSelectedCaseIds();
        if (selectedCases.length > 0) {
            fetch('/tanod-delete-cases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ caseIds: selectedCases })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.reload();
                } else {
                    alert('Error deleting cases');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            alert('No cases selected');
        }
    });

    resolveButton.addEventListener("click", function() {
        console.log("clicked");
        var selectedCases = getSelectedCaseIds();
        if (selectedCases.length > 0) {
            fetch('/tanod-resolve-cases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ caseIds: selectedCases })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.reload();
                } else {
                    alert('Error marking cases as resolved');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            alert('No cases selected');
        }
    });



   
    

    // var status_btns = document.getElementsByClassName("status");

    // Array.from(status_btns).forEach(function(status_btns) {
    //     status_btns.addEventListener("click", function() {
    //         var currentState = this.classList[1];
    //         var img = this.querySelector('img');
    //         var text = this.querySelector('span');

    //         if (currentState == "resolved") {
    //             this.classList.remove('resolved');
    //             this.classList.add('ongoing');
    //             img.src="/images/ongoing-circle.png"
    //             text.textContent = "Ongoing";
    //         } else {
    //             this.classList.remove('ongoing');
    //             this.classList.add('resolved');
    //             img.src="/images/resolved-circle.png"
    //             text.textContent = "Resolved";
    //         }
    //     });
    // });

    //var sort_btns = document.getElementsByClassName("sort");

    // Array.from(sort_btns).forEach(function(sort_btns) {
    //     sort_btns.addEventListener("click", function() {
    //         var currentState = this.classList[1];
    //         var img = this.querySelector('img');

    //         if (currentState == "descending") {
    //             this.classList.remove('descending');
    //             this.classList.add('ascending');
    //             img.src="/images/sort-ascending.png"
    //         } else {
    //             this.classList.remove('ascending');
    //             this.classList.add('descending');
    //             img.src="/images/sort-descending.png"
    //         }
    //     });
    // });
});