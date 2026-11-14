
// Get the search input
const searchInput = document.getElementById("searchInput");

// Get all image cards
const pinCards = document.querySelectorAll(".pin-card");

// Get the no-results message
const noResults = document.getElementById("noResults");

// Search functionality
searchInput.addEventListener("input", function () {

    const searchText = searchInput.value.toLowerCase().trim();

    let visibleCards = 0;

    pinCards.forEach(function (card) {

        const title = card.dataset.title.toLowerCase();

        if (title.includes(searchText)) {
            card.style.display = "inline-block";
            visibleCards++;
        } else {
            card.style.display = "none";
        }

    });

    // Show message if nothing matches
    if (visibleCards === 0) {
        noResults.classList.remove("d-none");
    } else {
        noResults.classList.add("d-none");
    }

});

// Save button functionality
const saveButtons = document.querySelectorAll(".save-btn");

saveButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        button.classList.toggle("saved");

        if (button.classList.contains("saved")) {
            button.textContent = "Saved";
        } else {
            button.textContent = "Save";
        }

    });

});

// Upload button (temporary demonstration)
const uploadButton = document.getElementById("uploadBtn");

uploadButton.addEventListener("click", function () {
    alert("Image upload functionality will be added in a later step!");
});
