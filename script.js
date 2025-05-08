document.addEventListener("DOMContentLoaded", function () {
  // === [ Smooth Scroll Setup Using Lenis ] ===

  const lenis = new Lenis(); // Enable Lenis for inertia-like scroll

  // Sync ScrollTrigger animations with Lenis scroll
  lenis.on("scroll", ScrollTrigger.update);

  // Hook Lenis into GSAP's ticker for frame updates
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // Convert seconds to ms
  });

  gsap.ticker.lagSmoothing(0); // Disable lag smoothing for instant response

  // === [ Animate Each Service Entry ] ===

  const services = gsap.utils.toArray(".service");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1, // Trigger when 10% of element is visible
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const service = entry.target;
        const imgContainer = service.querySelector(".img");

        // === [ Width Expansion on Scroll for Image Container ] ===
        ScrollTrigger.create({
          trigger: service,
          start: "bottom bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            let progress = self.progress; // 0 to 1 scroll progress
            let newWidth = 30 + 70 * progress; // Width from 30% → 100%
            gsap.to(imgContainer, {
              width: newWidth + "%",
              duration: 0.1,
              ease: "none",
            });
          },
        });

        // === [ Height Growth on Scroll for Entire Entry ] ===
        ScrollTrigger.create({
          trigger: service,
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            let progress = self.progress;
            let newHeight = 150 + 300 * progress; // Height from 150px → 450px
            gsap.to(service, {
              height: newHeight + "px",
              duration: 0.1,
              ease: "none",
            });
          },
        });

        // Stop observing this item after setup
        observer.unobserve(service);
      }
    });
  };

  // Observe all .service elements to trigger scroll-based animations
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  services.forEach((service) => observer.observe(service));
});
