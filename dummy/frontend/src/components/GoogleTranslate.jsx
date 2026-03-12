import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { Globe } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
];

const TranslateButton = () => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("en");
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectLanguage = (langCode) => {
    setCurrent(langCode);
    setOpen(false);

    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${langCode};path=/;domain=${domain}`;
    document.cookie = `googtrans=/en/${langCode};path=/`;

    const selectEl = document.querySelector(".goog-te-combo");
    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-white text-sm"
        title="Translate"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">
          {LANGUAGES.find((l) => l.code === current)?.label.split(" ")[0] || "Translate"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl overflow-hidden z-[9999]">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang.code)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between
                ${current === lang.code
                  ? "bg-accent/10 text-accent font-semibold"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
            >
              <span>{lang.label}</span>
              {current === lang.code && (
                <span className="text-accent text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const GoogleTranslate = () => {
  const location = useLocation();
  const [navContainer, setNavContainer] = useState(null);

  const hideOnPaths = ["/", "/signup"];
  const shouldHide = hideOnPaths.includes(location.pathname);

  // Load the Google Translate script once
  useEffect(() => {
    if (shouldHide) return;
    if (window.google?.translate?.TranslateElement) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,kn",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element_hidden"
      );
    };

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, [shouldHide]);

  // Find the navbar container on every route change
  useEffect(() => {
    if (shouldHide) {
      setNavContainer(null);
      return;
    }
    // Small delay to let the page render the container
    const timer = setTimeout(() => {
      const el = document.getElementById("nav-translate-container");
      setNavContainer(el);
    }, 150);
    return () => clearTimeout(timer);
  }, [location.pathname, shouldHide]);

  if (shouldHide) return (
    <>
      <div id="google_translate_element_hidden" style={{ display: "none" }} />
      <style>{`
        .goog-te-banner-frame, .goog-te-ftab-link,
        #goog-gt-tt, .goog-te-balloon-frame,
        .skiptranslate, .goog-tooltip,
        .goog-te-gadget { display: none !important; }
        body { top: 0 !important; }
        .goog-text-highlight { background: none !important; box-shadow: none !important; }
      `}</style>
    </>
  );

  return (
    <>
      <div id="google_translate_element_hidden" style={{ display: "none" }} />

      {/* Render the translate button inside the navbar container via portal */}
      {navContainer && createPortal(<TranslateButton />, navContainer)}

      <style>{`
        .goog-te-banner-frame, .goog-te-ftab-link,
        #goog-gt-tt, .goog-te-balloon-frame,
        .skiptranslate, .goog-tooltip,
        .goog-te-gadget { display: none !important; }
        body { top: 0 !important; }
        .goog-text-highlight { background: none !important; box-shadow: none !important; }
      `}</style>
    </>
  );
};

export default GoogleTranslate;
