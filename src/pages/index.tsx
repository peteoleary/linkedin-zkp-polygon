import React from "react";
import Head from "next/head";
import ReCAPTCHA from "react-google-recaptcha";
import MetaMaskCard from '../components/connectorCards/MetaMaskCard'

import axios from "axios";

export default function Home() {
  const [email, setEmail] = React.useState("");
  const [authResult, setAuthResult] = React.useState({});
  const recaptchaRef = React.createRef();

  const handleCircuitSubmit = (event) => {
    debugger
    event.preventDefault();
  }

  const handleCaptchaSubmit = (event) => {
    event.preventDefault();
    // Execute the reCAPTCHA when the form is submitted
    recaptchaRef.current.execute();
  };

  const handleChange = (event) => {
    event.preventDefault();
    // Execute the reCAPTCHA when the form is submitted
    setEmail(event.target.value)
  };
  
  const onReCAPTCHAChange = (captchaCode) => {
    // If the reCAPTCHA code is null or undefined indicating that
    // the reCAPTCHA was expired then return early
    if(!captchaCode) {
      return;
    }

    recaptchaRef.current.reset();

    axios.post("/api/auth", {email: email, captchaCode: captchaCode}).then(auth_result => {
      setAuthResult(auth_result.data)
    })
  }

  const circuitInfo = () => {
    if (!authResult.circuit) {
      return <div>Please log in with CAPTCHA</div>
    }
      
    return  (
      <div>
        <MetaMaskCard />
        <button onClick={handleCircuitSubmit}>Deploy</button>
      </div>
      )
  }

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome to Loan Application
        </h1>

        <div className="description">
          Get started by proving you are a human
          <form onSubmit={handleCaptchaSubmit}>
            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={onReCAPTCHAChange}
            />
            <input
              onChange={handleChange}
              required
              type="email"
              name="email"
              placeholder="Email"
            />
            <button type="submit">Register</button>
          </form>
        </div>

        <div className="grid">
          <div className="card">
            <h3>ZKP Circuit Info &rarr;</h3>
            {circuitInfo()}
          </div>

          <div className="card">
            <h3>Login Contract Info &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </div>

          <div className="card">
            <h3>Loan Information &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </div>

          <div className="card">
            <h3>Loan Contract &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </div>
        </div>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
