// Initialize the applications data when alpine is currently initializing itself
document.addEventListener("alpine:init", () => {
    Alpine.data("application", () => ({
        menus: [
            "About",
            "Portfolio",
            "Solutions",
            "Contact Us"
        ],

        isScrolled: false,
    }));
});

// Remove placeholder layout when alpine is already initialized
document.addEventListener("alpine:initialized", () => {
    let cover = document.getElementById("cover");
    cover.remove();
});
