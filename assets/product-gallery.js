/**
 * Product Gallery Component
 * Description: Swiper-based product gallery with color filtering
 * Dependencies: Swiper.js
 * Version: 1.0.0
 */

class ProductGallery {
  constructor(container) {
    this.container = typeof container === 'string' ? document.getElementById(container) : container;
    
    if (!this.container) {
      // Try to find gallery by attribute
      this.container = document.querySelector('[data-product-gallery]');
    }
    
    if (!this.container) {
      console.warn('ProductGallery: No container found');
      return;
    }

    this.swiper = null;
    this.colorOptions = [];
    this.productImages = {};
    this.currentColor = '';
    this.resizeTimeout = null;
    this.sectionId = this.container.id || 'default';
    
    this.init();
  }

  init() {
    try {
      this.loadProductData();
      this.initSwiper();
      this.initColorSwitching();
      this.initResizeHandler();
      this.initKeyboardNavigation();
      
      console.log('ProductGallery: Initialized successfully');
    } catch (error) {
      console.error('ProductGallery init error:', error);
    }
  }

  loadProductData() {
    // Try to load from JSON data first
    const dataScript = document.getElementById('ProductImagesData-demo');
    if (dataScript) {
      try {
        this.productImages = JSON.parse(dataScript.textContent);
        console.log('ProductGallery: Loaded product data from JSON');
        return;
      } catch (error) {
        console.warn('ProductGallery: Failed to parse JSON data', error);
      }
    }

    // Fallback: extract from existing slides
    const slides = this.container.querySelectorAll('.swiper-slide[data-color]');
    slides.forEach(slide => {
      const color = slide.dataset.color;
      const img = slide.querySelector('img');
      
      if (color && img) {
        if (!this.productImages[color]) {
          this.productImages[color] = [];
        }
        
        this.productImages[color].push({
          src: img.src || img.dataset.src,
          alt: img.alt || `Product ${color}`,
          width: img.width || 600,
          height: img.height || 600
        });
      }
    });

    console.log('ProductGallery: Extracted product data from slides');
  }

  initSwiper() {
    const swiperElement = this.container.querySelector('.swiper');
    if (!swiperElement) {
      console.error('ProductGallery: Swiper element not found');
      return;
    }

    // Get configuration from data attribute or use defaults
    let config;
    try {
      const configAttr = swiperElement.dataset.swiperConfig;
      config = configAttr ? JSON.parse(configAttr) : {};
    } catch (error) {
      console.warn('ProductGallery: Invalid swiper config, using defaults');
      config = {};
    }

    // Determine device type
    const isMobile = window.innerWidth <= 749;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 749;
    const isDesktop = window.innerWidth > 1024;

    const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

    // Build Swiper configuration
    const swiperConfig = {
      slidesPerView: config.slidesPerView?.[deviceType] || 1,
      spaceBetween: config.spaceBetween?.[deviceType] || 10,
      centeredSlides: true,
      loop: false,
      
      // Navigation
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      
      // Pagination
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      
      // Keyboard control
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      
      // Touch settings
      touchRatio: 1,
      touchAngle: 45,
      grabCursor: true,
      
      // Events
      on: {
        init: () => {
          console.log('ProductGallery: Swiper initialized');
          // Store swiper instance globally for demo access
          window.swiperInstance = this.swiper;
        },
        slideChange: () => {
          this.onSlideChange();
        },
        resize: () => {
          this.onSwiperResize();
        }
      }
    };

    // Hide navigation on mobile if configured
    if (isMobile && config.navigation?.mobile === false) {
      swiperConfig.navigation = false;
    }

    // Hide pagination if configured
    if (config.pagination?.[deviceType] === false) {
      swiperConfig.pagination = false;
    }

    try {
      this.swiper = new Swiper(swiperElement, swiperConfig);
      
      // Store reference globally for external access
      window.swiperInstance = this.swiper;
      
      console.log('ProductGallery: Swiper created successfully');
    } catch (error) {
      console.error('ProductGallery: Swiper creation failed', error);
    }
  }

  initColorSwitching() {
    // Find color options
    this.colorOptions = this.container.closest('.product-main')?.querySelectorAll('[data-color]') || 
                       document.querySelectorAll('.color-option[data-color]');

    if (this.colorOptions.length === 0) {
      console.warn('ProductGallery: No color options found');
      return;
    }

    // Get initial color from active option or first option
    const activeOption = document.querySelector('.color-option--active[data-color]');
    this.currentColor = activeOption?.dataset.color || this.colorOptions[0]?.dataset.color || '';

    console.log('ProductGallery: Color switching initialized with color:', this.currentColor);
  }

  filterSlidesByColor(color) {
    if (!this.swiper || !color) return;

    const slides = this.container.querySelectorAll('.swiper-slide');
    let visibleSlides = [];

    // Show/hide slides based on color
    slides.forEach((slide, index) => {
      if (slide.dataset.color === color) {
        slide.style.display = 'block';
        visibleSlides.push(index);
        
        // Load lazy images for this slide
        this.loadLazyImage(slide);
      } else {
        slide.style.display = 'none';
      }
    });

    // Update Swiper
    this.swiper.update();
    
    // Go to first visible slide
    if (visibleSlides.length > 0) {
      this.swiper.slideTo(visibleSlides[0], 0);
    }

    // Update navigation visibility
    this.updateNavigationState(visibleSlides.length);

    console.log(`ProductGallery: Filtered to ${visibleSlides.length} slides for color: ${color}`);
    
    return visibleSlides.length;
  }

  loadLazyImage(slide) {
    const lazyImg = slide.querySelector('img[data-src], img.lazy-load');
    if (!lazyImg || lazyImg.src) return;

    const src = lazyImg.dataset.src;
    if (!src) return;

    const placeholder = slide.querySelector('.loading-placeholder');
    
    lazyImg.onload = () => {
      lazyImg.classList.add('loaded');
      if (placeholder) {
        placeholder.classList.add('hidden');
      }
    };
    
    lazyImg.onerror = () => {
      console.error(`ProductGallery: Failed to load image: ${src}`);
      if (placeholder) {
        placeholder.textContent = 'Failed to load';
        placeholder.style.color = '#dc3545';
      }
    };
    
    lazyImg.src = src;
  }

  updateNavigationState(slideCount) {
    const nextBtn = this.container.querySelector('.swiper-button-next');
    const prevBtn = this.container.querySelector('.swiper-button-prev');
    const pagination = this.container.querySelector('.swiper-pagination');

    const shouldShow = slideCount > 1;

    if (nextBtn) {
      nextBtn.style.display = shouldShow ? 'flex' : 'none';
      nextBtn.style.opacity = shouldShow ? '1' : '0';
    }
    
    if (prevBtn) {
      prevBtn.style.display = shouldShow ? 'flex' : 'none';
      prevBtn.style.opacity = shouldShow ? '1' : '0';
    }
    
    if (pagination) {
      pagination.style.display = shouldShow ? 'block' : 'none';
      pagination.style.opacity = shouldShow ? '1' : '0';
    }
  }

  onSlideChange() {
    if (!this.swiper) return;
    
    const activeSlide = this.swiper.slides[this.swiper.activeIndex];
    if (activeSlide) {
      this.loadLazyImage(activeSlide);
    }
  }

  onSwiperResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    this.resizeTimeout = setTimeout(() => {
      if (this.swiper) {
        this.swiper.update();
      }
    }, 150);
  }

  initResizeHandler() {
    window.addEventListener('resize', () => {
      this.onSwiperResize();
    });
  }

  initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (!this.swiper) return;
      
      // Only handle if gallery is visible
      const galleryRect = this.container.getBoundingClientRect();
      if (galleryRect.width === 0 || galleryRect.height === 0) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.swiper.slidePrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.swiper.slideNext();
          break;
      }
    });
  }

  // Public API methods
  goToSlide(index) {
    if (this.swiper) {
      this.swiper.slideTo(index);
    }
  }

  nextSlide() {
    if (this.swiper) {
      this.swiper.slideNext();
    }
  }

  prevSlide() {
    if (this.swiper) {
      this.swiper.slidePrev();
    }
  }

  updateColor(color) {
    if (color && color !== this.currentColor) {
      this.currentColor = color;
      this.filterSlidesByColor(color);
    }
  }

  destroy() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
    
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    // Clean up global reference
    if (window.swiperInstance === this.swiper) {
      window.swiperInstance = null;
    }
    
    console.log('ProductGallery: Destroyed');
  }
}

// Auto-initialization
document.addEventListener('DOMContentLoaded', () => {
  // Wait for Swiper to be available
  const initGallery = () => {
    if (typeof Swiper === 'undefined') {
      setTimeout(initGallery, 100);
      return;
    }
    
    // Find gallery container
    const galleryContainer = document.querySelector('[data-product-gallery]') || 
                           document.querySelector('.product-gallery');
    
    if (galleryContainer) {
      window.productGallery = new ProductGallery(galleryContainer);
    }
  };
  
  initGallery();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProductGallery;
}