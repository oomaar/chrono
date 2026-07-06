import { THEME_STORAGE_KEY } from "../theme.constants";

const themeInitSource = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var m=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var t=(s==='light'||s==='dark')?s:(s==='system'||!s)?m:m;var r=document.documentElement;r.setAttribute('data-theme',t);r.style.colorScheme=t;}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export function ThemeInitScript() {
  return (
    <script
      // Runs before hydration to set data-theme, preventing theme flash.
      dangerouslySetInnerHTML={{ __html: themeInitSource }}
    />
  );
}
