var pages = null;
vueTitlebar = null;

var vueTitlebar = new Vue({
    el: "#titlebar-left-controls",
    data: {
        showLeftControls: false,
        showDropdownMenu: false
    },
    methods:{
        toggleDropdownMenu: function(){
            this.showDropdownMenu = this.showDropdownMenu ? false : true;
        },
        showSettings: function(){
            this.showDropdownMenu = false;

            pages.pages = {
                loader: false,
                dbna: false,
                login: false,
                stats: false,
                settings: true
            }
        },
        showStats: function(){
            this.showDropdownMenu = false;

            pages.pages = {
                loader: false,
                dbna: false,
                login: false,
                stats: true,
                settings: false
            }
        }
    }
});

var pages = new Vue({
    el: "#pages",
    data: {
        pages: {
            loader: true,
            dbna: false,
            login: false,
            stats: false,
            settings: false
        }
    }
})