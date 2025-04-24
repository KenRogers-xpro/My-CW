// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Menu Tabs
    setupMenuTabs();
    
    // Booking Form
    setupBookingForm();
    
    // Login Form
    setupLoginForm();
    
    // Stock Page
    if (document.querySelector('.stock-section')) {
        setupStockPage();
    }
    
    // Resume/Careers Page
    if (document.querySelector('.careers-section')) {
        setupCareersPage();
    }
});

// Menu Tabs Function
function setupMenuTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length === 0) return;
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and content
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(this.getAttribute('onclick').match(/openTab$$'(.+?)'$$/)[1]).classList.add('active');
        });
    });
}

// Function to open tab (called from HTML)
function openTab(tabName) {
    // Hide all tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Show the selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Update active state of tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(tabName)) {
            btn.classList.add('active');
        }
    });
}

// Booking Form Function
function setupBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const guests = document.getElementById('guests').value;
        
        if (!name || !email || !date || !time || !guests) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // In a real application, you would send this data to a server
        alert(`Thank you, ${name}! Your reservation for ${guests} guests on ${date} at ${time} has been received. We'll send a confirmation to ${email} shortly.`);
        bookingForm.reset();
    });
}

// Login Form Function
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Reset error messages
        document.getElementById('username-error').textContent = '';
        document.getElementById('password-error').textContent = '';
        
        // Validate form
        let isValid = true;
        
        if (username === '') {
            document.getElementById('username-error').textContent = 'Username is required';
            isValid = false;
        }
        
        if (password === '') {
            document.getElementById('password-error').textContent = 'Password is required';
            isValid = false;
        }
        
        if (isValid) {
            // For demo purposes, we'll use a simple check
            // In a real application, this woul  {
            // For demo purposes, we'll use a simple check
            // In a real application, this would involve server-side authentication
            if (username === 'admin' && password === 'password123') {
                // Redirect to stock page
                window.location.href = 'stock.html';
            } else {
                alert('Invalid username or password. Please try again.');
            }
        }
    });
}

// Stock Page Functions
function setupStockPage() {
    // Check if user is logged in (in a real app, this would use sessions/cookies)
    // For demo purposes, we'll just check if they came from the login page
    const referrer = document.referrer;
    if (!referrer.includes('login.html') && !sessionStorage.getItem('loggedIn')) {
        // Redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    // Set logged in status for this session
    sessionStorage.setItem('loggedIn', 'true');
    
    // Set manager name
    document.getElementById('manager-name').textContent = 'Admin';
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
        sessionStorage.removeItem('loggedIn');
        window.location.href = 'login.html';
    });
    
    // Load sample stock data
    loadStockData();
    
    // Setup search functionality
    document.getElementById('search-btn').addEventListener('click', function() {
        const searchTerm = document.getElementById('search-stock').value.toLowerCase();
        filterStockItems(searchTerm, document.getElementById('category-filter').value);
    });
    
    document.getElementById('search-stock').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.toLowerCase();
            filterStockItems(searchTerm, document.getElementById('category-filter').value);
        }
    });
    
    // Setup category filter
    document.getElementById('category-filter').addEventListener('change', function() {
        const searchTerm = document.getElementById('search-stock').value.toLowerCase();
        filterStockItems(searchTerm, this.value);
    });
    
    // Setup add item modal
    const addItemBtn = document.getElementById('add-item-btn');
    const addItemModal = document.getElementById('add-item-modal');
    const closeModal = document.querySelector('.close-modal');
    
    addItemBtn.addEventListener('click', function() {
        addItemModal.style.display = 'block';
    });
    
    closeModal.addEventListener('click', function() {
        addItemModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === addItemModal) {
            addItemModal.style.display = 'none';
        }
    });
    
    // Setup add item form
    document.getElementById('add-item-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const itemName = document.getElementById('item-name').value;
        const category = document.getElementById('item-category').value;
        const quantity = document.getElementById('item-quantity').value;
        const unit = document.getElementById('item-unit').value;
        const purchaseDate = document.getElementById('purchase-date').value;
        const expiryDate = document.getElementById('expiry-date').value;
        
        // Add new item to stock
        addStockItem(itemName, category, quantity, unit, purchaseDate, expiryDate);
        
        // Close modal and reset form
        addItemModal.style.display = 'none';
        this.reset();
    });
}

// Load sample stock data
function loadStockData() {
    const stockItems = [
        {
            name: 'Tomatoes',
            category: 'produce',
            quantity: 10,
            unit: 'kg',
            purchaseDate: '2023-05-01',
            expiryDate: '2023-05-08',
            status: 'in-stock'
        },
        {
            name: 'Chicken Breast',
            category: 'meat',
            quantity: 5,
            unit: 'kg',
            purchaseDate: '2023-05-02',
            expiryDate: '2023-05-06',
            status: 'low'
        },
        {
            name: 'Milk',
            category: 'dairy',
            quantity: 12,
            unit: 'l',
            purchaseDate: '2023-05-01',
            expiryDate: '2023-05-10',
            status: 'in-stock'
        },
        {
            name: 'Flour',
            category: 'dry-goods',
            quantity: 25,
            unit: 'kg',
            purchaseDate: '2023-04-15',
            expiryDate: '2023-10-15',
            status: 'in-stock'
        },
        {
            name: 'Red Wine',
            category: 'beverages',
            quantity: 8,
            unit: 'bottles',
            purchaseDate: '2023-03-10',
            expiryDate: '2024-03-10',
            status: 'in-stock'
        }
    ];
    
    const stockItemsContainer = document.getElementById('stock-items');
    stockItemsContainer.innerHTML = '';
    
    stockItems.forEach(item => {
        const row = document.createElement('tr');
        
        // Format category for display
        const categoryDisplay = item.category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${categoryDisplay}</td>
            <td>${item.quantity} ${item.unit}</td>
            <td>${item.unit}</td>
            <td>${formatDate(item.purchaseDate)}</td>
            <td>${formatDate(item.expiryDate)}</td>
            <td><span class="status-badge ${item.status}">${getStatusText(item.status)}</span></td>
            <td class="action-buttons">
                <button class="action-btn edit">Edit</button>
                <button class="action-btn delete">Delete</button>
            </td>
        `;
        
        stockItemsContainer.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const itemName = row.cells[0].textContent;
            alert(`Edit functionality for ${itemName} would be implemented in a real application.`);
        });
    });
    
    document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const itemName = row.cells[0].textContent;
            if (confirm(`Are you sure you want to delete ${itemName} from the stock?`)) {
                row.remove();
            }
        });
    });
}

// Filter stock items
function filterStockItems(searchTerm, category) {
    const rows = document.querySelectorAll('#stock-items tr');
    
    rows.forEach(row => {
        const itemName = row.cells[0].textContent.toLowerCase();
        const itemCategory = row.cells[1].textContent.toLowerCase();
        
        const matchesSearch = itemName.includes(searchTerm);
        const matchesCategory = category === 'all' || itemCategory.includes(category.split('-').join(' ').toLowerCase());
        
        if (matchesSearch && matchesCategory) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Add new stock item
function addStockItem(name, category, quantity, unit, purchaseDate, expiryDate) {
    const stockItemsContainer = document.getElementById('stock-items');
    const row = document.createElement('tr');
    
    // Determine status based on quantity and dates
    let status = 'in-stock';
    if (quantity < 5) {
        status = 'low';
    } else if (quantity <= 0) {
        status = 'out-of-stock';
    }
    
    // Format category for display
    const categoryDisplay = category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    row.innerHTML = `
        <td>${name}</td>
        <td>${categoryDisplay}</td>
        <td>${quantity} ${unit}</td>
        <td>${unit}</td>
        <td>${formatDate(purchaseDate)}</td>
        <td>${expiryDate ? formatDate(expiryDate) : 'N/A'}</td>
        <td><span class="status-badge ${status}">${getStatusText(status)}</span></td>
        <td class="action-buttons">
            <button class="action-btn edit">Edit</button>
            <button class="action-btn delete">Delete</button>
        </td>
    `;
    
    stockItemsContainer.appendChild(row);
    
    // Add event listeners to action buttons
    const editBtn = row.querySelector('.action-btn.edit');
    editBtn.addEventListener('click', function() {
        alert(`Edit functionality for ${name} would be implemented in a real application.`);
    });
    
    const deleteBtn = row.querySelector('.action-btn.delete');
    deleteBtn.addEventListener('click', function() {
        if (confirm(`Are you sure you want to delete ${name} from the stock?`)) {
            row.remove();
        }
    });
}

// Helper function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper function to get status text
function getStatusText(status) {
    switch (status) {
        case 'in-stock':
            return 'In Stock';
        case 'low':
            return 'Low Stock';
        case 'out-of-stock':
            return 'Out of Stock';
        case 'expired':
            return 'Expired';
        default:
            return 'Unknown';
    }
}

// Careers/Resume Page Functions
function setupCareersPage() {
    // Apply buttons
    const applyButtons = document.querySelectorAll('.job-apply-btn');
    const applicationForm = document.getElementById('application-form-container');
    const jobTitle = document.getElementById('job-title');
    const jobPosition = document.getElementById('job-position');
    
    applyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const position = this.getAttribute('data-job');
            jobTitle.textContent = position;
            jobPosition.value = position;
            applicationForm.classList.remove('hidden');
            document.getElementById('application-success').classList.add('hidden');
            
            // Scroll to form
            applicationForm.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Cancel button
    document.getElementById('cancel-application').addEventListener('click', function() {
        applicationForm.classList.add('hidden');
    });
    
    // Add more education button
    let educationCount = 1;
    document.getElementById('add-education').addEventListener('click', function() {
        educationCount++;
        const educationContainer = document.getElementById('education-container');
        const newEducation = document.createElement('div');
        newEducation.className = 'education-entry';
        newEducation.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="institution-${educationCount}">Institution</label>
                    <input type="text" id="institution-${educationCount}" name="institution-${educationCount}" required>
                </div>
                <div class="form-group">
                    <label for="degree-${educationCount}">Degree/Certificate</label>
                    <input type="text" id="degree-${educationCount}" name="degree-${educationCount}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="year-${educationCount}">Year</label>
                    <input type="text" id="year-${educationCount}" name="year-${educationCount}" required>
                </div>
                <div class="form-group">
                    <label for="major-${educationCount}">Major/Field of Study</label>
                    <input type="text" id="major-${educationCount}" name="major-${educationCount}">
                </div>
            </div>
        `;
        educationContainer.appendChild(newEducation);
    });
    
    // Add more experience button
    let experienceCount = 1;
    document.getElementById('add-experience').addEventListener('click', function() {
        experienceCount++;
        const experienceContainer = document.getElementById('experience-container');
        const newExperience = document.createElement('div');
        newExperience.className = 'experience-entry';
        newExperience.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="company-${experienceCount}">Company/Organization</label>
                    <input type="text" id="company-${experienceCount}" name="company-${experienceCount}" required>
                </div>
                <div class="form-group">
                    <label for="position-${experienceCount}">Position</label>
                    <input type="text" id="position-${experienceCount}" name="position-${experienceCount}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="start-date-${experienceCount}">Start Date</label>
                    <input type="month" id="start-date-${experienceCount}" name="start-date-${experienceCount}" required>
                </div>
                <div class="form-group">
                    <label for="end-date-${experienceCount}">End Date</label>
                    <input type="month" id="end-date-${experienceCount}" name="end-date-${experienceCount}">
                    <div class="checkbox-group">
                        <input type="checkbox" id="current-job-${experienceCount}" name="current-job-${experienceCount}">
                        <label for="current-job-${experienceCount}">I currently work here</label>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="responsibilities-${experienceCount}">Responsibilities & Achievements</label>
                <textarea id="responsibilities-${experienceCount}" name="responsibilities-${experienceCount}" rows="3" required></textarea>
            </div>
        `;
        experienceContainer.appendChild(newExperience);
    });
    
    // Form validation and submission
    const resumeForm = document.getElementById('resume-form');
    if (resumeForm) {
        resumeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => {
                el.textContent = '';
            });
            
            // Validate form
            let isValid = true;
            
            // Validate name
            const fullName = document.getElementById('full-name').value.trim();
            if (fullName === '') {
                document.getElementById('name-error').textContent = 'Full name is required';
                isValid = false;
            }
            
            // Validate email
            const email = document.getElementById('email-address').value.trim();
            if (email === '') {
                document.getElementById('email-error').textContent = 'Email address is required';
                isValid = false;
            } else if (!isValidEmail(email)) {
                document.getElementById('email-error').textContent = 'Please enter a valid email address';
                isValid = false;
            }
            
            // Validate phone
            const phone = document.getElementById('phone-number').value.trim();
            if (phone === '') {
                document.getElementById('phone-error').textContent = 'Phone number is required';
                isValid = false;
            }
            
            // Validate address
            const address = document.getElementById('address').value.trim();
            if (address === '') {
                document.getElementById('address-error').textContent = 'Address is required';
                isValid = false;
            }
            
            // Validate summary
            const summary = document.getElementById('professional-summary').value.trim();
            if (summary === '') {
                document.getElementById('summary-error').textContent = 'Professional summary is required';
                isValid = false;
            }
            
            // Validate skills
            const skills = document.getElementById('skills').value.trim();
            if (skills === '') {
                document.getElementById('skills-error').textContent = 'Please list at least one skill';
                isValid = false;
            }
            
            if (isValid) {
                // In a real application, you would send this data to a server
                // For demo purposes, we'll just show a success message
                applicationForm.classList.add('hidden');
                document.getElementById('application-success').classList.remove('hidden');
                resumeForm.reset();
                
                // Scroll to success message
                document.getElementById('application-success').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // New application button
    document.getElementById('new-application').addEventListener('click', function() {
        document.getElementById('application-success').classList.add('hidden');
        // Scroll back to job listings
        document.querySelector('.job-listings').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Current job checkboxes
    document.addEventListener('change', function(e) {
        if (e.target && e.target.id.startsWith('current-job-')) {
            const num = e.target.id.split('-')[2];
            const endDateInput = document.getElementById(`end-date-${num}`);
            
            if (e.target.checked) {
                endDateInput.disabled = true;
                endDateInput.value = '';
            } else {
                endDateInput.disabled = false;
            }
        }
    });
}

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}