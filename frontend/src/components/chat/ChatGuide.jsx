import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { MdChat, MdClose, MdSend, MdRefresh, MdViewInAr, MdOutlineQuiz, MdHeadphones, MdArrowForward } from 'react-icons/md';
import { LangContext } from '../../context/LangContext';
import AudioPlayer from '../common/AudioPlayer';
import { createChatEngine } from '../../chat/chatEngine';
import { TEXT } from '../../chat/knowledge';
import { getNarration } from '../../utils/narration';

const API = '/api';

// Pause before the guide answers, so replies don't appear to jump in
// before the visitor's own message has landed.
const REPLY_DELAY_MS = 350;

const textFor = (lang) => TEXT[lang] || TEXT.en;

// The exhibit page the visitor is on, if any.
const exhibitIdFromPath = (pathname) => pathname.match(/^\/exhibit\/([^/?#]+)/)?.[1] || null;

// ── One exhibit, shown under a guide answer ──────────────────────────────────

const ExhibitAnswerCard = ({ card, exhibit, lang, highlight, showAudio }) => {
  const T = textFor(lang);
  const [audioOpen, setAudioOpen] = useState(showAudio);
  const audioSrc = exhibit ? getNarration(exhibit, lang) : '';
  const ring = (name) => (highlight === name ? 'ring-2 ring-gold ring-offset-1 ring-offset-transparent' : '');
  const btn = 'inline-flex items-center gap-1 text-[11px] font-bold uppercase px-2.5 py-1.5 rounded-md transition-colors';

  return (
    <div className="mt-2 rounded-xl border border-gold/40 bg-white dark:bg-stone-900 overflow-hidden">
      <div className="flex gap-3 p-2">
        {card.image && (
          <img src={card.image} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-stone-200"
            onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        )}
        <div className="min-w-0 flex flex-col justify-center">
          <span className="font-heading font-bold text-sm text-primary dark:text-parchment leading-snug">{card.title}</span>
          {card.gallery && <span className="text-[10px] uppercase tracking-wider text-accent font-semibold truncate">{card.gallery}</span>}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 px-2 pb-2">
        <Link to={`/exhibit/${card.id}?lang=${lang}`} className={`${btn} bg-gold text-primary hover:bg-yellow-600`}>
          {T.openExhibit} <MdArrowForward className="w-3.5 h-3.5" />
        </Link>
        {audioSrc && (
          <button type="button" onClick={() => setAudioOpen(o => !o)} aria-expanded={audioOpen}
            className={`${btn} border border-stone-300 dark:border-stone-600 text-primary dark:text-parchment hover:border-gold ${ring('audio')}`}>
            <MdHeadphones className="w-3.5 h-3.5" /> {T.listen}
          </button>
        )}
        <Link to={`/exhibit/${card.id}?ar=1&lang=${lang}`}
          className={`${btn} bg-primary text-parchment border border-gold hover:bg-primary/90 ${ring('ar')}`}>
          <MdViewInAr className="w-3.5 h-3.5 text-gold" /> {T.arView}
        </Link>
        <Link to={`/quiz/exhibit/${card.id}`}
          className={`${btn} border border-stone-300 dark:border-stone-600 text-primary dark:text-parchment hover:border-gold ${ring('quiz')}`}>
          <MdOutlineQuiz className="w-3.5 h-3.5" /> {T.quiz}
        </Link>
      </div>

      {audioOpen && audioSrc && (
        <div className="px-2 pb-2">
          <AudioPlayer src={audioSrc} title={card.title} label={T.audioGuide} />
        </div>
      )}
    </div>
  );
};

// ── One message ───────────────────────────────────────────────────────────────

const Message = ({ msg, engine, isLast, onAsk }) => {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] bg-primary text-parchment text-sm px-3.5 py-2 rounded-2xl rounded-br-sm whitespace-pre-wrap break-words">
          {msg.text}
        </p>
      </div>
    );
  }

  const T = textFor(msg.lang);
  const chipClass = 'text-xs px-3 py-1.5 rounded-full border border-gold/60 text-primary dark:text-parchment bg-gold/10 hover:bg-gold/25 transition-colors text-left';

  return (
    <div className="flex justify-start">
      <div className="max-w-[92%] w-fit">
        <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-sm px-3.5 py-2.5 rounded-2xl rounded-bl-sm shadow-sm">
          <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>

          {msg.list && (
            <ul className="mt-2 space-y-1 text-[13px]">
              {msg.list.map((item, i) => (
                <li key={i} className="flex gap-2"><span className="text-gold">•</span><span>{item}</span></li>
              ))}
            </ul>
          )}

          {msg.link && (
            <Link to={msg.link.to} className="mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase text-gold hover:underline">
              {msg.link.label} <MdArrowForward className="w-3.5 h-3.5" />
            </Link>
          )}

          {msg.exhibit && (
            <ExhibitAnswerCard
              card={msg.exhibit}
              exhibit={engine?.getExhibit(msg.exhibit.id)}
              lang={msg.lang}
              highlight={msg.highlight}
              showAudio={!!msg.playAudio}
            />
          )}
        </div>

        {msg.exhibitChips && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {msg.exhibitChips.map(chip => (
              <button key={chip.id} type="button" className={chipClass}
                onClick={() => onAsk(T.aboutExhibit.replace('{title}', chip.label))}>
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {isLast && msg.suggestions && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {msg.suggestions.map(s => (
              <button key={s} type="button" className={chipClass} onClick={() => onAsk(s)}>{s}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── The floating chat guide ──────────────────────────────────────────────────

const ChatGuide = () => {
  const { lang: siteLang } = useContext(LangContext);
  const { pathname } = useLocation();
  const T = textFor(siteLang);

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | ready
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const engineRef = useRef(null);
  const nextId = useRef(1);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const pageExhibitId = exhibitIdFromPath(pathname);
  const hidden = pathname.startsWith('/dashboard') || pathname.startsWith('/admin-login');

  const addMessage = useCallback((msg) => {
    setMessages(prev => [...prev, { id: nextId.current++, ...msg }]);
  }, []);

  // Load the exhibits the first time the chat opens. If that fails the guide
  // still answers visitor-info questions.
  useEffect(() => {
    if (!open || status !== 'idle') return;
    setStatus('loading');
    axios.get(`${API}/exhibits`)
      .then(({ data }) => { engineRef.current = createChatEngine(data?.data || []); })
      .catch(() => { engineRef.current = createChatEngine([]); })
      .finally(() => setStatus('ready'));
  }, [open, status]);

  // Follow the page: on an exhibit page the guide talks about that exhibit.
  useEffect(() => {
    const engine = engineRef.current;
    if (status !== 'ready' || !engine) return;
    if (messages.length === 0) {
      engine.setFocus(pageExhibitId);
      addMessage({ role: 'bot', ...engine.welcome(siteLang) });
    } else if (pageExhibitId && pageExhibitId !== engine.getFocus()) {
      engine.setFocus(pageExhibitId);
      if (engine.getFocus()) addMessage({ role: 'bot', ...engine.welcome(siteLang) });
    }
    // Only page changes and the engine becoming ready should trigger this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pageExhibitId]);

  // Keep the newest message in view.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const ask = (question) => {
    const q = question.trim();
    const engine = engineRef.current;
    if (!q || !engine || typing) return;
    addMessage({ role: 'user', text: q });
    setInput('');
    setTyping(true);
    timerRef.current = setTimeout(() => {
      const answer = engine.reply(q, siteLang);
      if (answer) addMessage({ role: 'bot', ...answer });
      setTyping(false);
    }, REPLY_DELAY_MS);
  };

  const reset = () => {
    clearTimeout(timerRef.current);
    setTyping(false);
    const engine = engineRef.current;
    if (!engine) { setMessages([]); return; }
    engine.setFocus(pageExhibitId);
    setMessages([{ id: nextId.current++, role: 'bot', ...engine.welcome(siteLang) }]);
  };

  if (hidden) return null;

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label={T.title}
          className="fixed z-[90] bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 h-[min(600px,calc(100dvh-8rem))] flex flex-col rounded-2xl border border-gold/50 bg-parchment dark:bg-dark-card shadow-2xl overflow-hidden font-body"
        >
          {/* Header */}
          <header className="flex items-center justify-between gap-2 px-4 py-3 bg-primary text-parchment border-b-2 border-gold/70">
            <div className="min-w-0">
              <h2 className="font-heading font-bold text-gold text-sm tracking-wider uppercase truncate">{T.title}</h2>
              <p className="text-[11px] text-stone-300 truncate">{T.subtitle}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button type="button" onClick={reset} title={T.reset} aria-label={T.reset}
                className="p-1.5 rounded-full hover:bg-stone-700/60 text-stone-300 hover:text-gold transition-colors">
                <MdRefresh className="w-5 h-5" />
              </button>
              <button type="button" onClick={() => setOpen(false)} title={T.close} aria-label={T.close}
                className="p-1.5 rounded-full hover:bg-stone-700/60 text-stone-300 hover:text-gold transition-colors">
                <MdClose className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3" aria-live="polite">
            {status !== 'ready' && (
              <p className="text-center text-xs text-stone-500 dark:text-stone-400 py-6">{T.loading}</p>
            )}
            {messages.map((msg, i) => (
              <Message
                key={msg.id}
                msg={msg}
                engine={engineRef.current}
                isLast={i === messages.length - 1 && !typing}
                onAsk={ask}
              />
            ))}
            {typing && (
              <div className="flex justify-start" aria-hidden="true">
                <div className="flex gap-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3.5 py-3 rounded-2xl rounded-bl-sm">
                  {[0, 150, 300].map(d => (
                    <span key={d} className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); ask(input); }}
            className="flex items-center gap-2 p-3 border-t border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-900/60"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={T.placeholder}
              aria-label={T.placeholder}
              maxLength={300}
              disabled={status !== 'ready'}
              className="flex-1 min-w-0 text-sm px-3.5 py-2.5 rounded-full border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold disabled:opacity-60"
            />
            <button type="submit" aria-label={T.send} title={T.send}
              disabled={!input.trim() || status !== 'ready' || typing}
              className="p-2.5 rounded-full bg-gold text-primary hover:bg-yellow-600 disabled:opacity-40 disabled:hover:bg-gold transition-colors">
              <MdSend className="w-5 h-5" />
            </button>
          </form>
        </section>
      )}

      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? T.close : T.open}
        title={open ? T.close : T.open}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-primary text-gold border-2 border-gold shadow-lg flex items-center justify-center hover:bg-stone-800 hover:scale-105 transition-all"
      >
        {open ? <MdClose className="w-7 h-7" /> : <MdChat className="w-7 h-7" />}
      </button>
    </>
  );
};

export default ChatGuide;
