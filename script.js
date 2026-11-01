// Replace your original script.js with this entire file.
// This helper runs in the browser and reads your portfolio page.

function portfolioWords(value) {
    return String(value).toLowerCase().replace(/[’‘]/g, "'")
        .replace(/'s\b/g, '')
        .replace(/[^a-z0-9#+]+/g, ' ')
        .trim();
}

// Compare spelling, including swapped neighboring letters.
function portfolioDistance(a, b) {
    const rows = Array.from({ length: a.length + 1 }, () => []);

    for (let i = 0; i <= a.length; i++) rows[i][0] = i;
    for (let j = 0; j <= b.length; j++) rows[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            rows[i][j] = Math.min(
                rows[i - 1][j] + 1,
                rows[i][j - 1] + 1,
                rows[i - 1][j - 1] +
                    (a[i - 1] === b[j - 1] ? 0 : 1)
            );

            if (
                i > 1 && j > 1 &&
                a[i - 1] === b[j - 2] &&
                a[i - 2] === b[j - 1]
            ) {
                rows[i][j] = Math.min(
                    rows[i][j],
                    rows[i - 2][j - 2] + 1
                );
            }
        }
    }

    return rows[a.length][b.length];
}

function portfolioMatch(a, b) {
    if (a === b) return true;
    if (Math.min(a.length, b.length) < 5) return false;

    const allowedErrors =
        Math.min(a.length, b.length) >= 8 ? 2 : 1;

    return portfolioDistance(a, b) <= allowedErrors;
}

function portfolioReply(question, data, state = {}) {
    const result = (text, topic = '') => ({
        text,
        topic,
        pending: null
    });

    if (
        state.pending &&
        /^(yes|yeah|yep|correct|i mean xandre)[.!\s]*$/i.test(
            question.trim()
        )
    ) {
        question = state.pending;
    } else if (
        state.pending &&
        /^(no|nope)[.!\s]*$/i.test(question.trim())
    ) {
        return result(
            `I only have information from ${data.name}'s portfolio.`
        );
    }

    const text = portfolioWords(question);
    const words = text.split(' ');

    const has = (...keys) => keys.some(key =>
        key.includes(' ')
            ? text.includes(key)
            : words.some(word => portfolioMatch(word, key))
    );

    const join = list =>
        list.length
            ? list.join(', ')
            : 'Not listed in the portfolio';

    // Recognize common explicit name patterns.
    const nameParts = portfolioWords(data.name).split(' ');

    const named =
        question.match(
            /([a-z]+(?:\s+[a-z]+\.?){0,2})['’]s\b/i
        ) ||
        question.match(
            /\b(?:does|did|can|has)\s+(.+)/i
        ) ||
        question.match(
            /\b(?:what|where)\s+(?:is|are)\s+(.+?)\s+(?:email|phone|skills|school)\b/i
        ) ||
        question.match(
            /^(?:tell me about|who is|is his name)\s+(.+)/i
        );

    let assumedName = '';

    if (named && !has('compare', 'comparison')) {
        let candidate = portfolioWords(named[1]).split(' ');

        const skip = new Set(
            'what where when how who is are the a an about for of tell me does did can has his her he she they you i my your their it this that portfolio project projects system name skills education programming tools'
                .split(' ')
        );

        const pronouns = [
            'he', 'she', 'they', 'you', 'i',
            'his', 'her', 'my', 'your'
        ];

        while (
            candidate.length &&
            skip.has(candidate[0]) &&
            !pronouns.includes(candidate[0])
        ) {
            candidate.shift();
        }

        if (candidate.length && !skip.has(candidate[0])) {
            const stop = new Set(
                'know knw use learn study studies studying work worked attend graduate graduated have has is are a an the skills email phone project projects from with and in'
                    .split(' ')
            );

            const stopIndex = candidate.findIndex(
                word => stop.has(word)
            );

            candidate = candidate.slice(
                0,
                stopIndex < 0 ? 3 : stopIndex
            );

            const knownTopic = [
                ...data.programming,
                ...data.tools,
                ...data.projectTech
            ].some(
                item =>
                    portfolioWords(item) === candidate.join(' ')
            );

            if (candidate.length && !knownTopic) {
                const ownName = candidate.every(part =>
                    nameParts.some(known =>
                        portfolioMatch(part, known)
                    )
                );

                if (!ownName) {
                    const pattern = new RegExp(
                        candidate
                            .map(part => part + '\\.?')
                            .join('\\s+'),
                        'i'
                    );

                    return {
                        text:
                            `This portfolio belongs to ${data.name}. ` +
                            `Do you mean ${data.name.split(' ')[0]}?`,
                        topic: '',
                        pending: question.replace(
                            pattern,
                            data.name
                        )
                    };
                }

                if (
                    candidate.some(
                        part => !nameParts.includes(part)
                    )
                ) {
                    assumedName =
                        `Assuming you mean ${data.name}: `;
                }
            }
        }
    }

    const say = (answer, topic = '') =>
        result(assumedName + answer, topic);

    const platformNote =
        /web-based/i.test(data.project) &&
        data.projectTech.includes('Windows Forms')
            ? '\nThe description says web-based, while the technologies include Windows Forms. The platform needs clarification.'
            : '';

    const replies = {
        about: data.about,

        skills:
            `Programming and web technologies: ${join(data.programming)}.\n` +
            `Tools: ${join(data.tools)}.\n` +
            `Professional skills: ${join(data.professional)}.`,

        tools:
            `Listed tools: ${join(data.tools)}.`,

        education:
            `${data.about}\n` +
            'The portfolio does not state that he has graduated.',

        coursework:
            `Relevant coursework: ${join(data.coursework)}.`,

        projects:
            `${data.project}\n` +
            `Technologies: ${join(data.projectTech)}.` +
            platformNote,

        seminars: join(data.seminars),
        awards: join(data.awards),
        contact: data.contact,
        interests: data.about
    };

    if (has('compare', 'comparison')) {
        return say(
            `I can describe ${data.name}'s portfolio, but I do not have the other person's information.\n${replies.skills}`,
            'skills'
        );
    }

    if (
        has(
            'cert',
            'certification',
            'certifications',
            'certified',
            'certificate'
        )
    ) {
        return say(
            'Certifications are not listed in this portfolio. The seminars section lists events attended; it does not establish professional certification.'
        );
    }

    if (
        has('encryption', 'authentication', 'mechanism') ||
        (
            has('security', 'secure') &&
            has('project', 'voting', 'system')
        )
    ) {
        return say(
            'The project description says users can cast and manage votes securely, but it does not explain security mechanisms or individual implementation duties.',
            'projects'
        );
    }

    if (
        has(
            'age', 'birthday', 'birth', 'gpa',
            'salary', 'password', 'address'
        )
    ) {
        return say(
            'That detail is not provided in the displayed portfolio.'
        );
    }

    if (
        has(
            'graduate', 'graduated', 'graduation',
            'degree', 'school', 'university',
            'college', 'study', 'studies',
            'studying', 'education'
        ) &&
        !has('coursework', 'subjects', 'courses')
    ) {
        return say(replies.education, 'education');
    }

    if (
        has('cv', 'resume') &&
        has('read', 'inside', 'contents', 'experience')
    ) {
        return say(
            'The page links to a CV, but this helper only reads the displayed portfolio. It cannot read or verify the PDF contents.'
        );
    }

    if (
        has(
            'expert',
            'expertise',
            'advanced',
            'professional experience'
        )
    ) {
        return say(
            'The portfolio states his interests, skills, coursework, and academic project. It does not provide professional experience durations or expertise ratings.'
        );
    }

    if (
        has(
            'experience', 'employer', 'employment',
            'worked', 'job'
        ) ||
        /\bwork (at|for)\b/.test(text)
    ) {
        return say(
            'The portfolio says he is seeking internship and OJT opportunities. It does not list employment history, employers, or years of professional experience.'
        );
    }

    // Answer direct technology questions.
    const action = words.findIndex(word =>
        ['know', 'knw', 'use', 'learn'].some(
            key => portfolioMatch(word, key)
        )
    );

    if (
        action >= 0 &&
        words[action + 1] &&
        !has('project', 'projects', 'voting')
    ) {
        const target = words
            .slice(action + 1)
            .join(' ')
            .replace(/\b(programming language|language)\b/g, '')
            .replace(/\bvscode\b/g, 'visual studio code')
            .trim();

        const targets = target
            .split(/\s+(?:and|or)\s+/)
            .filter(Boolean);

        if (targets.length) {
            const answers = targets.map(item => {
                const equivalent = value =>
                    portfolioWords(value) === item ||
                    portfolioMatch(
                        item,
                        portfolioWords(value)
                    );

                const skill =
                    data.programming.find(equivalent);

                const tool =
                    data.tools.find(equivalent);

                const projectTech =
                    data.projectTech.find(equivalent);

                if (skill) {
                    return `${skill} is listed among his programming and web technologies; no proficiency level is given.`;
                }

                if (tool) {
                    return `${tool} is listed among his tools.`;
                }

                if (projectTech) {
                    return `${projectTech} is listed in his academic project's technologies; his individual duties are not specified.`;
                }

                const interests = [
                    'cybersecurity',
                    'networking',
                    'systems administration',
                    'it support'
                ];

                if (
                    interests.includes(item) &&
                    portfolioWords(data.about).includes(item)
                ) {
                    return `${item} is listed as an interest. A proficiency level is not stated.`;
                }

                return `“${item}” is not listed as a technology in this portfolio. That does not establish whether he knows or uses it.`;
            });

            return say(answers.join('\n'), 'skills');
        }
    }

    if (has('email', 'mail')) {
        return say(
            data.email || 'An email address is not listed.',
            'contact'
        );
    }

    if (has('phone', 'number', 'mobile')) {
        return say(
            data.phone || 'A phone number is not listed.',
            'contact'
        );
    }

    if (has('location', 'live', 'based')) {
        return say(
            data.location || 'A location is not listed.',
            'contact'
        );
    }

    if (has('github')) {
        return say(
            data.github
                ? `GitHub: ${data.github}`
                : 'A GitHub link is not listed.',
            'contact'
        );
    }

    if (has('linkedin')) {
        return say(
            data.linkedin
                ? `LinkedIn: ${data.linkedin}`
                : 'A LinkedIn link is not listed.',
            'contact'
        );
    }

    if (has('cv', 'resume', 'download')) {
        return say(
            data.cv
                ? `Use the Download CV button on the portfolio. Its linked filename is ${data.cv}. I cannot verify the PDF contents.`
                : 'A CV link is not listed.'
        );
    }

    if (has('name', 'who')) {
        return say(
            `This portfolio belongs to ${data.name}.`,
            'about'
        );
    }

    const topics = [
        ['coursework', ['coursework', 'subjects', 'courses']],
        ['tools', ['tools', 'software']],
        ['skills', [
            'skills', 'skill', 'abilities',
            'programming', 'languages', 'technologies'
        ]],
        ['projects', ['project', 'projects', 'voting']],
        ['seminars', [
            'seminar', 'seminars', 'training', 'summit'
        ]],
        ['awards', [
            'awards', 'award', 'honors',
            'honours', 'dean', 'achievements'
        ]],
        ['contact', ['contact', 'reach']],
        ['interests', [
            'interest', 'interests', 'cybersecurity',
            'networking', 'internship', 'ojt'
        ]],
        ['about', [
            'about', 'background', 'introduce', 'summary'
        ]]
    ];

    let found = topics.filter(
        ([, keys]) => has(...keys)
    );

    if (found.length > 1) {
        found = found.filter(
            ([topic]) => topic !== 'about'
        );
    }

    if (found.some(([topic]) => topic === 'skills')) {
        found = found.filter(
            ([topic]) => topic !== 'tools'
        );
    }

    if (found.length) {
        return say(
            found
                .map(([topic]) => replies[topic])
                .filter(Boolean)
                .join('\n\n'),
            found[0][0]
        );
    }

    const mentionedSkill = data.programming.find(item =>
        words.some(word =>
            portfolioMatch(word, portfolioWords(item))
        )
    );

    if (mentionedSkill) {
        return say(
            `${mentionedSkill} is listed among his programming and web technologies. A proficiency level is not stated.`,
            'skills'
        );
    }

    if (
        has('more', 'again') &&
        replies[state.topic]
    ) {
        return say(replies[state.topic], state.topic);
    }

    if (/^(hi|hello|hey|help)\b/.test(text)) {
        return say(
            `Hi! Ask me about ${data.name}'s skills, education, project, seminars, awards, or contact details.`
        );
    }

    return say(
        'I could not match that question to the displayed portfolio. Try asking about skills, education, projects, seminars, awards, or contact details. Unlisted information cannot be verified here.'
    );
}

function startPortfolioHelper() {
    if (
        document.getElementById('portfolio-chat-toggle')
    ) return;

    // Your original rotating role text.
    const roles = [
        'IT Support Enthusiast',
        'Cybersecurity Learner',
        'Networking Student',
        'Systems Administration Student'
    ];

    const roleText = document.querySelector(
        '.typing-text span'
    );

    let roleIndex = 0;

    function changeRole() {
        if (roleText) {
            roleText.textContent = roles[roleIndex];
        }

        roleIndex = (roleIndex + 1) % roles.length;
    }

    changeRole();

    if (
        !window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches
    ) {
        setInterval(changeRole, 2500);
    }

    // Read information from your original HTML.
    const read = selector =>
        document.querySelector(selector)
            ?.textContent.replace(/\s+/g, ' ').trim() || '';

    const list = selector =>
        [...document.querySelectorAll(selector)]
            .map(item => item.textContent.trim());

    const cards = [
        ...document.querySelectorAll('#skills .card')
    ];

    const skillList = title =>
        cards.find(
            card =>
                card.querySelector('h3')
                    ?.textContent.trim() === title
        );

    const cardList = title =>
        [...(skillList(title)?.querySelectorAll('p') || [])]
            .map(item => item.textContent.trim());

    const contactLine = label =>
        list('#contact .card p').find(
            line =>
                line.toLowerCase().startsWith(label)
        ) || '';

    const awardsSection = [
        ...document.querySelectorAll('.card-section')
    ].find(section =>
        /honors.*awards/i.test(
            section.querySelector('h2')?.textContent || ''
        )
    );

    const data = {
        name:
            read('.hero-content h1') ||
            'Xandre V. Landas',

        about: read('#about .card'),
        programming: cardList('Programming'),
        tools: cardList('Tools'),
        professional: cardList('Professional Skills'),
        coursework: list('#coursework .skill-box'),
        project: read('#projects .card > p'),
        projectTech: list('#projects .project-tech span'),
        seminars: list('#seminars .timeline-item'),

        awards: [
            ...(awardsSection?.querySelectorAll('.skill-box') || [])
        ].map(item => item.textContent.trim()),

        contact: list('#contact .card p').join('\n'),
        email: contactLine('email'),
        phone: contactLine('phone'),
        location: contactLine('location'),

        github:
            document.querySelector(
                'a[href*="github.com/"]'
            )?.href || '',

        linkedin:
            document.querySelector(
                'a[href*="linkedin.com/"]'
            )?.href || '',

        cv:
            document.querySelector(
                'a[href$=".pdf"]'
            )?.getAttribute('href') || ''
    };

    // Chat styling is added automatically.
    const style = document.createElement('style');

    style.textContent = `
        #portfolio-chat-toggle {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 2000;
            border: 0;
            border-radius: 30px;
            padding: 15px 20px;
            background: #58a6ff;
            color: #0d1117;
            font: 700 14px Arial, sans-serif;
            cursor: pointer;
            box-shadow: 0 5px 24px #0007;
        }

        #portfolio-chat {
            position: fixed;
            right: 20px;
            bottom: 85px;
            z-index: 2000;
            width: 360px;
            max-width: calc(100vw - 24px);
            height: 480px;
            max-height: calc(100dvh - 100px);
            display: flex;
            flex-direction: column;
            background: #161b22;
            color: #e6edf3;
            border: 1px solid #3c526c;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 12px 45px #0008;
            font: 14px Arial, sans-serif;
        }

        #portfolio-chat[hidden] {
            display: none;
        }

        #portfolio-chat * {
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }

        #portfolio-chat .pc-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding: 14px;
            background: #212c3a;
        }

        #portfolio-chat .pc-title {
            font-size: 15px;
            font-weight: 700;
        }

        #portfolio-chat .pc-head p {
            font-size: 11px;
            color: #bac8d8;
            margin-top: 4px;
        }

        #portfolio-chat .pc-head button {
            border: 0;
            background: transparent;
            color: #e6edf3;
            padding: 8px;
            font-size: 15px;
            cursor: pointer;
        }

        #portfolio-chat .pc-head button:hover {
            background: #ffffff14;
            border-radius: 5px;
        }

        #portfolio-chat .pc-messages {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            overscroll-behavior: contain;
            padding: 14px;
        }

        #portfolio-chat .pc-message {
            padding: 10px 12px;
            margin-bottom: 10px;
            border-radius: 10px;
            background: #263244;
            font-size: 13px;
            line-height: 1.6;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
        }

        #portfolio-chat .pc-user {
            background: #1c4268;
            margin-left: 25px;
        }

        #portfolio-chat .pc-message strong {
            display: block;
            color: #b9d8ff;
            font-size: 11px;
            margin-bottom: 4px;
        }

        #portfolio-chat .pc-suggestions {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            padding: 0 12px 10px;
        }

        #portfolio-chat .pc-suggestions button {
            border: 1px solid #3c526c;
            border-radius: 20px;
            background: transparent;
            color: #b9d8ff;
            padding: 7px 10px;
            font-size: 11px;
            cursor: pointer;
        }

        #portfolio-chat form {
            display: flex;
            gap: 8px;
            padding: 12px;
            border-top: 1px solid #30363d;
        }

        #portfolio-chat input {
            min-width: 0;
            flex: 1;
            background: #0d1117;
            color: #e6edf3;
            border: 1px solid #52657b;
            border-radius: 7px;
            padding: 10px;
            font-size: 13px;
        }

        #portfolio-chat .pc-send {
            border: 0;
            border-radius: 7px;
            background: #58a6ff;
            color: #0d1117;
            padding: 10px 12px;
            font-weight: 700;
            cursor: pointer;
        }

        #portfolio-chat .pc-note {
            font-size: 10px;
            line-height: 1.4;
            color: #afbdcd;
            padding: 0 12px 11px;
        }

        #portfolio-chat button:focus-visible,
        #portfolio-chat input:focus-visible,
        #portfolio-chat-toggle:focus-visible {
            outline: 3px solid #a5d1ff;
            outline-offset: 2px;
        }

        @media (max-width: 420px) {
            #portfolio-chat-toggle {
                right: 12px;
                bottom: 16px;
            }

            #portfolio-chat {
                right: 12px;
                bottom: 78px;
                max-height: calc(100dvh - 90px);
            }
        }
    `;

    document.head.append(style);

    const holder = document.createElement('div');

    // Only this fixed template uses HTML.
    // Visitor messages and replies are always rendered as text.
    holder.innerHTML = `
        <button
            id="portfolio-chat-toggle"
            type="button"
            aria-controls="portfolio-chat"
            aria-expanded="false"
        >
            Ask about Xandre
        </button>

        <aside
            id="portfolio-chat"
            role="dialog"
            aria-label="Portfolio helper"
            hidden
        >
            <div class="pc-head">
                <div>
                    <div class="pc-title">Portfolio helper</div>
                    <p>Answers from this page</p>
                </div>

                <div>
                    <button
                        type="button"
                        id="pc-clear"
                        aria-label="Start a new conversation"
                    >Reset</button>

                    <button
                        type="button"
                        id="pc-close"
                        aria-label="Close portfolio helper"
                    >✕</button>
                </div>
            </div>

            <div
                class="pc-messages"
                id="pc-messages"
                role="log"
                aria-label="Conversation"
                aria-live="polite"
                tabindex="0"
            ></div>

            <div class="pc-suggestions">
                <button
                    type="button"
                    data-pc-question="What are his skills?"
                >Skills</button>

                <button
                    type="button"
                    data-pc-question="Tell me about his project."
                >Project</button>

                <button
                    type="button"
                    data-pc-question="How can I contact him?"
                >Contact</button>
            </div>

            <form id="pc-form">
                <input
                    id="pc-input"
                    aria-label="Question about the portfolio"
                    placeholder="Ask about Xandre…"
                    maxlength="500"
                    autocomplete="off"
                >

                <button
                    class="pc-send"
                    type="submit"
                >Send</button>
            </form>

            <p class="pc-note">
                Rule-based helper · Common typos supported · Rephrase if needed
            </p>
        </aside>
    `;

    document.body.append(holder);

    const toggle = document.getElementById(
        'portfolio-chat-toggle'
    );

    const panel = document.getElementById('portfolio-chat');
    const input = document.getElementById('pc-input');
    const messages = document.getElementById('pc-messages');

    let state = {};

    function addMessage(label, text) {
        const bubble = document.createElement('div');

        bubble.className =
            'pc-message' +
            (label === 'You' ? ' pc-user' : '');

        const author = document.createElement('strong');
        author.textContent = label;

        bubble.append(
            author,
            document.createTextNode(text)
        );

        messages.append(bubble);

        while (messages.children.length > 40) {
            messages.firstElementChild.remove();
        }

        messages.scrollTop = messages.scrollHeight;
    }

    function closeChat() {
        panel.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
    }

    toggle.addEventListener('click', () => {
        if (!panel.hidden) return closeChat();

        panel.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
        input.focus();
    });

    document.getElementById('pc-close')
        .addEventListener('click', closeChat);

    panel.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeChat();
    });

    function reset() {
        state = {};
        messages.replaceChildren();

        addMessage(
            'Helper',
            `Hi! Ask me about ${data.name}'s portfolio. I use the information displayed on this page.`
        );
    }

    function ask(question) {
        question = question.trim().slice(0, 500);
        if (!question) return;

        addMessage('You', question);

        state = portfolioReply(question, data, state);

        addMessage('Helper', state.text);

        input.value = '';
        input.focus();
    }

    document.getElementById('pc-form')
        .addEventListener('submit', event => {
            event.preventDefault();
            ask(input.value);
        });

    holder.querySelectorAll('[data-pc-question]')
        .forEach(button => {
            button.addEventListener('click', () => {
                ask(button.dataset.pcQuestion);
            });
        });

    document.getElementById('pc-clear')
        .addEventListener('click', () => {
            reset();
            input.focus();
        });

    reset();
}

if (document.readyState === 'loading') {
    document.addEventListener(
        'DOMContentLoaded',
        startPortfolioHelper
    );
} else {
    startPortfolioHelper();
}
