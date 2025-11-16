"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Navbar from "./components/Navbar";

export default function Home() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const spotlightImagesRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const lenisRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(lenisRaf);
    gsap.ticker.lagSmoothing(0);

    const spotlightImgFinalPos = [
      [-140, -140],
      [40, -130],
      [-160, 40],
      [20, 30],
    ];

    const spotlightImages = spotlightImagesRef.current;

    const scrollTrigger = ScrollTrigger.create({
      trigger: spotlightRef.current,
      start: "top top",
      end: `+${window.innerHeight * 6}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        const initialRotations = [5, -3, 3.5, -1];
        const phaseOneStartOffsets = [0, 0.1, 0.2, 0.3];

        spotlightImages.forEach((img, index) => {
          if (!img) return;

          const initialRotation = initialRotations[index];
          const phase1Start = phaseOneStartOffsets[index];
          const phase1End = Math.min(
            phase1Start + (0.45 - phase1Start) * 0.9,
            0.45
          );

          let x = -50;
          let y, rotation;

          if (progress < phase1Start) {
            y = 200;
            rotation = initialRotation;
          } else if (progress <= 0.45) {
            let phase1Progress;

            if (progress >= phase1End) {
              phase1Progress = 1;
            } else {
              const linearProgress =
                (progress - phase1Start) / (phase1End - phase1Start);
              phase1Progress = 1 - Math.pow(1 - linearProgress, 3);
            }

            y = 200 - phase1Progress * 250;
            rotation = initialRotation;
          } else {
            y = -50;
            rotation = initialRotation;
          }

          const phaseTwoStartOffsets = [0.5, 0.55, 0.6, 0.65];
          const phase2Start = phaseTwoStartOffsets[index];
          const phase2End = Math.min(
            phase2Start + (0.95 - phase2Start) * 0.9,
            0.95
          );
          const finalX = spotlightImgFinalPos[index][0];
          const finalY = spotlightImgFinalPos[index][1];

          if (progress >= phase2Start && progress <= 0.95) {
            let phase2Progress;

            if (progress >= phase2End) {
              phase2Progress = 1;
            } else {
              const linearProgress =
                (progress - phase2Start) / (phase2End - phase2Start);
              phase2Progress = 1 - Math.pow(1 - linearProgress, 3);
            }

            x = -50 + (finalX + 50) * phase2Progress;
            y = -50 + (finalY + 50) * phase2Progress;
            rotation = initialRotation * (1 - phase2Progress);
          } else if (progress > 0.95) {
            x = finalX;
            y = finalY;
            rotation = 0;
          }

          gsap.set(img, {
            transform: `translate(${x}%, ${y}%) rotate(${rotation}deg)`,
          });
        });
      },
    });

    return () => {
      scrollTrigger.kill();
      gsap.ticker.remove(lenisRaf);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Navbar />
      <section className="intro">
        <div className="intro-content">
          <h1>Every place has a story… share yours.</h1>
          <p className="subhero">
            A location-bound AR messaging platform that turns public spaces into living layers 
            of shared memories, notes, and discoveries.
          </p>
        </div>
        <div className="features-floating">
          <div className="feature-badge">Hidden Stories</div>
          <div className="feature-badge">Place-Linked Memories</div>
          <div className="feature-badge">Moments Left Behind</div>
          <div className="feature-badge">Voices in the City</div>
          <div className="feature-badge">Time-Stamped Notes</div>
          <div className="feature-badge">Personal Landmarks</div>
          <div className="feature-badge">Walking Narratives</div>
          <div className="feature-badge">Memory Trails</div>
          <div className="feature-badge">Spatial Journals</div>
          <div className="feature-badge">Ephemeral Drops</div>
        </div>
      </section>

      <section className="spotlight" ref={spotlightRef}>
        <div className="spotlight-header">
          <h1>Messages become part of a place—waiting to be discovered.</h1>
        </div>

        <div className="spotlight-images">
          <div
            className="spotlight-img"
            ref={(el) => {
              if (el) spotlightImagesRef.current[0] = el;
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image src="/img_1.jpg" alt="" fill style={{ objectFit: "cover" }} />
            </div>
          </div>
          <div
            className="spotlight-img"
            ref={(el) => {
              if (el) spotlightImagesRef.current[1] = el;
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image src="/img_2.jpg" alt="" fill style={{ objectFit: "cover" }} />
            </div>
          </div>
          <div
            className="spotlight-img"
            ref={(el) => {
              if (el) spotlightImagesRef.current[2] = el;
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image src="/img_3.jpg" alt="" fill style={{ objectFit: "cover" }} />
            </div>
          </div>
          <div
            className="spotlight-img"
            ref={(el) => {
              if (el) spotlightImagesRef.current[3] = el;
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image src="/img_4.jpg" alt="" fill style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="outro-how-it-works">
        <div className="outro-hero">
          <h1>The world becomes a canvas of stories.</h1>
        </div>
        <div className="timeline-container">
          <div className="timeline">
            <div className="timeline-line"></div>
            <div className="timeline-step">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-number">01</div>
                <h3>Create</h3>
                <p>
                  Open the app in your browser. Use the AR camera view to place a marker in the real world. 
                  Add your message: text, photo, audio, or short video. Set how long it should last. 
                  Publish it to the Arkiv Network for secure, tamper-proof storage.
                </p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-number">02</div>
                <h3>Discover</h3>
                <p>
                  Explore the world with your camera open. When you enter a tagged location, artefacts appear as AR markers. 
                  Tap to reveal the story left behind. Messages expire when their time runs out, leaving room for new ones.
                </p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-number">03</div>
                <h3>Share</h3>
                <p>
                  Invite friends to explore hidden layers around you. Create shared storytelling trails across cities. 
                  Turn public spaces into living layers of shared memories, notes, and discoveries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="section-content">
          <h2>Core Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>AR Geolocation Messaging</h3>
              <p>Drop time-limited, geo-anchored messages that others can uncover through their camera.</p>
            </div>
            <div className="feature-card">
              <h3>Camera-Based Exploration</h3>
              <p>Discover digital artefacts in physical space by simply pointing your camera at the world around you.</p>
            </div>
            <div className="feature-card">
              <h3>Time-Limited Story Drops</h3>
              <p>Messages expire when their time runs out, creating a dynamic, ever-changing landscape of stories.</p>
            </div>
            <div className="feature-card">
              <h3>Decentralized Storage</h3>
              <p>Secure, tamper-proof storage via Arkiv Network ensures your messages are preserved and accessible.</p>
            </div>
            <div className="feature-card">
              <h3>Browser-Native</h3>
              <p>No app install required—experience AR messaging directly in your browser.</p>
            </div>
            <div className="feature-card">
              <h3>Lightweight UX</h3>
              <p>Expressive, intuitive interface that makes leaving and discovering stories effortless.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="use-cases" className="use-cases">
        <div className="section-content">
          <h1 className="features-hero-title">Core Features</h1>
          <div className="features-grid-new">
            <div className="feature-item">
              <div className="feature-number">01</div>
              <div className="feature-content">
                <h3>AR Geolocation Messaging</h3>
                <p>Drop time-limited, geo-anchored messages that others can uncover through their camera.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-number">02</div>
              <div className="feature-content">
                <h3>Camera-Based Exploration</h3>
                <p>Discover digital artefacts in physical space by simply pointing your camera at the world around you.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-number">03</div>
              <div className="feature-content">
                <h3>Time-Limited Story Drops</h3>
                <p>Messages expire when their time runs out, creating a dynamic, ever-changing landscape of stories.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-number">04</div>
              <div className="feature-content">
                <h3>Decentralized Storage</h3>
                <p>Secure, tamper-proof storage via Arkiv Network ensures your messages are preserved and accessible.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-number">05</div>
              <div className="feature-content">
                <h3>Browser-Native</h3>
                <p>No app install required—experience AR messaging directly in your browser.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-number">06</div>
              <div className="feature-content">
                <h3>Lightweight UX</h3>
                <p>Expressive, intuitive interface that makes leaving and discovering stories effortless.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="closing-content">
          <h1>Places hold energy, memory, and meaning. Artefact lets communities speak through their environments, creating a living Arkiv of stories.</h1>
    </div>
      </section>
    </>
  );
}
