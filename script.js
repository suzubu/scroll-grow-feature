document.addEventListener("DOMContentLoaded", function () {
    // Initialize Lenis for smooth scrolling behavior
    const lenis = new Lenis();
  
    // Keep ScrollTrigger in sync with Lenis scroll events
    lenis.on("scroll", ScrollTrigger.update);
  
    // Use GSAP's ticker to update Lenis on every animation frame
    // GSAP provides time in seconds; Lenis expects milliseconds
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
  
    // Turn off lag smoothing in GSAP to ensure scroll-linked animations respond instantly
    gsap.ticker.lagSmoothing(0);
  
    // Select all elements with the `.service` class to apply animations to
    const services = gsap.utils.toArray(".service");
  
    // Set up Intersection Observer options:
    // - `root: null` means use the viewport
    // - `threshold: 0.1` means animation triggers when 10% of the element is visible
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };
  
    // Intersection Observer callback:
    // For each `.service` element that enters the viewport,
    // - Animate its `.img` container's width based on scroll position
    // - Animate the entire `.service` element's height
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const service = entry.target;
          const imgContainer = service.querySelector(".img");
  
          // Scroll-linked width animation for image container
          ScrollTrigger.create({
            trigger: service,
            start: "bottom bottom", // when bottom of service hits bottom of viewport
            end: "top top", // until top of service hits top of viewport
            scrub: true, // smooth animation tied to scroll
            onUpdate: (self) => {
              let progress = self.progress; // 0 to 1
              let newWidth = 30 + 70 * progress; // from 30% to 100%
              gsap.to(imgContainer, {
                width: newWidth + "%",
                duration: 0.1,
                ease: "none",
              });
            },
          });
  
          // Scroll-linked height animation for the entire service element
          ScrollTrigger.create({
            trigger: service,
            start: "top bottom", // when top of service hits bottom of viewport
            end: "top top", // until top of service hits top of viewport
            scrub: true,
            onUpdate: (self) => {
              let progress = self.progress;
              let newHeight = 150 + 300 * progress; // from 150px to 450px
              gsap.to(service, {
                height: newHeight + "px",
                duration: 0.1,
                ease: "none",
              });
            },
          });
  
          // Stop observing once animations are triggered to avoid re-triggering
          observer.unobserve(service);
        }
      });
    };
  
    // Start observing each `.service` element
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    services.forEach((service) => observer.observe(service));
  });
  