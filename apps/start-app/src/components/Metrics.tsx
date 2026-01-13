import { useEffect } from 'react';

export const MicrosoftClarity = ({
  clarityId,
  user,
}: {
  clarityId?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
}) => {
  useEffect(() => {
    if (!clarityId) {
      return;
    }

    // Initialize Clarity
    const initScript = document.createElement('script');
    initScript.id = 'microsoft-clarity-init';
    initScript.innerHTML = `
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${clarityId}");
    `;
    document.head.appendChild(initScript);

    // Identify user if provided
    if (user?.email || user?.id) {
      const identifyScript = document.createElement('script');
      identifyScript.id = 'microsoft-clarity-identify';
      identifyScript.innerHTML = `window.clarity && window.clarity("identify", "${user?.email || user?.id}");`;
      document.head.appendChild(identifyScript);
    }

    return () => {
      const init = document.getElementById('microsoft-clarity-init');
      const identify = document.getElementById('microsoft-clarity-identify');
      if (init) init.remove();
      if (identify) identify.remove();
    };
  }, [clarityId, user]);

  return null;
};

export const Umami = ({
  umamiWebSiteId,
  umamiUrl,
  user,
}: {
  umamiWebSiteId?: string;
  umamiUrl?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
}) => {
  useEffect(() => {
    if (!umamiWebSiteId || !umamiUrl) {
      return;
    }

    // Check if script already exists
    if (document.getElementById('umami-init')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'umami-init';
    script.defer = true;
    script.src = umamiUrl;
    script.setAttribute('data-website-id', umamiWebSiteId);
    script.onload = () => {
      if (user && window.umami) {
        window.umami.identify({ email: user.email, id: user.id, name: user.name });
      }
    };
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('umami-init');
      if (existing) existing.remove();
    };
  }, [umamiWebSiteId, umamiUrl, user]);

  return null;
};
