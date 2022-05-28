// Initialize the applications data when alpine is currently initializing itself
document.addEventListener("alpine:init", () => {
    Alpine.data("application", () => ({
        menus: [
            "About",
            "Services",
            "Portfolios",
            "Contact Us"
        ],

        fullMenus: {
            "Company": [
                {
                    title: "About Us",
                    link: "/about-us"
                },
                {
                    title: "Portfolios",
                    link: "/portfolios"
                },
                {
                    title: "Careers",
                    link: "/careers"
                },
                {
                    title: "Team",
                    link: "/team"
                },
                {
                    title: "Open Source",
                    link: "/open-source"
                }
            ],
            "Services": [
                {
                    title: "Mobile App Development",
                    link: "/mobile-app-development"
                },
                {
                    title: "Desktop App Development",
                    link: "/desktop-app-development"
                },
                {
                    title: "Website Development",
                    link: "/website-development"
                },
                {
                    title: "Software Automation",
                    link: "/software-automation"
                },
                {
                    title: "Software Testing & QA",
                    link: "/software-testing"
                },
                {
                    title: "IoT Development",
                    link: "/iot-development"
                },
                {
                    title: "Embedded System",
                    link: "/embedded-system"
                },
                {
                    title: "Mini Game Development",
                    link: "/mini-game-development"
                },
                {
                    title: "Custom Software Solution",
                    link: "/custom-software-solution"
                }
            ],
            "Connect": [                
                {
                    title: "Contact Us",
                    link: "/contact-us"
                },
                {
                    title: "Blog",
                    link: "/blog"
                }
            ]
        },

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
