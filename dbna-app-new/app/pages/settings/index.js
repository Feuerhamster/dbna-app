Vue.component("settingsComponent", {
    name: "settingsComponent",
    template: fs.readFileSync(__dirname + "\\pages\\settings\\settings-component-template.html"),
    data() {
        return {
            general: true,
            behavior: false,
            notify: false,
            infos: false
        }
    },
    methods: {
        menuGeneral: function(){
            this.panels = {
                general: true,
                behavior: false,
                notify: false,
                infos: false
            }
        },
        menuBehavior: function(){
            this.panels = {
                general: false,
                behavior: true,
                notify: false,
                infos: false
            }
        },
        menuNotify: function(){
            this.panels = {
                general: false,
                behavior: false,
                notify: true,
                infos: false
            }
        },
        menuInfos: function(){
            this.panels = {
                general: false,
                behavior: false,
                notify: false,
                infos: true
            }
        }
    }
});