/* Portfolio Helper 2.0 — replace your entire script.js with this file.
   No API, dependencies, backend, or installation. Facts come from the page.
   Common question patterns are supported; this is not a generative AI model. */
(function () {
    'use strict';

    const ROLES = [
        'IT Support Enthusiast',
        'Cybersecurity Learner',
        'Networking Student',
        'Systems Administration Student'
    ];

    const MAX_INPUT = 500;

    // Optional approved facts: edit here only when you have a factual source.
    // Visible [data-portfolio-field="fieldName"] elements take precedence.
    const ADDITIONAL_FACTS = {
        graduationDate: null,
        availability: null,
        workArrangement: null,
        relocation: null,
        employment: null,
        completedInternship: null,
        certifications: null,
        proficiency: null,
        preferredLanguage: null,
        experienceYears: null,
        projectDuties: null,
        projectArchitecture: null,
        projectSecurity: null,
        projectDate: null,
        gpa: null,
        rank: null,
        age: null,
        fullAddress: null,
        spokenLanguages: null,
        rates: null,
        hobbies: null,
        references: null
    };

    const MISSING = {
        graduationDate:
            'A graduation date is not provided.',
        availability:
            'An internship start date or availability schedule is not stated. Please contact the owner to discuss availability.',
        workArrangement:
            'A preferred work arrangement is not stated.',
        relocation:
            'Willingness to relocate is not stated. Please contact the owner to discuss the opportunity.',
        employment:
            'Employment history, employers, and employment durations are not listed in the displayed portfolio.',
        completedInternship:
            'A completed internship is not stated. Seeking an opportunity does not establish that one has been completed.',
        certifications:
            'Professional certifications are not listed. Seminar attendance does not establish certification.',
        proficiency:
            'Proficiency levels, expertise ratings, and professional experience durations are not stated.',
        preferredLanguage:
            'A strongest or preferred programming language is not identified.',
        experienceYears:
            'Years of use or professional experience are not provided.',
        projectDuties:
            'Specific individual features, implementation responsibilities, and code contributions are not provided.',
        projectArchitecture:
            'Detailed project architecture is not provided.',
        projectSecurity:
            'The description does not explain authentication, encryption, or other security mechanisms.',
        projectDate:
            'A project completion date is not stated.',
        gpa:
            'A GPA or numerical grade average is not provided.',
        rank:
            'A class ranking is not stated. Academic recognition does not establish a particular rank.',
        age:
            'Age and date of birth are not provided.',
        fullAddress:
            'A full residential address is not provided.',
        spokenLanguages:
            'Spoken-language proficiency is not listed. Programming technologies do not establish spoken-language ability.',
        rates:
            'Service rates or salary expectations are not stated. Please contact the owner to discuss the opportunity.',
        hobbies:
            'Personal hobbies are not listed. IT-related interests are described separately.',
        references:
            'Personal or professional references are not listed.'
    };

    const GLOSSARY = {
        ojt:
            'OJT means on-the-job training.',
        bsit:
            'BSIT means Bachelor of Science in Information Technology.',
        cv:
            'A CV presents a person’s education, qualifications, and experience. A link alone does not give this helper its contents.',
        'it support':
            'IT support involves helping people resolve computer, software, and related technical problems.',
        networking:
            'Computer networking concerns connections and communication between devices.',
        'systems administration':
            'Systems administration involves maintaining and managing computer systems.',
        cybersecurity:
            'Cybersecurity concerns protecting systems, accounts, and information.',
        'professional skills':
            'Professional skills are workplace-related abilities such as communication, collaboration, problem solving, and adaptability.',
        'html and css':
            'HTML describes webpage structure, while CSS controls its presentation.',
        'java and javascript':
            'Java and JavaScript are different programming languages. Listing one does not establish knowledge of the other.'
    };

    const TECHNOLOGIES = {
        Java: ['java'],
        JavaScript: ['javascript', 'java script', 'js'],
        Python: ['python', 'pythn'],
        SQL: ['sql'],
        HTML: ['html'],
        CSS: ['css'],
        'C#': ['c#', 'csharp', 'c sharp'],
        C: ['c'],
        'C++': ['c++', 'cpp', 'c plus plus'],
        React: ['react', 'reactjs', 'react js'],
        PHP: ['php'],
        Ruby: ['ruby'],
        Rust: ['rust'],
        Go: ['golang', 'go language'],
        TypeScript: ['typescript'],
        JavaFX: ['javafx'],
        MySQL: ['mysql'],
        PostgreSQL: ['postgresql', 'postgres'],
        MongoDB: ['mongodb'],
        'Node.js': ['node js', 'nodejs'],
        Express: ['express', 'expressjs'],
        Git: ['git', 'git commands'],
        GitHub: ['github', 'git hub'],
        'Visual Studio Code': [
            'visual studio code',
            'vs code',
            'vscode'
        ],
        'Visual Studio': ['visual studio'],
        'Windows Forms': [
            'windows forms',
            'winforms',
            'win forms'
        ],
        Linux: ['linux'],
        Docker: ['docker'],
        AWS: ['aws', 'amazon web services'],
        Azure: ['azure'],
        Unity: ['unity'],
        Figma: ['figma']
    };

    const SPELLINGS = {
        wat: 'what',
        wht: 'what',
        wher: 'where',
        abt: 'about',
        knw: 'know',
        knwo: 'know',
        skils: 'skills',
        skil: 'skill',
        emial: 'email',
        eamil: 'email',
        phoen: 'phone',
        cntact: 'contact',
        universty: 'university',
        educaton: 'education',
        projct: 'project',
        semnars: 'seminars',
        awrds: 'awards',
        certs: 'certifications',
        cert: 'certification',
        dbms: 'database management systems',
        oop: 'object oriented programming',
        'thank u': 'thank you',
        thx: 'thanks'
    };

    const TOPIC_WORDS = (
        'education university college school skills programming ' +
        'technologies tools software professional coursework subjects ' +
        'courses project projects voting seminars training awards honors ' +
        'contact email phone location certifications graduation interests ' +
        'networking cybersecurity internship availability employer employment ' +
        'encryption authentication portfolio background proficient proficiency ' +
        'responsibilities architecture'
    ).split(' ');

    const SECTION_NAMES = {
        about: 'About Me',
        skills: 'Technical Skills',
        coursework: 'Relevant Coursework',
        projects: 'Academic Projects',
        seminars: 'Seminars & Training',
        awards: 'Honors & Awards',
        contact: 'Contact Information'
    };

    const clean = value =>
        String(value || '').replace(/\s+/g, ' ').trim();

    const escapeRX = value =>
        value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const unique = list =>
        [...new Set(list.filter(Boolean))];

    const join = list =>
        list.length ? list.join(', ') : 'not listed';

    const base = value =>
        String(value || '')
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[’‘]/g, "'")
            .replace(/\bwhat's\b/g, 'what is')
            .replace(/\bdoesn't\b/g, 'does not')
            .replace(/\bdidn't\b/g, 'did not')
            .replace(/\bisn't\b/g, 'is not')
            .replace(/\bcan't\b/g, 'can not')
            .replace(/'s\b/g, '')
            .replace(/[^a-z0-9#+]+/g, ' ')
            .trim()
            .replace(/\s+/g, ' ');

    const contains = (text, phrase) =>
        new RegExp(
            '(^|[^a-z0-9#+])' +
            escapeRX(base(phrase)) +
            '(?![a-z0-9#+])'
        ).test(text);

    function distance(a, b) {
        if (Math.abs(a.length - b.length) > 2) return 3;

        const d = Array.from(
            { length: a.length + 1 },
            () => []
        );

        for (let i = 0; i <= a.length; i++) d[i][0] = i;
        for (let j = 0; j <= b.length; j++) d[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                d[i][j] = Math.min(
                    d[i - 1][j] + 1,
                    d[i][j - 1] + 1,
                    d[i - 1][j - 1] +
                        Number(a[i - 1] !== b[j - 1])
                );

                if (
                    i > 1 &&
                    j > 1 &&
                    a[i - 1] === b[j - 2] &&
                    a[i - 2] === b[j - 1]
                ) {
                    d[i][j] = Math.min(
                        d[i][j],
                        d[i - 2][j - 2] + 1
                    );
                }
            }
        }

        return d[a.length][b.length];
    }

    function normalize(value) {
        const protectedWords = new Set(
            Object.values(TECHNOLOGIES)
                .flat()
                .flatMap(base)
                .flatMap(s => s.split(' '))
        );

        return base(value)
            .split(' ')
            .map(word => {
                if (SPELLINGS[word]) return SPELLINGS[word];

                if (
                    word.length < 5 ||
                    /[0-9#+]/.test(word) ||
                    protectedWords.has(word)
                ) {
                    return word;
                }

                const candidates = TOPIC_WORDS.filter(key =>
                    distance(word, key) <=
                    (
                        Math.min(word.length, key.length) >= 9
                            ? 2
                            : 1
                    )
                );

                return candidates.length === 1
                    ? candidates[0]
                    : word;
            })
            .join(' ');
    }

    function initialState() {
        return {
            topic: '',
            topics: [],
            entity: null,
            pending: null
        };
    }

    function thirdPerson(text, name) {
        return text
            .replace(/\bI am\b/g, `${name} is`)
            .replace(/\bI enjoy\b/g, 'He enjoys')
            .replace(/\bI have\b/g, 'He has')
            .replace(/\bmy\b/gi, 'his')
            .replace(/\bI\b/g, 'he');
    }

    function findSection(doc, key) {
        if (key === 'awards') {
            return [
                ...doc.querySelectorAll('.card-section')
            ].find(el =>
                /honors.*awards|honours.*awards/i.test(
                    el.querySelector('h2')?.textContent || ''
                )
            ) || null;
        }

        return doc.getElementById(key);
    }

    function readFacts(doc) {
        const read = (selector, parent = doc) =>
            clean(parent.querySelector(selector)?.textContent);

        const list = (selector, parent = doc) =>
            [...parent.querySelectorAll(selector)]
                .map(el => clean(el.textContent))
                .filter(Boolean);

        const about = read('#about .card');
        const hero = read('.hero-content > p');
        const education = about + ' ' + hero;

        const name =
            read('.hero-content h1') ||
            read('header .logo');

        const skillCards = [
            ...doc.querySelectorAll('#skills .card')
        ];

        const skills = heading => {
            const card = skillCards.find(el =>
                base(read('h3', el)) === base(heading)
            );

            return card ? list('p', card) : [];
        };

        const contact = list('#contact .card p');

        const contactValue = label =>
            clean(
                contact.find(line =>
                    new RegExp(
                        '^' + label + '\\s*:',
                        'i'
                    ).test(line)
                )?.replace(/^[^:]+:\s*/, '')
            );

        const explicit = key =>
            read(`[data-portfolio-field="${key}"]`);

        const extra = {};

        for (const key of Object.keys(ADDITIONAL_FACTS)) {
            extra[key] =
                explicit(key) ||
                ADDITIONAL_FACTS[key];
        }

        extra.certifications ||= read('#certifications');
        extra.employment ||=
            read('#experience') ||
            read('#employment');

        const school =
            explicit('school') ||
            education.match(
                /\b(?:from|at)\s+([^.!?]*?\b(?:University|College|Institute|School))\b/i
            )?.[1] ||
            '';

        const degree =
            explicit('degree') ||
            education.match(
                /\bBachelor of [A-Za-z &-]+?(?=\s+student\b|[.,!?]|$)/i
            )?.[0] ||
            '';

        const year =
            explicit('year') ||
            education.match(
                /\b(?:incoming\s+)?(?:[1-6](?:st|nd|rd|th)|first|second|third|fourth|fifth|sixth)\s*(?:year|yr)\b/i
            )?.[0] ||
            '';

        const interestText =
            about.match(
                /\binterests?\s+(?:in|include)\s+(.+?)(?:[.!?]|$)/i
            )?.[1] ||
            '';

        const interests = interestText
            .split(/,|\band\b/i)
            .map(clean)
            .filter(Boolean);

        const goal =
            hero.match(
                /\bseeking\s+.+?(?:[.!?]|$)/i
            )?.[0]?.replace(/[.!?]$/, '') ||
            '';

        const projects = [
            ...doc.querySelectorAll('#projects .card')
        ].map(card => ({
            name: read('h3', card),

            description:
                list('p', card).find(
                    p => !/^technologies\s*:/i.test(p)
                ) || '',

            technologies:
                list('.project-tech span', card),

            links: [
                ...card.querySelectorAll('a[href]')
            ].map(el => ({
                label: clean(el.textContent),
                href: el.getAttribute('href')
            })).filter(link =>
                safeURL(link.href, doc.baseURI)
            )
        }));

        const awards = findSection(doc, 'awards');
        const cv = doc.querySelector('a[href$=".pdf"]');

        const fullLink = selector =>
            doc.querySelector(selector)
                ?.getAttribute('href') || '';

        return {
            name,
            firstName: name.split(' ')[0] || 'the owner',
            about: thirdPerson(about, name),
            hero,
            school: clean(school),
            degree: clean(degree),
            year: clean(year),
            interests,
            goal,

            graduated:
                /\b(?:graduated (?:from|in|with)|graduate of)\b/i
                    .test(education) &&
                !/\bnot (?:yet )?graduated\b/i
                    .test(education),

            programming: skills('Programming'),
            tools: skills('Tools'),
            professional: skills('Professional Skills'),

            coursework: list('#coursework .skill-box'),
            projects,
            seminars: list('#seminars .timeline-item'),

            awards:
                awards ? list('.skill-box', awards) : [],

            contact,
            email: contactValue('email'),
            phone: contactValue('phone'),
            location: contactValue('location'),

            github: fullLink('a[href*="github.com/"]'),
            linkedin: fullLink('a[href*="linkedin.com/"]'),

            cv: cv?.getAttribute('href') || '',

            photo:
                doc.querySelector('.hero-image img')
                    ?.getAttribute('src') || '',

            extra
        };
    }

    function safeURL(href, origin) {
        try {
            return [
                'http:',
                'https:',
                'mailto:',
                'tel:'
            ].includes(
                new URL(
                    href,
                    origin || 'https://example.invalid/'
                ).protocol
            );
        } catch {
            return false;
        }
    }

    function technologyMentions(text, facts) {
        const catalog = new Map(
            Object.entries(TECHNOLOGIES)
        );

        for (const value of [
            ...facts.programming,
            ...facts.tools,
            ...facts.projects.flatMap(
                p => p.technologies
            )
        ]) {
            if (!catalog.has(value)) {
                catalog.set(value, [base(value)]);
            }
        }

        const hits = [];

        for (const [name, aliases] of catalog) {
            for (const alias of aliases) {
                const rx = new RegExp(
                    '(^|[^a-z0-9#+])(' +
                    escapeRX(base(alias)) +
                    ')(?![a-z0-9#+])',
                    'g'
                );

                for (const match of text.matchAll(rx)) {
                    hits.push({
                        name,
                        start:
                            match.index +
                            match[1].length,
                        length: match[2].length
                    });
                }
            }
        }

        const selected = [];

        for (
            const hit of hits.sort(
                (a, b) => b.length - a.length
            )
        ) {
            if (
                !selected.some(other =>
                    hit.start <
                        other.start + other.length &&
                    other.start <
                        hit.start + hit.length
                )
            ) {
                selected.push(hit);
            }
        }

        let names = unique(
            selected
                .sort((a, b) => a.start - b.start)
                .map(hit => hit.name)
        );

        // Also interpret short technologies not in the catalog.
        const request = text.match(
            /\b(?:know|use|learn|familiar with|proficient in|skilled in|experience with)\s+(.+)/
        );

        if (
            request &&
            !/\b(project|voting|tools|software|programming|languages|technology|technologies)\b/
                .test(request[1])
        ) {
            for (
                let target of request[1].split(
                    /\s+(?:and|or)\s+/
                )
            ) {
                target = target
                    .replace(
                        /^how to (?:use |code in )?/,
                        ''
                    )
                    .replace(
                        /\s+(?:well|professionally|yet|already|for work)$/,
                        ''
                    )
                    .trim();

                if (
                    !target ||
                    target.split(' ').length > 4 ||
                    /^(it|that|this|them|anything|code)$/
                        .test(target)
                ) {
                    continue;
                }

                const alreadyMatched = selected.some(hit =>
                    contains(target, hit.name) ||
                    (catalog.get(hit.name) || []).some(
                        alias => contains(target, alias)
                    )
                );

                if (!alreadyMatched) {
                    const fuzzy = [
                        ...catalog.keys()
                    ].filter(name =>
                        base(name).length >= 5 &&
                        distance(
                            target,
                            base(name)
                        ) === 1
                    );

                    names.push(
                        fuzzy.length === 1
                            ? fuzzy[0]
                            : target
                    );
                }
            }
        }

        return unique(names);
    }

    function detectPerson(raw, facts) {
        if (!facts.name) return null;

        let masked = raw.replace(/[’‘]/g, "'");

        // Mask visitor introductions while preserving positions.
        masked = masked.replace(
            /\b(?:my name is|i am|i'm)\s+([a-z]+(?:\s+[a-z]+\.?){0,2})(?=[,.!?]|\s+(?:what|where|how|tell|can|does)\b|$)/gi,
            match => ' '.repeat(match.length)
        );

        const stop = new Set((
            'what where when how who whose is are was were the a an ' +
            'about for of tell me does did can has have know knw use ' +
            'learn study studies studying work worked attend attending ' +
            'listing graduate graduated available interested looking ' +
            'seeking good familiar expert from with and in email phone ' +
            'skills school degree year project projects full name owner ' +
            'helper chatbot portfolio website system this that these ' +
            'those it he his she her they their you your i my programming ' +
            'tools software networking cybersecurity opportunities'
        ).split(' '));

        const names = base(facts.name).split(' ');

        const nonPeople = unique([
            ...TOPIC_WORDS,

            ...Object.keys(GLOSSARY)
                .flatMap(a => base(a).split(' ')),

            ...Object.values(TECHNOLOGIES)
                .flat()
                .flatMap(a => base(a).split(' ')),

            ...base(facts.school).split(' '),

            'microsoft',
            'amazon',
            'google',
            'ateneo',
            'pcu',
            'bsit',
            'ojt',
            'gpa',
            'react',
            'blockchain'
        ]);

        let start = -1;
        let fragment = '';

        const possessive = [
            ...masked.matchAll(
                /\b([a-z]+(?:\s+[a-z]+\.?){0,2})'s\b/gi
            )
        ].at(-1);

        if (possessive) {
            start = possessive.index;
            fragment = possessive[1];
        }

        if (!fragment) {
            const direct =
                masked.match(
                    /\b(?:does|did|can|has)\s+(.+)/i
                ) ||
                masked.match(
                    /\b(?:tell me about|who is|is his name|what is|where is)\s+(.+)/i
                ) ||
                masked.match(/^is\s+(.+)/i);

            if (direct) {
                fragment = direct[1];

                start =
                    direct.index +
                    direct[0].length -
                    fragment.length;
            }
        }

        if (!fragment) return null;

        const tokens = [
            ...fragment.matchAll(/[a-z]+\.?/gi)
        ];

        const leadingWords = [
            'what', 'where', 'who', 'is', 'are',
            'about', 'for', 'of', 'tell', 'me', 'the'
        ];

        while (
            tokens.length &&
            leadingWords.includes(base(tokens[0][0]))
        ) {
            tokens.shift();
        }

        if (
            !tokens.length ||
            stop.has(base(tokens[0][0])) ||
            nonPeople.includes(base(tokens[0][0]))
        ) {
            return null;
        }

        const person = [];

        for (const token of tokens.slice(0, 3)) {
            if (stop.has(base(token[0]))) break;
            person.push(token);
        }

        if (!person.length) return null;

        const parts = person.map(p => base(p[0]));

        const owner = parts.every(part =>
            names.some(name =>
                part === name ||
                (
                    Math.min(
                        part.length,
                        name.length
                    ) >= 5 &&
                    distance(part, name) === 1
                )
            )
        );

        const from = start + person[0].index;
        const last = person.at(-1);

        return {
            owner,

            assumed:
                owner &&
                parts.some(p => !names.includes(p)),

            start: from,

            end:
                start +
                last.index +
                last[0].length
        };
    }

    const optional = (facts, field) =>
        facts.extra[field] !== null &&
        facts.extra[field] !== undefined &&
        facts.extra[field] !== ''
            ? `The portfolio states: ${facts.extra[field]}`
            : MISSING[field];

    const projectText = facts =>
        facts.projects.length
            ? facts.projects
                .map(p =>
                    `${p.name}: ${p.description}`
                )
                .join('\n')
            : 'An academic project section is not available.';

    const educationText = facts =>
        unique([
            facts.year &&
                `The stated academic status is ${facts.year}.`,

            facts.degree &&
                `Degree program: ${facts.degree}.`,

            facts.school &&
                `Institution: ${facts.school}.`
        ]).join(' ') ||
        'Education details are not available in the displayed sections.';

    const responseLibrary = {
        about: d =>
            d.about || educationText(d),

        identity: d =>
            d.name
                ? `This portfolio belongs to ${d.name}. ${educationText(d)}`
                : 'The owner’s name is not available in the expected page sections.',

        overview: () =>
            'This portfolio presents the owner’s background, skills, coursework, academic projects, seminars, awards, CV link, and contact details.',

        school: d =>
            d.school
                ? `The listed institution is ${d.school}.`
                : 'An institution is not available in the expected page sections.',

        degree: d =>
            d.degree
                ? `The stated degree program is ${d.degree}.`
                : 'A full degree title is not provided.',

        year: d =>
            d.year
                ? `The portfolio describes ${d.firstName} as ${d.year}.`
                : 'A year level is not stated.',

        education: educationText,

        graduated: d =>
            `${educationText(d)} ${
                d.graduated
                    ? 'The text explicitly mentions graduation.'
                    : 'The portfolio does not state that he has graduated or provide a complete education history.'
            }`,

        interests: d =>
            d.interests.length
                ? `His listed interests are ${join(d.interests)}.`
                : 'Career interests are not available in the expected page section.',

        goal: d =>
            d.goal
                ? `The portfolio states that he is ${
                    d.goal.charAt(0).toLowerCase() +
                    d.goal.slice(1)
                }.`
                : 'An internship or career goal is not stated.',

        skills: d =>
            `Programming and web technologies: ${join(d.programming)}.\n` +
            `Tools: ${join(d.tools)}.\n` +
            `Professional skills: ${join(d.professional)}.`,

        programming: d =>
            `His listed programming and web technologies are ${join(d.programming)}.`,

        tools: d =>
            `His listed tools are ${join(d.tools)}.`,

        professional: d =>
            `His listed professional skills are ${join(d.professional)}. Specific workplace examples are not provided.`,

        coursework: d =>
            `Relevant coursework: ${join(d.coursework)}.`,

        project: projectText,

        projectTech: d =>
            d.projects.length
                ? d.projects
                    .map(p =>
                        `${p.name} — listed technologies: ${join(p.technologies)}.`
                    )
                    .join('\n')
                : 'Project technologies are not listed.',

        projectTeam: d =>
            d.projects.some(p =>
                /\bco-developed\b/i.test(p.description)
            )
                ? 'The portfolio says he co-developed the system. It does not identify him as its sole developer.'
                : 'The project’s team arrangement or individual contribution is not specified.',

        platform: d =>
            d.projects.map(p =>
                /web[ -]based/i.test(p.description) &&
                p.technologies.some(t =>
                    /windows forms/i.test(t)
                )
                    ? `${p.name}: the description calls it web-based, while the technologies include Windows Forms. The platform needs clarification.`
                    : `${p.name}: ${p.description} Listed technologies: ${join(p.technologies)}. No further platform details are provided.`
            ).join('\n') ||
            'Project platform details are not provided.',

        projectLinks: d =>
            d.projects.some(p => p.links.length)
                ? d.projects
                    .flatMap(p => p.links)
                    .map(l =>
                        `${l.label || 'Project link'}: ${l.href}`
                    )
                    .join('\n')
                : 'A project-specific repository or live demonstration link is not supplied. A GitHub profile link does not establish a particular project repository.',

        projectCount: d =>
            `The portfolio lists ${d.projects.length} academic project${
                d.projects.length === 1 ? '' : 's'
            }${
                d.projects.length
                    ? ': ' + join(
                        d.projects.map(p => p.name)
                    )
                    : ''
            }.`,

        seminars: d =>
            d.seminars.length
                ? `Listed seminars and training:\n${d.seminars.join('\n')}`
                : 'Seminars are not listed in the expected section.',

        seminarExperience: () =>
            'Seminar attendance is listed, but it does not establish professional work experience, expert-level skills, or certification.',

        awards: d =>
            d.awards.length
                ? `Listed academic recognition:\n${d.awards.join('\n')}`
                : 'Academic awards are not listed in the expected section.',

        email: d =>
            d.email
                ? `His listed email address is ${d.email}.`
                : 'An email address is not listed.',

        phone: d =>
            d.phone
                ? `His listed phone number is ${d.phone}.`
                : 'A phone number is not listed.',

        location: d =>
            d.location
                ? `His listed location is ${d.location}.`
                : 'A location is not listed.',

        contact: d =>
            d.contact.length
                ? d.contact.join('\n')
                : 'Contact details are not listed.',

        github: d =>
            d.github
                ? `His listed GitHub profile is ${d.github}`
                : 'A GitHub profile link is not listed.',

        linkedin: d =>
            d.linkedin
                ? `His listed LinkedIn profile is ${d.linkedin}`
                : 'A LinkedIn profile link is not listed.',

        cv: d =>
            d.cv
                ? `Use the Download CV button. Its linked file is ${d.cv}. The helper has not read or verified the PDF.`
                : 'A CV link is not listed.',

        cvContents: () =>
            'This helper reads the displayed portfolio, not the linked PDF. The CV’s contents have not been supplied to it.',

        photo: d =>
            d.photo
                ? `The page references ${d.photo} as its profile image. This helper does not inspect or verify the image’s contents.`
                : 'A profile-image reference is not available.',

        send: d =>
            `I cannot send messages, submit applications, or schedule interviews automatically. Please use ${d.firstName}’s listed contact details.`,

        nature: () =>
            'I’m a rule-based portfolio helper. I match questions to information and prepared responses on this page; I do not use ChatGPT or a language model.',

        livePerson: d =>
            `You are speaking to the portfolio helper, not directly to ${d.name}. Please use the listed contact details to reach him.`,

        privacy: () =>
            'This helper keeps conversation context in the current page session only. Reloading the page or using Reset clears it. The helper itself does not send questions to an AI service or save them to a database.',

        api: () =>
            'This version does not use an API key. It processes questions locally using JavaScript rules and portfolio information.',

        immutable: () =>
            'Visitor messages do not change the portfolio’s facts. The website owner needs to update the source information.',

        suitability: () =>
            'The portfolio provides stated education, skills, interests, and academic work. It does not guarantee suitability for every role; specific requirements should be discussed with the owner.',

        correction: () =>
            'Please tell me which detail you mean. I use the information displayed in the portfolio and can sometimes misinterpret a question.',

        greeting: d =>
            `Hi! I can help you explore ${d.firstName}’s background, skills, coursework, project, seminars, awards, and contact details.`,

        thanks: () =>
            'You’re welcome! Let me know if you have another question about the portfolio.',

        goodbye: d =>
            `Thanks for visiting ${d.firstName}’s portfolio.`,

        fallback: () =>
            'I could not confidently match that question to the portfolio. Try rephrasing it or choose skills, education, projects, seminars, awards, or contact details.',

        unrelated: () =>
            'I help with questions about this portfolio. You can ask about education, skills, projects, seminars, awards, or contact details.'
    };

    /*
       Rules in the same family compete by specificity.
       Different requested fields can be combined.
       Priorities are matching heuristics, not probabilities.
    */
    const intentPatterns = [
        ['cvContents', 'cv', 100,
            c => c.m(/\b(cv|resume|pdf)\b/) &&
                 c.m(/\b(read|inside|contents|experience|in it)\b/),
            'about'],

        ['cv', 'cv', 40,
            c => c.m(/\b(cv|resume|download)\b/),
            'about'],

        ['projectDuties', 'project', 100,
            c => c.project &&
                 c.m(/\b(personally|individual|duties|responsibilities|contributions|exactly|which part|project role|specific role|implement)\b/),
            'projects'],

        ['projectSecurity', 'project', 110,
            c => c.m(/\b(encryption|authentication|oauth|hashing)\b/) ||
                 (
                     c.project &&
                     c.m(/\b(secure|security|mechanisms)\b/)
                 ),
            'projects'],

        ['projectArchitecture', 'project', 105,
            c => c.project &&
                 c.m(/\b(architecture|backend|front end|front-end|database schema|hosting stack)\b/),
            'projects'],

        ['platform', 'project', 95,
            c => c.project &&
                 c.m(/\b(platform|web based|desktop|windows forms|mobile based)\b/),
            'projects'],

        ['projectLinks', 'project', 95,
            c => c.m(/\b(repository|repositories|repo|source code|live demo|demonstration)\b/) &&
                 (
                     c.project ||
                     !c.m(/\bgit commands\b/)
                 ),
            'projects'],

        ['projectDate', 'project', 90,
            c => c.project &&
                 c.m(/\b(when|completion date|what year|which year|date completed)\b/),
            'projects'],

        ['projectCount', 'project', 85,
            c => c.m(/\bhow many (?:academic )?projects\b/),
            'projects'],

        ['projectTeam', 'project', 85,
            c => c.project &&
                 c.m(/\b(alone|sole|solo|team|co developed|by himself|make it himself)\b/),
            'projects'],

        ['projectTech', 'project', 80,
            c => c.project &&
                 c.m(/\b(technologies|technology|tools|software|used|use|stack)\b/),
            'projects'],

        ['project', 'project', 30,
            c => c.m(/\b(project|projects|voting|election)\b/) ||
                 (
                     c.project &&
                     c.m(/\bwhat does (?:it|the system) do\b/)
                 ),
            'projects'],

        ['graduationDate', 'education', 100,
            c => c.m(/\b(when|what year|which year|date)\b/) &&
                 c.m(/\b(graduate|graduated|graduation)\b/),
            'about'],

        ['graduated', 'education', 90,
            c => c.m(/\b(graduate|graduated|graduation|alumnus|alumna)\b/),
            'about'],

        ['year', 'education', 85,
            c => c.m(/\b(year level|what year is|which year is|what year level|academic status)\b/),
            'about'],

        ['school', 'education', 70,
            c => c.m(/\b(school|university|college|institution|pcu)\b|\bwhere.*\b(study|studies|studying)\b/),
            'about'],

        ['degree', 'education', 75,
            c => c.m(/\b(degree|degree program|bsit|what course is|what program is)\b/),
            'about'],

        ['education', 'education', 30,
            c => c.m(/\b(education|academic background)\b/),
            'about'],

        ['availability', 'career', 95,
            c => c.m(/\b(availability|available|when can he start|when can xandre start|start date|work schedule)\b/),
            'about'],

        ['workArrangement', 'career', 95,
            c => c.m(/\b(remote|onsite|on site|hybrid|work arrangement)\b/),
            'about'],

        ['relocation', 'career', 95,
            c => c.m(/\b(relocate|relocation|move for work)\b/),
            'about'],

        ['completedInternship', 'career', 90,
            c => c.m(/\b(internship|ojt)\b/) &&
                 c.m(/\b(completed|finished|already|done)\b/),
            'about'],

        ['goal', 'career', 40,
            c => c.m(/\b(internship|ojt|opportunities|opportunity|career goal|looking for a role)\b/),
            'about'],

        ['interests', 'interests', 40,
            c => c.m(/\b(interests|interest|career areas|career roles|interested in)\b/),
            'about'],

        ['spokenLanguages', 'skills', 110,
            c => c.m(/\b(spoken|speak|speaks|speaking|fluent|fluency|english proficiency)\b/),
            'skills'],

        ['preferredLanguage', 'skills', 100,
            c => c.m(/\b(strongest|preferred|favorite|favourite|best)\b/) &&
                 c.m(/\b(language|languages|technology|technologies|programming)\b/),
            'skills'],

        ['proficiency', 'skills', 95,
            c => c.m(/\b(expert|expertise|advanced|proficiency|rating|ratings|skill level)\b/),
            'skills'],

        ['experienceYears', 'experience', 100,
            c => c.m(/\b(how many years|years of|how long)\b/) &&
                 (
                     c.entities.length ||
                     c.state.entity ||
                     c.m(/\b(use|used|experience|work|worked)\b/)
                 ),
            'skills'],

        ['employment', 'experience', 70,
            c => c.m(/\b(employment|employers|employer|worked|work history|job history|past jobs|professional experience)\b|\bwork (?:at|for)\b|\bwhere.*\bwork\b/),
            'about'],

        ['gitSpecific', 'skills', 90,
            c => c.m(/\bgit commands\b|\bgit\b.*\bgithub\b|\bgithub\b.*\bgit\b/),
            'skills'],

        ['professional', 'skills', 80,
            c => c.m(/\b(professional skills|soft skills|communication|team collaboration|teamwork|adaptability|problem solving|troubleshooting|work in a team)\b/),
            'skills'],

        ['technology', 'skills', 75,
            c => c.entities.length > 0 &&
                 !c.project &&
                 !c.glossary &&
                 !c.m(/\b(subjects|coursework|courses|seminars|certification|certifications|awards|profile|link|repository|repo|full name)\b/),
            'skills'],

        ['tools', 'skills', 60,
            c => !c.project &&
                 c.m(/\b(tools|software|ide|editor|editors)\b/),
            'skills'],

        ['programming', 'skills', 55,
            c => !c.project &&
                 c.m(/\b(programming|programming languages|web technologies|languages)\b/),
            'skills'],

        ['skills', 'skills', 40,
            c => c.m(/\b(skills|skill|abilities|competencies|technical abilities)\b/),
            'skills'],

        ['coursework', 'coursework', 60,
            c => c.m(/\b(coursework|subjects|courses|studied|taken|dbms|object oriented programming)\b/) ||
                 (
                     c.m(/\b(study|studies|studying)\b/) &&
                     !c.m(/\b(where|school|university|college)\b/)
                 ),
            'coursework'],

        ['certifications', 'credentials', 100,
            c => c.m(/\b(certifications|certification|certified|certificates|certificate)\b/),
            'seminars'],

        ['seminarExperience', 'seminars', 90,
            c => c.m(/\b(seminar|seminars|attending|blockchain|devops|summit)\b/) &&
                 c.m(/\b(experience|expert|expertise|skills|certified)\b/),
            'seminars'],

        ['seminars', 'seminars', 30,
            c => c.m(/\b(seminars|seminar|training|summit|colloquium|bitskwela|freelancing)\b/),
            'seminars'],

        ['gpa', 'awards', 100,
            c => c.m(/\b(gpa|gwa|numerical grades|grade average|grades)\b/),
            'awards'],

        ['rank', 'awards', 95,
            c => c.m(/\b(rank|ranking|top student|number one|valedictorian)\b/),
            'awards'],

        ['awards', 'awards', 40,
            c => c.m(/\b(awards|award|honors|honours|dean|deans|recognition|achievements)\b/),
            'awards'],

        ['email', 'email', 70,
            c => c.m(/\b(email|mail|e mail)\b/),
            'contact'],

        ['phone', 'phone', 70,
            c => c.m(/\b(phone|telephone|mobile number|contact number|phone number)\b/),
            'contact'],

        ['fullAddress', 'location', 90,
            c => c.m(/\b(full address|complete address|home address|residential address|street address)\b/),
            'contact'],

        ['location', 'location', 40,
            c => !c.project &&
                 c.m(/\b(location|where.*live|where.*based|where.*located)\b/),
            'contact'],

        ['github', 'profiles', 60,
            c => !c.project &&
                 c.m(/\bgithub\b/) &&
                 !c.m(/\b(know|use|commands|tools|software)\b/),
            'contact'],

        ['linkedin', 'linkedin', 60,
            c => c.m(/\blinkedin\b/),
            'contact'],

        ['contact', 'contact', 30,
            c => c.m(/\b(contact|reach him|get in touch|reach xandre)\b/) &&
                 !c.m(/\b(email|phone|number)\b/),
            'contact'],

        ['age', 'personal', 90,
            c => c.m(/\b(age|birthday|date of birth|how old|born)\b/),
            'about'],

        ['hobbies', 'personal', 90,
            c => c.m(/\b(hobbies|hobby|free time|personal interests)\b/),
            'about'],

        ['references', 'personal', 90,
            c => c.m(/\b(personal references|professional references|reference people)\b/),
            'about'],

        ['rates', 'rates', 90,
            c => c.m(/\b(salary|rates|rate|charge|charges|how much.*hire|compensation)\b/),
            'contact'],

        ['suitability', 'suitability', 80,
            c => c.m(/\b(guaranteed|guarantee|suitable|suitability|qualified for|hire him|why hire)\b/),
            'about'],

        ['photo', 'photo', 50,
            c => c.m(/\b(photo|picture|portrait|profile image)\b/),
            'about'],

        ['api', 'helper', 100,
            c => c.m(/\b(api|api key|api keys|backend|nodejs|npm)\b/) &&
                 !c.project,
            ''],

        ['privacy', 'helper', 95,
            c => c.m(/\b(remember|tomorrow|privacy|store|stored|save chats|database|send my data|send my questions|learn from chat)\b/) &&
                 !c.project &&
                 !c.m(/\b(studied|coursework|subjects)\b/),
            ''],

        ['livePerson', 'helper', 90,
            c => c.m(/\b(speaking directly|talking directly|real xandre|are you xandre|is this xandre|human being|real person)\b/),
            ''],

        ['nature', 'helper', 70,
            c => c.m(/\b(chatgpt|language model|real ai|artificial intelligence|are you ai|how do you work|rule based)\b/),
            ''],

        ['identity', 'identity', 70,
            c => c.m(/\b(full name|his name|owner name|who owns|whose portfolio|portfolio about|who is (?:xandre|landas|this))\b/),
            'about'],

        ['overview', 'overview', 50,
            c => c.m(/\b(what can i (?:find|ask)|what.*website contain|what.*portfolio contain|help|menu|topics)\b/),
            ''],

        ['about', 'about', 20,
            c => c.m(/\b(about|background|introduce|summary|biography|bio)\b/),
            'about']
    ];

    function technologyAnswer(d, entities) {
        return entities.map(entity => {
            const inList = list =>
                list.some(value =>
                    base(value) === base(entity)
                );

            const programs = inList(d.programming);
            const tools = inList(d.tools);

            const projects = d.projects.filter(p =>
                inList(p.technologies)
            );

            if (programs) {
                return (
                    `${entity} is listed among his programming and web technologies` +
                    (
                        projects.length
                            ? ' and in the academic project’s technologies'
                            : ''
                    ) +
                    `. ${
                        d.extra.proficiency
                            ? 'Stated proficiency: ' +
                                d.extra.proficiency
                            : 'A proficiency level is not provided.'
                    }`
                );
            }

            if (tools) {
                return `${entity} is listed among his tools.`;
            }

            if (projects.length) {
                return (
                    `${entity} appears in ${
                        join(projects.map(p => p.name))
                    }’s technology list. ` +
                    optional(d, 'projectDuties')
                );
            }

            if (
                d.interests.some(value =>
                    base(value) === base(entity)
                )
            ) {
                return `${entity} is listed as an interest. A proficiency level is not stated.`;
            }

            return `${entity} is not listed as a technology in this portfolio. That does not establish whether he knows or uses it.`;
        }).join('\n');
    }

    function glossaryKey(text) {
        if (
            !/\b(what is|what are|what does|define|explain|meaning|means|stand for|difference)\b/
                .test(text) ||
            /\b(his|he|xandre|landas)\b/.test(text)
        ) {
            return '';
        }

        return Object.keys(GLOSSARY)
            .sort((a, b) => b.length - a.length)
            .find(key => contains(text, key)) ||
            '';
    }

    function makeAnswer(id, d, c) {
        if (id === 'technology') {
            return technologyAnswer(d, c.entities);
        }

        if (
            id === 'experienceYears' &&
            (c.entities[0] || c.state.entity)
        ) {
            return (
                `${c.entities[0] || c.state.entity}: ` +
                optional(d, 'experienceYears')
            );
        }

        if (
            id === 'experienceYears' &&
            c.m(/\b(work|worked|employer|employment)\b/)
        ) {
            return optional(d, 'employment');
        }

        if (id === 'graduationDate') {
            return optional(d, id) +
                (
                    c.m(/\bfrom\b/)
                        ? ' ' + educationText(d)
                        : ''
                );
        }

        if (id === 'projectDuties') {
            return (
                d.projects.some(p =>
                    /co-developed/i.test(p.description)
                )
                    ? 'His listed contribution is co-development. '
                    : ''
            ) + optional(d, id);
        }

        if (id === 'projectSecurity') {
            return optional(d, id) +
                ' The word “securely” alone does not establish a security implementation.';
        }

        if (id === 'proficiency') {
            return (
                c.m(/\bcybersecurity\b/) &&
                d.interests.some(i =>
                    /cybersecurity/i.test(i)
                )
                    ? 'Cybersecurity is listed as an interest and appears in related coursework. '
                    : ''
            ) + optional(d, id);
        }

        if (id === 'fullAddress') {
            return (
                d.location
                    ? `The listed location is ${d.location}. `
                    : ''
            ) + optional(d, id);
        }

        if (id === 'employment') {
            return (
                d.goal
                    ? responseLibrary.goal(d) + ' '
                    : ''
            ) + optional(d, id);
        }

        if (id === 'gitSpecific') {
            return (
                `GitHub ${
                    d.tools.some(t =>
                        base(t) === 'github'
                    )
                        ? 'is listed as a tool'
                        : 'is not listed as a tool'
                }. Knowledge of Git commands or version-control workflows is not specifically described.`
            );
        }

        if (
            id === 'coursework' &&
            c.m(/\b(security|cybersecurity|database|networking)\b/)
        ) {
            const term =
                c.m(/\bsecurity|cybersecurity\b/)
                    ? /security/i
                    : c.m(/\bdatabase\b/)
                        ? /database/i
                        : /networking/i;

            const matched = d.coursework.filter(
                course => term.test(course)
            );

            if (matched.length) {
                return `Listed relevant coursework: ${join(matched)}. Coursework does not establish professional certification.`;
            }
        }

        if (Object.hasOwn(MISSING, id)) {
            return optional(d, id);
        }

        return responseLibrary[id]?.(d) ||
            responseLibrary.fallback(d);
    }

    function classify(text, d, state) {
        const glossary = glossaryKey(text);

        if (glossary) {
            return {
                id: 'glossary',
                text: `General explanation: ${GLOSSARY[glossary]}`,
                sources: [],
                entity: null
            };
        }

        const entities = technologyMentions(text, d);

        const project =
            /\b(project|projects|voting|election|web based|desktop|the system)\b/
                .test(text) ||
            (
                (
                    state.topic.startsWith('project') ||
                    state.topic === 'platform'
                ) &&
                /\b(it|its|that|personally|implement|platform|architecture|authentication|encryption)\b/
                    .test(text)
            );

        const c = {
            text,
            state,
            entities,
            project,
            glossary,
            m: rx => rx.test(text)
        };

        const matches = intentPatterns.filter(
            ([, , , test]) => test(c)
        );

        const winners = new Map();

        for (const rule of matches) {
            if (
                !winners.has(rule[1]) ||
                winners.get(rule[1])[2] < rule[2]
            ) {
                winners.set(rule[1], rule);
            }
        }

        let chosen = [...winners.values()];

        if (chosen.some(r => r[0] !== 'about')) {
            chosen = chosen.filter(
                r => r[0] !== 'about'
            );
        }

        if (chosen.some(r => r[1] === 'project')) {
            chosen = chosen.filter(r =>
                ![
                    'skills',
                    'interests',
                    'profiles'
                ].includes(r[1])
            );
        }

        if (
            chosen.some(r =>
                r[0] === 'certifications'
            )
        ) {
            chosen = chosen.filter(r =>
                ![
                    'seminarExperience',
                    'seminars',
                    'proficiency',
                    'technology'
                ].includes(r[0])
            );
        }

        if (chosen.some(r => r[0] === 'coursework')) {
            chosen = chosen.filter(r =>
                ![
                    'school',
                    'education',
                    'technology',
                    'privacy'
                ].includes(r[0])
            );
        }

        if (
            chosen.some(r =>
                r[0] === 'seminarExperience'
            )
        ) {
            chosen = chosen.filter(r =>
                ![
                    'employment',
                    'proficiency',
                    'technology'
                ].includes(r[0])
            );
        }

        if (chosen.some(r => r[0] === 'cvContents')) {
            chosen = chosen.filter(r =>
                ![
                    'employment',
                    'experienceYears'
                ].includes(r[0])
            );
        }

        if (chosen.some(r => r[0] === 'goal')) {
            chosen = chosen.filter(
                r => r[0] !== 'interests'
            );
        }

        if (
            chosen.some(r =>
                ['github', 'linkedin'].includes(r[0])
            )
        ) {
            chosen = chosen.filter(
                r => r[0] !== 'technology'
            );
        }

        if (chosen.length) {
            return {
                id: chosen[0][0],
                ids: chosen.map(r => r[0]),

                text: unique(
                    chosen.map(r =>
                        makeAnswer(r[0], d, c)
                    )
                ).join('\n\n'),

                sources: unique(
                    chosen.map(r => r[4])
                ),

                entity:
                    entities.length === 1
                        ? entities[0]
                        : null
            };
        }

        if (
            d.interests.some(i =>
                contains(text, i)
            )
        ) {
            return {
                id: 'interests',
                text: responseLibrary.interests(d),
                sources: ['about'],
                entity: null
            };
        }

        if (/^(hi|hello|hey)(\s|$)/.test(text)) {
            return {
                id: 'greeting',
                text: responseLibrary.greeting(d),
                sources: [],
                entity: null
            };
        }

        if (/\b(thanks|thank you|thank u)\b/.test(text)) {
            return {
                id: 'thanks',
                text: responseLibrary.thanks(d),
                sources: [],
                entity: null
            };
        }

        if (/\b(goodbye|bye|see you)\b/.test(text)) {
            return {
                id: 'goodbye',
                text: responseLibrary.goodbye(d),
                sources: [],
                entity: null
            };
        }

        const unrelated =
            /\b(recipe|pancake|weather|capital of|write.*poem|football|lottery)\b/
                .test(text);

        return {
            id: unrelated ? 'unrelated' : 'fallback',

            text: responseLibrary[
                unrelated ? 'unrelated' : 'fallback'
            ](d),

            sources: [],
            entity: null
        };
    }

    function reply(
        question,
        facts,
        previous = initialState(),
        options = {}
    ) {
        const state = {
            ...initialState(),
            ...previous
        };

        const finish = (answer, pending = null) => ({
            ...answer,

            state: {
                topic:
                    answer.id === 'fallback' ||
                    [
                        'thanks',
                        'greeting',
                        'goodbye'
                    ].includes(answer.id)
                        ? state.topic
                        : answer.id,

                topics:
                    answer.ids || [answer.id],

                entity:
                    answer.entity || state.entity,

                pending
            }
        });

        if (
            typeof question !== 'string' ||
            !question.trim()
        ) {
            return finish({
                id: 'empty',
                text: 'Enter a question about the portfolio.',
                sources: []
            });
        }

        if (question.length > MAX_INPUT) {
            return finish({
                id: 'tooLong',
                text: `Please shorten your question to ${MAX_INPUT} characters or fewer.`,
                sources: []
            });
        }

        const raw = question.trim();
        const text = normalize(raw);

        if (state.pending?.type === 'person') {
            if (
                /^(yes|yeah|yep|correct|yes i mean xandre|i mean xandre|xandre)[.!\s]*$/i
                    .test(raw)
            ) {
                return reply(
                    state.pending.question,
                    facts,
                    {
                        ...state,
                        pending: null
                    },
                    { skipPerson: true }
                );
            }

            if (/^(no|nope)\b/.test(text)) {
                return finish({
                    id: 'otherPerson',
                    text: `I only have information from ${facts.name}’s portfolio, so I cannot provide the other person’s information.`,
                    sources: []
                });
            }
        }

        if (state.pending?.type === 'topic') {
            const choice = state.pending.choices.find(
                item => contains(text, item.label)
            );

            if (choice) {
                return reply(
                    choice.question,
                    facts,
                    {
                        ...state,
                        pending: null
                    },
                    { skipPerson: true }
                );
            }
        }

        if (
            /^(?:please )?(?:ignore|pretend|change|replace|update|invent|say he|say that|new facts|from now on)\b/
                .test(text)
        ) {
            return finish({
                id: 'immutable',
                text: responseLibrary.immutable(facts),
                sources: []
            });
        }

        if (
            /\b(that answer|your answer|the answer)\b.*\b(wrong|incorrect|inaccurate)\b|\bwrong answer\b/
                .test(text)
        ) {
            return finish({
                id: 'correction',
                text: responseLibrary.correction(facts),
                sources: []
            });
        }

        if (
            /\b(send|email him|submit|schedule|book)\b/
                .test(text) &&
            /\b(message|application|interview|appointment|email him|my cv)\b/
                .test(text)
        ) {
            return finish({
                id: 'send',
                text: responseLibrary.send(facts),
                sources: ['contact']
            });
        }

        if (
            /\b(compare|comparison|versus|vs)\b/.test(text) &&
            !/\bvs code\b/.test(text) &&
            !(
                /\b(java|html|visual studio)\b/.test(text) &&
                technologyMentions(text, facts).length > 1
            )
        ) {
            return finish({
                id: 'comparison',

                text:
                    `I can describe ${facts.name}’s portfolio, but the other person’s information is not available here.\n` +
                    responseLibrary.skills(facts),

                sources: ['skills']
            });
        }

        if (
            /\b(my friend|another person|different person|also called|also named)\b/
                .test(text)
        ) {
            return finish({
                id: 'personClarification',
                text: `Are you asking about this portfolio’s owner, ${facts.name}, or a different person?`,
                sources: []
            });
        }

        const person =
            !options.skipPerson &&
            detectPerson(raw, facts);

        if (person && !person.owner) {
            return finish({
                id: 'personClarification',
                text: `This portfolio belongs to ${facts.name}. Do you mean ${facts.firstName}?`,
                sources: []
            }, {
                type: 'person',

                question:
                    raw.slice(0, person.start) +
                    facts.name +
                    raw.slice(person.end)
            });
        }

        const prefix = person?.assumed
            ? `Assuming you mean ${facts.name}: `
            : '';

        const nav = text.match(
            /\b(?:show|go to|take me to|open)\s+(?:me\s+)?(?:the\s+)?(about|skills|coursework|projects|project|seminars|awards|honors|contact)(?:\s+section)?\b/
        );

        if (nav) {
            const section =
                nav[1] === 'project'
                    ? 'projects'
                    : nav[1] === 'honors'
                        ? 'awards'
                        : nav[1];

            return finish({
                id: 'navigation',
                text: `Here is the ${SECTION_NAMES[section]} section, if it is available on this page.`,
                sources: [section],
                action: section
            });
        }

        if (
            /^(?:and |what about )?(?:that|that one|it|which one|the other one)$/
                .test(text)
        ) {
            const choices = [
                {
                    label: 'skills',
                    question: 'What are his skills?'
                },
                {
                    label: 'project',
                    question: 'Tell me about his project.'
                },
                {
                    label: 'education',
                    question: 'What is his education?'
                }
            ];

            return finish({
                id: 'topicClarification',
                text: 'Which topic do you mean: skills, the project, or education?',
                sources: []
            }, {
                type: 'topic',
                choices
            });
        }

        if (
            /^(?:tell me )?(?:more|again|repeat)(?: please)?$/
                .test(text) &&
            state.topic
        ) {
            const answer = classify(
                state.topic === 'technology' &&
                state.entity
                    ? `does he know ${base(state.entity)}`
                    : state.topic,
                facts,
                state
            );

            return finish(answer);
        }

        const parts = text.split(
            /\?|;|\s+and\s+(?=(?:what|which|where|when|how|who|does|did|can|has|have|is|are|his)\b|(?:aws\s+)?certifications?\b|(?:skills|tools|professional skills|technical skills|coursework|seminars|education|school|degree|institution|year level|graduation|awards|work experience|gpa|email|phone|hobbies|salary|favorite|favourite)\b)/
        ).map(clean).filter(Boolean);

        if (parts.length > 6) {
            return finish({
                id: 'tooComplex',
                text: 'Please ask up to six related parts at a time so I can address each one clearly.',
                sources: []
            });
        }

        const answers = [];

        let current = {
            ...state,
            pending: null
        };

        for (const part of parts) {
            const answer = classify(
                part,
                facts,
                current
            );

            answers.push(answer);

            if (answer.id !== 'fallback') {
                current = {
                    ...current,
                    topic: answer.id,
                    entity:
                        answer.entity ||
                        current.entity
                };
            }
        }

        const ids = unique(
            answers.flatMap(
                answer => answer.ids || [answer.id]
            )
        );

        const answer = {
            id: answers[0]?.id || 'fallback',
            ids,

            text:
                prefix +
                unique(
                    answers.map(item => item.text)
                ).join('\n\n'),

            sources: unique(
                answers.flatMap(item => item.sources)
            ),

            entity: current.entity
        };

        return finish(answer);
    }

    function mount() {
        if (
            document.getElementById(
                'portfolio-chat-toggle'
            )
        ) {
            return;
        }

        const facts = readFacts(document);

        let state = initialState();
        let roleIndex = 0;

        const roleText = document.querySelector(
            '.typing-text span'
        );

        function changeRole() {
            if (roleText) {
                roleText.textContent = ROLES[roleIndex];
            }

            roleIndex = (roleIndex + 1) % ROLES.length;
        }

        changeRole();

        if (
            !window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches
        ) {
            setInterval(changeRole, 2500);
        }

        const style = document.createElement('style');
        style.id = 'portfolio-helper-style';

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
                width: 390px;
                max-width: calc(100% - 24px);
                height: 560px;
                max-height: calc(100vh - 100px);
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
                display: none !important;
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

            #portfolio-chat .pc-suggestions button,
            #portfolio-chat .pc-sources button,
            #portfolio-chat .pc-sources a {
                border: 1px solid #526a86;
                border-radius: 16px;
                background: transparent;
                color: #c4e0ff;
                padding: 6px 9px;
                font-size: 11px;
                cursor: pointer;
                text-decoration: none;
                line-height: 1.4;
                display: inline-block;
            }

            #portfolio-chat .pc-sources {
                display: flex;
                gap: 5px;
                flex-wrap: wrap;
                margin-top: 9px;
                padding-top: 8px;
                border-top: 1px solid #ffffff20;
                white-space: normal;
            }

            #portfolio-chat form {
                display: flex;
                gap: 8px;
                padding: 12px;
                border-top: 1px solid #30363d;
                flex-shrink: 0;
            }

            #portfolio-chat input {
                min-width: 0;
                flex: 1;
                background: #0d1117;
                color: #e6edf3;
                border: 1px solid #52657b;
                border-radius: 7px;
                padding: 10px;
                font-size: 14px;
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

            #portfolio-chat .pc-send:disabled {
                opacity: .45;
                cursor: default;
            }

            #portfolio-chat .pc-note {
                font-size: 10px;
                line-height: 1.4;
                color: #afbdcd;
                padding: 0 12px 11px;
            }

            #portfolio-chat button:focus-visible,
            #portfolio-chat input:focus-visible,
            #portfolio-chat a:focus-visible,
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
                    max-height: calc(100vh - 90px);
                    max-height: calc(100dvh - 90px);
                }
            }
        `;

        document.head.append(style);

        const holder = document.createElement('div');
        holder.id = 'portfolio-helper-root';

        // Fixed interface template only; no visitor input goes into HTML.
        holder.innerHTML = `
            <button
                id="portfolio-chat-toggle"
                type="button"
                aria-controls="portfolio-chat"
                aria-expanded="false"
            >
                Ask about the portfolio
            </button>

            <aside
                id="portfolio-chat"
                role="dialog"
                aria-labelledby="pc-title"
                aria-describedby="pc-note"
                hidden
            >
                <div class="pc-head">
                    <div>
                        <div
                            class="pc-title"
                            id="pc-title"
                        >Portfolio helper</div>

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
                    aria-relevant="additions"
                    tabindex="0"
                ></div>

                <div
                    class="pc-suggestions"
                    id="pc-suggestions"
                    aria-label="Suggested questions"
                ></div>

                <form id="pc-form">
                    <input
                        id="pc-input"
                        aria-label="Question about the portfolio"
                        placeholder="Ask a portfolio question…"
                        maxlength="500"
                        autocomplete="off"
                    >

                    <button
                        class="pc-send"
                        id="pc-send"
                        type="submit"
                        disabled
                    >Send</button>
                </form>

                <p
                    class="pc-note"
                    id="pc-note"
                >
                    Rule-based helper · Common patterns supported · Rephrase if needed
                </p>
            </aside>
        `;

        document.body.append(holder);

        const toggle = document.getElementById(
            'portfolio-chat-toggle'
        );

        const panel = document.getElementById(
            'portfolio-chat'
        );

        const input = document.getElementById('pc-input');
        const messages = document.getElementById('pc-messages');
        const send = document.getElementById('pc-send');

        toggle.textContent =
            `Ask about ${facts.firstName}`;

        function closeChat() {
            panel.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus({ preventScroll: true });
        }

        function navigate(key) {
            const section = findSection(document, key);
            if (!section) return;

            closeChat();

            const headerHeight = Math.ceil(
                document.querySelector('header')
                    ?.getBoundingClientRect().height || 70
            );

            section.style.scrollMarginTop =
                `${headerHeight + 12}px`;

            section.scrollIntoView({
                behavior:
                    window.matchMedia(
                        '(prefers-reduced-motion: reduce)'
                    ).matches
                        ? 'auto'
                        : 'smooth',
                block: 'start'
            });

            const heading = section.querySelector('h2');

            if (heading) {
                heading.tabIndex = -1;
                heading.focus({ preventScroll: true });
            }
        }

        function addMessage(label, text, answer = null) {
            const bubble = document.createElement('div');

            bubble.className =
                'pc-message' +
                (label === 'You' ? ' pc-user' : '');

            const author = document.createElement('strong');
            author.textContent = label;

            const content = document.createElement('p');
            content.textContent = text;

            bubble.append(author, content);

            if (answer) {
                const sources = document.createElement('div');
                sources.className = 'pc-sources';

                for (
                    const key of unique(
                        answer.sources || []
                    ).slice(0, 4)
                ) {
                    if (
                        !Object.hasOwn(
                            SECTION_NAMES,
                            key
                        ) ||
                        !findSection(document, key)
                    ) {
                        continue;
                    }

                    const button =
                        document.createElement('button');

                    button.type = 'button';
                    button.textContent = SECTION_NAMES[key];

                    button.setAttribute(
                        'aria-label',
                        `Go to ${SECTION_NAMES[key]}`
                    );

                    button.addEventListener(
                        'click',
                        () => navigate(key)
                    );

                    sources.append(button);
                }

                const ids =
                    answer.ids || [answer.id];

                const links =
                    ids.includes('cv')
                        ? [{
                            label: 'CV link',
                            href: facts.cv
                        }]
                        : ids.includes('github')
                            ? [{
                                label: 'GitHub profile',
                                href: facts.github
                            }]
                            : ids.includes('linkedin')
                                ? [{
                                    label: 'LinkedIn profile',
                                    href: facts.linkedin
                                }]
                                : ids.includes('projectLinks')
                                    ? facts.projects.flatMap(
                                        p => p.links
                                    )
                                    : [];

                for (const link of links) {
                    if (
                        !link.href ||
                        !safeURL(
                            link.href,
                            document.baseURI
                        )
                    ) {
                        continue;
                    }

                    const a = document.createElement('a');

                    a.textContent =
                        link.label || 'Portfolio link';

                    a.href = link.href;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';

                    sources.append(a);
                }

                if (sources.childElementCount) {
                    bubble.append(sources);
                }
            }

            messages.append(bubble);

            while (messages.children.length > 60) {
                messages.firstElementChild.remove();
            }

            messages.scrollTop =
                messages.scrollHeight;
        }

        function reset() {
            state = initialState();

            messages.replaceChildren();

            input.value = '';
            send.disabled = true;

            addMessage(
                'Helper',
                responseLibrary.greeting(facts)
            );
        }

        function ask(question) {
            if (!question.trim()) return;

            addMessage('You', question);

            const answer = reply(
                question,
                facts,
                state
            );

            state = answer.state;

            addMessage(
                'Helper',
                answer.text,
                answer
            );

            input.value = '';
            send.disabled = true;
            input.focus({ preventScroll: true });

            if (answer.action) {
                navigate(answer.action);
            }
        }

        toggle.addEventListener('click', () => {
            if (!panel.hidden) return closeChat();

            panel.hidden = false;

            toggle.setAttribute(
                'aria-expanded',
                'true'
            );

            input.focus({ preventScroll: true });
        });

        document.getElementById('pc-close')
            .addEventListener('click', closeChat);

        document.addEventListener('keydown', event => {
            if (
                event.key === 'Escape' &&
                !panel.hidden &&
                (
                    panel.contains(document.activeElement) ||
                    document.activeElement === toggle
                )
            ) {
                event.preventDefault();
                closeChat();
            }
        });

        input.addEventListener('input', () => {
            send.disabled = !input.value.trim();
        });

        document.getElementById('pc-form')
            .addEventListener('submit', event => {
                event.preventDefault();
                ask(input.value);
            });

        document.getElementById('pc-clear')
            .addEventListener('click', () => {
                reset();
                input.focus({ preventScroll: true });
            });

        const suggestions = [
            ['About', 'Tell me about the owner.'],
            ['Skills', 'What are his skills?'],
            ['Project', 'Tell me about his project.'],
            ['Education', 'What is his education?'],
            ['Coursework', 'What coursework is listed?'],
            ['Seminars', 'What seminars are listed?'],
            ['Awards', 'What awards does he have?'],
            ['Contact', 'How can I contact him?']
        ];

        for (const [label, question] of suggestions) {
            const button = document.createElement('button');

            button.type = 'button';
            button.textContent = label;

            button.addEventListener(
                'click',
                () => ask(question)
            );

            document.getElementById('pc-suggestions')
                .append(button);
        }

        reset();
    }

    // Optional development API; no chat history or credentials are exposed.
    window.PortfolioHelper = Object.freeze({
        version: '2.0',
        reply,
        readFacts,
        initialState,

        intentNames:
            intentPatterns.map(rule => rule[0])
    });

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            mount,
            { once: true }
        );
    } else {
        mount();
    }
}());
