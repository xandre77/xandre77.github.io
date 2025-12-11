
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));

        this.classList.add('active');

        const sectionID = this.textContent.trim().toLowerCase();

        const section = document.getElementById(sectionID);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    });
});
