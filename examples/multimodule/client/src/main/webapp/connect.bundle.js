window.twttr = window.twttr || {};
twttr.templates = twttr.templates || {};
twttr.templates.connect_button = '\u003Ca href="#" class="twitter-connect" title="Connect with Twitter"\u003E\u003Cspan\u003E{{_i}}Connect with Twitter{{/i}}\u003C/span\u003E\u003C/a\u003E';
window.twttr = window.twttr || {};
twttr.templates = twttr.templates || {};
twttr.templates.connected_button = '\u003Cspan class="twitter-connect" title="Connected with Twitter"\u003E\u003Cspan\u003E{{_i}}Connected with Twitter{{/i}}\u003C/span\u003E\u003C/span\u003E';
(function() {
    var A = function(E, C) {
        var F = E.window,B = E.selector;
        this.client = E.client;
        this.options = C;
        this.fnComplete = function() {
            if (C.complete) {
                C.complete()
            }
            this.fnComplete = function() {
            }
        };
        this.sizes = {connect:{small:{width:129,height:19},medium:{width:146,height:23},large:{width:170,height:26},xlarge:{width:236,height:38}},connected:{small:{width:137,height:19},medium:{width:159,height:23},large:{width:182,height:26},xlarge:{width:258,height:38}}};
        var D = {verticalAlign:"middle"};

        function G(H, I) {
            H.$node.css({width:I.outerWidth(),height:I.outerHeight()})
        }

        twttr.IFrame.create({window:F,parentNode:B,content:{styles:twttr.stylesheets["connect_button.css"],body:'<span class="twitter-connect-init twitter-connect-init-' + C.size + '"><span>Loading...</span></span>'},css:twttr.merge(D, this.sizes.connected[C.size])}, twttr.bind(this, function(J) {
            this.button = J;
            this.button.tabIndex = 0;
            J.jQuery("body").css({margin:0,padding:0});
            G(J, J.jQuery(".twitter-connect-init"));
            this.renderButton();
            J.jQuery("body").delegate("a", "click", twttr.bind(this, function(K) {
                twttr.anywhere.signIn(this.options);
                K.preventDefault()
            }));
            var I = C.authComplete;
            E.client.bind("authComplete", twttr.bind(this, function(M, K, L) {
                this.renderButton();
                if (I) {
                    I(K, L)
                }
            }));
            var H = C.signOut;
            E.client.bind("signOut", twttr.bind(this, function() {
                this.renderButton();
                if (H) {
                    H()
                }
            }))
        }))
    };
    A.prototype = {renderButton:function() {
        var B;
        twttr.anywhere.scribe({event_name:"connect_button_show"});
        if (this.client.currentUser) {
            B = Mustache.to_html(twttr.templates.connected_button, {})
        } else {
            B = Mustache.to_html(twttr.templates.connect_button, {})
        }
        this.button.node.tabIndex = 0;
        this.button.jQuery("body").html(B);
        this.setSize();
        this.fnComplete()
    },setSize:function() {
        this.button.jQuery(".twitter-connect-box").addClass("twitter-connect-box-" + this.options.size);
        this.button.jQuery("a.twitter-connect").addClass("twitter-connect-" + this.options.size);
        this.button.jQuery("span.twitter-connect").addClass("twitter-connected-" + this.options.size);
        var B = this.button.jQuery("body > *");
        if (this.options.explanation) {
            this.button.$node.css({width:B.innerWidth() + 2 + "px",height:B.innerHeight() + 2 + "px"})
        } else {
            if (this.button.jQuery("a.twitter-connect").length > 0) {
                this.button.$node.css(this.sizes.connect[this.options.size])
            } else {
                this.button.$node.css(this.sizes.connected[this.options.size])
            }
        }
    }};
    twttr.anywhere.connectButton = function(B, E, C) {
        var D = new A(B, E, C)
    }
}());