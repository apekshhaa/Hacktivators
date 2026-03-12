import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GoogleTranslate = () => {
  const location = useLocation();

  // Paths where the translation widget should NOT appear
  const hideOnPaths = ["/", "/signup"];
  const shouldHide = hideOnPaths.includes(location.pathname);

  useEffect(() => {
    // Only inject if it's not hidden and hasn't been injected yet
    if (!shouldHide && !document.querySelector(".gtranslate_wrapper")) {
      // Create wrapper
      const wrapper = document.createElement("div");
      wrapper.className = "gtranslate_wrapper";

      // Add settings
      window.gtranslateSettings = {
        "default_language": "en",
        "languages": ["en", "kn", "hi"],
        "wrapper_selector": ".gtranslate_wrapper",
        "globe_color": "#ffffff",
        "globe_size": 24
      };

      // Add script
      const script = document.createElement("script");
      script.src = "https://cdn.gtranslate.net/widgets/latest/globe.js";
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [shouldHide]);

  // Move the widget to the navbar container and handle visibility
  useEffect(() => {
    // Wait a brief moment to allow page to render the container
    setTimeout(() => {
      const wrapper = document.querySelector(".gtranslate_wrapper");
      const navContainer = document.getElementById("nav-translate-container");

      if (shouldHide) {
        if (wrapper) wrapper.style.display = "none";
      } else {
        if (wrapper) {
          wrapper.style.display = "block";
          if (navContainer) {
            navContainer.appendChild(wrapper);
          } else if (!wrapper.parentElement) {
            document.body.appendChild(wrapper);
          }
        }
      }
    }, 100);
  }, [location.pathname, shouldHide]);

  return null;
};

export default GoogleTranslate;
