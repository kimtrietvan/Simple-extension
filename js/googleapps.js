
(function() {
    $(document).ready(function() {
        $(".button").click(function(n) {
            n.stopPropagation(), $(".app-launcher").toggle()
        }), $(document).click(function() {
            $(".app-launcher").hide()
        }), $(".app-launcher").click(function(n) {
            n.stopPropagation()
        }), $(".app-launcher").hide()
    })
}).call(this);