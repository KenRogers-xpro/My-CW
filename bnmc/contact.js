// Contact Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            if (validateForm()) {
                // Show success message (in a real application, this would submit to a server)
                showSubmissionMessage();
            }
        });
    }
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        // Reset previous error messages
        const errorMessages = contactForm.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.remove());
        
        // Check each required field
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, 'This field is required');
            }
        });
        
        // Email validation
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim() && !isValidEmail(emailField.value)) {
            isValid = false;
            showError(emailField, 'Please enter a valid email address');
        }
        
        return isValid;
    }
    
    // Show error message for a field
    function showError(field, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '5px';
        
        field.style.borderColor = 'red';
        field.parentNode.appendChild(errorElement);
        
        // Remove error on field focus
        field.addEventListener('focus', function() {
            this.style.borderColor = '';
            const error = this.parentNode.querySelector('.error-message');
            if (error) {
                error.remove();
            }
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show submission success message
    function showSubmissionMessage() {
        // Hide the form
        contactForm.style.display = 'none';
        
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'submission-success';
        successMessage.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <i class="fas fa-check-circle" style="font-size: 48px; color: green; margin-bottom: 20px;"></i>
                <h3 style="margin-bottom: 15px; color: var(--primary-color);">Message Sent Successfully!</h3>
                <p>Thank you for contacting Bishop Nankyama Memorial College. We have received your message and will get back to you shortly.</p>
                <button id="reset-form" class="btn btn-primary" style="margin-top: 20px;">Send Another Message</button>
            </div>
        `;
        
        // Insert success message
        contactForm.parentNode.insertBefore(successMessage, contactForm);
        
        // Add event listener to reset button
        document.getElementById('reset-form').addEventListener('click', function() {
            // Show the form again
            contactForm.style.display = 'block';
            // Reset the form
            contactForm.reset();
            // Remove success message
            successMessage.remove();
        });
    }
});