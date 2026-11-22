
// ==========================================
// 1. BACKEND API URL
// ==========================================

const API_URL = "http://localhost:8000";


// ==========================================
// 2. GET HTML ELEMENTS
// ==========================================

const pinGrid = document.getElementById("pinGrid");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const noResults = document.getElementById("noResults");
const loadingMessage = document.getElementById("loadingMessage");
// Navigation elements
const exploreNavBtn = document.getElementById("exploreNavBtn");
const savedNavBtn = document.getElementById("savedNavBtn");
const profileNavBtn = document.getElementById("profileNavBtn");

// Authentication elements
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

const signupMessage = document.getElementById("signupMessage");
const loginMessage = document.getElementById("loginMessage");

const loginNavBtn = document.getElementById("loginNavBtn");
const signupNavBtn = document.getElementById("signupNavBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userStatus = document.getElementById("userStatus");


// Upload elements
const uploadBtn = document.getElementById("uploadBtn");
const uploadForm = document.getElementById("uploadForm");
const uploadMessage = document.getElementById("uploadMessage");
const createPinBtn = document.getElementById("createPinBtn");

// Profile elements
const profileSection = document.getElementById("profileSection");
const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");
const profilePinCount = document.getElementById("profilePinCount");
const profilePinGrid = document.getElementById("profilePinGrid");
const profileNoPins = document.getElementById("profileNoPins");

// ==========================================
// 3. BOOTSTRAP MODAL INSTANCES
// ==========================================

const signupModal = new bootstrap.Modal(
    document.getElementById("signupModal")
);

const loginModal = new bootstrap.Modal(
    document.getElementById("loginModal")
);

const uploadModal = new bootstrap.Modal(
    document.getElementById("uploadModal")
);


// ==========================================
// 4. JWT TOKEN
// ==========================================

function getToken() {
    return localStorage.getItem("access_token");
}


// Get the IDs of pins saved by the logged-in user
async function getSavedPinIds() {
    if (!getToken()) {
        return new Set();
    }

    try {
        const response = await fetch(`${API_URL}/saved-pins/me`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem("access_token");
            updateNavbar();
            return new Set();
        }

        if (!response.ok) {
            throw new Error("Could not retrieve saved pins");
        }

        const savedPins = await response.json();

        return new Set(savedPins.map(pin => pin.id));

    } catch (error) {
        console.error("Error retrieving saved pins:", error);
        return new Set();
    }
}


// ==========================================
// 5. UPDATE NAVIGATION BAR
// ==========================================

function updateNavbar(username = null) {

    const loggedIn = Boolean(getToken());

    loginNavBtn.classList.toggle("d-none", loggedIn);
    signupNavBtn.classList.toggle("d-none", loggedIn);
    logoutBtn.classList.toggle("d-none", !loggedIn);
    userStatus.classList.toggle("d-none", !loggedIn);

    if (loggedIn) {

        userStatus.textContent = username
            ? `Hello, ${username}`
            : "Logged in";

    }

}


// ==========================================
// 6. SIGNUP FUNCTIONALITY
// ==========================================

signupForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    signupMessage.textContent = "Creating your account...";
    signupMessage.className = "small text-muted";

    const userData = {

        username: document.getElementById("signupUsername").value.trim(),
        email: document.getElementById("signupEmail").value.trim(),
        password: document.getElementById("signupPassword").value

    };

    try {

        const response = await fetch(`${API_URL}/users/register`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)

        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || "Registration failed");
        }

        signupMessage.textContent =
            "Account created successfully! Please log in.";

        signupMessage.className = "small text-success";

        signupForm.reset();

        setTimeout(function() {

            signupModal.hide();
            loginModal.show();

        }, 1000);

    }

    catch (error) {

        signupMessage.textContent = error.message;
        signupMessage.className = "small text-danger";

    }

});


// ==========================================
// 7. LOGIN FUNCTIONALITY
// ==========================================

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    loginMessage.textContent = "Logging in...";
    loginMessage.className = "small text-muted";

    const loginData = {

        email: document.getElementById("loginEmail").value.trim(),
        password: document.getElementById("loginPassword").value

    };

    try {

        const response = await fetch(`${API_URL}/users/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(loginData)

        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || "Login failed");
        }

        // Store JWT token
        localStorage.setItem("access_token", result.access_token);

        // Retrieve logged-in user's profile
        const profileResponse = await fetch(`${API_URL}/users/me`, {

            headers: {
                "Authorization": `Bearer ${getToken()}`
            }

        });

        if (!profileResponse.ok) {

            localStorage.removeItem("access_token");

            throw new Error("Could not retrieve your profile");

        }

        const profile = await profileResponse.json();

        updateNavbar(profile.username);

        loginMessage.textContent = "Login successful!";
        loginMessage.className = "small text-success";

        loginForm.reset();

        setTimeout(function() {

            loginModal.hide();

        }, 700);

    }

    catch (error) {

        loginMessage.textContent = error.message;
        loginMessage.className = "small text-danger";

    }

});


// ==========================================
// 8. LOGOUT FUNCTIONALITY
// ==========================================

logoutBtn.addEventListener("click", function() {

    localStorage.removeItem("access_token");

    updateNavbar();

    alert("You have logged out successfully.");

});


// ==========================================
// 9. LOAD PINS FROM FASTAPI
// ==========================================

async function loadPins(view = "explore") {
    try {
        loadingMessage.textContent = "Loading ideas...";
        loadingMessage.classList.remove("d-none");
        noResults.classList.add("d-none");

        // Choose the API based on the selected view
        const pinsEndpoint = view === "saved"
            ? `${API_URL}/saved-pins/me`
            : `${API_URL}/pins/`;

        // Fetch pins and saved pin IDs together
        const [pinsResponse, savedPinIds] = await Promise.all([
            fetch(pinsEndpoint, {
                headers: view === "saved"
                    ? { "Authorization": `Bearer ${getToken()}` }
                    : {}
            }),
            getSavedPinIds()
        ]);

        if (!pinsResponse.ok) {
            throw new Error("Could not fetch pins");
        }

        const pins = await pinsResponse.json();

        // Clear the existing feed
        pinGrid.innerHTML = "";

        // Create each pin card
        pins.forEach(function(pin) {
            const card = document.createElement("article");
            card.className = "pin-card";

            card.dataset.title =
                (pin.title + " " + (pin.description || "")).toLowerCase();

            const imageWrapper = document.createElement("div");
            imageWrapper.className = "pin-image-wrapper";

            const image = document.createElement("img");
            image.src = pin.image_url.startsWith("http")
            ? pin.image_url
            : `${API_URL}${pin.image_url}`;
            image.alt = pin.title;
            image.loading = "lazy";

            // Create Save button
            const saveButton = document.createElement("button");
            saveButton.className = "save-btn";

            let isSaved = savedPinIds.has(pin.id);

            function updateSaveButton() {
                saveButton.textContent = isSaved ? "Saved" : "Save";
                saveButton.classList.toggle("saved", isSaved);
            }

            updateSaveButton();

            // Save and Unsave functionality
            saveButton.addEventListener("click", async function() {
                if (!getToken()) {
                    alert("Please log in to save Pins.");
                    loginModal.show();
                    return;
                }

                saveButton.disabled = true;

                try {
                    const response = await fetch(
                        `${API_URL}/saved-pins/${pin.id}`,
                        {
                            method: isSaved ? "DELETE" : "POST",
                            headers: {
                                "Authorization": `Bearer ${getToken()}`
                            }
                        }
                    );

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(
                            result.detail || "Could not update saved pin"
                        );
                    }

                    isSaved = !isSaved;

                    // Remove unsaved pin from Saved view
                    if (view === "saved" && !isSaved) {
                        card.remove();

                        const remainingPins =
                            pinGrid.querySelectorAll(".pin-card").length;

                        noResults.classList.toggle(
                            "d-none",
                            remainingPins !== 0
                        );

                        noResults.textContent =
                            "You haven't saved any pins yet.";

                    } else {
                        updateSaveButton();
                    }

                } catch (error) {
                    console.error("Save pin error:", error);
                    alert(error.message);

                } finally {
                    saveButton.disabled = false;
                }
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

        noResults.textContent = view === "saved"
            ? "You haven't saved any pins yet."
            : "No pins available yet.";

        noResults.classList.toggle("d-none", pins.length !== 0);

    } catch (error) {
        console.error("Error loading pins:", error);
        loadingMessage.textContent =
            "Unable to load ideas. Please try again.";
    }
}


// Load logged-in user's profile
async function loadProfile() {

    if (!getToken()) {
        alert("Please log in to view your profile.");
        loginModal.show();
        return;
    }

    try {
        profilePinGrid.innerHTML = "";
        profileNoPins.classList.add("d-none");

        // Fetch user information and uploaded pins
        const [userResponse, pinsResponse] = await Promise.all([
            fetch(`${API_URL}/users/me`, {
                headers: {
                    "Authorization": `Bearer ${getToken()}`
                }
            }),

            fetch(`${API_URL}/users/me/pins`, {
                headers: {
                    "Authorization": `Bearer ${getToken()}`
                }
            })
        ]);

        if (!userResponse.ok || !pinsResponse.ok) {
            throw new Error("Could not load profile.");
        }

        const user = await userResponse.json();
        const pins = await pinsResponse.json();

        // Display user information
        profileUsername.textContent = user.username;
        profileEmail.textContent = user.email;
        profilePinCount.textContent = `${pins.length} Pins`;

        // Display uploaded pins
        pins.forEach(function(pin) {

            const card = document.createElement("article");
            card.className = "pin-card";

            const image = document.createElement("img");
            image.src = pin.image_url.startsWith("http")
            ? pin.image_url
            : `${API_URL}${pin.image_url}`;
            image.alt = pin.title;
            image.loading = "lazy";

            const title = document.createElement("h6");
            title.textContent = pin.title;

            const description = document.createElement("p");
            description.textContent = pin.description || "";

            card.appendChild(image);
            card.appendChild(title);
            card.appendChild(description);

            profilePinGrid.appendChild(card);
        });

        // Show message if user has no uploaded pins
        profileNoPins.classList.toggle("d-none", pins.length !== 0);

    } catch (error) {
        console.error("Profile loading error:", error);
        alert("Unable to load your profile. Please try again.");
    }
}




// Current page view
let currentView = "explore";

function showPage(page) {

    const elements = {
    pinGrid,
    profileSection,
    loadingMessage,
    noResults,
    exploreNavBtn,
    savedNavBtn,
    profileNavBtn
};

for (const [name, element] of Object.entries(elements)) {
    if (!element) {
        console.error("MISSING HTML ELEMENT:", name);
    }
}

    console.log("Checking page elements:");

    console.log("pinGrid:", pinGrid);
    console.log("profileSection:", profileSection);
    console.log("loadingMessage:", loadingMessage);
    console.log("noResults:", noResults);

    console.log("exploreNavBtn:", exploreNavBtn);
    console.log("savedNavBtn:", savedNavBtn);
    console.log("profileNavBtn:", profileNavBtn);

    // Hide all sections first
    pinGrid.classList.add("d-none");
    profileSection.classList.add("d-none");
    loadingMessage.classList.add("d-none");
    noResults.classList.add("d-none");

    // Remove active navbar styling
    exploreNavBtn.classList.remove("active");
    savedNavBtn.classList.remove("active");
    profileNavBtn.classList.remove("active");

    if (page === "explore") {
        pinGrid.classList.remove("d-none");
        exploreNavBtn.classList.add("active");
    }

    if (page === "saved") {
        pinGrid.classList.remove("d-none");
        savedNavBtn.classList.add("active");
    }

    if (page === "profile") {
        profileSection.classList.remove("d-none");
        profileNavBtn.classList.add("active");
    }
}

// Explore navigation
exploreNavBtn.addEventListener("click", function(event) {
    event.preventDefault();

    showPage("explore");
    searchInput.value = "";

    loadPins("explore");
});


// Saved navigation
savedNavBtn.addEventListener("click", function(event) {
    event.preventDefault();

    if (!getToken()) {
        alert("Please log in to view your saved Pins.");
        loginModal.show();
        return;
    }

    showPage("saved");
    searchInput.value = "";

    loadPins("saved");
});


// Profile navigation
profileNavBtn.addEventListener("click", function(event) {
    event.preventDefault();

    if (!getToken()) {
        alert("Please log in to view your profile.");
        loginModal.show();
        return;
    }

    showPage("profile");
    searchInput.value = "";

    loadProfile();
});


// ==========================================
// 10. SEARCH FUNCTIONALITY
// ==========================================

searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

});

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


// ==========================================
// 11. OPEN UPLOAD MODAL
// ==========================================

uploadBtn.addEventListener("click", function() {

    if (!getToken()) {

        alert("Please log in before uploading a Pin.");

        loginModal.show();

        return;

    }

    uploadModal.show();

});


// ==========================================
// 12. UPLOAD PIN TO FASTAPI
// ==========================================

uploadForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    // Get selected image
    const imageFile = document.getElementById("uploadImage").files[0];

    // Get title
    const title = document.getElementById("uploadTitle").value.trim();

    // Get description
    const description = document.getElementById("uploadDescription").value.trim();


    // Check image selection
    if (!imageFile) {

        uploadMessage.textContent = "Please select an image.";

        uploadMessage.className = "small text-danger";

        return;

    }


    // Check file size (5 MB)
    if (imageFile.size > 5 * 1024 * 1024) {

        uploadMessage.textContent = "Image must be 5 MB or less.";

        uploadMessage.className = "small text-danger";

        return;

    }


    // Prepare FormData
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", imageFile);


    try {

        createPinBtn.disabled = true;

        createPinBtn.textContent = "Uploading...";

        uploadMessage.textContent = "Uploading your Pin...";

        uploadMessage.className = "small text-muted";


        // Send request to FastAPI
        const response = await fetch(`${API_URL}/pins/`, {

            method: "POST",

            headers: {

                "Authorization": `Bearer ${getToken()}`

            },

            body: formData

        });


        const result = await response.json();


        if (!response.ok) {

            throw new Error(result.detail || "Pin upload failed");

        }


        // Success message
        uploadMessage.textContent = "Pin uploaded successfully!";

        uploadMessage.className = "small text-success";


        // Clear form
        uploadForm.reset();


        // Refresh Explore feed
        await loadPins();


        // Close upload modal
        setTimeout(function() {

            uploadModal.hide();

            uploadMessage.textContent = "";

        }, 1000);


    }

    catch (error) {

        uploadMessage.textContent = error.message;

        uploadMessage.className = "small text-danger";

        console.error("Pin upload error:", error);

    }

    finally {

        createPinBtn.disabled = false;

        createPinBtn.textContent = "Create Pin";

    }

});


// ==========================================
// 13. INITIALIZE HOMEPAGE
// ==========================================

updateNavbar();

loadPins();
