/* =====================================================
   WHATSAPP WIDGET - AI CHATBOT WITH FALLBACK
===================================================== */

class WhatsAppWidget {
    constructor(whatsappNumber = "+91 8077 313 241") {
        this.whatsappNumber = whatsappNumber;
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createWidget();
        this.setupEventListeners();
        this.open(); // Open widget automatically
        this.showInitialGreeting();
    }

    createWidget() {
        const container = document.createElement('div');
        container.className = 'whatsapp-widget-container';
        container.innerHTML = `
            <button class="whatsapp-toggle-btn" title="Chat with us">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.549 4.127 1.514 5.869L0 24l6.248-1.496C7.873 23.451 9.878 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.961 0-3.842-.478-5.475-1.316l-.393-.195-4.07.975.976-4.054-.195-.394A9.957 9.957 0 013 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10z"/>
                    <path d="M7.707 9.293a1 1 0 00-1.414 1.414l1.414-1.414zM10 7c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm2 2h2v2h-2v-2z" transform="translate(2 3)" fill="white"/>
                </svg>
            </button>

            <div class="whatsapp-chat-window">
                <div class="whatsapp-chat-header">
                    <div>
                        <h3>Chat with us</h3>
                        <p>We typically reply within minutes</p>
                    </div>
                    <button class="whatsapp-close-btn">&times;</button>
                </div>

                <div class="whatsapp-messages"></div>

                <div class="whatsapp-input-section">
                    <div class="whatsapp-input-wrapper">
                        <textarea class="whatsapp-input" placeholder="Type your question..." rows="1"></textarea>
                        <button class="whatsapp-send-btn" title="Send message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        this.container = container;
        this.messagesContainer = container.querySelector('.whatsapp-messages');
        this.inputField = container.querySelector('.whatsapp-input');
        this.sendBtn = container.querySelector('.whatsapp-send-btn');
        this.toggleBtn = container.querySelector('.whatsapp-toggle-btn');
        this.chatWindow = container.querySelector('.whatsapp-chat-window');
        this.closeBtn = container.querySelector('.whatsapp-close-btn');
    }

    setupEventListeners() {
        this.toggleBtn.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.close());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.inputField.addEventListener('input', () => this.resizeTextarea());
    }

    resizeTextarea() {
        this.inputField.style.height = 'auto';
        this.inputField.style.height = Math.min(this.inputField.scrollHeight, 100) + 'px';
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.toggleBtn.classList.add('active');
        this.chatWindow.classList.add('active');
        this.inputField.focus();
    }

    close() {
        this.isOpen = false;
        this.toggleBtn.classList.remove('active');
        this.chatWindow.classList.remove('active');
    }

    showInitialGreeting() {
        setTimeout(() => {
            this.addBotMessage(
                "Hi! 👋 Welcome to Nexa Solutions. How can we help you today?"
            );
            this.showInitialQuestion();
        }, 500);
    }

    showInitialQuestion() {
        const repliesHtml = `
            <div class="whatsapp-quick-replies">
                <button class="whatsapp-quick-reply-btn" onclick="window.whatsappWidget.handleQuickReply('What services do you offer?')">
                    What services do you offer?
                </button>
            </div>
        `;
        const repliesElement = document.createElement('div');
        repliesElement.innerHTML = repliesHtml;
        this.messagesContainer.appendChild(repliesElement);
        this.scrollToBottom();
    }

    handleQuickReply(message) {
        this.inputField.value = message;
        this.sendMessage();
    }

    sendMessage() {
        const message = this.inputField.value.trim();
        if (!message) return;

        this.addUserMessage(message);
        this.inputField.value = '';
        this.inputField.style.height = 'auto';

        // Show typing indicator
        this.showTypingIndicator();

        // Get response after a short delay
        setTimeout(() => {
            this.getResponse(message);
        }, 800);
    }

    getResponse(userMessage) {
        // Check if user is asking about services
        const lowerMessage = userMessage.toLowerCase();
        if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('what')) {
            this.showServices();
        } else {
            this.addBotMessage("I'm curious about your question, but let's start with our services first. Feel free to connect with us on WhatsApp for any other inquiries!");
            setTimeout(() => {
                this.showWhatsappButton();
            }, 500);
        }
    }

    showServices() {
        const servicesHtml = `
            <div class="whatsapp-services-container">
                <div class="whatsapp-service-item">
                    <div class="whatsapp-service-icon">🌐</div>
                    <div class="whatsapp-service-content">
                        <div class="whatsapp-service-name">Website Development</div>
                        <div class="whatsapp-service-desc">High-performance websites designed to convert visitors into customers</div>
                    </div>
                </div>
                <div class="whatsapp-service-item">
                    <div class="whatsapp-service-icon">📱</div>
                    <div class="whatsapp-service-content">
                        <div class="whatsapp-service-name">Mobile App Development</div>
                        <div class="whatsapp-service-desc">Scalable mobile apps for Android & iOS that engage users</div>
                    </div>
                </div>
                <div class="whatsapp-service-item">
                    <div class="whatsapp-service-icon">⚙️</div>
                    <div class="whatsapp-service-content">
                        <div class="whatsapp-service-name">Workflow & n8n Automations</div>
                        <div class="whatsapp-service-desc">Automate repetitive tasks and capture leads automatically</div>
                    </div>
                </div>
                <div class="whatsapp-service-item">
                    <div class="whatsapp-service-icon">🤖</div>
                    <div class="whatsapp-service-content">
                        <div class="whatsapp-service-name">AI & ML Solutions</div>
                        <div class="whatsapp-service-desc">Private, self-hosted AI systems trained on your company data</div>
                    </div>
                </div>
                <div class="whatsapp-service-item">
                    <div class="whatsapp-service-icon">📊</div>
                    <div class="whatsapp-service-content">
                        <div class="whatsapp-service-name">Data Analysis & Insights</div>
                        <div class="whatsapp-service-desc">Turn data into decisions with analytics and dashboards</div>
                    </div>
                </div>
                <div class="whatsapp-service-item">
                    <div class="whatsapp-service-icon">🔍</div>
                    <div class="whatsapp-service-content">
                        <div class="whatsapp-service-name">SEO & GEO (Organic Growth)</div>
                        <div class="whatsapp-service-desc">Capture high-quality leads from search & AI engines</div>
                    </div>
                </div>
            </div>
        `;
        
        const servicesElement = document.createElement('div');
        servicesElement.className = 'whatsapp-message bot';
        servicesElement.innerHTML = servicesHtml;
        
        // Remove typing indicator
        const typingIndicator = this.messagesContainer.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.parentElement.remove();
        }
        
        this.messagesContainer.appendChild(servicesElement);
        this.scrollToBottom();

        // Show WhatsApp CTA after services
        setTimeout(() => {
            this.addBotMessage("Interested in any of these services? Let's connect on WhatsApp to discuss your project!");
            setTimeout(() => {
                this.showWhatsappButton();
            }, 500);
        }, 1000);
    }

    addUserMessage(text) {
        const messageEl = document.createElement('div');
        messageEl.className = 'whatsapp-message user';
        messageEl.innerHTML = `<div class="whatsapp-message-content">${this.escapeHtml(text)}</div>`;
        this.messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
    }

    addBotMessage(text) {
        // Remove typing indicator if exists
        const typingEl = this.messagesContainer.querySelector('.whatsapp-message.bot:has(.typing-indicator)');
        if (typingEl) {
            typingEl.remove();
        }

        const messageEl = document.createElement('div');
        messageEl.className = 'whatsapp-message bot';
        messageEl.innerHTML = `<div class="whatsapp-message-content">${this.escapeHtml(text)}</div>`;
        this.messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingEl = document.createElement('div');
        typingEl.className = 'whatsapp-message bot';
        typingEl.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        this.messagesContainer.appendChild(typingEl);
        this.scrollToBottom();
    }

    showWhatsappButton() {
        const buttonEl = document.createElement('div');
        buttonEl.className = 'whatsapp-quick-replies';
        buttonEl.innerHTML = `
            <button class="whatsapp-quick-reply-btn" onclick="window.whatsappWidget.openWhatsApp()" 
                    style="background: #25D366; color: white; border: none;">
                💬 Chat on WhatsApp
            </button>
        `;
        this.messagesContainer.appendChild(buttonEl);
        this.scrollToBottom();
    }

    openWhatsApp() {
        const message = encodeURIComponent("Hi, I'd like to get more information about your services.");
        const url = `https://wa.me/${this.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`;
        window.open(url, '_blank');
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 0);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.whatsappWidget = new WhatsAppWidget('+91 8077 313 241');
});
