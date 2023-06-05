// Codidact-specific markdown extensions
function moshidact(md, options) {
    // Load all the rules
    for (const [rule, ruleset] of Object.entries(moshidact.inline)) {
        md.inline.ruler.before('escape', rule, moshidact.inlineRule(ruleset));
        md.renderer.rules[ruleset.name] = (tokens, idx) => ruleset.transform(tokens[idx].content);
    }
}

moshidact.inlineRule = ruleset => (state, silent) => {
    const start = state.pos;

    ruleset.match.lastIndex = start;
    const match = ruleset.match.exec(state.src);
    if (!match) { return false; }

    const end = start + match[0].length

    if (!silent) {
        const token = state.push(ruleset.name, 'moshi', 0);
        token.content = state.src.substring(start, end);
    }

    state.pos = end;

    return true;
};

moshidact.inline = {
    'tag': {
        name: 'inline_tag',
        match: /\[tag:.+?\]/y,
        transform: match => {
            const name = match.substring(5, match.length - 1);
            return `<a class='moshidact-tag'>${name}</a>`
        }
    }
};

moshidact.runPass = () => {
    $('.moshidact-tag').each(async (_, el) => {
        const name = el.innerText;

        const req = await fetch(`/tags?term=${name}`)
        const res = await req.json();

        el.classList.remove('moshidact-tag');
        el.classList.add('badge', 'is-tag');

        if (res.length === 1) {
            const tag_id = res[0].id;
            el.href = `/tags/${tag_id}`;
        }
    })
};