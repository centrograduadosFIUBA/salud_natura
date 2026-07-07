// Funcionalidades de la página

document.addEventListener('DOMContentLoaded', () => {
    const btnVolver = document.getElementById('btn-volver');

    btnVolver.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
});
