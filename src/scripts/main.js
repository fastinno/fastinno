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

        openTopBarOnScroll() {
            if (window.scrollY > this.$el.getBoundingClientRect().top) {
                this.isScrolled = true;
            } else {
                this.isScrolled = false;
            }
        },
    }));
});

// Remove placeholder layout when alpine is already initialized
document.addEventListener("alpine:initialized", () => {
    let cover = document.getElementById("cover");
    cover.remove();
});
