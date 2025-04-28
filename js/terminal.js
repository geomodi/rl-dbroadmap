// Cyber Terminal Functionality
document.addEventListener('DOMContentLoaded', () => {
    setupTerminal();
});

function setupTerminal() {
    const terminal = document.getElementById('cyber-terminal');
    const terminalToggle = document.getElementById('terminal-toggle');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalTime = document.getElementById('terminal-time');
    const terminalClose = document.querySelector('.terminal-close');
    const terminalMinimize = document.querySelector('.terminal-minimize');
    const terminalMaximize = document.querySelector('.terminal-maximize');
    const terminalHeader = document.querySelector('.terminal-header');

    if (!terminal || !terminalToggle || !terminalInput || !terminalOutput) return;

    // Initialize terminal state
    let isTerminalOpen = false;
    let isTerminalMaximized = false;
    let emailMode = false;
    let emailData = {
        to: '',
        subject: '',
        message: ''
    };

    // Set up terminal time
    updateTerminalTime();
    setInterval(updateTerminalTime, 1000);

    // Add tooltip for terminal toggle button
    terminalToggle.setAttribute('title', 'Terminal');

    // Terminal toggle button in header
    terminalToggle.addEventListener('click', () => {
        toggleTerminal();

        // Animate button
        anime({
            targets: terminalToggle,
            scale: [1, 1.2, 1],
            duration: 400,
            easing: 'easeOutBack'
        });
    });

    // Make terminal header clickable to toggle
    terminalHeader.addEventListener('click', (e) => {
        // Only toggle if clicking on the header itself, not on the control buttons
        if (!e.target.closest('.terminal-controls')) {
            toggleTerminal();
        }
    });

    // Terminal close button
    terminalClose.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent header click event
        closeTerminal();
    });

    // Terminal minimize button
    terminalMinimize.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent header click event
        minimizeTerminal();
    });

    // Terminal maximize button
    terminalMaximize.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent header click event
        maximizeTerminal();
    });

    // Terminal input handling
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();

            if (command) {
                if (emailMode) {
                    processEmailInput(command);
                } else {
                    processCommand(command);
                }

                terminalInput.value = '';
            }
        }
    });

    // Function to toggle terminal visibility
    function toggleTerminal() {
        if (isTerminalOpen) {
            closeTerminal();
            terminalToggle.classList.remove('active');
        } else {
            openTerminal();
            terminalToggle.classList.add('active');
        }
    }

    // Function to open terminal and automatically start email mode
    function openTerminal() {
        if (isTerminalOpen) return; // Already open

        terminal.classList.add('active');
        isTerminalOpen = true;

        // Animate the terminal opening
        anime({
            targets: terminal,
            height: 300,
            duration: 500,
            easing: 'easeOutQuad',
            complete: function() {
                // Fade in the terminal body and status bar
                anime({
                    targets: ['.terminal-body', '.terminal-status-bar'],
                    opacity: [0, 1],
                    duration: 300,
                    easing: 'easeOutQuad',
                    complete: function() {
                        // Clear any existing content
                        clearTerminal();

                        // Start the terminal initialization animation
                        addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> <span class="terminal-loading">Initializing messaging terminal...</span>`);

                        // Start email mode automatically after a short delay
                        setTimeout(() => {
                            startEmailMode();
                        }, 800);
                    }
                });
            }
        });

        // Animate the terminal button
        anime({
            targets: terminalToggle,
            rotate: 180,
            duration: 500,
            easing: 'easeOutQuad'
        });
    }

    // Function to close terminal
    function closeTerminal() {
        if (!isTerminalOpen) return; // Already closed

        // Fade out the terminal body and status bar first
        anime({
            targets: ['.terminal-body', '.terminal-status-bar'],
            opacity: 0,
            duration: 300,
            easing: 'easeOutQuad',
            complete: function() {
                // Then animate the terminal closing
                anime({
                    targets: terminal,
                    height: 40,
                    duration: 500,
                    easing: 'easeOutQuad',
                    complete: function() {
                        terminal.classList.remove('active');
                        isTerminalOpen = false;

                        // Reset terminal state
                        if (isTerminalMaximized) {
                            terminal.style.maxWidth = '900px';
                            isTerminalMaximized = false;
                        }

                        // Reset email mode
                        emailMode = false;
                        emailData = {
                            to: '',
                            subject: '',
                            message: ''
                        };

                        // Remove any email form
                        const emailForm = document.querySelector('.email-form');
                        if (emailForm) {
                            emailForm.remove();
                        }
                    }
                });
            }
        });

        // Animate the terminal button back
        anime({
            targets: terminalToggle,
            rotate: 0,
            duration: 500,
            easing: 'easeOutQuad'
        });
    }

    // Function to minimize terminal
    function minimizeTerminal() {
        // Same as closing the terminal
        closeTerminal();
    }

    // Function to maximize terminal
    function maximizeTerminal() {
        // Make sure terminal is open first
        if (!isTerminalOpen) {
            openTerminal();

            // Wait for open animation to complete before maximizing
            setTimeout(() => {
                doMaximize();
            }, 600);
        } else {
            doMaximize();
        }

        function doMaximize() {
            if (isTerminalMaximized) {
                // Restore to normal size
                anime({
                    targets: terminal,
                    height: '300px',
                    maxWidth: '900px',
                    duration: 500,
                    easing: 'easeInOutQuad'
                });
                isTerminalMaximized = false;
            } else {
                // Maximize
                anime({
                    targets: terminal,
                    height: '500px',
                    maxWidth: '1200px',
                    duration: 500,
                    easing: 'easeInOutQuad'
                });
                isTerminalMaximized = true;
            }
        }
    }

    // Function to update terminal time
    function updateTerminalTime() {
        if (!terminalTime) return;

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        terminalTime.textContent = `${hours}:${minutes}:${seconds}`;
    }

    // Function to process commands
    function processCommand(command) {
        // Add command to output
        addTerminalLine(`<span class="terminal-prompt">USER@REPAIR_LIFT:~$</span> ${command}`);

        // Process command
        const lowerCommand = command.toLowerCase();

        if (lowerCommand === 'help') {
            showHelp();
        } else if (lowerCommand === 'clear') {
            clearTerminal();
        } else if (lowerCommand === 'email' || lowerCommand === 'message' || lowerCommand === 'contact') {
            // Any of these commands will start email mode
            startEmailMode();
        } else if (lowerCommand === 'about') {
            showAbout();
        } else if (lowerCommand === 'exit') {
            closeTerminal();
        } else {
            // For any unrecognized command, suggest using email
            addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> To send a message to Alex, type <span class="terminal-command">email</span> or just start typing your message.`);

            // If the user typed something that looks like a message, treat it as starting email mode
            if (command.length > 5) {
                startEmailMode();
                // Pre-fill the message with what they typed
                emailData.message = command;
                createEmailForm(command);
            }
        }

        // Scroll to bottom
        scrollToBottom();
    }

    // Function to process email input
    function processEmailInput(input) {
        // Always set recipient to alex@repairlift.com
        emailData.to = "alex@repairlift.com";

        if (!emailData.subject) {
            // First input is now the subject
            emailData.subject = input;
            addTerminalLine(`<span class="terminal-prompt">EMAIL:</span> Subject set to: <span class="terminal-success">${input}</span>`);

            // Create email form for message
            createEmailForm();
        } else {
            // Should not reach here as we use the form for the message
            emailData.message = input;
            sendEmail();
        }

        // Scroll to bottom
        scrollToBottom();
    }

    // Function to create email form with enhanced visuals
    function createEmailForm(prefilledMessage = '') {
        // Remove any existing form
        const existingForm = document.querySelector('.email-form');
        if (existingForm) {
            existingForm.remove();
        }

        // Add a separator line
        addTerminalLine(`<span class="terminal-separator">-----[ MESSAGE COMPOSITION ]-----</span>`);

        // Create form with enhanced styling
        const form = document.createElement('div');
        form.className = 'email-form';

        form.innerHTML = `
            <div class="email-header">
                <div class="email-field"><span class="email-label">TO:</span> <span class="terminal-success">alex@repairlift.com</span></div>
                <div class="email-field"><span class="email-label">SUBJECT:</span> <span class="terminal-success">${emailData.subject}</span></div>
                <div class="email-field"><span class="email-label">STATUS:</span> <span class="terminal-warning">DRAFT</span></div>
            </div>
            <div class="email-body">
                <textarea id="email-message" placeholder="Type your message here...">${prefilledMessage}</textarea>
            </div>
            <div class="email-actions">
                <button id="send-email" class="send-button">SEND MESSAGE</button>
                <button id="cancel-email" class="cancel-button">CANCEL</button>
            </div>
        `;

        // Add form to terminal
        terminalOutput.appendChild(form);

        // Focus on textarea
        setTimeout(() => {
            const messageElement = document.getElementById('email-message');
            messageElement.focus();

            // Place cursor at the end of any prefilled text
            if (prefilledMessage) {
                messageElement.selectionStart = messageElement.selectionEnd = prefilledMessage.length;
            }
        }, 100);

        // Add send button event
        document.getElementById('send-email').addEventListener('click', () => {
            const messageText = document.getElementById('email-message').value.trim();
            if (messageText) {
                emailData.message = messageText;

                // Show sending animation
                const sendButton = document.getElementById('send-email');
                sendButton.disabled = true;
                sendButton.textContent = 'SENDING...';
                sendButton.classList.add('sending');

                // Delay to show the animation
                setTimeout(() => {
                    sendEmail();
                }, 800);
            } else {
                addTerminalLine(`<span class="terminal-error">Error: Message cannot be empty</span>`);
            }
        });

        // Add cancel button event
        document.getElementById('cancel-email').addEventListener('click', () => {
            form.remove();
            addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> Message composition cancelled.`);
            addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> Returning to command mode. Type <span class="terminal-command">help</span> for available commands.`);

            // Reset email mode
            emailMode = false;
            emailData = {
                to: '',
                subject: '',
                message: ''
            };
        });
    }

    // Function to send email with enhanced animation
    function sendEmail() {
        // Prepare the data for sending - matching your EmailJS template parameters
        const templateParams = {
            name: 'Dashboard User',
            email: 'dashboard@repairlift.com',
            subject: emailData.subject,
            message: emailData.message
        };

        // Remove the form
        const emailForm = document.querySelector('.email-form');
        if (emailForm) {
            emailForm.remove();
        }

        // Add a separator line
        addTerminalLine(`<span class="terminal-separator">-----[ TRANSMISSION IN PROGRESS ]-----</span>`);

        // Show animated sending process
        addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> <span class="terminal-loading">Preparing message payload...</span>`);
        scrollToBottom();

        setTimeout(() => {
            addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> <span class="terminal-loading">Encrypting communication channel...</span>`);
            scrollToBottom();
        }, 400);

        setTimeout(() => {
            addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> <span class="terminal-loading">Establishing connection to messaging server...</span>`);
            scrollToBottom();
        }, 800);

        setTimeout(() => {
            addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> <span class="terminal-loading">Transmitting message data...</span>`);
            scrollToBottom();

            // Actually send the email using EmailJS
            emailjs.send('service_oo6j53p', 'template_s2qup8q', templateParams)
                .then(function(response) {
                    // Success animation and response
                    setTimeout(() => {
                        addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> <span class="terminal-success">Transmission complete!</span>`);
                        scrollToBottom();
                    }, 600);

                    setTimeout(() => {
                        addTerminalLine(`<span class="terminal-separator">-----[ MESSAGE DETAILS ]-----</span>`);
                        addTerminalLine(`<span class="terminal-prompt">RECIPIENT:</span> <span class="terminal-success">alex@repairlift.com</span>`);
                        addTerminalLine(`<span class="terminal-prompt">SUBJECT:</span> <span class="terminal-success">${emailData.subject}</span>`);
                        addTerminalLine(`<span class="terminal-prompt">MESSAGE:</span> <span class="terminal-success">${emailData.message.substring(0, 50)}${emailData.message.length > 50 ? '...' : ''}</span>`);
                        addTerminalLine(`<span class="terminal-prompt">STATUS:</span> <span class="terminal-success">DELIVERED</span>`);
                        scrollToBottom();
                    }, 1200);

                    setTimeout(() => {
                        addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> <span class="terminal-success">Thank you for your message. Alex will respond as soon as possible.</span>`);
                        addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> Type <span class="terminal-command">email</span> to send another message or <span class="terminal-command">exit</span> to close the terminal.`);
                        scrollToBottom();

                        // Reset email mode
                        emailMode = false;
                        emailData = {
                            to: '',
                            subject: '',
                            message: ''
                        };
                    }, 1800);
                }, function(error) {
                    // Error handling with animation
                    setTimeout(() => {
                        addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> <span class="terminal-error">Transmission failed!</span>`);
                        scrollToBottom();
                    }, 600);

                    setTimeout(() => {
                        addTerminalLine(`<span class="terminal-prompt">ERROR:</span> <span class="terminal-error">Unable to deliver message to recipient.</span>`);
                        addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> <span class="terminal-error">Please check your internet connection and try again.</span>`);
                        scrollToBottom();
                    }, 1200);

                    setTimeout(() => {
                        addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> Type <span class="terminal-command">email</span> to try again or <span class="terminal-command">exit</span> to close the terminal.`);
                        scrollToBottom();

                        // Reset email mode
                        emailMode = false;
                        emailData = {
                            to: '',
                            subject: '',
                            message: ''
                        };
                    }, 1800);

                    console.error('Error:', error);
                });
        }, 1200);
    }

    // Function to show help
    function showHelp() {
        addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> Available commands:`);
        addTerminalLine(`<span class="terminal-command">email</span> or <span class="terminal-command">message</span> or <span class="terminal-command">contact</span> - Send a message to Alex`);
        addTerminalLine(`<span class="terminal-command">help</span> - Show available commands`);
        addTerminalLine(`<span class="terminal-command">clear</span> - Clear terminal output`);
        addTerminalLine(`<span class="terminal-command">about</span> - Show information about Repair Lift`);
        addTerminalLine(`<span class="terminal-command">exit</span> - Close the terminal`);
        addTerminalLine(`<span class="terminal-prompt">TIP:</span> You can also just start typing your message directly!`);
    }

    // Function to clear terminal
    function clearTerminal() {
        terminalOutput.innerHTML = '';
        // Don't add any message when clearing for initialization
    }

    // Function to show time
    function showTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> Current time: <span class="terminal-success">${hours}:${minutes}:${seconds}</span>`);
    }

    // Function to show date
    function showDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('en-US', options);

        addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> Current date: <span class="terminal-success">${dateString}</span>`);
    }

    // Function to show about
    function showAbout() {
        addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> <span class="terminal-success">Repair Lift Dashboard</span>`);
        addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> Version: 1.0.0`);
        addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> A futuristic dashboard for tracking repair and maintenance tasks.`);
        addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> © 2023 Repair Lift`);
    }

    // Function to start email mode with animation and auto-prompt for subject
    function startEmailMode() {
        emailMode = true;

        // Disable input during animation
        terminalInput.disabled = true;

        // Start animation sequence
        addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> <span class="terminal-loading">Initializing communication protocol...</span>`);

        setTimeout(() => {
            addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> <span class="terminal-loading">Establishing secure connection...</span>`);
            scrollToBottom();
        }, 600);

        setTimeout(() => {
            addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> <span class="terminal-loading">Configuring messaging service...</span>`);
            scrollToBottom();
        }, 1200);

        setTimeout(() => {
            addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> <span class="terminal-loading">Verifying recipient address: alex@repairlift.com...</span>`);
            scrollToBottom();
        }, 1800);

        setTimeout(() => {
            addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> <span class="terminal-success">Direct communication channel established!</span>`);
            scrollToBottom();
        }, 2400);

        setTimeout(() => {
            addTerminalLine(`<span class="terminal-prompt">SYSTEM:</span> <span class="terminal-success">Message mode activated</span>`);
            addTerminalLine(`<span class="terminal-prompt">EMAIL:</span> Your message will be sent to <span class="terminal-success">alex@repairlift.com</span>`);

            // Auto-generate a default subject with timestamp
            const now = new Date();
            const timestamp = now.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            const defaultSubject = `Message from Dashboard (${timestamp})`;

            // Set the subject automatically
            emailData.subject = defaultSubject;

            // Show the subject and create the email form
            addTerminalLine(`<span class="terminal-prompt">EMAIL:</span> Subject: <span class="terminal-success">${defaultSubject}</span>`);

            // Create email form after a short delay
            setTimeout(() => {
                createEmailForm();

                // Re-enable input for the message textarea
                terminalInput.disabled = false;

                scrollToBottom();
            }, 600);

            scrollToBottom();
        }, 3000);
    }

    // Function to add a line to the terminal output
    function addTerminalLine(html) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = html;
        terminalOutput.appendChild(line);
    }

    // Function to scroll to bottom of terminal
    function scrollToBottom() {
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
}
