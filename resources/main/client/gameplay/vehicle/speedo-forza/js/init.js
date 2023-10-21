window.addEventListener("load", () => {
    document.fonts.forEach(function (font) {
        font.loaded.then(function () {
            if (font.family.match(/Oswald-Regular/)) {
                document.gauges.forEach(function (gauge) {
                    gauge.update();
                    gauge.options.renderTo.style.visibility = "visible";
                });
            }
        });
    });
});
