$(document).ready(function() {
    // Note: It's infeasible to attach custom hover css over
    // the grid-overlay because the portfolio-link overlaps it.
    // So trigger a mouseenter/mouseleave event to toggle the
    // opacity of the grid accordingly.
    $(".portfolio-link").mouseenter(function() {
        $(this).siblings(".grid-overlay").fadeTo(300, 0.5);
    }).mouseleave(function () {
        $(this).siblings(".grid-overlay").fadeTo(300, 0);
    });
});
