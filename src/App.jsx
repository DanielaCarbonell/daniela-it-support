import { BrowserRouter, Routes, Route } from "react-router-dom"
import TicketSystem from "./pages/TicketSystem"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <div>
              
              <header>
                <nav>
                  <h2>Daniela Carbonell</h2>

                  <div>
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#skills">Skills</a>
                    <a href="#certifications">Certifications</a>
                    <a href="#projects">Projects</a>
                    <a href="#contact">Contact</a>
                  </div>
                </nav>
              </header>

              <main>

                <section id="home">
                  <div className="hero-photo">
                    <div className="photo-glow">
                      <img
                        src="/profile.png"
                        alt="Daniela Carbonell"
                      />
                    </div>
                  </div>

                  <h1>Daniela Carbonell</h1>

                  <h2>IT Support | Help Desk</h2>

                  <p>
                    Entry-level IT professional interested in
                    technical support, troubleshooting, networking
                    and cybersecurity.
                  </p>

                  <a href="#projects">
                    <button>View Projects</button>
                  </a>
                </section>


                <section id="about">
                  <h2>About Me</h2>

                  <p>
                    I am a Systems Engineering student interested
                    in IT Support and cybersecurity. I enjoy
                    troubleshooting technical problems and helping
                    users find practical solutions.
                  </p>
                </section>


                <section id="skills">
                  <h2>Skills</h2>

                  <ul>
                    <li>Windows 11 Troubleshooting</li>
                    <li>Basic Networking</li>
                    <li>Microsoft 365</li>
                    <li>Technical Support</li>
                    <li>Command Line</li>
                    <li>Security Fundamentals</li>
                  </ul>
                </section>


                <section id="certifications">
                  <h2>Certifications & Training</h2>

                  <div>
                    <h3>Google IT Support Professional Certificate</h3>

                    <p>
                      Training in technical support, networking,
                      operating systems, system administration and security.
                    </p>
                  </div>

                  <div>
                    <h3>IT Security Training</h3>

                    <p>
                      Practical training in security fundamentals,
                      encryption, network security, threats and incident handling.
                    </p>
                  </div>
                </section>


                <section id="projects">
                  <h2>IT Support Projects</h2>

                  <div>
                    <h3>IT Support Ticket System</h3>

                    <p>
                      A help desk application for managing and
                      tracking technical support requests.
                    </p>

                    <a href="/tickets">
                      <button>View Project</button>
                    </a>
                  </div>

                  <div>
                    <h3>Windows Troubleshooting Lab</h3>

                    <p>
                      Practical troubleshooting scenarios involving
                      Windows configuration and common user issues.
                    </p>
                  </div>

                  <div>
                    <h3>Network Troubleshooting</h3>

                    <p>
                      Basic network diagnostics using tools such as
                      ipconfig, ping and nslookup.
                    </p>
                  </div>

                  <div>
                    <h3>Security Awareness</h3>

                    <p>
                      Practical exercises focused on phishing,
                      security threats and incident handling.
                    </p>
                  </div>
                </section>


                <section id="contact">
                  <h2>Contact</h2>

                  <p>
                    Interested in connecting? Feel free to contact me.
                  </p>
                </section>

              </main>


              <footer>
                <p>© 2026 Daniela Carbonell</p>
              </footer>

            </div>
          }
        />

        <Route
          path="/tickets"
          element={<TicketSystem />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App