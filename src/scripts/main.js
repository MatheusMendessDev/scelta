//carrossel de marcas home
$(document).ready(function(){
    $('.science__carousel').owlCarousel({
        loop:true,
        margin:15,
        autoplay: true,
        nav:false,
        dots: true,
        dotsContainer: '.science__dots',
        responsive:{
            0:{
                items:2.5
            },
            1000:{
                items:3
            }
        }
    });
    $('.area__carousel').owlCarousel({
        loop:true,
        margin:15,
        autoplay: true,
        nav:false,
        dots: true,
        responsive:{
            0:{
                items:1.5
            },
            1000:{
                items:2.3
            }
        }
    });
    wow = new WOW(
        {
        boxClass:     'animate',     
        animateClass: 'animated',
        offset:       0,         
        mobile:       true,      
        live:         true       
        }
      )
      wow.init();
      
      // Set current year in footer
      const currentYearElement = document.getElementById('currentYear');
      if (currentYearElement) {
          currentYearElement.textContent = new Date().getFullYear();
      }
      
      // Contact form spam protection and validation
      initContactForm();
})

// Contact form spam protection and validation
let formSubmitTime = 0;
let formSubmitCount = 0;

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Rate limiting: track submission attempts
    const lastSubmit = localStorage.getItem('formLastSubmit');
    const submitCount = parseInt(localStorage.getItem('formSubmitCount') || '0');
    const resetTime = Date.now() - (60 * 60 * 1000); // 1 hour
    
    if (lastSubmit && parseInt(lastSubmit) > resetTime) {
        formSubmitCount = submitCount;
    } else {
        localStorage.setItem('formSubmitCount', '0');
        formSubmitCount = 0;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Honeypot check
        const honeypot = document.getElementById('website').value;
        if (honeypot !== '') {
            console.log('Spam detected: honeypot field filled');
            showFormError('Erro ao enviar formulário. Por favor, tente novamente.');
            return false;
        }
        
        // Rate limiting check
        const now = Date.now();
        if (formSubmitTime && (now - formSubmitTime) < 5000) {
            showFormError('Por favor, aguarde alguns segundos antes de enviar novamente.');
            return false;
        }
        
        if (formSubmitCount >= 5) {
            showFormError('Muitas tentativas de envio. Por favor, tente novamente mais tarde.');
            return false;
        }
        
        // Validate form
        if (!validateForm()) {
            return false;
        }
        
        // Disable submit button
        const submitBtn = document.getElementById('submitBtn');
        const submitText = submitBtn.querySelector('.submit-text');
        const submitLoading = submitBtn.querySelector('.submit-loading');
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        submitLoading.style.display = 'inline-flex';
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(function() {
            // Update rate limiting
            formSubmitTime = Date.now();
            formSubmitCount++;
            localStorage.setItem('formLastSubmit', formSubmitTime.toString());
            localStorage.setItem('formSubmitCount', formSubmitCount.toString());
            
            // Show success message
            document.getElementById('formSuccess').style.display = 'block';
            document.getElementById('formError').style.display = 'none';
            form.reset();
            
            // Reset button
            submitBtn.disabled = false;
            submitText.style.display = 'inline';
            submitLoading.style.display = 'none';
            
            // Hide success message after 5 seconds
            setTimeout(function() {
                document.getElementById('formSuccess').style.display = 'none';
            }, 5000);
            
            // Here you would normally send the data to your server
            // Example: sendFormData(formData);
        }, 1500);
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('.contact__input, .contact__textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(input);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(input);
        });
    });
}

function validateForm() {
    const form = document.getElementById('contactForm');
    let isValid = true;
    
    const name = document.getElementById('contactName');
    const phone = document.getElementById('contactPhone');
    const email = document.getElementById('contactEmail');
    const message = document.getElementById('contactMessage');
    
    isValid = validateField(name) && isValid;
    isValid = validateField(phone) && isValid;
    isValid = validateField(email) && isValid;
    isValid = validateField(message) && isValid;
    
    return isValid;
}

function validateField(field) {
    const errorId = field.id + 'Error';
    const errorElement = document.getElementById(errorId);
    let isValid = true;
    let errorMessage = '';
    
    // Check required
    if (field.hasAttribute('required') && !field.value.trim()) {
        errorMessage = 'Este campo é obrigatório.';
        isValid = false;
    }
    // Check minlength
    else if (field.hasAttribute('minlength') && field.value.length < parseInt(field.getAttribute('minlength'))) {
        errorMessage = `Este campo deve ter pelo menos ${field.getAttribute('minlength')} caracteres.`;
        isValid = false;
    }
    // Check maxlength
    else if (field.hasAttribute('maxlength') && field.value.length > parseInt(field.getAttribute('maxlength'))) {
        errorMessage = `Este campo deve ter no máximo ${field.getAttribute('maxlength')} caracteres.`;
        isValid = false;
    }
    // Check pattern
    else if (field.hasAttribute('pattern') && field.value) {
        const pattern = new RegExp(field.getAttribute('pattern'));
        if (!pattern.test(field.value)) {
            if (field.type === 'tel') {
                errorMessage = 'Por favor, insira um telefone válido.';
            } else if (field.type === 'email') {
                errorMessage = 'Por favor, insira um e-mail válido.';
            } else {
                errorMessage = 'Formato inválido.';
            }
            isValid = false;
        }
    }
    // Check email format
    else if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            errorMessage = 'Por favor, insira um e-mail válido.';
            isValid = false;
        }
    }
    
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }
    
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
    } else {
        field.classList.add('error');
        field.classList.remove('valid');
    }
    
    return isValid;
}

function clearFieldError(field) {
    const errorId = field.id + 'Error';
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = '';
    }
    field.classList.remove('error');
}

function showFormError(message) {
    const errorElement = document.getElementById('formError');
    const errorText = document.getElementById('errorText');
    if (errorElement && errorText) {
        errorText.textContent = message;
        errorElement.style.display = 'block';
        document.getElementById('formSuccess').style.display = 'none';
    }
}

function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  } 

// setas carrossel mobile
function changeArrow(){
    let slides = document.querySelectorAll('.reasons__carousel .item') && document.querySelectorAll('.admin__carousel .item')
    let nextSlide = document.querySelector('.owl_controls .owl-next')
    let prevSlide = document.querySelector('.owl_controls .owl-prev')
    switch(slides){
        case 0 :
            prevSlide.classList.add('disabled')
            break;
        case 3 : 
            nextSlide.classList.add('disabled')
    }
}

// Toggle project category accordion
function toggleCategory(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('i');
    const isOpen = content.style.display === 'block';
    
    // Close all other categories
    document.querySelectorAll('.project-category-content').forEach(item => {
        item.style.display = 'none';
    });
    document.querySelectorAll('.project-category-header i').forEach(item => {
        item.classList.remove('fa-chevron-up');
        item.classList.add('fa-chevron-down');
    });
    
    // Toggle current category
    if (!isOpen) {
        content.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    }
}

// Track drag state to prevent image opening during carousel drag
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let hasMoved = false;

// Initialize drag detection for carousel images
$(document).ready(function(){
    // Track drag on carousel items
    $('.area__carousel').on('mousedown touchstart', '.item img', function(e) {
        isDragging = false;
        hasMoved = false;
        dragStartX = e.type === 'mousedown' ? e.clientX : (e.originalEvent.touches ? e.originalEvent.touches[0].clientX : 0);
        dragStartY = e.type === 'mousedown' ? e.clientY : (e.originalEvent.touches ? e.originalEvent.touches[0].clientY : 0);
    });
    
    $('.area__carousel').on('mousemove touchmove', '.item img', function(e) {
        if (dragStartX !== 0 || dragStartY !== 0) {
            const currentX = e.type === 'mousemove' ? e.clientX : (e.originalEvent.touches ? e.originalEvent.touches[0].clientX : 0);
            const currentY = e.type === 'mousemove' ? e.clientY : (e.originalEvent.touches ? e.originalEvent.touches[0].clientY : 0);
            const deltaX = Math.abs(currentX - dragStartX);
            const deltaY = Math.abs(currentY - dragStartY);
            
            // If movement is more than 5px, consider it a drag
            if (deltaX > 5 || deltaY > 5) {
                isDragging = true;
                hasMoved = true;
            }
        }
    });
    
    $('.area__carousel').on('mouseup touchend', '.item img', function() {
        // Small delay to check if it was a drag
        setTimeout(function() {
            dragStartX = 0;
            dragStartY = 0;
            if (hasMoved) {
                isDragging = false;
                hasMoved = false;
            }
        }, 50);
    });
    
    // Also check if Owl Carousel is being dragged
    $('.area__carousel').on('drag.owl.carousel', function() {
        isDragging = true;
    });
    
    $('.area__carousel').on('dragged.owl.carousel', function() {
        setTimeout(function() {
            isDragging = false;
        }, 100);
    });
});

// Lightbox navigation variables
let currentImageIndex = -1;
let currentImageList = [];

// Expand image in lightbox
function expandImage(img) {
    // Don't open if user was dragging
    if (isDragging || hasMoved) {
        isDragging = false;
        hasMoved = false;
        return;
    }
    
    // Get all images from the same carousel
    const carousel = $(img).closest('.area__carousel');
    currentImageList = carousel.find('.item img').toArray();
    currentImageIndex = currentImageList.indexOf(img);
    
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modal.style.display = 'block';
    modalImg.src = img.src;
    document.body.style.overflow = 'hidden';
    
    // Add keyboard navigation
    $(document).on('keydown.lightbox', handleLightboxKeyboard);
    
    // Add swipe support for touch devices
    initLightboxSwipe();
}

// Navigate lightbox (next/prev)
function navigateLightbox(direction) {
    if (currentImageList.length === 0) return;
    
    currentImageIndex += direction;
    
    // Loop around
    if (currentImageIndex < 0) {
        currentImageIndex = currentImageList.length - 1;
    } else if (currentImageIndex >= currentImageList.length) {
        currentImageIndex = 0;
    }
    
    const modalImg = document.getElementById('modalImage');
    modalImg.src = currentImageList[currentImageIndex].src;
}

// Keyboard navigation
function handleLightboxKeyboard(e) {
    const modal = document.getElementById('imageModal');
    if (modal.style.display !== 'block') return;
    
    if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
    } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
    } else if (e.key === 'Escape') {
        closeImageModal({target: modal});
    }
}

// Swipe detection for touch devices
let touchStartX = 0;
let touchEndX = 0;

function initLightboxSwipe() {
    const modalImg = document.getElementById('modalImage');
    
    modalImg.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    modalImg.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next image
            navigateLightbox(1);
        } else {
            // Swipe right - previous image
            navigateLightbox(-1);
        }
    }
}

// Close image modal
function closeImageModal(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal || event.target.classList.contains('image-modal-close')) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentImageList = [];
        currentImageIndex = -1;
        // Remove keyboard listener
        $(document).off('keydown.lightbox');
    }
}


