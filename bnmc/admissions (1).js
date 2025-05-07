// Admissions Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const applicationForm = document.getElementById('application-form');
    
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            if (validateForm()) {
                // Show success message (in a real application, this would submit to a server)
                showSubmissionMessage();
            }
        });
        
        // Program selection changes available entry levels
        const programSelect = document.getElementById('program');
        const entrySelect = document.getElementById('entry');
        
        if (programSelect && entrySelect) {
            programSelect.addEventListener('change', function() {
                updateEntryLevels(this.value);
            });
        }
    }
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        const requiredFields = applicationForm.querySelectorAll('[required]');
        
        // Reset previous error messages
        const errorMessages = applicationForm.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.remove());
        
        // Check each required field
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, 'This field is required');
            }
        });
        
        // Email validation if provided
        const emailField = document.getElementById('parentEmail');
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
    
    // Update entry levels based on program selection
    function updateEntryLevels(program) {
        const entrySelect = document.getElementById('entry');
        if (!entrySelect) return;
        
        // Clear current options
        entrySelect.innerHTML = '<option value="">Select entry level</option>';
        
        // Add appropriate options based on program
        if (program === 'o-level') {
            const oLevelOptions = [
                { value: 's1', text: 'Senior 1' },
                { value: 's2', text: 'Senior 2' },
                { value: 's3', text: 'Senior 3' }
            ];
            
            oLevelOptions.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.text;
                entrySelect.appendChild(optionElement);
            });
        } else if (program === 'a-level') {
            const aLevelOptions = [
                { value: 's5', text: 'Senior 5' }
            ];
            
            aLevelOptions.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.text;
                entrySelect.appendChild(optionElement);
            });
        }
    }
    
    // Show submission success message
    function showSubmissionMessage() {
        // Hide the form
        applicationForm.style.display = 'none';
        
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'submission-success';
        successMessage.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <i class="fas fa-check-circle" style="font-size: 48px; color: green; margin-bottom: 20px;"></i>
                <h3 style="margin-bottom: 15px; color: var(--primary-color);">Application Submitted Successfully!</h3>
                <p>Thank you for applying to Bishop Nankyama Memorial College. We have received your application and will contact you soon.</p>
                <p style="margin-top: 15px;">Reference Number: <strong>APP-${generateReferenceNumber()}</strong></p>
                <button id="reset-form" class="btn btn-primary" style="margin-top: 20px;">Submit Another Application</button>
            </div>
        `;
        
        // Insert success message
        applicationForm.parentNode.insertBefore(successMessage, applicationForm);
        
        // Add event listener to reset button
        document.getElementById('reset-form').addEventListener('click', function() {
            // Show the form again
            applicationForm.style.display = 'block';
            // Reset the form
            applicationForm.reset();
            // Remove success message
            successMessage.remove();
        });
    }
    
    // Generate a random reference number
    function generateReferenceNumber() {
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${timestamp}-${random}`;
    }
});