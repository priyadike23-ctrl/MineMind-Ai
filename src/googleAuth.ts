/**
 * Google Authentication Service for MineMind AI
 * Direct Google Cloud Console OAuth 2.0 Integration via Google Identity Services (GIS)
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (momentListener?: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          disableAutoSelect: () => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (tokenResponse: any) => void;
            error_callback?: (error: any) => void;
            prompt?: string;
          }) => {
            requestAccessToken: (overrideConfig?: any) => void;
          };
          initCodeClient?: (config: any) => any;
        };
      };
    };
  }
}

export interface GoogleUserProfile {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  email: string;
  email_verified?: boolean;
  picture?: string;
}

// Current runtime container URLs for Google Console configuration
export const GOOGLE_CONSOLE_CONFIG = {
  devUrl: 'https://ais-dev-4rfgbivmvuoe4c4sn5iq5d-205116143886.asia-southeast1.run.app',
  sharedUrl: 'https://ais-pre-4rfgbivmvuoe4c4sn5iq5d-205116143886.asia-southeast1.run.app',
  localUrl: 'http://localhost:3000',
  consoleUrl: 'https://console.cloud.google.com/apis/credentials',
};

/**
 * Retrieve the active Google Client ID from environment, localStorage, or server config
 */
export function getSavedGoogleClientId(): string {
  // 1. Check Vite env variable
  const viteClientId = 
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID) ||
    '';
  if (viteClientId && viteClientId.trim()) return viteClientId.trim();

  // 2. Check localStorage
  if (typeof window !== 'undefined') {
    const localId = localStorage.getItem('minemind_google_client_id');
    if (localId && localId.trim()) return localId.trim();
  }

  return '';
}

/**
 * Persist user-provided Google Client ID
 */
export function saveGoogleClientId(clientId: string): void {
  if (typeof window !== 'undefined') {
    if (clientId.trim()) {
      localStorage.setItem('minemind_google_client_id', clientId.trim());
    } else {
      localStorage.removeItem('minemind_google_client_id');
    }
  }
}

/**
 * Fetch Google Client ID from backend server if available
 */
export async function fetchServerGoogleConfig(): Promise<string> {
  try {
    const res = await fetch('/api/auth/google/config');
    if (res.ok) {
      const data = await res.json();
      if (data.clientId) {
        return data.clientId;
      }
    }
  } catch (err) {
    console.debug('[Google Auth] Notice checking server config:', err);
  }
  return '';
}

/**
 * Check if the Google Identity Services SDK is loaded in the browser
 */
export function isGoogleGsiLoaded(): boolean {
  return typeof window !== 'undefined' && Boolean(window.google?.accounts?.oauth2);
}

/**
 * Trigger official Google OAuth popup using Google Identity Services token client
 */
export function promptGoogleLoginDirect(clientId: string): Promise<GoogleUserProfile> {
  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.oauth2) {
      return reject(new Error('Google Identity Services SDK is still loading. Please try again in a moment.'));
    }

    if (!clientId || !clientId.trim()) {
      return reject(new Error('Google Client ID is missing. Please configure your OAuth Client ID from Google Cloud Console.'));
    }

    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId.trim(),
        scope: 'openid email profile',
        prompt: 'consent',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            console.error('[Google Auth] OAuth Error:', tokenResponse);
            return reject(new Error(tokenResponse.error_description || tokenResponse.error || 'Google authorization was cancelled or denied.'));
          }

          if (!tokenResponse.access_token) {
            return reject(new Error('No access token received from Google OAuth response.'));
          }

          try {
            // Fetch verified user profile from Google UserInfo endpoint
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });

            if (!userInfoRes.ok) {
              const errBody = await userInfoRes.text();
              throw new Error(`Failed to retrieve profile from Google: ${errBody}`);
            }

            const profile: GoogleUserProfile = await userInfoRes.json();
            resolve(profile);
          } catch (fetchErr: any) {
            reject(new Error(fetchErr.message || 'Error fetching user profile from Google.'));
          }
        },
        error_callback: (err: any) => {
          console.error('[Google Auth] Token client error:', err);
          reject(new Error(err?.message || 'Google OAuth prompt encountered an error.'));
        },
      });

      tokenClient.requestAccessToken();
    } catch (err: any) {
      reject(err);
    }
  });
}
