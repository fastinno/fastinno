document.addEventListener('alpine:init', () => {
    Alpine.data('application', () => ({
        menus: [
            "About",
            "Portfolio",
            "Solutions",
            "Contact Us"
        ],
    }))
})
