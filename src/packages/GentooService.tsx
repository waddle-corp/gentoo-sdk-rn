import { EventEmitter } from "events";
import { Platform } from "react-native";

class GentooServiceApp extends EventEmitter {
    private serviceConfig: { partnerId?: string; authCode?: string; itemId?: string; displayLocation?: string } = {};
    private bootConfig: { showGentooButton?: boolean | true } = {};
    private isInitialized = false;

    // ✅ Initialize chatbot with configuration
    init(config: {
        partnerId: string;
        authCode: string; 
        itemId?: string | ''; 
        displayLocation?: string | 'HOME';
    }) {
        this.serviceConfig = config;
        this.isInitialized = true;
        this.emit("configChanged", this.serviceConfig); // Notify GentooChat component
        console.log("[GentooService] Initialized with config:", config);
    }

    // ✅ Get the current config (for direct access)
    getServiceConfig() {
        return this.serviceConfig;
    }

    // ✅ Boot (open chatbot)
    toggleChat() {
        this.emit("toggleChat");
        console.log("[GentooService] Toggled chat");
    }

    // Get the current config (for direct access)
    getBootConfig() {
        return this.bootConfig;
    }

    // ✅ Unmount (close chatbot)
    unmount() {
        this.emit("unmount");
    }
}

class GentooServiceWeb {
    constructor() {}
    async loadScript() {
      const w = window as any;
      if (w.GentooIO) {
        w.console.error("GentooIO script included twice.");
        return;
      }
      
      const ge: any = function() { ge.c(arguments); };
      ge.q = [];
      ge.c = function(a: any) { ge.q.push(a); };
      w.GentooIO = ge;
      
      function l() {
        if (w.GentooIOInitialized) return;
        w.GentooIOInitialized = true;
        
        const s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://sdk.gentooai.com/floating-button-sdk.js";
        
        const x = document.getElementsByTagName("script")[0];
        if (x.parentNode) {
          x.parentNode.insertBefore(s, x);
        }
      }
      
      if (document.readyState === "complete") {
        l();
      } else {
        w.addEventListener("DOMContentLoaded", l);
        w.addEventListener("load", l);
      }
    }
  
    boot(params: any) {
      if (typeof window === 'undefined') return;
      (window as any).GentooIO("boot", params);
    }
  
    init(params: any) {
      if (typeof window === 'undefined') return;
      (window as any).GentooIO("init", params);
    }
  
    openChat() {
      if (typeof window === 'undefined') return;
      (window as any).GentooIO("openChat", {});
    }
  
    unmount() {
      if (typeof window === 'undefined') return;
      (window as any).GentooIO("unmount", {});
    }

    sendLog(params: any) {
      if (typeof window === 'undefined') return;
      (window as any).GentooIO("sendLog", params);
    }
}
  

// Singleton instance
const GentooService = {
    App: new GentooServiceApp(),
    Web: new GentooServiceWeb()
};
export default GentooService;
