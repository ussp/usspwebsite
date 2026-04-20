import { buildTree } from "../builder.js";

export const infrastructureTree = buildTree("infrastructure", "Infrastructure", [
  {
    id: "cloud-hosting",
    label: "Cloud Hosting",
    children: [
      { id: "nic-cloud", label: "NIC Cloud", aliases: ["nic cloud", "nic", "national informatics centre cloud", "meghraj"] },
      { id: "aws", label: "Amazon Web Services", aliases: ["aws", "amazon web services"] },
      { id: "azure", label: "Microsoft Azure", aliases: ["azure", "microsoft azure", "ms azure"] },
      { id: "gcp", label: "Google Cloud Platform", aliases: ["gcp", "google cloud", "google cloud platform"] },
      { id: "private-cloud", label: "Private Cloud", aliases: ["private cloud", "on-premise cloud", "vpc"] },
    ],
  },
  {
    id: "government-integration",
    label: "Government Integration Hubs",
    children: [
      { id: "vahan", label: "VAHAN Database", aliases: ["vahan", "vahan database", "vahan integration", "vahan portal"] },
      { id: "erss", label: "ERSS / Dial 112", aliases: ["erss", "emergency response support system", "dial 112", "dial-112", "112 dispatch"] },
      { id: "sarathi", label: "SARATHI", aliases: ["sarathi", "sarathi portal", "driving licence database"] },
      { id: "morth-dashboard", label: "MoRTH Dashboard", aliases: ["morth dashboard", "morth data api", "ministry dashboard"] },
    ],
  },
  {
    id: "compliance-security",
    label: "Compliance & Security Infrastructure",
    children: [
      { id: "cert-in", label: "CERT-IN Certification", aliases: ["cert-in", "cert in", "indian computer emergency response team"] },
      { id: "ssl-tls", label: "SSL / TLS", aliases: ["ssl", "tls", "https", "ssl certificates"] },
      { id: "ais-140", label: "AIS 140 Compliance", aliases: ["ais 140", "ais-140", "ais140"] },
      { id: "type-approval", label: "Type Approval Certificate (TAC)", aliases: ["tac", "type approval certificate", "type-approval"] },
      { id: "conformity-of-production", label: "Conformity of Production (COP)", aliases: ["cop", "conformity of production", "cop certificate"] },
    ],
  },
  {
    id: "gis-mapping",
    label: "GIS & Mapping",
    children: [
      { id: "survey-of-india", label: "Survey of India", aliases: ["survey of india", "soi map", "soi compliance", "sovi"] },
      { id: "mapmyindia", label: "MapmyIndia", aliases: ["mapmyindia", "mapmy india", "mappls"] },
      { id: "google-maps", label: "Google Maps", aliases: ["google maps", "gmap"] },
      { id: "real-time-tracking", label: "Real-time GPS Tracking", aliases: ["real-time tracking", "gps tracking", "vehicle location tracking", "live tracking"] },
      { id: "geo-fencing", label: "Geo-Fencing", aliases: ["geofencing", "geo-fence", "geo fencing", "geofence"] },
      { id: "route-playback", label: "Route Playback", aliases: ["route playback", "trip playback", "trip view", "map playback"] },
    ],
  },
  {
    id: "monitoring-centre",
    label: "Monitoring Centre Operations",
    children: [
      { id: "control-tower", label: "Control Tower / Command Centre", aliases: ["control tower", "command centre", "command center", "monitoring centre", "monitoring center", "mc"] },
      { id: "video-wall", label: "Video Wall Display", aliases: ["video wall", "videowall", "display wall", "led video wall"] },
      { id: "ups-power", label: "UPS / Power Backup", aliases: ["ups", "power backup", "uninterruptible power supply"] },
      { id: "desktop-workstation", label: "Desktop Workstations", aliases: ["desktop", "workstation", "operator pc"] },
      { id: "mfp-printer", label: "Multi-functional Printer", aliases: ["mfp", "multifunctional printer", "multi-function printer"] },
    ],
  },
  {
    id: "alerts-messaging",
    label: "Alerts & Messaging",
    children: [
      { id: "sms-gateway", label: "SMS Gateway", aliases: ["sms gateway", "sms", "short message service gateway"] },
      { id: "panic-alert", label: "Emergency / Panic Alert", aliases: ["panic alert", "panic button", "emergency alert", "emergency button", "sos"] },
      { id: "speed-violation-alert", label: "Speed Violation Alert", aliases: ["speed violation", "over-speeding", "overspeeding", "speed alert"] },
      { id: "tampering-alert", label: "Device Tampering Alert", aliases: ["tampering", "tamper detection", "seal tampering", "power cut detection"] },
      { id: "health-alert", label: "Device Health Alert", aliases: ["health monitoring", "device health", "health check", "heartbeat"] },
    ],
  },
  {
    id: "connectivity",
    label: "Connectivity",
    children: [
      { id: "cellular-m2m", label: "Cellular m2m Connectivity", aliases: ["cellular", "m2m", "machine-to-machine", "telematics sim", "m2m sim"] },
      { id: "sim-lifecycle", label: "SIM Activation & Lifecycle", aliases: ["sim activation", "sim validity", "sim lifecycle", "kyc"] },
      { id: "vlt-device", label: "VLT Device / Hardware", aliases: ["vlt", "vlt device", "vehicle location tracking device", "vltd", "gps tracker"] },
      { id: "ai-dashcam", label: "AI Dashcam", aliases: ["ai dashcam", "dashcam", "adas camera", "driver facing camera"] },
      { id: "fuel-sensor", label: "Fuel Sensor", aliases: ["fuel sensor", "fuel monitoring", "fuel level sensor"] },
    ],
  },
  {
    id: "data-platform",
    label: "Data Platform",
    children: [
      { id: "data-retention", label: "Tiered Data Retention", aliases: ["data retention", "online storage", "archive storage", "data archival"] },
      { id: "data-api", label: "Data Sharing API", aliases: ["data sharing api", "data exchange api", "rest api"] },
      { id: "rbac", label: "Role-based Access Control", aliases: ["rbac", "role-based access", "multi-stakeholder access"] },
      { id: "reports", label: "Operational Reports", aliases: ["reports", "reporting", "fleet reports", "mis reports"] },
      { id: "mobile-app", label: "Mobile Application", aliases: ["mobile app", "mobile application", "android app", "ios app"] },
      { id: "web-dashboard", label: "Web Dashboard", aliases: ["web dashboard", "web portal", "web interface", "browser dashboard"] },
    ],
  },
]);
