/* =====================================================
   PARTICLES
===================================================== */

const particleContainer =
    document.getElementById("particles");

const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");
const backToTop = document.getElementById("backToTop");

const particleCanvas = document.getElementById("particleCanvas");
const particleContext = particleCanvas.getContext("2d");
const pointer = { x: -1000, y: -1000, active: false };
let particles = [];
let canvasWidth = 0;
let canvasHeight = 0;

function createParticles() {
    const density = Math.min(95, Math.max(28, Math.floor(canvasWidth / 15)));
    particles = Array.from({ length: density }, () => ({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: (Math.random() - .5) * .25,
        vy: (Math.random() - .5) * .25,
        radius: Math.random() * 1.6 + .7
    }));
}

function resizeParticleCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    particleCanvas.width = canvasWidth * ratio;
    particleCanvas.height = canvasHeight * ratio;
    particleCanvas.style.width = `${canvasWidth}px`;
    particleCanvas.style.height = `${canvasHeight}px`;
    particleContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    createParticles();
}

function animateParticles() {
    particleContext.clearRect(0, 0, canvasWidth, canvasHeight);

    particles.forEach(particle => {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distance = Math.hypot(dx, dy);

        if (pointer.active && distance < 170 && distance > 0) {
            const force = (170 - distance) / 170;
            particle.vx -= (dx / distance) * force * .012;
            particle.vy -= (dy / distance) * force * .012;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= .995;
        particle.vy *= .995;

        if (particle.x < -20) particle.x = canvasWidth + 20;
        if (particle.x > canvasWidth + 20) particle.x = -20;
        if (particle.y < -20) particle.y = canvasHeight + 20;
        if (particle.y > canvasHeight + 20) particle.y = -20;

        particleContext.beginPath();
        particleContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        particleContext.fillStyle = "rgba(69, 217, 255, .6)";
        particleContext.fill();
    });

    for (let first = 0; first < particles.length; first++) {
        for (let second = first + 1; second < particles.length; second++) {
            const dx = particles[first].x - particles[second].x;
            const dy = particles[first].y - particles[second].y;
            const distance = Math.hypot(dx, dy);

            if (distance < 125) {
                particleContext.beginPath();
                particleContext.moveTo(particles[first].x, particles[first].y);
                particleContext.lineTo(particles[second].x, particles[second].y);
                particleContext.strokeStyle = `rgba(108, 124, 255, ${.16 * (1 - distance / 125)})`;
                particleContext.lineWidth = .6;
                particleContext.stroke();
            }
        }
    }

    if (pointer.active) {
        particleContext.beginPath();
        particleContext.arc(pointer.x, pointer.y, 3, 0, Math.PI * 2);
        particleContext.fillStyle = "rgba(255, 255, 255, .8)";
        particleContext.fill();
    }

    requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", resizeParticleCanvas);
window.addEventListener("pointermove", event => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
});
window.addEventListener("pointerleave", () => {
    pointer.active = false;
});

resizeParticleCanvas();
animateParticles();

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") {
    document.body.classList.add("light-theme");
}

function updateThemeButton() {
    const isLight = document.body.classList.contains("light-theme");
    themeToggle.textContent = isLight ? "☾" : "☼";
    themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
    );
}

updateThemeButton();

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    localStorage.setItem(
        "portfolio-theme",
        document.body.classList.contains("light-theme") ? "light" : "dark"
    );
    updateThemeButton();
});

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );
    menuToggle.textContent = isOpen ? "×" : "☰";
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        menuToggle.textContent = "☰";
    });
});

const roles = [
    "Computer Science Student",
    "Software Developer",
    "AI/ML Enthusiast"
];
const roleText = document.getElementById("roleText");
let roleIndex = 0;
let characterIndex = 0;
let deleting = false;

function typeRole() {
    const role = roles[roleIndex];

    if (!deleting && characterIndex < role.length) {
        characterIndex++;
        roleText.textContent = role.slice(0, characterIndex);
        setTimeout(typeRole, 75);
    } else if (deleting && characterIndex > 0) {
        characterIndex--;
        roleText.textContent = role.slice(0, characterIndex);
        setTimeout(typeRole, 55);
    } else {
        deleting = !deleting;
        if (!deleting) {
            roleIndex = (roleIndex + 1) % roles.length;
        }
        setTimeout(typeRole, 1600);
    }
}

typeRole();

const sections = [...document.querySelectorAll("section[id]")];
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.querySelectorAll("a").forEach(link => {
            const isActive = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("active", isActive);
            if (isActive) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });
    });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });

sections.forEach(section => sectionObserver.observe(section));

document.querySelectorAll(".project-filter").forEach(filterButton => {
    filterButton.addEventListener("click", () => {
        const filter = filterButton.dataset.filter;

        document.querySelectorAll(".project-filter").forEach(button => {
            button.classList.toggle("active", button === filterButton);
        });

        document.querySelectorAll(".project").forEach(project => {
            const matches = filter === "all" || project.dataset.category.includes(filter);
            project.classList.toggle("is-hidden", !matches);
        });
    });
});

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", event => {
    event.preventDefault();
    formStatus.textContent = "";
    formStatus.className = "form-status";

    const formData = new FormData(contactForm);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const message = formData.get("message").trim();
    const fields = [
        { id: "contactName", value: name, message: "Please enter your name." },
        { id: "contactEmail", value: email, message: "Please enter a valid email." },
        { id: "contactMessage", value: message, message: "Please add a message." }
    ];
    let isValid = true;

    fields.forEach(field => {
        const container = document.getElementById(field.id).closest(".form-field");
        const error = document.querySelector(`[data-error-for="${field.id}"]`);
        const emailIsValid = field.id !== "contactEmail" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
        const valid = Boolean(field.value) && emailIsValid;
        container.classList.toggle("invalid", !valid);
        error.textContent = valid ? "" : field.message;
        isValid = isValid && valid;
    });

    if (!isValid) {
        formStatus.textContent = "Please correct the highlighted fields.";
        formStatus.classList.add("error");
        return;
    }

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
    formStatus.textContent = "Opening your email client...";
    formStatus.classList.add("success");
    window.location.href = `mailto:poojadas100207@gmail.com?subject=${subject}&body=${body}`;
});

window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 500);
});

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


for(let i = 0; i < 90; i++){

    const p =
        document.createElement("span");

    p.className =
        "particle";

    p.style.left =
        Math.random() * 100 + "%";

    p.style.top =
        (70 + Math.random() * 50) + "%";

    p.style.animationDuration =
        (8 + Math.random() * 15) + "s";

    p.style.animationDelay =
        (-Math.random() * 15) + "s";

    particleContainer.appendChild(p);

}


/* =====================================================
   SCROLL REVEAL
===================================================== */

const observer =
    new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if(entry.isIntersecting){

                    entry.target
                        .classList
                        .add("visible");

                }

            });

        },

        {
            threshold: .12
        }

    );


document
    .querySelectorAll(".reveal")
    .forEach(el => {

        observer.observe(el);

    });


/* =====================================================
   PROFILE 3D MOVEMENT
===================================================== */

const profileRing =
    document.getElementById("profileRing");


document.addEventListener(
    "mousemove",
    (e) => {

        if(window.innerWidth < 950)
            return;

        const x =
            e.clientX /
            window.innerWidth -
            .5;

        const y =
            e.clientY /
            window.innerHeight -
            .5;

        profileRing.style.transform =

            `perspective(1000px)
             rotateY(${x * 8}deg)
             rotateX(${y * -8}deg)`;

    }
);


/* =====================================================
   PROJECT 3D HOVER
===================================================== */

document
    .querySelectorAll(".project")
    .forEach(card => {

        card.addEventListener(
            "mousemove",
            e => {

                if(window.innerWidth < 950)
                    return;

                const rect =
                    card.getBoundingClientRect();

                const x =
                    e.clientX -
                    rect.left;

                const y =
                    e.clientY -
                    rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateX =
                    (y - centerY) / 40;

                const rotateY =
                    (centerX - x) / 40;

                card.style.transform =

                    `perspective(800px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-6px)`;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "";

            }
        );

    });


/* =====================================================
   CERTIFICATE IMAGE POPUP
===================================================== */

function openCertificate(imageSrc) {

    const modal =
        document.getElementById(
            "certificateModal"
        );

    const image =
        document.getElementById(
            "certificateModalImage"
        );

    const pdf =
        document.getElementById(
            "certificateModalPdf"
        );

    const isPdf = imageSrc.toLowerCase().endsWith(".pdf");

    image.hidden = isPdf;
    pdf.hidden = !isPdf;

    if (isPdf) {
        pdf.src = imageSrc;
    } else {
        image.src = imageSrc;
        pdf.removeAttribute("src");
    }

    modal.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";

}


function closeCertificate() {

    const modal =
        document.getElementById(
            "certificateModal"
        );

    modal.classList.remove(
        "active"
    );

    document
        .getElementById("certificateModalPdf")
        .removeAttribute("src");

    document.body.style.overflow =
        "";

}


/* =====================================================
   CLOSE MODAL OUTSIDE
===================================================== */

document
    .getElementById("certificateModal")
    .addEventListener(
        "click",
        function(event){

            if(event.target === this){

                closeCertificate();

            }

        }
    );


/* =====================================================
   ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    function(event){

        if(event.key === "Escape"){

            closeCertificate();

        }

    }
);


function showSkills(category, button) {

    // Remove active state from all buttons
    document.querySelectorAll(".skill-tab").forEach(tab => {
        tab.classList.remove("active");
    });

    // Activate clicked button
    button.classList.add("active");

    // Get all skill cards
    const skills = document.querySelectorAll(".skill-card");

    skills.forEach(skill => {

        if (category === "all") {

            skill.classList.remove("hide");

        } else {

            if (skill.classList.contains(category)) {

                skill.classList.remove("hide");

            } else {

                skill.classList.add("hide");

            }

        }

    });

}
