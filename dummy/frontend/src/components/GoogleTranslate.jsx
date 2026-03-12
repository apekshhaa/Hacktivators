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
      document.body.appendChild(wrapper);

      // Add settings
      window.gtranslateSettings = {
        "default_language": "en",
        "languages": ["en", "kn", "hi"],
        "wrapper_selector": ".gtranslate_wrapper",
        "switcher_horizontal_position": "right",
        "switcher_vertical_position": "top",
        "float_switcher_open_direction": "bottom",
        "flag_style": "3d"
      };

      // Add script
      const script = document.createElement("script");
      script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [shouldHide]);

  // Hide the widget using CSS if we are on an auth page, 
  // because the external script injects elements directly into the body.
  useEffect(() => {
    const wrapper = document.querySelector(".gtranslate_wrapper");
    const switcher = document.querySelector(".gt_float_switcher"); // Often injected by gtranslate separately
    
    if (shouldHide) {
      if (wrapper) wrapper.style.display = "none";
      if (switcher) switcher.style.display = "none";
    } else {
      if (wrapper) wrapper.style.display = "block";
      if (switcher) switcher.style.display = "block";
    }
  }, [location.pathname, shouldHide]);

  return null;
};

export default GoogleTranslate;
