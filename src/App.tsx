import { useRef, useState } from "react";
// import chrome from 'chrome';

import "./App.css";

import { LINKEDIN_API_SECRET, LINKEDIN_CLIEND_ID, TWITTER_CLIENT_ID } from "./secrets";

// Rest of your code

function App() {
  const twitterCheckbox = useRef<HTMLInputElement>(null);
  const linkedinCheckbox = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const postToTwitter = twitterCheckbox.current?.checked
    const postToLinkedIn = linkedinCheckbox.current?.checked;
    if (!postToTwitter && !postToLinkedIn) {
      alert("Please select at least one social media platform to share your post.")
    }


    if (postToTwitter) {
      // TODO: Implement Twitter sharing logic
      _postToTwitter(text)
    }

    if (postToLinkedIn) {
      // TODO: Implement LinkedIn sharing logic
      if (!text) {
        alert('Please enter some text to share.')
        return
      }

      // LinkedIn authentication URL
      const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedInConfig.client_id}&redirect_uri=${linkedInConfig.redirect_uri}&state=${linkedInConfig.state}&scope=r_liteprofile%20w_member_social`

      // Get LinkedIn access token
      chrome.identity.launchWebAuthFlow(
        {
          url: linkedInAuthUrl,
          interactive: true,
        },
        function (redirectUrl?: string) {
          if (!redirectUrl) return;

          const urlParams = new URLSearchParams(new URL(redirectUrl).search)

          if (urlParams.has('code')) {
            const code = urlParams.get('code')

            // Exchange authorization code for access token
            fetch(
              `${linkedInConfig.token_url
              }?grant_type=client_credentials&code=${code}&client_id=${linkedInConfig.client_id
              }&client_secret=${linkedInConfig.client_secret
              }&redirect_uri=${encodeURIComponent(
                linkedInConfig.redirect_uri,
              )}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                }
              },
            )
              .then(function (response) {
                console.warn(response.status)
                return response.json()
              })
              .then(function (data) {
                const accessToken = data.access_token
                console.warn(JSON.stringify(data))

                // Post to LinkedIn using the access token
                fetch('https://api.linkedin.com/v2/ugcPosts', {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Restli-Protocol-Version': '2.0.0',
                  },
                  body: JSON.stringify({
                    author: `urn:li:person:${data.actor}`,
                    lifecycleState: 'PUBLISHED',
                    specificContent: {
                      'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                          text,
                        },
                        shareMediaCategory: 'NONE',
                      },
                    },
                    visibility: {
                      'com.linkedin.ugc.MemberNetworkVisibility': 'CONNECTIONS',
                    },
                  }),
                })
                  .then(function (response) {
                    if (response.ok) {
                      console.log('Posted to LinkedIn:', text)
                      alert('Posted to LinkedIn successfully.')
                    } else {
                      console.error('LinkedIn post failed:', response)
                      alert('Failed to post to LinkedIn.')
                    }
                  })
                  .catch(function (error) {
                    console.error('Error posting to LinkedIn:', error)
                    alert('An error occurred while posting to LinkedIn.')
                  })
              })
              .catch(function (error) {
                console.error(
                  'Error exchanging authorization code for access token:',
                  error,
                )
                alert('An error occurred while authenticating with LinkedIn.')
              })
          } else {
            console.error('Authorization code not found.')
            alert('Failed to authenticate with LinkedIn.')
          }
        },
      )
    }
  }

  function _postToTwitter(tweet: string) {
    if (!tweet) {
      alert('Please enter some text to share.')
      return
    }

    const twitterAuthUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=MTVKTEJnamlfYkdfLWtiWXBIWUw6MTpjaQ&redirect_uri=${chrome.identity.getRedirectURL('/provider_cb')}&scope=tweet.write%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain`

    chrome.identity.launchWebAuthFlow(
      {
        url: twitterAuthUrl,
        interactive: true,
      },
      function (redirectUrl?: string) {
        console.warn(redirectUrl)
        if (!redirectUrl) {
          return;
        }

        const urlParams = new URLSearchParams(new URL(redirectUrl).search)

        if (urlParams.has('code')) {
          const code = urlParams.get('code')
          console.warn(code)

          if (!code) {
            alert('Failed to authenticate with Twitter.');
            return;
          }

          var urlencoded = new URLSearchParams();
          urlencoded.append("code", code);
          urlencoded.append("grant_type", "authorization_code");
          urlencoded.append("client_id", TWITTER_CLIENT_ID);
          urlencoded.append("redirect_uri", chrome.identity.getRedirectURL('/provider_cb'));
          urlencoded.append("code_verifier", "challenge");

          fetch(`https://api.twitter.com/2/oauth2/token`, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlencoded,
            method: 'POST',
          }).then(function (response) {
            console.warn(response.status);
            return response.json();
          }).then(function (data) {
            const { access_token } = data;
            var urlencoded = new URLSearchParams();
            urlencoded.append("client_id", TWITTER_CLIENT_ID);
            urlencoded.append("text", tweet);
            fetch('https://api.twitter.com/2/tweets', {
              method: 'POST',
              body: urlencoded,
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'user-agent': "v2CreateTweetJS",
                'content-type': "application/json",
                'accept': "application/json"
              }
            }).then(function (response) {
              console.warn('status from tweet send ', response.status);
              return response.json();
            }).then(function (data) {
              console.warn(JSON.stringify(data))
              alert("Tweet sent successfully")
            }).catch(function (error) {
              console.log("An error occurred while posting to Twitter", error)
            })
          })

          // Exchange authorization code for access token
        } else {
          console.error('Authorization code not found.')
          alert('Failed to authenticate with LinkedIn.')
        }
      },
    )
  }

  // LinkedIn API configuration
  const linkedInConfig = {
    client_id: LINKEDIN_CLIEND_ID,
    client_secret: LINKEDIN_API_SECRET,
    redirect_uri: chrome.identity.getRedirectURL('/provider_cb'),
    scopes: 'w_member_social',
    auth_url: 'https://www.linkedin.com/oauth/v2/authorization',
    token_url: 'https://www.linkedin.com/oauth/v2/accessToken',
    state: 'linkedin',
  }

  return (
    <div className="App">
      <div id="container">
        <textarea value={text} onChange={e => setText(e.target.value)} id="text-input" placeholder="Enter your post text"></textarea>
        <label><input ref={twitterCheckbox} type="checkbox" id="twitter-checkbox" />Twitter</label>
        <label><input ref={linkedinCheckbox} type="checkbox" id="linkedin-checkbox" />LinkedIn</label>
        <button onClick={handleSubmit} disabled={!text} id="share-button">Share</button>
      </div>
    </div>
  );
}

export default App;
