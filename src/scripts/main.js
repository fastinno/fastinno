// Initialize the applications data when alpine is currently initializing itself
document.addEventListener("alpine:init", () => {
    Alpine.data("application", () => ({
        menus: [
            {
                title: "About",
                link: "/company/about-us.html"
            },
            {
                title: "Services",
                link: "/#servicesPage"
            },
            {
                title: "Portfolios",
                link: "/company/portfolios.html"
            },
            {
                title: "Contact Us",
                link: "/connect/contact-us.html"
            }
        ],

        fullMenus: {
            Company: [
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
            Services: [
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
            Connect: [                
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

        doSomethingOnScroll() {
            // move up the top bar when page is scrolled to the end
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight && document.body.scrollHeight != 0) {
                this.$refs.topBar.classList.add("-mt-10")
                this.$refs.topBar.classList.remove("mt-5")
            } else {
                this.$refs.topBar.classList.add("mt-5")
                this.$refs.topBar.classList.remove("-mt-10")
            }

            // widen up the top bar when page is scrolled more than the top bar itself
            if (window.scrollY > this.$refs.topBar.getBoundingClientRect().top) {
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
