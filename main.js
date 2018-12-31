(function () {
    function main() {
        let html = matrix.main();

        let container = document.getElementById("container");
        container.innerHTML = html;

        let mathJax = window.MathJax;
        if (mathJax !== undefined) {
            mathJax.Hub.Queue(["Typeset", MathJax.Hub, container]);
        }
    }

    document.addEventListener('DOMContentLoaded', main);
})();