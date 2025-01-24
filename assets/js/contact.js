import { config } from './config.js';

export const contact = (function() {
    emailjs.init(config.EMAILJS_PUBLIC_KEY); 

    function initializeContactForm() {
        const contactForm = document.querySelector('.contact-form');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            const submitBtn = document.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            const userPromise = emailjs.send(config.EMAILJS_ID, config.EMAILJS_TEMPLATE_ID, {
                to_name: name,
                from_name: 'PokeGallery',
                email: email,
                subject: subject,
                message: message
            });

            const adminPromise = emailjs.send(config.EMAILJS_ID, config.EMAILJS_TEMPLATE_ID, {
                to_name: 'Admin',
                from_name: name,
                email: 'pablo.echegaray97@gmail.com',
                subject: subject,
                message: message
            });

            Promise.all([userPromise, adminPromise])
                .then(function() {
                    Swal.fire({
                        title: '¡Mensaje enviado!',
                        html: `
                            <div style="margin-bottom: 10px;">
                                <span style="margin-bottom: 10px; display: block;">Gracias por probar mi página web.</span>
                                <span style="margin-bottom: 10px; display: block;">Datos recibidos:</span>
                                <ul style="list-style: none; padding: 0; margin: 5px 0;">
                                    <li><strong>Nombre:</strong> ${name}</li>
                                    <li><strong>Email:</strong> ${email}</li>
                                    <li><strong>Asunto:</strong> ${subject}</li>
                                </ul>
                                <span style="margin: 10px 0; display: block;">Conecta conmigo:</span>
                                <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px;">
                                    <a href="https://www.linkedin.com/in/pablo-echegaray-a4a000241/" target="_blank" style="text-decoration: none;">
                                        <i class='bx bxl-linkedin-square' style="font-size: 3.5rem; color: #333; transition: color 0.3s ease;" onmouseover="this.style.color='#dc3545'" onmouseout="this.style.color='#333'"></i>
                                    </a>
                                    <a href="https://github.com/PabloEchegaray97" target="_blank" style="text-decoration: none;">
                                        <i class='bx bxl-github' style="font-size: 3.5rem; color: #333; transition: color 0.3s ease;" onmouseover="this.style.color='#dc3545'" onmouseout="this.style.color='#333'"></i>
                                    </a>
                                </div>
                            </div>
                        `,
                        icon: 'success',
                        confirmButtonColor: '#dc3545',
                        confirmButtonFontWeight: 'bold',
                        confirmButtonText: 'Cerrar'
                    });
                    contactForm.reset();
                })
                .catch(function(error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un problema al enviar el mensaje.',
                        icon: 'error'
                    });
                    console.error('Error:', error);
                })
                .finally(function() {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar Mensaje';
                });
        });
    }

    return {
        init: function() {
            document.addEventListener('DOMContentLoaded', initializeContactForm);
        }
    };
})(); 