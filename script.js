   const slider = document.querySelector('.rank-card');
      const sliderViewport = document.querySelector('.slider-viewport');
      const previousButton = document.querySelector('.slider-button-previous');
      const nextButton = document.querySelector('.slider-button-next');
      const movieCards = document.querySelectorAll('.movie-card');
      let currentSlide = 0;
      let dragStartX = 0;
      let isDragging = false;
      let startingOffset = 0;

      function updateSlider() {
        const visibleCards = window.innerWidth <= 700 ? 2 : 4;
        const cardWidth = movieCards[0].getBoundingClientRect().width + 6;
        const maximumSlide = movieCards.length - visibleCards;
        slider.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
        previousButton.disabled = currentSlide === 0;
        nextButton.disabled = currentSlide >= maximumSlide;
      }

      nextButton.addEventListener('click', () => {
        if (currentSlide < movieCards.length - (window.innerWidth <= 700 ? 2 : 4)) {
          currentSlide += 1;
          updateSlider();
        }
      });

      previousButton.addEventListener('click', () => {
        if (currentSlide > 0) {
          currentSlide -= 1;
          updateSlider();
        }
      });

      let trackpadLocked = false;
      sliderViewport.addEventListener('wheel', (event) => {
        if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

        event.preventDefault();
        if (trackpadLocked) return;

        const maximumSlide = movieCards.length - (window.innerWidth <= 700 ? 2 : 4);
        currentSlide = Math.max(0, Math.min(maximumSlide, currentSlide + (event.deltaX > 0 ? 1 : -1)));
        updateSlider();
        trackpadLocked = true;
        setTimeout(() => {
          trackpadLocked = false;
        }, 300);
      }, { passive: false });

      slider.addEventListener('pointerdown', (event) => {
        dragStartX = event.clientX;
        const cardWidth = movieCards[0].getBoundingClientRect().width + 6;
        startingOffset = currentSlide * cardWidth;
        isDragging = true;
        slider.setPointerCapture(event.pointerId);
        slider.classList.add('is-dragging');
      });

      slider.addEventListener('pointermove', (event) => {
        if (!isDragging) return;

        const dragDistance = event.clientX - dragStartX;
        slider.style.transform = `translateX(${dragDistance - startingOffset}px)`;
      });

      slider.addEventListener('pointerup', (event) => {
        if (!isDragging) return;

        const dragDistance = event.clientX - dragStartX;
        if (Math.abs(dragDistance) > 50) {
          if (dragDistance < 0 && currentSlide < movieCards.length - (window.innerWidth <= 700 ? 2 : 4)) {
            currentSlide += 1;
          } else if (dragDistance > 0 && currentSlide > 0) {
            currentSlide -= 1;
          }
          updateSlider();
        }

        isDragging = false;
        slider.classList.remove('is-dragging');
        slider.releasePointerCapture(event.pointerId);
        updateSlider();
      });

      slider.addEventListener('pointercancel', () => {
        isDragging = false;
        slider.classList.remove('is-dragging');
        updateSlider();
      });

      window.addEventListener('resize', updateSlider);
      updateSlider();

      document.querySelectorAll('.faq-question').forEach((question) => {
        question.addEventListener('click', () => {
          const answer = question.nextElementSibling;
          const isExpanded = question.getAttribute('aria-expanded') === 'true';

          question.setAttribute('aria-expanded', String(!isExpanded));
          answer.hidden = isExpanded;
        });
      });