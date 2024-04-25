var checkbox = document.querySelector('input[type=checkbox]');
checkbox.addEventListener('change', function() {
    if (this.checked) {
        // Ativar o tema escuro
        document.body.classList.add('dark-mode');
    } else {
        // Desativar o tema escuro
        document.body.classList.remove('dark-mode');
    }
});