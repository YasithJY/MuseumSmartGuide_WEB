// The chat guide's "brain". It runs entirely in the browser with no AI
// service: it matches the visitor's question against the visitor-info topics
// in knowledge.js and against the exhibits loaded from our own API, then
// builds the answer from that content. Nothing is generated, so it never
// makes facts up; when it can't match a question it says so and suggests
// questions it can answer.
import Fuse from 'fuse.js';
import {
  TOPICS, QUESTION_TYPES, REFERS_BACK, STOPWORDS, EXHIBIT_ALIASES, ANSWER_HINTS, TEXT,
} from './knowledge';

const LANG_CODES = ['en', 'si', 'ta'];

// ── Text helpers ──────────────────────────────────────────────────────────────

// Sinhala uses zero-width joiners inside some letters (ශ්‍ර), which visitors
// often leave out when typing, so they are dropped from both sides of a match.
const stripJoiners = (s) => s.replace(/[‌‍]/g, '');

export const normalize = (s) =>
  stripJoiners(String(s || '').toLowerCase())
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const isLatin = (s) => /^[a-z0-9 ]+$/.test(s);

const STOP = new Set([...STOPWORDS].map(normalize));

// Single words that ask a kind of question or name a visitor topic ("find",
// "play", "hours"). They are never part of an exhibit's name, so they are
// skipped when looking for one.
const IGNORE_FOR_NAMES = new Set([
  ...STOP,
  ...Object.values(QUESTION_TYPES).flat(),
  ...TOPICS.flatMap(t => t.keywords).filter(k => typeof k === 'string'),
].map(normalize).filter(k => k && !k.includes(' ')));

// The language to answer in: the script the visitor typed in, or the site's
// language when the message has no letters (e.g. only numbers).
export const detectLang = (raw, siteLang) => {
  if (/[඀-෿]/.test(raw)) return 'si';
  if (/[஀-௿]/.test(raw)) return 'ta';
  if (/[a-z]/i.test(raw)) return 'en';
  return siteLang;
};

const fill = (template, values) =>
  template.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '');

// Does one keyword (see the format notes in knowledge.js) appear in the text?
const hasKeyword = (text, tokens, kw) => {
  if (Array.isArray(kw)) return kw.every(part => hasKeyword(text, tokens, part));
  const k = normalize(kw);
  if (!k) return false;
  if (!isLatin(k)) return text.includes(k);
  if (k.includes(' ')) return ` ${text} `.includes(` ${k} `);
  return tokens.some(t => t === k || (k.length >= 4 && t.startsWith(k)));
};

const keywordScore = (text, tokens, keywords) =>
  keywords.reduce((sum, kw) => {
    if (!hasKeyword(text, tokens, kw)) return sum;
    // Phrases and all-of keywords are more telling than a single word.
    return sum + (Array.isArray(kw) || kw.includes(' ') ? 2 : 1);
  }, 0);

// Abbreviations that end in a full stop without ending the sentence.
const ABBREVIATION = /\b(eng|dr|mr|mrs|ms|st|sir|prof|no|c|ca|approx|vs)\.$/i;

// Sentences, so answers can quote one or two instead of a whole essay.
// Headings inside the text ("Water Management Technology") are dropped.
const splitSentences = (text) => {
  // Numbered lists ("1. One large pond 2. A large Geliya") read as bullets.
  const flat = String(text || '').replace(/(^|\s)\d{1,2}\.(?=\s)/g, '$1•').replace(/(•\s*)+/g, '• ');
  const parts = flat.split(/(?<=[.!?।])\s+|\n+/);
  const sentences = [];
  for (const raw of parts) {
    const part = raw.trim();
    if (!part) continue;
    const prev = sentences[sentences.length - 1];
    if (prev && ABBREVIATION.test(prev)) sentences[sentences.length - 1] = `${prev} ${part}`;
    else sentences.push(part);
  }
  return sentences.filter(s => /[.!?।]$/.test(s) || s.split(/\s+/).length >= 8);
};

const HAS_DATE = /\b\d{3,4}\b|\bcentur|\bb\.?c\b|\ba\.?d\b|ක්‍රි|සියවස|நூற்றாண்டு|கி\.மு|கி\.பி/i;

// ── Exhibit content in one language (falls back to English per field) ─────────

const localized = (exhibit, lang) => {
  const tr = lang === 'en' ? null : exhibit.translations?.[lang];
  const pick = (field) => (tr?.[field] ? tr[field] : exhibit[field] || '');
  const timeline = tr?.timeline?.length
    ? (exhibit.timeline || []).map((ev, i) => ({ ...ev, ...(tr.timeline[i] || {}), year: ev.year }))
    : exhibit.timeline || [];
  return {
    title: pick('title'),
    description: pick('description'),
    historicalInfo: pick('historicalInfo'),
    timeline,
  };
};

// The card the chat window shows under an exhibit answer.
const exhibitCard = (exhibit, lang) => ({
  id: exhibit._id,
  title: localized(exhibit, lang).title,
  image: exhibit.images?.[0] || '',
  gallery: exhibit.galleryId?.name || '',
});

// ── The engine ───────────────────────────────────────────────────────────────

export const createChatEngine = (exhibits = []) => {
  const byId = new Map(exhibits.map(e => [String(e._id), e]));

  // Every name an exhibit goes by, in all three languages, for typo-tolerant
  // matching of names inside a question.
  const nameEntries = exhibits.flatMap(e => {
    const titles = LANG_CODES.map(l => localized(e, l).title);
    // "Elephant Lamp (Ath Pahana)" also goes by "Elephant Lamp" and "Ath Pahana".
    const parts = titles.flatMap(t => t.split(/[()]/));
    const names = [...titles, ...parts, ...(EXHIBIT_ALIASES[String(e._id)] || [])]
      .map(normalize)
      .filter(n => n.length >= 3);
    return [...new Set(names)].map(name => ({ id: String(e._id), name }));
  });
  const nameIndex = new Fuse(nameEntries, {
    keys: ['name'],
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.3,
    minMatchCharLength: 3,
  });

  // All of each exhibit's text, for questions that describe an exhibit
  // without naming it ("which one is about railways?").
  const contentText = new Map(exhibits.map(e => [
    String(e._id),
    normalize(LANG_CODES.map(l => {
      const x = localized(e, l);
      return [x.title, x.description, x.historicalInfo, ...x.timeline.map(t => `${t.title} ${t.description}`)].join(' ');
    }).join(' ')),
  ]));

  // Conversation memory: the exhibit being discussed, and which of its
  // sentences have been shown, so "tell me more" continues where it left off.
  let focusId = null;
  let shown = new Set();

  const setFocus = (id) => {
    const key = id ? String(id) : null;
    if (key !== focusId) shown = new Set();
    focusId = key && byId.has(key) ? key : null;
  };

  // Words that might be part of an exhibit's name.
  const nameTokens = (tokens) =>
    tokens.filter(t => t.length >= 3 && !IGNORE_FOR_NAMES.has(t));

  // Finds an exhibit named in the question. Returns the best match, or
  // `ambiguous` when a name fits several equally well ("elephant").
  const findNamed = (text, tokens) => {
    const scores = new Map();
    const words = nameTokens(tokens);
    // Pairs of words too, so "lion rock" beats the separate words.
    const pairs = words.slice(1).map((w, i) => `${words[i]} ${w}`);
    for (const q of [...words, ...pairs]) {
      const best = new Map();
      for (const r of nameIndex.search(q)) {
        // A near-exact match counts fully; a looser one ("sigirya") only for
        // longer words, so short words like "find" don't match "wind".
        const strength = r.score <= 0.15 ? 1 : q.length >= 6 ? 0.6 : 0;
        if (!strength) continue;
        best.set(r.item.id, Math.max(best.get(r.item.id) || 0, strength));
      }
      for (const [id, s] of best) scores.set(id, (scores.get(id) || 0) + s);
    }
    const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
    if (!ranked.length || ranked[0][1] < 0.6) return null;
    const [topId, topScore] = ranked[0];
    const tied = ranked.filter(([, s]) => s >= topScore - 0.01).map(([id]) => byId.get(id));
    return { exhibit: byId.get(topId), score: topScore, ambiguous: tied.length > 1 ? tied : null };
  };

  // Finds an exhibit whose text covers the question's words, weighting rare
  // words more than common ones.
  const findByContent = (tokens) => {
    const words = [...new Set(tokens.filter(t => t.length >= 4 && !IGNORE_FOR_NAMES.has(t)))];
    if (!words.length || !exhibits.length) return null;
    const scores = new Map();
    for (const w of words) {
      const hits = [...contentText.entries()].filter(([, txt]) => txt.includes(w));
      if (!hits.length || hits.length === exhibits.length) continue;
      const weight = Math.log(exhibits.length / hits.length);
      for (const [id] of hits) scores.set(id, (scores.get(id) || 0) + weight);
    }
    const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
    if (!ranked.length || ranked[0][1] < 1) return null;
    if (ranked[1] && ranked[1][1] === ranked[0][1]) return null;
    return byId.get(ranked[0][0]);
  };

  const matchTopic = (text, tokens) => {
    let best = null;
    for (const topic of TOPICS) {
      const score = keywordScore(text, tokens, topic.keywords);
      if (score > 0 && (!best || score > best.score)) best = { topic, score };
    }
    // A greeting tacked onto a real question shouldn't win ("hi, where is…").
    if (best?.topic.smallTalk && tokens.length > 4) return null;
    return best;
  };

  const detectQuestionType = (text, tokens) => {
    for (const [type, keywords] of Object.entries(QUESTION_TYPES)) {
      if (keywords.some(kw => hasKeyword(text, tokens, kw))) return type;
    }
    return null;
  };

  // ── Answers ────────────────────────────────────────────────────────────────

  const suggestionsFor = (lang) => (focusId ? TEXT[lang].exhibitSuggestions : TEXT[lang].suggestions);

  const exhibitChips = (list, lang) =>
    list.map(e => ({ id: String(e._id), label: localized(e, lang).title }));

  // The sentences of an exhibit that best answer the question.
  const bestSentences = (exhibit, lang, tokens, type, count = 2) => {
    const x = localized(exhibit, lang);
    const sentences = [...splitSentences(x.description), ...splitSentences(x.historicalInfo)];
    const ownName = new Set(normalize(x.title).split(' '));
    const words = tokens.filter(t => t.length >= 3 && !STOP.has(t) && !ownName.has(t));
    const hints = ANSWER_HINTS[type] || [];
    const scored = sentences.map((s, i) => {
      const n = normalize(s);
      let score = words.filter(w => n.includes(w)).length;
      if (hints.some(h => n.includes(normalize(h)))) score += 0.5;
      if (type === 'when' && HAS_DATE.test(s)) score += 1;
      return { s, i, score };
    });
    const fresh = scored.filter(x2 => !shown.has(x2.s));
    const pool = fresh.length ? fresh : scored;
    const relevant = pool.filter(x2 => x2.score > 0).sort((a, b) => b.score - a.score || a.i - b.i);
    const chosen = (relevant.length ? relevant : pool).slice(0, count).sort((a, b) => a.i - b.i);
    return chosen.map(c => c.s);
  };

  const remember = (sentences) => sentences.forEach(s => shown.add(s));

  const answerExhibit = (exhibit, type, lang, tokens) => {
    setFocus(exhibit._id);
    const x = localized(exhibit, lang);
    const T = TEXT[lang];
    const card = exhibitCard(exhibit, lang);
    const base = { exhibit: card, suggestions: T.exhibitSuggestions, lang };

    switch (type) {
      case 'audio':
        return { ...base, text: fill(T.audioIntro, { title: x.title }), playAudio: true };
      case 'ar':
        return { ...base, text: fill(T.arIntro, { title: x.title }), highlight: 'ar' };
      case 'quiz':
        return { ...base, text: fill(T.quizIntro, { title: x.title }), highlight: 'quiz' };
      case 'where': {
        const gallery = exhibit.galleryId?.name;
        if (!gallery) return { ...base, text: fill(T.whereUnknown, { title: x.title }) };
        const museum = exhibit.museumId?.name ? fill(T.whereMuseum, { museum: exhibit.museumId.name }) : '';
        return { ...base, text: fill(T.whereAnswer, { title: x.title, gallery, museum }) };
      }
      case 'when':
        if (x.timeline.length) {
          return {
            ...base,
            text: fill(T.whenIntro, { title: x.title }),
            list: x.timeline.slice(0, 6).map(ev => `${ev.year} — ${ev.title}`),
          };
        }
        break;
      case 'more': {
        const x2 = localized(exhibit, lang);
        const all = [...splitSentences(x2.description), ...splitSentences(x2.historicalInfo)];
        const next = all.filter(s => !shown.has(s)).slice(0, 3);
        if (!next.length) return { ...base, text: fill(T.moreEnd, { title: x.title }) };
        remember(next);
        return { ...base, text: next.join(' ') };
      }
      default:
        break;
    }
    const sentences = bestSentences(exhibit, lang, tokens, type);
    remember(sentences);
    return { ...base, text: sentences.join(' ') || x.description };
  };

  const answerTopic = ({ topic }, lang) => {
    const T = TEXT[lang];
    if (topic.action === 'listExhibits') {
      if (!exhibits.length) return { text: T.loadError, suggestions: T.suggestions, lang };
      return { text: T.listIntro, exhibitChips: exhibitChips(exhibits, lang), lang };
    }
    if (topic.action === 'recommend') {
      if (!exhibits.length) return { text: T.loadError, suggestions: T.suggestions, lang };
      // A different few each time, so repeat visitors see something new.
      const picks = [...exhibits].sort(() => Math.random() - 0.5).slice(0, 3);
      return { text: T.recommendIntro, exhibitChips: exhibitChips(picks, lang), lang };
    }
    return {
      text: topic.answer[lang] || topic.answer.en,
      link: topic.link ? { to: topic.link.to, label: topic.link.label[lang] || topic.link.label.en } : null,
      suggestions: topic.smallTalk ? suggestionsFor(lang) : null,
      lang,
    };
  };

  // ── Entry point ─────────────────────────────────────────────────────────────

  const reply = (raw, siteLang = 'en') => {
    const lang = detectLang(raw, siteLang);
    const T = TEXT[lang];
    const text = normalize(raw);
    const tokens = text.split(' ').filter(Boolean);
    if (!tokens.length) return null;

    const named = exhibits.length ? findNamed(text, tokens) : null;
    const type = detectQuestionType(text, tokens);
    const topic = matchTopic(text, tokens);
    const focus = focusId ? byId.get(focusId) : null;
    const refersBack = REFERS_BACK.some(kw => hasKeyword(text, tokens, kw));
    const exhibitAction = ['audio', 'ar', 'quiz'].includes(type);

    // 1. A name that fits several exhibits: ask which, unless one of them is
    //    the exhibit already being discussed.
    if (named?.ambiguous) {
      if (focus && named.ambiguous.some(e => String(e._id) === focusId)) {
        return answerExhibit(focus, type, lang, tokens);
      }
      if (!topic || named.score >= 1) {
        return { text: T.whichOne, exhibitChips: exhibitChips(named.ambiguous, lang), lang };
      }
    }

    // 2. A clearly named exhibit. A weak (typo-level) name match loses to a
    //    visitor-info topic, so "opening hours" never turns into an exhibit.
    if (named && !named.ambiguous && (named.score >= 1 || !topic)) {
      return answerExhibit(named.exhibit, type, lang, tokens);
    }

    // 3. "Play the audio" / "show it in 3D" about the exhibit in focus, or a
    //    clear follow-up about it ("how old is it?") that only brushes a topic.
    if (focus && (exhibitAction || (refersBack && type && (!topic || topic.score < 2)))) {
      return answerExhibit(focus, type, lang, tokens);
    }

    // 4. Visitor information and help.
    if (topic) return answerTopic(topic, lang);

    // 5. A follow-up about the exhibit in focus ("how old is it?").
    if (focus && (type || refersBack)) return answerExhibit(focus, type, lang, tokens);

    // 6. An exhibit described rather than named ("the one about railways").
    const described = findByContent(tokens);
    if (described) return answerExhibit(described, type, lang, tokens);

    // 7. "It" with nothing in focus: ask which exhibit.
    if (refersBack && exhibits.length) {
      return { text: T.whichExhibit, exhibitChips: exhibitChips(exhibits.slice(0, 4), lang), lang };
    }

    // 8. Nothing matched.
    return {
      text: exhibits.length ? T.fallback : T.loadError,
      suggestions: suggestionsFor(lang),
      lang,
    };
  };

  // The opening message, which depends on the page the visitor is on.
  const welcome = (siteLang) => {
    const T = TEXT[siteLang] || TEXT.en;
    const focus = focusId ? byId.get(focusId) : null;
    if (focus) {
      return {
        text: fill(T.contextWelcome, { title: localized(focus, siteLang).title }),
        exhibit: exhibitCard(focus, siteLang),
        suggestions: T.exhibitSuggestions,
        lang: siteLang,
      };
    }
    return { text: T.welcome, suggestions: T.suggestions, lang: siteLang };
  };

  return { reply, welcome, setFocus, getFocus: () => focusId, getExhibit: (id) => byId.get(String(id)) };
};

