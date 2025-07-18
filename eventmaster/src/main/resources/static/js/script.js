document.addEventListener('DOMContentLoaded', function() {
    // ==================== AUTHENTICATION FLOW ====================
    const authContainer = document.getElementById('auth-container');
    const appContent = document.getElementById('app-content');
    const authChoices = document.getElementById('auth-choices');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const loginChoice = document.getElementById('login-choice');
    const registerChoice = document.getElementById('register-choice');
    const backToChoicesFromLogin = document.getElementById('back-to-choices-from-login');
    const backToChoicesFromRegister = document.getElementById('back-to-choices-from-register');
    const logoutLink = document.getElementById('logout-link');

    // Check if user is already logged in
    if (localStorage.getItem('currentUser')) {
        authContainer.classList.add('hidden');
        appContent.classList.remove('hidden');
    } else {
        authContainer.classList.remove('hidden');
        appContent.classList.add('hidden');
    }

    // Auth navigation handlers
    loginChoice.addEventListener('click', () => {
        authChoices.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    registerChoice.addEventListener('click', () => {
        authChoices.classList.add('hidden');
        registerSection.classList.remove('hidden');
    });

    backToChoicesFromLogin.addEventListener('click', () => {
        loginSection.classList.add('hidden');
        authChoices.classList.remove('hidden');
    });

    backToChoicesFromRegister.addEventListener('click', () => {
        registerSection.classList.add('hidden');
        authChoices.classList.remove('hidden');
    });

    // Logout handler
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        document.getElementById('auth-container').style.display = 'flex';
document.getElementById('auth-container').style.justifyContent = 'center';
document.getElementById('auth-container').style.alignItems = 'center';
document.getElementById('auth-container').style.height = '100vh';

        document.getElementById('app-content').style.display = 'none';
    
        // Reset forms
        document.getElementById('login-form').reset();
        document.getElementById('register-form').reset();
    });
    

    // ==================== MAIN APP FUNCTIONALITY ====================
    // DOM Elements
    const homeLink = document.getElementById('home-link');
    const eventsLink = document.getElementById('events-link');
    const bookingsLink = document.getElementById('bookings-link');
    const exploreEventsBtn = document.getElementById('explore-events');
    
    const homeSection = document.getElementById('home-section');
    const eventsSection = document.getElementById('events-section');
    const bookingSection = document.getElementById('booking-section');
    const paymentSection = document.getElementById('payment-section');
    const bookingsSection = document.getElementById('bookings-section');
    
    const eventsContainer = document.getElementById('events-container');
    const bookingsContainer = document.getElementById('bookings-container');
    
    const bookingForm = document.getElementById('booking-form');
    const paymentForm = document.getElementById('payment-form');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    const cancelBookingBtn = document.getElementById('cancel-booking');
    const cancelPaymentBtn = document.getElementById('cancel-payment');
    
    const modal = document.getElementById('confirmation-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalOk = document.getElementById('modal-ok');
    const closeModal = document.querySelector('.close-modal');
    
    // Current state
    let currentEvent = null;
    let currentBooking = null;
    let currentUser = null;
    
    // Navigation functions
    function showSection(section) {
        // Hide all sections
        document.querySelectorAll('#app-content main section').forEach(sec => {
            sec.classList.add('hidden');
        });
        
        // Show the requested section
        section.classList.remove('hidden');
        
        // Update active nav link
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Special cases for active link
        if (section === homeSection) {
            homeLink.classList.add('active');
        } else if (section === eventsSection) {
            eventsLink.classList.add('active');
            loadEvents();
        } else if (section === bookingsSection) {
            bookingsLink.classList.add('active');
            loadBookings();
        }
    }
    
    // Event Listeners for navigation
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(homeSection);
    });
    
    eventsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(eventsSection);
    });
    
    bookingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(bookingsSection);
    });
    
    exploreEventsBtn.addEventListener('click', () => {
        showSection(eventsSection);
    });
    
    cancelBookingBtn.addEventListener('click', () => {
        showSection(eventsSection);
    });
    
    cancelPaymentBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to cancel this booking? All food orders will be deleted.')) {
            try {
                const response = await fetch(`http://localhost:8080/bookings/${currentBooking.id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    showModal('Success', 'Booking and food orders cancelled successfully');
                    showSection(homeSection);
                    currentBooking = null;
                    foodCart = [];
                } else {
                    const error = await response.text();
                    throw new Error(error);
                }
            } catch (error) {
                console.error('Cancellation error:', error);
                showModal('Error', error.message);
            }
        }
    });
    
    // Modal functions
    function showModal(title, message) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.classList.remove('hidden');
    }
    
    function hideModal() {
        modal.classList.add('hidden');
    }
    
    modalOk.addEventListener('click', hideModal);
    closeModal.addEventListener('click', hideModal);
    
    // Load events from API
    async function loadEvents() {
        try {
            const response = await fetch('http://localhost:8080/events');
            const events = await response.json();
            
            eventsContainer.innerHTML = '';
            
            if (events.length === 0) {
                eventsContainer.innerHTML = '<p>No events available at the moment.</p>';
                return;
            }
            
            events.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.className = 'event-card';
                
                eventCard.innerHTML = `
                    <img src="${event.imagePath}" alt="${event.name}" onerror="this.src='/images/default-event.jpg'">
                    <div class="event-info">
                        <h3>${event.name}</h3>
                        <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                        <p><i class="far fa-calendar-alt"></i> ${new Date(event.date).toLocaleDateString()}</p>
                        <p class="event-price">₹${event.price.toFixed(2)}</p>
                        <div class="event-actions">
                            <button class="btn-primary book-btn" data-id="${event.id}">Book Now</button>
                        </div>
                    </div>
                `;
                
                eventsContainer.appendChild(eventCard);
            });
            
            // Add event listeners to book buttons
            document.querySelectorAll('.book-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const eventId = e.target.getAttribute('data-id');
                    currentEvent = events.find(event => event.id == eventId);
                    showBookingForm(currentEvent);
                });
            });
            
        } catch (error) {
            console.error('Error loading events:', error);
            showModal('Error', 'Failed to load events. Please try again later.');
        }
    }
    

    // Seat selection functionality
    async function initializeSeatMap(totalSeats = 50) {
        const seatMapContainer = document.getElementById('seat-map-container');
        seatMapContainer.innerHTML = '';
        
        // Get already booked seats for this event
        const eventId = document.getElementById('event-id').value;
        let bookedSeats = [];
        
        try {
            const response = await fetch(`http://localhost:8080/events/${eventId}/booked-seats`);
            bookedSeats = await response.json();
        } catch (error) {
            console.error('Error fetching booked seats:', error);
        }
        
        const rows = Math.ceil(totalSeats / 10);
        let seatNumber = 1;
        
        for (let i = 0; i < rows; i++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'seat-row';
            
            const seatsInRow = (i === rows - 1) ? (totalSeats % 10 || 10) : 10;
            
            for (let j = 0; j < seatsInRow; j++) {
                const seat = document.createElement('div');
                seat.className = 'seat';
                seat.textContent = seatNumber;
                seat.dataset.seatNumber = seatNumber;
                
                // Mark seat as booked if it's in the bookedSeats array
                const isBooked = bookedSeats.includes(seatNumber.toString());
                seat.dataset.booked = isBooked.toString();
                
                if (isBooked) {
                    seat.classList.add('booked');
                } else {
                    seat.addEventListener('click', toggleSeatSelection);
                }
                
                rowDiv.appendChild(seat);
                seatNumber++;
            }
            
            seatMapContainer.appendChild(rowDiv);
        }
        
        updateSelectedSeatsDisplay();
    }

    function toggleSeatSelection(e) {
        const seat = e.target;
        if (seat.dataset.booked === "true") return;
        
        seat.classList.toggle('selected');
        updateSelectedSeatsDisplay();
    }

    function updateSelectedSeatsDisplay() {
        const selectedSeats = Array.from(document.querySelectorAll('.seat.selected'))
            .map(seat => seat.dataset.seatNumber);
        
        const display = document.getElementById('selected-seats-display');
        display.textContent = selectedSeats.length > 0 
            ? `Selected Seats: ${selectedSeats.join(', ')}` 
            : 'No seats selected';
    }

    function getSelectedSeats() {
        return Array.from(document.querySelectorAll('.seat.selected'))
            .map(seat => seat.dataset.seatNumber);
    }



    // Show booking form
    function showBookingForm(event) {
        document.getElementById('event-id').value = event.id;
        document.getElementById('event-name').value = event.name;
        
        // Initialize seat map with 50 seats (adjust as needed)
        initializeSeatMap(50);
        
        // Update price when seats are selected
        const updatePrice = () => {
            const selectedCount = document.querySelectorAll('.seat.selected').length;
            const totalPrice = selectedCount * event.price;
            document.getElementById('total-price').value = `₹${totalPrice.toFixed(2)}`;
        };
        
        // Listen for seat selection changes
        document.getElementById('seat-map-container').addEventListener('click', updatePrice);
        
        showSection(bookingSection);
    }


    // Define all cart-related functions first
    let foodCart = [];

    function addToCart(id, name, price) {
        const existing = foodCart.find(item => item.id === id && !item.isCombo);
        if (existing) {
            existing.quantity++;
        } else {
            foodCart.push({ id, name, price, quantity: 1 });
        }
        updateCartDisplay();
    }

    function updateCartDisplay() {
        const cartItemsEl = document.getElementById('cart-items');
        const cartTotalEl = document.getElementById('cart-total');
        
        if (!cartItemsEl || !cartTotalEl) return;
        
        cartItemsEl.innerHTML = foodCart.map(item => `
            <div class="cart-item ${item.isCombo ? 'combo-item' : ''}">
                <span>${item.name} x${item.quantity}</span>
                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                ${item.isCombo ? '<span class="combo-badge">COMBO</span>' : ''}
            </div>
        `).join('');
        
        const total = foodCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalEl.innerHTML = `<strong>Total: ₹${total.toFixed(2)}</strong>`;
    }

    function showFoodSelection() {
        Promise.all([
            fetch('/api/food').then(res => res.json()),
            fetch('/api/food/combos').then(res => res.json())
        ])
        .then(([foodItems, foodCombos]) => {
            const foodSection = document.getElementById('food-section');
            foodSection.innerHTML = `
                <h2>Order Theatre Food</h2>
                <div class="food-tabs">
                    <button class="tab-btn active" data-tab="items">Individual Items</button>
                    <button class="tab-btn" data-tab="combos">Meal Combos</button>
                </div>
                
                <div id="food-items-tab" class="food-tab-content active">
                    <div class="food-grid" id="food-grid">
                        ${foodItems.map(item => `
                            <div class="food-item">
                                <img src="${item.imagePath}" alt="${item.name}">
                                <h3>${item.name}</h3>
                                <p>${item.description}</p>
                                <p>₹${item.price.toFixed(2)}</p>
                                <button data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" class="add-to-cart-btn">
                                    Add to Cart
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div id="food-combos-tab" class="food-tab-content">
                    <div class="combo-grid">
                        ${foodCombos.map(combo => `
                            <div class="combo-item">
                                <img src="${combo.imagePath}" alt="${combo.name}">
                                <h3>${combo.name}</h3>
                                <p>${combo.description}</p>
                                <div class="combo-items">
                                    ${combo.items.map(item => `
                                        <div class="combo-subitem">
                                            <span>${item.name}</span>
                                            <span>₹${item.price.toFixed(2)}</span>
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="combo-price">
                                    <span class="original-price">₹${combo.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                                    <span class="discounted-price">₹${combo.totalPrice.toFixed(2)}</span>
                                    <span class="discount">${combo.discount}% OFF</span>
                                </div>
                                <button data-id="${combo.id}" data-name="${combo.name}" data-price="${combo.totalPrice}" class="add-combo-btn">
                                    Add Combo
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="cart-container">
                    <h3>Your Cart</h3>
                    <div id="cart-items"></div>
                    <div id="cart-total"></div>
                    <button id="proceed-to-payment" class="btn-primary">
                        Proceed to Payment
                    </button>
                    <button id="skip-food" class="btn-secondary">
                        Skip Food
                    </button>
                </div>
            `;
            
            // Add tab switching
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    document.querySelectorAll('.food-tab-content').forEach(c => c.classList.remove('active'));
                    
                    btn.classList.add('active');
                    document.getElementById(`food-${btn.dataset.tab}-tab`).classList.add('active');
                });
            });
            
            // Add event listeners using event delegation
            document.getElementById('food-grid')?.addEventListener('click', function(e) {
                if (e.target.classList.contains('add-to-cart-btn')) {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    const name = e.target.getAttribute('data-name');
                    const price = parseFloat(e.target.getAttribute('data-price'));
                    addToCart(id, name, price);
                }
            });
            
            // Add combo to cart
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('add-combo-btn')) {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    const name = e.target.getAttribute('data-name');
                    const price = parseFloat(e.target.getAttribute('data-price'));
                    
                    // Check if combo already exists in cart
                    const existingCombo = foodCart.find(item => item.isCombo && item.comboId === id);
                    if (existingCombo) {
                        existingCombo.quantity++;
                    } else {
                        foodCart.push({
                            id: `combo_${id}`,
                            name: `${name} (Combo)`,
                            price: price,
                            quantity: 1,
                            isCombo: true,
                            comboId: id
                        });
                    }
                    
                    updateCartDisplay();
                }
            });
            
            document.getElementById('proceed-to-payment').addEventListener('click', submitFoodOrder);
            document.getElementById('skip-food').addEventListener('click', skipFoodOrder);
            
            updateCartDisplay();
            showSection(foodSection);
        })
        .catch(error => {
            console.error("Error loading food items:", error);
            showModal('Error', 'Failed to load food items');
        });
    }

    function submitFoodOrder() {
        if (foodCart.length === 0) {
            skipFoodOrder();
            return;
        }
        
        // Separate items and combos
        const items = foodCart.filter(item => !item.isCombo).map(item => ({
            foodItemId: item.id,
            quantity: item.quantity
        }));
        
        const combos = foodCart.filter(item => item.isCombo).map(item => ({
            comboId: item.comboId,
            quantity: item.quantity
        }));
        
        const orderData = {
            bookingId: currentBooking.id,
            items: items,
            combos: combos
        };
        
        fetch('/api/food/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save food order');
            }
            return response.text();
        })
        .then(() => showPaymentPage(true))
        .catch(error => {
            console.error("Food order error:", error);
            showModal('Error', 'Failed to save food order');
        });
    }

    function skipFoodOrder() {
        showPaymentPage(false);
    }
    let paymentCompleted = false; 
    function processPayment() {
        return new Promise((resolve, reject) => {
            fetch('/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData)
            })
            .then(response => {
                if (!response.ok) throw new Error('Payment failed');
                paymentCompleted = true;
                
                // Enable download button after payment
                const downloadBtn = document.getElementById('download-invoice-btn');
                if (downloadBtn) {
                    downloadBtn.disabled = false;
                    downloadBtn.textContent = 'Download Invoice';
                }
                
                resolve();
            })
            .catch(error => {
                alert('Payment failed: ' + error.message);
                reject(error);
            });
        });
    }

    function downloadInvoice(bookingId) {
        console.log("Download invoice called with ID:", bookingId);
        console.log("Payment completed status:", paymentCompleted);
        console.log("Current booking:", currentBooking);
        console.log("Food cart:", foodCart);
        
        if (!paymentCompleted) {
            alert('Please complete payment first');
            return;
        }
        
        try {
            // Collect all necessary data
            const invoiceData = {
                bookingId: currentBooking.id,
                seatPrice: currentBooking.totalPrice,
                seatCount: currentBooking.seats,
                seatNumbers: currentBooking.seatNumbers,
                eventName: currentBooking.event.name,
                food: foodCart.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                foodTotal: foodCart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                total: currentBooking.totalPrice + foodCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
            
            console.log("Invoice data prepared:", invoiceData);
            
            // Store data in localStorage
            localStorage.setItem("invoiceData", JSON.stringify(invoiceData));
            console.log("Data stored in localStorage");
            
            // Open the invoice page
            const invoiceWindow = window.open("/invoice.html", "_blank");
            console.log("Invoice window opened:", !!invoiceWindow);
            
            // Fallback in case popup is blocked
            if (!invoiceWindow) {
                alert("Popup was blocked. Please allow popups for this site to view your invoice.");
                // Alternative: show invoice in same window
                window.location.href = "/invoice.html";
            }
        } catch (error) {
            console.error("Error in downloadInvoice:", error);
            alert("Error preparing invoice: " + error.message);
        }
    }
    
    function showPaymentPage(hasFoodOrder) {
        const paymentAmountEl = document.getElementById('payment-amount');
        const foodSummaryEl = document.getElementById('food-summary');
        
        let total = currentBooking.totalPrice;
        let foodHtml = '';
        
        if (hasFoodOrder && foodCart.length > 0) {
            const foodTotal = foodCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            total += foodTotal;
            
            // Create detailed food summary
            const itemDetails = foodCart.map(item => `
                <div class="payment-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');
            
            foodHtml = `
                <div class="payment-breakdown">
                    <div class="payment-section">
                        <h4>Seats</h4>
                        <div>₹${currentBooking.totalPrice.toFixed(2)}</div>
                    </div>
                    <div class="payment-section">
                        <h4>Food Order</h4>
                        ${itemDetails}
                        <div class="food-total">Food Total: ₹${foodTotal.toFixed(2)}</div>
                    </div>
                    <div class="payment-total">
                        <strong>Grand Total: ₹${total.toFixed(2)}</strong>
                    </div>
                </div>
            `;
        } else {
            foodHtml = `
                <div class="payment-breakdown">
                    <div class="payment-section">
                        <h4>Seats</h4>
                        <div>₹${currentBooking.totalPrice.toFixed(2)}</div>
                    </div>
                    <div class="payment-total">
                        <strong>Total: ₹${total.toFixed(2)}</strong>
                    </div>
                </div>
            `;
        }
        
        paymentAmountEl.value = total.toFixed(2);
        foodSummaryEl.innerHTML = foodHtml;
        document.getElementById('booking-id').value = currentBooking.id; 

    // Ensure the button is created only once and only after payment is successful
    // Create download button (initially disabled)
    if (!document.getElementById('download-invoice-btn')) {
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Complete Payment to Download Invoice';
        downloadButton.id = 'download-invoice-btn';
        downloadButton.disabled = true;
        downloadButton.onclick = function() { 
            downloadInvoice(currentBooking.id);
        };
        downloadButton.classList.add('btn', 'btn-primary', 'mt-3');
        paymentForm.appendChild(downloadButton);
        
    }
    

    // Show the payment section
    showSection(paymentSection);

};
 
   

    // Login function
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const response = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email, 
                    password: password 
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            
            // Store user data
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            // Hide auth container completely
            document.getElementById('auth-container').style.display = 'none';
            
            // Show app content
            document.getElementById('app-content').style.display = 'block';
            
            // Reset form
            loginForm.reset();
            
            // Show home section
            showSection(homeSection);
        } catch (error) {
            showModal('Error', error.message);
        }
    });
    // Register function
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;
        
        if (password !== confirmPassword) {
            showModal('Error', 'Passwords do not match');
            return;
        }
        
        const userData = {
            name: document.getElementById('register-name').value,
            email: document.getElementById('register-email').value,
            phone: document.getElementById('register-phone').value,
            password: password
        };
        
        try {
            const response = await fetch('http://localhost:8080/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }
            
            const user = await response.json();
            showModal('Success', `Registration successful! Welcome ${user.name}`);
            
            // Switch to login after registration
            registerSection.classList.add('hidden');
            loginSection.classList.remove('hidden');
            
            // Reset form
            registerForm.reset();
        } catch (error) {
            showModal('Error', error.message);
        }
    });
    
    // Handle booking form submission
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            showModal('Error', 'Please login to book events');
            return;
        }
        
        const selectedSeats = getSelectedSeats();
        if (selectedSeats.length === 0) {
            showModal('Error', 'Please select at least one seat');
            return;
        }
        
        const eventId = document.getElementById('event-id').value;
        const totalPrice = selectedSeats.length * currentEvent.price;
        
        const bookingData = {
            user: { id: currentUser.id },
            event: { id: parseInt(eventId) },
            seats: selectedSeats.length,
            seatNumbers: selectedSeats.join(','), // Store seat numbers as comma-separated string
            totalPrice: totalPrice,
            bookingDate: new Date().toISOString()
        };
        
        try {
            const response = await fetch('http://localhost:8080/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });
            
            if (!response.ok) {
                throw new Error('Booking failed');
            }
            
            const booking = await response.json();
            currentBooking = booking;
            foodCart = [];
            showFoodSelection();
            
                                    // Show payment form
                                    // document.getElementById('booking-id').value = booking.id;
                                    // document.getElementById('payment-amount').value = `₹${booking.totalPrice.toFixed(2)}`;
                                    // showSection(paymentSection);
            
        } catch (error) {
            console.error('Error creating booking:', error);
            showModal('Error', 'Failed to create booking. Please try again.');
        }
    });
    
    // Handle payment form submission
    // Add this to your existing script.js

// Payment method toggle
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('card-payment-fields').classList.add('hidden');
            document.getElementById('upi-payment-fields').classList.add('hidden');
            document.getElementById('cash-payment-message').classList.add('hidden');
            
            if (this.value === 'CARD') {
                document.getElementById('card-payment-fields').classList.remove('hidden');
            } else if (this.value === 'UPI') {
                document.getElementById('upi-payment-fields').classList.remove('hidden');
            } else if (this.value === 'CASH') {
                document.getElementById('cash-payment-message').classList.remove('hidden');
            }
        });
    });

    // Handle payment form submission
    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bookingId = document.getElementById('booking-id').value;
                        //const amount = parseFloat(currentBooking.totalPrice);
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        const userId = currentUser.id; // Assuming you have currentUser available
        // Calculate total amount including food
    let totalAmount = currentBooking.totalPrice;
    if (foodCart.length > 0) {
        totalAmount += foodCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
        // Basic payment data
        const paymentData = {
            bookingId: parseInt(bookingId),
            userId: currentUser.id, // Add user ID
            amount: totalAmount,
            paymentMethod: paymentMethod,
            paymentStatus: "COMPLETED"
        };
        
        try {
            // Only validate non-cash payments
            if (paymentMethod !== 'CASH') {
                // Get the values first before validation
                if (paymentMethod === 'CARD') {
                    paymentData.cardNumber = document.getElementById('card-number').value;
                    paymentData.cardHolderName = document.getElementById('card-name').value;
                    const cardPassword = document.getElementById('card-password').value;
                    
                    // Validate card password
                    const passwordRegex = /^[a-zA-Z0-9]+$/;
                    if (!passwordRegex.test(cardPassword)) {
                        showModal('Error', 'Card password must be alphanumeric.');
                        return;
                    }
                    paymentData.cardPassword = cardPassword;
                    
                } else if (paymentMethod === 'UPI') {
                        const upiId = document.getElementById('upi-id').value;
                        const upiPin = document.getElementById('upi-pin').value;
                    
                        const pinRegex = /^[a-zA-Z0-9]+$/;
                        if (!pinRegex.test(upiPin)) {
                            showModal('Error', 'UPI PIN must be alphanumeric.');
                            return;
                        }
                    
                        paymentData.upiId = upiId;
                        paymentData.upiPin = upiPin;
                    }
                
            }
            
            const response = await fetch('http://localhost:8080/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Payment failed');
            }

            paymentCompleted = true;
            
            if (paymentMethod === 'CASH') {
                showModal('Success', 'Your booking is confirmed! Please bring cash when you arrive.');
            } else {
                showModal('Success', 'Payment completed successfully! Your tickets have been booked.');
            }
            const downloadBtn = document.getElementById('download-invoice-btn');
        if (downloadBtn) {
            downloadBtn.disabled = false;
            downloadBtn.textContent = 'Download Invoice';
        }
            // showSection(homeSection);
            // paymentForm.reset();
            
        } catch (error) {
            console.error('Error processing payment:', error);
            showModal('Error', error.message || 'Payment failed. Please try again.');
        }
    });
    function validatePayment(paymentMethod) {
        if (paymentMethod === 'CARD') {
            const cardNumber = document.getElementById('card-number').value;
            const cardName = document.getElementById('card-name').value; 
            const cardPassword = document.getElementById('card-password').value;
             
            
            if (!cardPassword || cardPassword.length < 4) {
                throw new Error('Card password must be at least 4 characters');
            }
            
        } else if (paymentMethod === 'UPI') {
            const upiId = document.getElementById('upi-id').value;
            const upiPin = document.getElementById('upi-pin').value;
            
            if (!upiId || !upiPin) {
                throw new Error('Please fill all UPI details');
            }
            
            if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId)) {
                throw new Error('Please enter a valid UPI ID (e.g., name@upi)');
            }
            
            if (!/^\d{4}$/.test(upiPin)) {
                throw new Error('UPI PIN must be 4 digits');
            }
        }
        
        return true;
    }
    // Load user bookings
    async function loadBookings() {
        if (!currentUser) {
            showModal('Error', 'Please login to view bookings');
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:8080/bookings/user/${currentUser.id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const bookings = await response.json();
            bookingsContainer.innerHTML = '';
            
            if (bookings.length === 0) {
                bookingsContainer.innerHTML = '<p>You have no bookings yet.</p>';
                return;
            }
            
            // Create booking cards
            bookings.forEach(booking => {
                const event = booking.event; // Event data is included in the booking
                
                const bookingCard = document.createElement('div');
                bookingCard.className = 'booking-card';
                
                bookingCard.innerHTML = `
                    <h3>${event.name}</h3>
                    <div class="booking-details">
                        <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                        <span><i class="far fa-calendar-alt"></i> ${new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div class="booking-details">
                        <span>Seats: ${booking.seatNumbers || booking.seats}</span>
                        <span>Total: ₹${booking.totalPrice.toFixed(2)}</span>
                    </div>
                    <div class="booking-details">
                        <span>Booked on: ${new Date(booking.bookingDate).toLocaleString()}</span>
                    </div>
                `;
                
                bookingsContainer.appendChild(bookingCard);
            });
            
        } catch (error) {
            console.error('Error loading bookings:', error);
            showModal('Error', 'Failed to load bookings. Please try again later.');
        }
    }
    
    // Initialize the app
    if (localStorage.getItem('currentUser')) {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
        showSection(homeSection);
    }
});