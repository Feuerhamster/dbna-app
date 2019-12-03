var pages = null;
vueTitlebar = null;

Vue.component("panel", {
    template: `
    <div class="panel bottom-space" v-show="visible" style="width: 100%">
        <h2 style="margin-bottom: 20px">{{ title }}</h2>
        <slot></slot>
    </div>
    `,
    props: [
        "title", "visible"
    ]
});

Vue.component("settings-component", {
    template: fs.readFileSync(__dirname + "\\pages\\settings\\settings-component-template.html").toString(),
    data(){
        return {
            settingsGroups: {
                general: true,
                behavior: false,
                messages: false,
                infos: false
            }
        }
    },
    methods: {
        showSettingsGroup: function(group){
            
            switch(group){

                case "general":
                    this.settingsGroups = {
                        general: true,
                        behavior: false,
                        messages: false,
                        infos: false
                    }
                    break;

                case "behavior":
                    this.settingsGroups = {
                        general: false,
                        behavior: true,
                        messages: false,
                        infos: false
                    }
                    break;

                case "messages":
                    this.settingsGroups = {
                        general: false,
                        behavior: false,
                        messages: true,
                        infos: false
                    }
                    break;

                case "infos":
                    this.settingsGroups = {
                        general: false,
                        behavior: false,
                        messages: false,
                        infos: true
                    }
                    break;

                default:
                    break;
            }

        },
        reloadApp: function(){
            win.reload();
        },
        navigateBack: function(){
            pages.pages.settings = false;
            pages.pages.stats = false;
            pages.pages.dbna = true;
        }
    }
});



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
        },
        webviewBack: function(){
            webviewelement.goBack();
        },
        webviewForward: function(){
            webviewelement.goForward();
        },
        webviewReload: function(){
            webviewelement.reload();
        },
        webviewDevTools: function(){
            webviewelement.openDevTools();
        },
        navigateHome: function(){
            webviewelement.loadURL(config.homepage);
        },
        loadLink: function(event){

            var url = event.target.value;

            if(url.match(/dbna\.com/gi)){

                this.showDropdownMenu = false;
                event.target.value = "";
                webviewelement.loadURL(url);

            }else{
                event.target.value = "Kein DBNA Link!";
                setTimeout(()=>{
                    event.target.value = "";
                },800);
            }
            
        },
        copyUrl: function(event){

            ccopy(webviewelement.getURL());
            event.target.innerHTML = `<i class="fas fa-share-alt"></i> Kopiert!`;

            setTimeout(()=>{
                event.target.innerHTML = `<i class="fas fa-share-alt"></i> Link kopieren`;
                this.showDropdownMenu = false;
            },800);

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
});