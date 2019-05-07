define([
    'dojo/_base/declare',
    'dojo/cookie',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'gis/dijit/_FloatingWidgetMixin',
    'dojo/text!./Disclaimer/templates/Disclaimer.html',
    'dojo/i18n!./Disclaimer/nls/Disclaimer',
    'dijit/layout/ContentPane',
    'dijit/form/Form',
    'dijit/form/Button',
    'xstyle/css!./Disclaimer/css/Disclaimer.css'
], function (
    declare,
    cookie,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    _FloatingWidgetMixin,

    DisclaimerTemplate,
    i18n
) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FloatingWidgetMixin], {
        widgetsInTemplate: true,
        templateString: DisclaimerTemplate,
        defaultI18n: i18n,
        i18n: {},
        baseClass: 'cmvDisclaimerWidget',
        draggable: false,

        openOnStartup: true,

        content: 'Every reasonable effort has been made to assure the accuracy of the data provided, however, the City of Oceanside and its employees and agents disclaim any and all responsibility from or relating to any results obtained in its use. The GIS database and data is subject to constant change and the accuracy and completeness cannot be and is not guaranteed. The City of Oceanside makes no warranties or guarantees, either expressed or implied as to the completeness, accuracy, or correctness of such products, nor accept any liability, arising from incorrect, incomplete or misleading information contained therein. This data shall not be used to replace or provide data for engineering and surveying calculations. It is only a tool to get general preliminary site information.',
        href: null,
        declineHref: 'http://www.ci.oceanside.ca.us/services/maps/default.asp',

        useCookies: false,
        cookieName: 'skipCMVDisclaimer',
        cookieValue: 'true',
        cookieProps: {
            expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)) // show disclaimer every 30 days
        },

        postMixInProperties: function () {
            this.inherited(arguments);
            this.i18n = this.mixinDeep(this.defaultI18n, this.i18n);
        },

        postCreate: function () {
            this.inherited(arguments);

            this.messageNode.set('content', this.content);
            if (this.href) {
                this.messageNode.set('href', this.href);
            }

            // prevent the dialog from closing with the escape key
            this.parentWidget._onKey = function () {};

            // check for cookies
            if (this.useCookies) {
                var chkCookie = cookie(this.cookieName);
                if (chkCookie && chkCookie === this.cookieValue) {
                    this.openOnStartup = false;
                }
            }
        },

        acceptDisclaimer: function () {
            this.parentWidget.hide();

            // set a cookie so it is only show again
            if (this.useCookies) {
                cookie(this.cookieName, this.cookieValue, this.cookieProps);
            }
        },

        declineDisclaimer: function () {
            window.location.href = this.declineHref;
        },

        mixinDeep: function (dest, source) {
            //Recursively mix the properties of two objects
            var empty = {};
            for (var name in source) {
                if (!(name in dest) || (dest[name] !== source[name] && (!(name in empty) || empty[name] !== source[name]))) {
                    try {
                        if (source[name].constructor === Object) {
                            dest[name] = this.mixinDeep(dest[name], source[name]);
                        } else {
                            dest[name] = source[name];
                        }
                    } catch (e) {
                        // Property in destination object not set. Create it and set its value.
                        dest[name] = source[name];
                    }
                }
            }
            return dest;
        }
    });
});