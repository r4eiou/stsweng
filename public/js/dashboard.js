document.addEventListener("DOMContentLoaded", function() {
    var checkboxes = document.getElementsByClassName("checkbox");
    var deleteButton = document.getElementById("delete-btn");
    var resolveButton = document.getElementById("resolve-btn");
    var deleteButtonTanod = document.getElementById("delete-btn-tanod");
    var resolveButtonTanod = document.getElementById("resolve-btn-tanod");

    Array.from(checkboxes).forEach(function(checkbox) {
        checkbox.addEventListener("click", function() {
            this.classList.toggle("clicked");
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
            fetch('/lupon-delete-cases', {
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
            fetch('/lupon-resolve-cases', {
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

    deleteButtonTanod.addEventListener("click", function() {
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

    resolveButtonTanod.addEventListener("click", function() {
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

    var sort_btns = document.getElementsByClassName("sort");

    Array.from(sort_btns).forEach(function(sort_btns) {
        sort_btns.addEventListener("click", function() {
            var currentState = this.classList[1];
            var img = this.querySelector('img');

            if (currentState == "descending") {
                this.classList.remove('descending');
                this.classList.add('ascending');
                img.src="/images/sort-ascending.png"
            } else {
                this.classList.remove('ascending');
                this.classList.add('descending');
                img.src="/images/sort-descending.png"
            }
        });
    });
});