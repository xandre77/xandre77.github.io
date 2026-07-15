const roles = [
    "IT Support Enthusiast",
    "Cybersecurity Learner",
    "Networking Student",
    "Systems Administration Student"
];

let roleIndex = 0;

const roleText = document.querySelector(".typing-text span");

function changeRole() {
    roleText.textContent = roles[roleIndex];

    roleIndex++;

    if(roleIndex >= roles.length) {
        roleIndex = 0;
    }
}

changeRole();

setInterval(changeRole, 2500);
