
// Backend API URL
const API_URL = "http://localhost:8000";

// Get HTML elements
const pinGrid = document.getElementById("pinGrid");
const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");
const loadingMessage = document.getElementById("loadingMessage");


// Fetch Pins from FastAPI
async function loadPins() {

    try {

        const response = await fetch(`${API_URL}/pins/`);

        if (!response.ok) {
            throw new Error("Could not fetch Pins");
        }

        const pins = await response.json();

        // Clear previous cards
        pinGrid.innerHTML = "";

        // Display Pins
        pins.forEach(function(pin) {

            const card = document.createElement("article");

            card.className = "pin-card";

            card.dataset.title = (
                pin.title + " " + (pin.description || "")
            ).toLowerCase();

            const imageWrapper = document.createElement("div");
            imageWrapper.className = "pin-image-wrapper";

            const image = document.createElement("img");
            image.src = `${API_URL}${pin.image_url}`;
            image.alt = pin.title;
            image.loading = "lazy";

            const saveButton = document.createElement("button");
            saveButton.className = "save-btn";
            saveButton.textContent = "Save";

            saveButton.addEventListener("click", function() {

                saveButton.classList.toggle("saved");

                saveButton.textContent =
                    saveButton.classList.contains("saved")
                    ? "Saved"
                    : "Save";

            });

            const title = document.createElement("h6");
            title.textContent = pin.title;

            const description = document.createElement("p");
            description.textContent = pin.description || "";

            imageWrapper.appendChild(image);
            imageWrapper.appendChild(saveButton);

            card.appendChild(imageWrapper);
            card.appendChild(title);
            card.appendChild(description);

            pinGrid.appendChild(card);

        });

        loadingMessage.classList.add("d-none");

        noResults.classList.toggle("d-none", pins.length !== 0);

    }

    catch (error) {

        console.error("Error loading Pins:", error);

        loadingMessage.textContent =
            "Unable to load ideas. Please try again.";

    }

}


// Search functionality
searchInput.addEventListener("input", function() {

    const searchText = searchInput.value.toLowerCase().trim();

    const cards = document.querySelectorAll(".pin-card");

    let visibleCards = 0;

    cards.forEach(function(card) {

        const title = card.dataset.title;

        if (title.includes(searchText)) {

            card.style.display = "inline-block";
            visibleCards++;

        } else {

            card.style.display = "none";

        }

    });

    noResults.classList.toggle("d-none", visibleCards !== 0);

});


// Load Pins when page opens
loadPins();
