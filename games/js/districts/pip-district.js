/* ==========================================================================
   STRATIVO WORLD — PIP DISTRICT WORLD SCENE & QUESTION ENGINE
   Version: 3.0 (Phase 3.1.4 Question Variety, Separate Collision/Interaction & State Reset)
   Namespace: StrativoRPG.PipDistrictWorld / StrativoRPG.QuestionEngine / StrativoRPG.PipBlitzEngine
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    // Safe Event Emitter
    window.StrativoRPG.emitGameEvent = window.StrativoRPG.emitGameEvent || function (eventName, eventData = {}) {
        if (window.StrativoWorldAudio && typeof window.StrativoWorldAudio.playEvent === "function") {
            window.StrativoWorldAudio.playEvent(eventName, eventData);
        }
        if (window.StrativoWorldHaptics && typeof window.StrativoWorldHaptics.triggerForEvent === "function") {
            window.StrativoWorldHaptics.triggerForEvent(eventName, eventData);
        }
        try {
            window.dispatchEvent(new CustomEvent("strativo:gameEvent", { detail: { eventName, eventData } }));
        } catch {}
    };

    const Rectangle = window.StrativoRPG.Rectangle || class {
        constructor(x, y, w, h, id, type) {
            this.x = Number(x) || 0;
            this.y = Number(y) || 0;
            this.width = Number(w) || 0;
            this.height = Number(h) || 0;
            this.id = id || "rect_" + Math.random().toString(36).slice(2, 7);
            this.type = type || "solid";
        }
        get left() { return this.x; }
        get right() { return this.x + this.width; }
        get top() { return this.y; }
        get bottom() { return this.y + this.height; }
        get centerX() { return this.x + this.width / 2; }
        get centerY() { return this.y + this.height / 2; }
        intersects(o) {
            if (!o) return false;
            return this.left < o.right && this.right > o.left && this.top < o.bottom && this.bottom > o.top;
        }
    };

    const MAP_CONFIG = {
  "version": "1.2.0",
  "districtId": "pip-district",
  "districtName": "Pip District",
  "districtSubtitle": "Metropolis of Precision, Price Movement & Risk Control",
  "bounds": {
    "width": 3200,
    "height": 2400
  },
  "spawn": {
    "x": 1600,
    "y": 2250,
    "direction": "up"
  },
  "theme": {
    "primary": "#00F0FF",
    "secondary": "#3B82F6",
    "accent": "#A855F7",
    "gold": "#FCD34D",
    "emerald": "#10B981",
    "rose": "#F43F5E",
    "darkBg": "#020617",
    "roadBg": "#0A1128",
    "sidewalkBg": "#0F1E3D",
    "buildingWall": "#0B1936",
    "buildingRoof": "#071229"
  },
  "quarters": [
    {
      "id": "pip_plaza",
      "name": "PIP PLAZA",
      "description": "Central civic plaza and heart of Pip District",
      "bounds": {
        "x": 1250,
        "y": 950,
        "w": 700,
        "h": 500
      },
      "color": "#00F0FF"
    },
    {
      "id": "education_quarter",
      "name": "EDUCATION QUARTER",
      "description": "Academic grounds for foundational pip definitions and direction",
      "bounds": {
        "x": 100,
        "y": 100,
        "w": 1050,
        "h": 750
      },
      "color": "#3B82F6"
    },
    {
      "id": "precision_quarter",
      "name": "PRECISION QUARTER",
      "description": "High-tech research labs for Price Ladders, JPY rules, and fractional pipettes",
      "bounds": {
        "x": 2050,
        "y": 100,
        "w": 1050,
        "h": 750
      },
      "color": "#10B981"
    },
    {
      "id": "leverage_quarter",
      "name": "LEVERAGE QUARTER",
      "description": "Citadel of purchasing power, margin utilization, and exposure calculation",
      "bounds": {
        "x": 1250,
        "y": 100,
        "w": 700,
        "h": 750
      },
      "color": "#A855F7"
    },
    {
      "id": "risk_quarter",
      "name": "RISK QUARTER",
      "description": "Defensive engineering sector for position sizing and capital preservation",
      "bounds": {
        "x": 100,
        "y": 1550,
        "w": 1050,
        "h": 750
      },
      "color": "#F59E0B"
    },
    {
      "id": "market_mission_quarter",
      "name": "MARKET & BLITZ QUARTER",
      "description": "Fast-paced market exchange, tactical blitz arena, and directives command",
      "bounds": {
        "x": 2050,
        "y": 1550,
        "w": 1050,
        "h": 750
      },
      "color": "#FCD34D"
    },
    {
      "id": "residential_quarter",
      "name": "RESIDENTIAL & SOCIAL QUARTER",
      "description": "Community residential sector with public parks, lore kiosks, and social avenues",
      "bounds": {
        "x": 2050,
        "y": 900,
        "w": 1050,
        "h": 600
      },
      "color": "#38BDF8"
    }
  ],
  "roads": [
    {
      "id": "road_main_avenue",
      "name": "Main Avenue (N-S)",
      "x": 1540,
      "y": 80,
      "w": 120,
      "h": 2240,
      "type": "avenue"
    },
    {
      "id": "road_pip_plaza_blvd",
      "name": "Pip Plaza Boulevard (E-W)",
      "x": 80,
      "y": 1140,
      "w": 3040,
      "h": 120,
      "type": "boulevard"
    },
    {
      "id": "road_north_highline",
      "name": "Academic & Precision Highline (E-W)",
      "x": 80,
      "y": 500,
      "w": 3040,
      "h": 100,
      "type": "street"
    },
    {
      "id": "road_south_promenade",
      "name": "Risk & Market Promenade (E-W)",
      "x": 80,
      "y": 1880,
      "w": 3040,
      "h": 100,
      "type": "street"
    },
    {
      "id": "road_west_flank",
      "name": "Education-Risk West Connector (N-S)",
      "x": 800,
      "y": 100,
      "w": 80,
      "h": 2200,
      "type": "connector"
    },
    {
      "id": "road_east_flank",
      "name": "Precision-Market East Connector (N-S)",
      "x": 2320,
      "y": 100,
      "w": 80,
      "h": 2200,
      "type": "connector"
    }
  ],
  "sidewalks": [
    {
      "id": "sw_main_west",
      "x": 1500,
      "y": 80,
      "w": 40,
      "h": 2240
    },
    {
      "id": "sw_main_east",
      "x": 1660,
      "y": 80,
      "w": 40,
      "h": 2240
    },
    {
      "id": "sw_plaza_north",
      "x": 80,
      "y": 1100,
      "w": 3040,
      "h": 40
    },
    {
      "id": "sw_plaza_south",
      "x": 80,
      "y": 1260,
      "w": 3040,
      "h": 40
    },
    {
      "id": "sw_highline_north",
      "x": 80,
      "y": 460,
      "w": 3040,
      "h": 40
    },
    {
      "id": "sw_highline_south",
      "x": 80,
      "y": 600,
      "w": 3040,
      "h": 40
    },
    {
      "id": "sw_promenade_north",
      "x": 80,
      "y": 1840,
      "w": 3040,
      "h": 40
    },
    {
      "id": "sw_promenade_south",
      "x": 80,
      "y": 1980,
      "w": 3040,
      "h": 40
    }
  ],
  "crosswalks": [
    {
      "x": 1540,
      "y": 480,
      "w": 120,
      "h": 20,
      "bars": 6
    },
    {
      "x": 1540,
      "y": 600,
      "w": 120,
      "h": 20,
      "bars": 6
    },
    {
      "x": 1540,
      "y": 1120,
      "w": 120,
      "h": 20,
      "bars": 6
    },
    {
      "x": 1540,
      "y": 1260,
      "w": 120,
      "h": 20,
      "bars": 6
    },
    {
      "x": 1540,
      "y": 1860,
      "w": 120,
      "h": 20,
      "bars": 6
    },
    {
      "x": 1540,
      "y": 1980,
      "w": 120,
      "h": 20,
      "bars": 6
    },
    {
      "x": 780,
      "y": 1140,
      "w": 20,
      "h": 120,
      "bars": 6
    },
    {
      "x": 2320,
      "y": 1140,
      "w": 20,
      "h": 120,
      "bars": 6
    }
  ],
  "buildings": [
    {
      "id": "pip_academy",
      "x": 250,
      "y": 200,
      "w": 460,
      "h": 300,
      "name": "PIP ACADEMY",
      "subtitle": "What a Pip Represents & Directional Movement",
      "category": "ACADEMY",
      "quarter": "education_quarter",
      "themeColor": "#00F0FF",
      "accentColor": "#3B82F6",
      "icon": "fa-graduation-cap",
      "facadeStyle": "academic_facility",
      "windows": 10,
      "entrance": {
        "x": 480,
        "y": 500
      },
      "interactRadius": 85,
      "promptText": "Enter Pip Academy",
      "roofProps": [
        "solar_array",
        "holographic_crest"
      ]
    },
    {
      "id": "precision_lab",
      "x": 2480,
      "y": 200,
      "w": 460,
      "h": 300,
      "name": "PRECISION LAB",
      "subtitle": "Price Ladder, JPY Rules & Fractional Pipettes",
      "category": "LAB",
      "quarter": "precision_quarter",
      "themeColor": "#10B981",
      "accentColor": "#00F0FF",
      "icon": "fa-microscope",
      "facadeStyle": "precision_tech_lab",
      "windows": 10,
      "entrance": {
        "x": 2710,
        "y": 500
      },
      "interactRadius": 85,
      "promptText": "Enter Precision Lab",
      "roofProps": [
        "dish_antenna",
        "laser_caliper"
      ]
    },
    {
      "id": "leverage_tower",
      "x": 1380,
      "y": 160,
      "w": 440,
      "h": 340,
      "name": "LEVERAGE TOWER",
      "subtitle": "Purchasing Power, Exposure & Margin Mechanics",
      "category": "TOWER",
      "quarter": "leverage_quarter",
      "themeColor": "#A855F7",
      "accentColor": "#F43F5E",
      "icon": "fa-building-columns",
      "facadeStyle": "corporate_skyscraper",
      "windows": 16,
      "entrance": {
        "x": 1600,
        "y": 500
      },
      "interactRadius": 85,
      "promptText": "Enter Leverage Tower",
      "roofProps": [
        "spire_antenna",
        "skyline_beacon"
      ]
    },
    {
      "id": "risk_forge",
      "x": 250,
      "y": 1600,
      "w": 460,
      "h": 280,
      "name": "RISK & POSITION FORGE",
      "subtitle": "Capital Risk % & Lot Sizing Workshop",
      "category": "RISK",
      "quarter": "risk_quarter",
      "themeColor": "#F59E0B",
      "accentColor": "#F43F5E",
      "icon": "fa-shield-halved",
      "facadeStyle": "armory_forge",
      "windows": 8,
      "entrance": {
        "x": 480,
        "y": 1880
      },
      "interactRadius": 85,
      "promptText": "Enter Risk & Position Forge",
      "roofProps": [
        "shield_spires",
        "heavy_vents"
      ]
    },
    {
      "id": "risk_arena",
      "x": 250,
      "y": 1980,
      "w": 460,
      "h": 240,
      "name": "RISK ARENA",
      "subtitle": "Drawdown Defense & Risk Survival",
      "category": "ARENA",
      "quarter": "risk_quarter",
      "themeColor": "#F43F5E",
      "accentColor": "#F59E0B",
      "icon": "fa-cubes-stacked",
      "facadeStyle": "bunker_defense",
      "windows": 6,
      "entrance": {
        "x": 480,
        "y": 2220
      },
      "interactRadius": 85,
      "promptText": "Enter Risk Arena",
      "roofProps": [
        "fortified_turret"
      ]
    },
    {
      "id": "pip_blitz_arena",
      "x": 2480,
      "y": 1600,
      "w": 460,
      "h": 280,
      "name": "PIP BLITZ ARENA",
      "subtitle": "10-Round Precision Mini-Game Gauntlet",
      "category": "ARENA",
      "quarter": "market_mission_quarter",
      "themeColor": "#00F0FF",
      "accentColor": "#10B981",
      "icon": "fa-bolt-lightning",
      "facadeStyle": "stadium_combat",
      "windows": 10,
      "entrance": {
        "x": 2710,
        "y": 1880
      },
      "interactRadius": 85,
      "promptText": "Enter Pip Blitz Arena",
      "roofProps": [
        "lightning_rods",
        "arena_pylon"
      ]
    },
    {
      "id": "mission_hq",
      "x": 2120,
      "y": 1600,
      "w": 300,
      "h": 280,
      "name": "MISSION HQ",
      "subtitle": "10 District Directives & Tactical Operations",
      "category": "HQ",
      "quarter": "market_mission_quarter",
      "themeColor": "#FCD34D",
      "accentColor": "#00F0FF",
      "icon": "fa-compass",
      "facadeStyle": "command_center",
      "windows": 8,
      "entrance": {
        "x": 2270,
        "y": 1880
      },
      "interactRadius": 85,
      "promptText": "Enter Mission HQ",
      "roofProps": [
        "satellite_uplink"
      ]
    },
    {
      "id": "gate_return_hub",
      "x": 1480,
      "y": 2280,
      "w": 240,
      "h": 80,
      "name": "WORLD HUB TRANSIT GATE",
      "subtitle": "Return to Strativo World Central Hub",
      "category": "GATEWAY",
      "quarter": "market_mission_quarter",
      "themeColor": "#00E5A8",
      "accentColor": "#00F0FF",
      "icon": "fa-portal-enter",
      "facadeStyle": "quantum_gate",
      "windows": 0,
      "entrance": {
        "x": 1600,
        "y": 2340
      },
      "interactRadius": 95,
      "promptText": "Return to World Hub [E]",
      "districtId": "world-hub"
    },
    {
      "id": "bldg_residential_a",
      "x": 2480,
      "y": 960,
      "w": 460,
      "h": 180,
      "name": "NEXUS RESIDENTIAL APARTMENTS",
      "subtitle": "Trader Residences & Social Lofts",
      "category": "RESIDENTIAL",
      "quarter": "residential_quarter",
      "themeColor": "#38BDF8",
      "accentColor": "#818CF8",
      "icon": "fa-house",
      "facadeStyle": "residential_block",
      "windows": 12
    },
    {
      "id": "bldg_residential_b",
      "x": 2480,
      "y": 1200,
      "w": 460,
      "h": 180,
      "name": "STRATIVO COMMONS RESIDENCES",
      "subtitle": "Financial Scholars Living Quarters",
      "category": "RESIDENTIAL",
      "quarter": "residential_quarter",
      "themeColor": "#38BDF8",
      "accentColor": "#818CF8",
      "icon": "fa-city",
      "facadeStyle": "residential_block",
      "windows": 12
    }
  ],
  "landmarks": [
    {
      "id": "landmark_precision_spire",
      "name": "Pip Precision Spire",
      "description": "The central spire projecting holographic 4th decimal metrics into the night sky.",
      "x": 1600,
      "y": 1200,
      "radius": 40,
      "themeColor": "#00F0FF",
      "accentColor": "#3B82F6",
      "icon": "fa-monument"
    },
    {
      "id": "landmark_south_fountain",
      "name": "South Plaza Energy Fountain",
      "description": "Cascading neon energy fountain at the district entrance.",
      "x": 1600,
      "y": 2150,
      "radius": 35,
      "themeColor": "#10B981",
      "accentColor": "#00F0FF",
      "icon": "fa-water"
    },
    {
      "id": "landmark_pipette_array",
      "name": "Pipette Hologram Array",
      "description": "High-frequency decimal microscope projector demonstrating fractional pipette physics.",
      "x": 2850,
      "y": 380,
      "radius": 35,
      "themeColor": "#10B981",
      "accentColor": "#A855F7",
      "icon": "fa-microchip"
    },
    {
      "id": "landmark_decimal_clock",
      "name": "Atomic Decimal Precision Clock",
      "description": "Ultra-precise synchronization chronometer keeping millisecond market volatility records.",
      "x": 1600,
      "y": 850,
      "radius": 35,
      "themeColor": "#FCD34D",
      "accentColor": "#00F0FF",
      "icon": "fa-clock"
    },
    {
      "id": "landmark_risk_shield_monument",
      "name": "Risk Shield Bastion Monument",
      "description": "Commemorative shield monument honoring 100% capital preservation principles.",
      "x": 650,
      "y": 1750,
      "radius": 35,
      "themeColor": "#F59E0B",
      "accentColor": "#F43F5E",
      "icon": "fa-shield-halved"
    },
    {
      "id": "landmark_market_arch",
      "name": "Market Exchange Archway",
      "description": "Gateway arch spanning Market Street with real-time simulated order flow streams.",
      "x": 2320,
      "y": 1200,
      "radius": 35,
      "themeColor": "#FCD34D",
      "accentColor": "#10B981",
      "icon": "fa-archway"
    }
  ],
  "npcs": [
    {
      "id": "mentor_pip",
      "name": "Pip Mentor",
      "role": "Chief Precision Officer",
      "x": 650,
      "y": 560,
      "quarter": "education_quarter",
      "themeColor": "#00F0FF",
      "secondaryColor": "#3B82F6",
      "avatarIcon": "fa-calculator",
      "missions": [
        "first_measurement",
        "precision_master"
      ],
      "defaultDialogue": "Welcome to Pip District! Precision is the foundation of trading risk management. Every 0.0001 movement on standard forex pairs represents 1 pip of fluctuation. Visit Pip Academy to begin your tour!"
    },
    {
      "id": "instructor_precision",
      "name": "Precision Instructor",
      "role": "Ladder & JPY Specialist",
      "x": 2550,
      "y": 560,
      "quarter": "precision_quarter",
      "themeColor": "#10B981",
      "secondaryColor": "#00F0FF",
      "avatarIcon": "fa-ruler-combined",
      "missions": [
        "precision_test",
        "jpy_zone",
        "fractional_precision"
      ],
      "defaultDialogue": "Remember: Not all instruments follow 4-decimal rules! JPY pairs quote at 2 decimal places, Gold quotes in cents, and pipettes measure tenths of a pip."
    },
    {
      "id": "engineer_risk",
      "name": "Risk Engineer",
      "role": "Position & Leverage Specialist",
      "x": 700,
      "y": 1900,
      "quarter": "risk_quarter",
      "themeColor": "#F59E0B",
      "secondaryColor": "#F43F5E",
      "avatarIcon": "fa-shield-halved",
      "missions": [
        "risk_engineer",
        "leverage_check",
        "risk_arena"
      ],
      "defaultDialogue": "Account capital, stop loss distance, and risk percentage dictate your position lot size. Never calculate position size backwards from profit expectations!"
    },
    {
      "id": "coordinator_pip",
      "name": "Mission Coordinator",
      "role": "District Directives Officer",
      "x": 2180,
      "y": 1960,
      "quarter": "market_mission_quarter",
      "themeColor": "#FCD34D",
      "secondaryColor": "#00F0FF",
      "avatarIcon": "fa-compass",
      "missions": [
        "city_explorer_pip",
        "pip_blitz",
        "know_your_instrument"
      ],
      "defaultDialogue": "Welcome to Pip District Operations! Complete all 10 directives across our facilities to earn the title of Grand Precision Master."
    }
  ],
  "ambientNpcs": [
    {
      "id": "ambient_trader_alex",
      "name": "Trader Alex",
      "role": "Market Street Analyst",
      "avatarIcon": "fa-user-tie",
      "themeColor": "#3B82F6",
      "x": 2400,
      "y": 1200,
      "dialogue": "EUR/USD is testing support! A 15-pip stop loss on standard lots is exactly $150 of risk.",
      "waypoints": [
        {
          "x": 2400,
          "y": 1200
        },
        {
          "x": 2000,
          "y": 1200
        },
        {
          "x": 1600,
          "y": 1200
        },
        {
          "x": 2000,
          "y": 1200
        }
      ],
      "speed": 0.9
    },
    {
      "id": "ambient_student_leo",
      "name": "Student Leo",
      "role": "Academy Scholar",
      "avatarIcon": "fa-user-graduate",
      "themeColor": "#00F0FF",
      "x": 600,
      "y": 550,
      "dialogue": "I just solved the EUR/USD 25-pip movement calculation! On a mini lot (0.10), that's $25.",
      "waypoints": [
        {
          "x": 600,
          "y": 550
        },
        {
          "x": 1000,
          "y": 550
        },
        {
          "x": 1400,
          "y": 550
        },
        {
          "x": 1000,
          "y": 550
        }
      ],
      "speed": 0.85
    },
    {
      "id": "ambient_quant_elena",
      "name": "Quant Elena",
      "role": "Precision Specialist",
      "avatarIcon": "fa-laptop-code",
      "themeColor": "#10B981",
      "x": 2600,
      "y": 550,
      "dialogue": "On USD/JPY, moving from 154.20 to 154.55 represents 35 pips because the 2nd decimal is 1 pip.",
      "waypoints": [
        {
          "x": 2600,
          "y": 550
        },
        {
          "x": 2100,
          "y": 550
        },
        {
          "x": 1650,
          "y": 550
        },
        {
          "x": 2100,
          "y": 550
        }
      ],
      "speed": 0.9
    },
    {
      "id": "ambient_officer_marcus",
      "name": "Officer Marcus",
      "role": "Risk Defense Inspector",
      "avatarIcon": "fa-user-shield",
      "themeColor": "#F59E0B",
      "x": 650,
      "y": 1920,
      "dialogue": "Never risk more than 1-2% of total capital on a single execution.",
      "waypoints": [
        {
          "x": 650,
          "y": 1920
        },
        {
          "x": 1100,
          "y": 1920
        },
        {
          "x": 1550,
          "y": 1920
        },
        {
          "x": 1100,
          "y": 1920
        }
      ],
      "speed": 0.8
    },
    {
      "id": "ambient_broker_victor",
      "name": "Broker Victor",
      "role": "Leverage Executive",
      "avatarIcon": "fa-briefcase",
      "themeColor": "#A855F7",
      "x": 1600,
      "y": 650,
      "dialogue": "1:100 leverage allows you to control $100,000 notional with only $1,000 margin collateral.",
      "waypoints": [
        {
          "x": 1600,
          "y": 650
        },
        {
          "x": 1600,
          "y": 950
        },
        {
          "x": 1600,
          "y": 1150
        },
        {
          "x": 1600,
          "y": 800
        }
      ],
      "speed": 0.85
    },
    {
      "id": "ambient_blitz_fan_maya",
      "name": "Challenger Maya",
      "role": "Speed Drill Athlete",
      "avatarIcon": "fa-medal",
      "themeColor": "#FCD34D",
      "x": 2600,
      "y": 1920,
      "dialogue": "My record in the Blitz Arena is 10/10 correct in under 45 seconds! Keep your focus sharp.",
      "waypoints": [
        {
          "x": 2600,
          "y": 1920
        },
        {
          "x": 2100,
          "y": 1920
        },
        {
          "x": 1650,
          "y": 1920
        },
        {
          "x": 2100,
          "y": 1920
        }
      ],
      "speed": 1
    },
    {
      "id": "ambient_resident_clara",
      "name": "Resident Clara",
      "role": "Social Quarter Botanist",
      "avatarIcon": "fa-seedling",
      "themeColor": "#38BDF8",
      "x": 2700,
      "y": 1140,
      "dialogue": "The cyber-gardens in our residential quarter provide the best view of the central Precision Spire.",
      "waypoints": [
        {
          "x": 2700,
          "y": 1140
        },
        {
          "x": 2350,
          "y": 1140
        },
        {
          "x": 2700,
          "y": 1140
        },
        {
          "x": 2900,
          "y": 1140
        }
      ],
      "speed": 0.75
    },
    {
      "id": "ambient_archivist_owen",
      "name": "Archivist Owen",
      "role": "Financial Historian",
      "avatarIcon": "fa-book-open",
      "themeColor": "#FCD34D",
      "x": 1400,
      "y": 1200,
      "dialogue": "The term 'pip' originated as 'percentage in point' or 'price interest point'.",
      "waypoints": [
        {
          "x": 1400,
          "y": 1200
        },
        {
          "x": 1600,
          "y": 1200
        },
        {
          "x": 1800,
          "y": 1200
        },
        {
          "x": 1600,
          "y": 1200
        }
      ],
      "speed": 0.8
    },
    {
      "id": "ambient_engineer_tariq",
      "name": "Engineer Tariq",
      "role": "Telemetry Technician",
      "avatarIcon": "fa-wrench",
      "themeColor": "#10B981",
      "x": 2400,
      "y": 600,
      "dialogue": "Recalibrating the atomic decimal clock ensures sub-pipette synchronicity across all facilities.",
      "waypoints": [
        {
          "x": 2400,
          "y": 600
        },
        {
          "x": 2400,
          "y": 850
        },
        {
          "x": 2400,
          "y": 1100
        },
        {
          "x": 2400,
          "y": 850
        }
      ],
      "speed": 0.85
    },
    {
      "id": "ambient_scout_ren",
      "name": "Scout Ren",
      "role": "District Guide",
      "avatarIcon": "fa-compass",
      "themeColor": "#00F0FF",
      "x": 1600,
      "y": 2000,
      "dialogue": "Welcome! Head North to reach Pip Plaza, or explore the avenues to discover hidden archives!",
      "waypoints": [
        {
          "x": 1600,
          "y": 2000
        },
        {
          "x": 1600,
          "y": 1700
        },
        {
          "x": 1600,
          "y": 1400
        },
        {
          "x": 1600,
          "y": 1700
        }
      ],
      "speed": 0.9
    }
  ],
  "marketBoards": [
    {
      "id": "board_eurusd",
      "pair": "EUR/USD",
      "currentPrice": 1.08542,
      "pipsChange": 14.5,
      "pipDecimals": 5,
      "x": 2350,
      "y": 1100,
      "w": 180,
      "h": 60
    },
    {
      "id": "board_gbpusd",
      "pair": "GBP/USD",
      "currentPrice": 1.27318,
      "pipsChange": -22.3,
      "pipDecimals": 5,
      "x": 2550,
      "y": 1100,
      "w": 180,
      "h": 60
    },
    {
      "id": "board_usdjpy",
      "pair": "USD/JPY",
      "currentPrice": 154.385,
      "pipsChange": 38,
      "pipDecimals": 3,
      "x": 2750,
      "y": 1100,
      "w": 180,
      "h": 60
    },
    {
      "id": "board_gbpjpy",
      "pair": "GBP/JPY",
      "currentPrice": 196.52,
      "pipsChange": 45.2,
      "pipDecimals": 3,
      "x": 2350,
      "y": 1280,
      "w": 180,
      "h": 60
    },
    {
      "id": "board_xauusd",
      "pair": "XAU/USD",
      "currentPrice": 2345.65,
      "pipsChange": -85,
      "pipDecimals": 2,
      "x": 2550,
      "y": 1280,
      "w": 180,
      "h": 60
    },
    {
      "id": "board_us30",
      "pair": "US30",
      "currentPrice": 39120,
      "pipsChange": 120,
      "pipDecimals": 1,
      "x": 2750,
      "y": 1280,
      "w": 180,
      "h": 60
    },
    {
      "id": "board_nas100",
      "pair": "NAS100",
      "currentPrice": 18450.5,
      "pipsChange": 65.5,
      "pipDecimals": 1,
      "x": 2950,
      "y": 1280,
      "w": 180,
      "h": 60
    }
  ],
  "explorationPoints": [
    {
      "id": "exp_caliper_monument",
      "name": "Caliper Obelisk Inscription",
      "quarter": "pip_plaza",
      "x": 1600,
      "y": 1100,
      "rewardXP": 15,
      "text": "The ancient Caliper Obelisk reads: 'A trader who masters the pip masters risk; a trader who ignores the pip forfeits capital.'"
    },
    {
      "id": "exp_market_archive",
      "name": "Market Street Secret Archive",
      "quarter": "market_mission_quarter",
      "x": 2500,
      "y": 1360,
      "rewardXP": 20,
      "text": "Archive Vault #4: 'On standard pairs, 1 pip = 0.0001 = $10 per standard lot. On mini lots (0.10), 1 pip = $1.00.'"
    },
    {
      "id": "exp_leverage_vault",
      "name": "Leverage Tower Terrace Viewpoint",
      "quarter": "leverage_quarter",
      "x": 1400,
      "y": 480,
      "rewardXP": 20,
      "text": "Overlooking the entire district skyline: 'High leverage amplifies purchasing power without altering pip value. Margin is collateral, not free equity.'"
    },
    {
      "id": "exp_risk_sanctuary",
      "name": "Risk Quarter Defense Bunker",
      "quarter": "risk_quarter",
      "x": 350,
      "y": 1850,
      "rewardXP": 15,
      "text": "Bunker Wall Axiom: 'Position Size = (Account Balance × Risk %) / (Stop Loss in Pips × Pip Value).'"
    },
    {
      "id": "exp_precision_vault",
      "name": "Atomic Clock Chamber",
      "quarter": "precision_quarter",
      "x": 2850,
      "y": 250,
      "rewardXP": 20,
      "text": "Laser Calibration Register: 'The 5th decimal is a pipette (0.1 pip). A quote move from 1.10000 to 1.10005 is 0.5 pips.'"
    },
    {
      "id": "exp_academy_terrace",
      "name": "Academy Knowledge Pergola",
      "quarter": "education_quarter",
      "x": 350,
      "y": 450,
      "rewardXP": 15,
      "text": "Pergola Scholar Plaque: 'Pip stands for Percentage in Point. It represents the standardized unit of currency price fluctuation.'"
    },
    {
      "id": "exp_jpy_monument",
      "name": "JPY 2nd Decimal Monument",
      "quarter": "precision_quarter",
      "x": 2400,
      "y": 700,
      "rewardXP": 15,
      "text": "JPY Pillar: 'Japanese Yen pairs quote in 2 decimal places. 1 pip = 0.01 JPY movement.'"
    },
    {
      "id": "exp_residential_garden",
      "name": "Residential Garden Lore Pod",
      "quarter": "residential_quarter",
      "x": 2700,
      "y": 1100,
      "rewardXP": 10,
      "text": "Social Garden Terminal: 'Disciplined traders practice consistency daily. Even 15 pips per day with strict risk compounding creates long-term mastery.'"
    },
    {
      "id": "exp_anti_ruin_vault",
      "name": "Anti-Ruin Capital Cache",
      "quarter": "risk_quarter",
      "x": 750,
      "y": 2150,
      "rewardXP": 15,
      "text": "Security Terminal: 'A 50% drawdown requires a 100% gain just to break even. Defend capital at all costs.'"
    },
    {
      "id": "exp_blitz_monolith",
      "name": "Blitz Champion Hall of Fame",
      "quarter": "market_mission_quarter",
      "x": 2850,
      "y": 1800,
      "rewardXP": 20,
      "text": "Arena Honors Monument: 'Speed combined with precision is the hallmark of professional order execution.'"
    },
    {
      "id": "exp_transit_ledger",
      "name": "South Gate World Gateway Archive",
      "quarter": "market_mission_quarter",
      "x": 1450,
      "y": 2250,
      "rewardXP": 10,
      "text": "Transit Gate Telemetry: 'Pip District is connected directly to Candle City, Market Arena, and the World Hub.'"
    },
    {
      "id": "exp_civic_beacon",
      "name": "Central Civic Telemetry Beacon",
      "quarter": "pip_plaza",
      "x": 1400,
      "y": 1200,
      "rewardXP": 15,
      "text": "Civic Beacon: 'Broadcasting live market health, pip volatility alerts, and district mastery rankings across Strativo World.'"
    }
  ],
  "challengeStations": [
    {
      "id": "trigger_station_quick_plaza",
      "name": "Plaza Quick Pip Drill",
      "quarter": "pip_plaza",
      "x": 1450,
      "y": 1150,
      "rewardXP": 10
    },
    {
      "id": "trigger_station_quick_market",
      "name": "Market Street Fast Calculator",
      "quarter": "market_mission_quarter",
      "x": 2600,
      "y": 1350,
      "rewardXP": 10
    },
    {
      "id": "trigger_station_quick_precision",
      "name": "Precision Quarter Drill Kiosk",
      "quarter": "precision_quarter",
      "x": 2450,
      "y": 650,
      "rewardXP": 10
    },
    {
      "id": "trigger_station_quick_risk",
      "name": "Risk Sizing Quick Booth",
      "quarter": "risk_quarter",
      "x": 750,
      "y": 1750,
      "rewardXP": 10
    },
    {
      "id": "trigger_station_quick_residential",
      "name": "Community Knowledge Terminal",
      "quarter": "residential_quarter",
      "x": 2800,
      "y": 1050,
      "rewardXP": 10
    }
  ],
  "interiors": {
    "pip_academy": {
      "id": "pip_academy",
      "name": "Pip Academy Lecture Hall",
      "subtitle": "Foundational Pip Mathematics & Direction",
      "width": 1200,
      "height": 800,
      "spawn": {
        "x": 600,
        "y": 680,
        "direction": "up"
      },
      "exit": {
        "x": 600,
        "y": 750,
        "w": 120,
        "h": 40
      },
      "themeColor": "#00F0FF",
      "accentColor": "#38BDF8",
      "floorStyle": "classroom",
      "returnPos": {
        "x": 480,
        "y": 560
      },
      "stations": [
        {
          "id": "station_pip_fundamentals",
          "name": "Pip Fundamentals Terminal",
          "x": 320,
          "y": 380,
          "w": 100,
          "h": 50,
          "label": "Use Fundamentals Terminal [E]",
          "action": "openAcademyModal",
          "tab": "fund"
        },
        {
          "id": "station_pip_direction",
          "name": "Directional Movement Board",
          "x": 500,
          "y": 380,
          "w": 100,
          "h": 50,
          "label": "Use Directional Board [E]",
          "action": "openAcademyModal",
          "tab": "dir"
        },
        {
          "id": "station_pip_drill",
          "name": "Live Pip Spread Terminal",
          "x": 700,
          "y": 380,
          "w": 100,
          "h": 50,
          "label": "Use Spread Terminal [E]",
          "action": "openAcademyModal",
          "tab": "spread"
        },
        {
          "id": "station_pip_matrix",
          "name": "4th Decimal Theory Station",
          "x": 880,
          "y": 380,
          "w": 100,
          "h": 50,
          "label": "Use Matrix Station [E]",
          "action": "openAcademyModal",
          "tab": "matrix"
        }
      ],
      "npc": {
        "id": "mentor_pip_interior",
        "name": "Pip Mentor",
        "role": "Chief Precision Officer",
        "x": 600,
        "y": 200,
        "themeColor": "#00F0FF",
        "avatarIcon": "fa-calculator",
        "dialogue": "Welcome inside Pip Academy! The fourth decimal place (0.0001) on EUR/USD is 1 pip. On a 1.00 standard lot, 1 pip equals exactly $10.00."
      }
    },
    "precision_lab": {
      "id": "precision_lab",
      "name": "Precision & Instruments Lab",
      "subtitle": "Price Ladder, JPY Rules & Fractional Pipettes",
      "width": 1200,
      "height": 800,
      "spawn": {
        "x": 600,
        "y": 680,
        "direction": "up"
      },
      "exit": {
        "x": 600,
        "y": 750,
        "w": 120,
        "h": 40
      },
      "themeColor": "#10B981",
      "accentColor": "#00F0FF",
      "floorStyle": "microscope",
      "returnPos": {
        "x": 2710,
        "y": 560
      },
      "stations": [
        {
          "id": "station_price_ladder",
          "name": "Interactive Price Ladder",
          "x": 320,
          "y": 380,
          "w": 100,
          "h": 50,
          "label": "Use Price Ladder [E]",
          "action": "openPrecisionLabModal",
          "tab": "ladder"
        },
        {
          "id": "station_jpy_precision",
          "name": "JPY Precision Converter",
          "x": 500,
          "y": 380,
          "w": 100,
          "h": 50,
          "label": "Use JPY Converter [E]",
          "action": "openPrecisionLabModal",
          "tab": "jpy"
        },
        {
          "id": "station_fractional_pipette",
          "name": "Pipette Microscope Station",
          "x": 700,
          "y": 380,
          "w": 100,
          "h": 50,
          "label": "Use Pipette Station [E]",
          "action": "openPrecisionLabModal",
          "tab": "fractional"
        },
        {
          "id": "station_instrument_rules",
          "name": "Multi-Asset Rules Station",
          "x": 880,
          "y": 380,
          "w": 100,
          "h": 50,
          "label": "Use Instrument Rules [E]",
          "action": "openPrecisionLabModal",
          "tab": "rules"
        }
      ],
      "npc": {
        "id": "instructor_precision_interior",
        "name": "Precision Instructor",
        "role": "Ladder & JPY Specialist",
        "x": 600,
        "y": 200,
        "themeColor": "#10B981",
        "avatarIcon": "fa-ruler-combined",
        "dialogue": "Gold moves in $0.01 cents (1 pip = $0.10 or $0.01 depending on broker), and JPY pairs quote at 2 decimal places (0.01 = 1 pip)."
      }
    },
    "risk_forge": {
      "id": "risk_forge",
      "name": "Risk & Position Forge",
      "subtitle": "Capital Risk % & Lot Sizing Workshop",
      "width": 1200,
      "height": 800,
      "spawn": {
        "x": 600,
        "y": 680,
        "direction": "up"
      },
      "exit": {
        "x": 600,
        "y": 750,
        "w": 120,
        "h": 40
      },
      "themeColor": "#F59E0B",
      "accentColor": "#F43F5E",
      "floorStyle": "industrial",
      "returnPos": {
        "x": 480,
        "y": 1940
      },
      "stations": [
        {
          "id": "station_position_calculator",
          "name": "Position Size Calculation Anvil",
          "x": 320,
          "y": 380,
          "w": 100,
          "h": 50,
          "label": "Use Position Anvil [E]",
          "action": "openRiskForgeModal",
          "tab": "sizing"
        },
        {
          "id": "station_max_risk_workstation",
          "name": "Max Dollar Risk Hard-Cap",
          "x": 500,
          "y": 380,
          "w": 100,
          "h": 50,
          "label": "Use Risk Hard-Cap [E]",
          "action": "openRiskForgeModal",
          "tab": "maxrisk"
        },
        {
          "id": "station_stop_distance",
          "name": "Stop Loss Distance Workstation",
          "x": 700,
          "y": 380,
          "w": 100,
          "h": 50,
          "label": "Use Stop Distance Station [E]",
          "action": "openRiskForgeModal",
          "tab": "stopdist"
        },
        {
          "id": "station_anti_ruin",
          "name": "Anti-Ruin Sizing Matrix",
          "x": 880,
          "y": 380,
          "w": 100,
          "h": 50,
          "label": "Use Anti-Ruin Matrix [E]",
          "action": "openRiskForgeModal",
          "tab": "antiruin"
        }
      ],
      "npc": {
        "id": "engineer_risk_interior",
        "name": "Risk Engineer",
        "role": "Position & Sizing Specialist",
        "x": 600,
        "y": 200,
        "themeColor": "#F59E0B",
        "avatarIcon": "fa-shield-halved",
        "dialogue": "Position Size = (Account Balance * Risk %) / (Stop Loss in Pips * Pip Value). Always size the trade to fit your risk tolerance."
      }
    },
    "leverage_tower": {
      "id": "leverage_tower",
      "name": "Leverage Citadel & Margin Observatory",
      "subtitle": "Purchasing Power, Exposure & Margin Mechanics",
      "width": 1200,
      "height": 800,
      "spawn": {
        "x": 600,
        "y": 680,
        "direction": "up"
      },
      "exit": {
        "x": 600,
        "y": 750,
        "w": 120,
        "h": 40
      },
      "themeColor": "#A855F7",
      "accentColor": "#F43F5E",
      "floorStyle": "vault",
      "returnPos": {
        "x": 1600,
        "y": 600
      },
      "stations": [
        {
          "id": "station_margin_simulator",
          "name": "Margin Requirement Simulator",
          "x": 320,
          "y": 380,
          "w": 100,
          "h": 50,
          "label": "Use Margin Simulator [E]",
          "action": "openLeverageModal",
          "tab": "margin"
        },
        {
          "id": "station_exposure_analyzer",
          "name": "Notional Exposure Analyzer",
          "x": 500,
          "y": 380,
          "w": 100,
          "h": 50,
          "label": "Use Exposure Analyzer [E]",
          "action": "openLeverageModal",
          "tab": "exposure"
        },
        {
          "id": "station_margin_gauge",
          "name": "Margin Utilization Gauge",
          "x": 700,
          "y": 380,
          "w": 100,
          "h": 50,
          "label": "Use Utilization Gauge [E]",
          "action": "openLeverageModal",
          "tab": "utilization"
        },
        {
          "id": "station_liquidation_defense",
          "name": "Liquidation Defense Terminal",
          "x": 880,
          "y": 380,
          "w": 100,
          "h": 50,
          "label": "Use Liquidation Defense [E]",
          "action": "openLeverageModal",
          "tab": "liquidation"
        }
      ],
      "npc": {
        "id": "broker_elena_interior",
        "name": "Elena - Senior Risk Broker",
        "role": "Leverage Strategist",
        "x": 600,
        "y": 200,
        "themeColor": "#A855F7",
        "avatarIcon": "fa-building-columns",
        "dialogue": "Leverage is a double-edged sword. It increases notional exposure without requiring 100% upfront capital. Maintain high margin levels to avoid liquidation."
      }
    },
    "risk_arena": {
      "id": "risk_arena",
      "name": "Risk Defense Arena & Bastion",
      "subtitle": "Drawdown Defense & Risk Survival",
      "width": 1200,
      "height": 800,
      "spawn": {
        "x": 600,
        "y": 680,
        "direction": "up"
      },
      "exit": {
        "x": 600,
        "y": 750,
        "w": 120,
        "h": 40
      },
      "themeColor": "#F43F5E",
      "accentColor": "#F59E0B",
      "floorStyle": "defense",
      "returnPos": {
        "x": 480,
        "y": 2260
      },
      "stations": [
        {
          "id": "station_defense_trial",
          "name": "Capital Defense Trial Console",
          "x": 400,
          "y": 380,
          "w": 140,
          "h": 50,
          "label": "Start Defense Trial [E]",
          "action": "openRiskArenaModal",
          "tab": "trial"
        },
        {
          "id": "station_drawdown_defense",
          "name": "Drawdown Defense Simulator",
          "x": 800,
          "y": 380,
          "w": 140,
          "h": 50,
          "label": "Start Drawdown Defense [E]",
          "action": "openRiskArenaModal",
          "tab": "drawdown"
        }
      ],
      "npc": {
        "id": "arena_master_kane",
        "name": "Kane - Defense Proctor",
        "role": "Chief Survival Officer",
        "x": 600,
        "y": 200,
        "themeColor": "#F43F5E",
        "avatarIcon": "fa-cubes-stacked",
        "dialogue": "In the Arena, we test your ability to survive consecutive losing streaks without blowing up. A 20% drawdown requires 25% gain to recover."
      }
    },
    "pip_blitz_arena": {
      "id": "pip_blitz_arena",
      "name": "Pip Blitz Battle Arena",
      "subtitle": "10-Round Precision Mini-Game Gauntlet",
      "width": 1200,
      "height": 800,
      "spawn": {
        "x": 600,
        "y": 680,
        "direction": "up"
      },
      "exit": {
        "x": 600,
        "y": 750,
        "w": 120,
        "h": 40
      },
      "themeColor": "#00F0FF",
      "accentColor": "#10B981",
      "floorStyle": "speed_track",
      "returnPos": {
        "x": 2710,
        "y": 1940
      },
      "stations": [
        {
          "id": "station_blitz_launcher",
          "name": "10-Round Blitz Battle Console",
          "x": 600,
          "y": 340,
          "w": 180,
          "h": 60,
          "label": "Launch Pip Blitz Gauntlet [E]",
          "action": "launchPipBlitz"
        },
        {
          "id": "station_blitz_warmup",
          "name": "Blitz Warmup & Speed Drills",
          "x": 350,
          "y": 420,
          "w": 120,
          "h": 50,
          "label": "Use Warmup Drills [E]",
          "action": "openBlitzWarmupModal"
        },
        {
          "id": "station_blitz_scorecard",
          "name": "Precision Record Scorecard",
          "x": 850,
          "y": 420,
          "w": 120,
          "h": 50,
          "label": "View Scorecard [E]",
          "action": "openBlitzScorecardModal"
        }
      ],
      "npc": {
        "id": "blitz_referee_jax",
        "name": "Jax - Blitz Referee",
        "role": "High-Speed Drill Coordinator",
        "x": 600,
        "y": 180,
        "themeColor": "#00F0FF",
        "avatarIcon": "fa-bolt-lightning",
        "dialogue": "Ready for the 10-round gauntlet? We test measurement speed, direction, JPY rules, pipettes, and position sizing against the clock!"
      }
    },
    "mission_hq": {
      "id": "mission_hq",
      "name": "District Operations Command HQ",
      "subtitle": "10 District Directives & Tactical Operations",
      "width": 1200,
      "height": 800,
      "spawn": {
        "x": 600,
        "y": 680,
        "direction": "up"
      },
      "exit": {
        "x": 600,
        "y": 750,
        "w": 120,
        "h": 40
      },
      "themeColor": "#FCD34D",
      "accentColor": "#00F0FF",
      "floorStyle": "command_radar",
      "returnPos": {
        "x": 2270,
        "y": 1940
      },
      "stations": [
        {
          "id": "station_mission_board",
          "name": "Directives Master Terminal",
          "x": 600,
          "y": 340,
          "w": 180,
          "h": 60,
          "label": "Open Directives Board [E]",
          "action": "openMissionsJournal"
        },
        {
          "id": "station_hq_briefing",
          "name": "Sector Tactical Hologram Table",
          "x": 350,
          "y": 420,
          "w": 120,
          "h": 50,
          "label": "Access Sector Briefing [E]",
          "action": "openTacticalBriefingModal"
        },
        {
          "id": "station_hq_vault",
          "name": "Directives Rewards Vault",
          "x": 850,
          "y": 420,
          "w": 120,
          "h": 50,
          "label": "Inspect Rewards Vault [E]",
          "action": "openRewardsVaultModal"
        }
      ],
      "npc": {
        "id": "coordinator_pip_interior",
        "name": "Mission Coordinator",
        "role": "District Directives Officer",
        "x": 600,
        "y": 180,
        "themeColor": "#FCD34D",
        "avatarIcon": "fa-compass",
        "dialogue": "Welcome to Command HQ. Complete all 10 District Directives to achieve 100% Pip Mastery and unlock advanced financial operations."
      }
    }
  }
};

    const BLITZ_CONFIG = {
  "version": "1.1.0",
  "scenarios": [
    {
      "id": "blitz_meas_01",
      "category": "MEASURE",
      "difficulty": "beginner",
      "instrument": "EUR/USD",
      "startPrice": 1.082,
      "endPrice": 1.0855,
      "questionText": "EUR/USD moves from 1.0820 to 1.0855. What is the total price distance in pips?",
      "options": [
        "35 Pips",
        "3.5 Pips",
        "350 Pips",
        "0.35 Pips"
      ],
      "correctAnswer": "35 Pips",
      "explanation": "1.0855 - 1.0820 = 0.0035. On 4-decimal pairs, 0.0001 = 1 pip. Therefore, 0.0035 = 35 pips."
    },
    {
      "id": "blitz_meas_02",
      "category": "MEASURE",
      "difficulty": "beginner",
      "instrument": "GBP/USD",
      "startPrice": 1.261,
      "endPrice": 1.267,
      "questionText": "GBP/USD moves from 1.2610 to 1.2670. How many pips did price travel?",
      "options": [
        "60 Pips",
        "6 Pips",
        "600 Pips",
        "0.6 Pips"
      ],
      "correctAnswer": "60 Pips",
      "explanation": "1.2670 - 1.2610 = 0.0060 = 60 pips."
    },
    {
      "id": "blitz_meas_03",
      "category": "MEASURE",
      "difficulty": "beginner",
      "instrument": "AUD/USD",
      "startPrice": 0.654,
      "endPrice": 0.6515,
      "questionText": "AUD/USD drops from 0.6540 to 0.6515. What is the pip decline?",
      "options": [
        "25 Pips",
        "2.5 Pips",
        "250 Pips",
        "0.25 Pips"
      ],
      "correctAnswer": "25 Pips",
      "explanation": "0.6540 - 0.6515 = 0.0025 = 25 pips down."
    },
    {
      "id": "blitz_meas_04",
      "category": "MEASURE",
      "difficulty": "beginner",
      "instrument": "USD/CAD",
      "startPrice": 1.352,
      "endPrice": 1.3565,
      "questionText": "USD/CAD advances from 1.3520 to 1.3565. How many pips did it gain?",
      "options": [
        "45 Pips",
        "4.5 Pips",
        "450 Pips",
        "0.45 Pips"
      ],
      "correctAnswer": "45 Pips",
      "explanation": "1.3565 - 1.3520 = 0.0045 = 45 pips."
    },
    {
      "id": "blitz_meas_05",
      "category": "MEASURE",
      "difficulty": "intermediate",
      "instrument": "NZD/USD",
      "startPrice": 0.6085,
      "endPrice": 0.6175,
      "questionText": "NZD/USD rallies from 0.6085 to 0.6175. What is the pip expansion?",
      "options": [
        "90 Pips",
        "9 Pips",
        "900 Pips",
        "0.9 Pips"
      ],
      "correctAnswer": "90 Pips",
      "explanation": "0.6175 - 0.6085 = 0.0090 = 90 pips."
    },
    {
      "id": "blitz_dir_01",
      "category": "DIRECTION",
      "difficulty": "beginner",
      "instrument": "EUR/USD",
      "startPrice": 1.088,
      "endPrice": 1.083,
      "questionText": "EUR/USD moves from 1.0880 to 1.0830 (-50 pips). What market vector is this?",
      "options": [
        "BEARISH (DOWN)",
        "BULLISH (UP)",
        "CONSOLIDATION",
        "NEUTRAL"
      ],
      "correctAnswer": "BEARISH (DOWN)",
      "explanation": "Ending price (1.0830) is lower than starting price (1.0880), representing a 50-pip downward (bearish) vector."
    },
    {
      "id": "blitz_dir_02",
      "category": "DIRECTION",
      "difficulty": "beginner",
      "instrument": "GBP/USD",
      "startPrice": 1.255,
      "endPrice": 1.261,
      "questionText": "GBP/USD climbs from 1.2550 to 1.2610 (+60 pips). What vector is this?",
      "options": [
        "BULLISH (UP)",
        "BEARISH (DOWN)",
        "SIDEWAYS",
        "REVERSAL"
      ],
      "correctAnswer": "BULLISH (UP)",
      "explanation": "Price moved from 1.2550 up to 1.2610 (+60 pips), indicating an upward bullish movement."
    },
    {
      "id": "blitz_dir_03",
      "category": "DIRECTION",
      "difficulty": "beginner",
      "instrument": "USD/CHF",
      "startPrice": 0.884,
      "endPrice": 0.879,
      "questionText": "USD/CHF falls from 0.8840 to 0.8790. What is the directional bias?",
      "options": [
        "BEARISH (DOWN)",
        "BULLISH (UP)",
        "MEAN REVERSION",
        "BREAKOUT"
      ],
      "correctAnswer": "BEARISH (DOWN)",
      "explanation": "0.8840 to 0.8790 is a drop of 50 pips (bearish direction)."
    },
    {
      "id": "blitz_dir_04",
      "category": "DIRECTION",
      "difficulty": "intermediate",
      "instrument": "EUR/GBP",
      "startPrice": 0.852,
      "endPrice": 0.8565,
      "questionText": "EUR/GBP rises from 0.8520 to 0.8565 (+45 pips). What vector is confirmed?",
      "options": [
        "BULLISH (UP)",
        "BEARISH (DOWN)",
        "FALSE BREAK",
        "LIQUIDITY RUN"
      ],
      "correctAnswer": "BULLISH (UP)",
      "explanation": "A 45-pip increase represents bullish expansion."
    },
    {
      "id": "blitz_jpy_01",
      "category": "JPY",
      "difficulty": "intermediate",
      "instrument": "USD/JPY",
      "startPrice": 150.2,
      "endPrice": 150.75,
      "questionText": "USD/JPY moves from 150.20 to 150.75. On Japanese Yen pairs, how many pips is this?",
      "options": [
        "55 Pips",
        "5.5 Pips",
        "550 Pips",
        "0.55 Pips"
      ],
      "correctAnswer": "55 Pips",
      "explanation": "On JPY pairs, 1 pip is the 2nd decimal place (0.01). 150.75 - 150.20 = 0.55 = 55 pips."
    },
    {
      "id": "blitz_jpy_02",
      "category": "JPY",
      "difficulty": "intermediate",
      "instrument": "GBP/JPY",
      "startPrice": 189.5,
      "endPrice": 188.9,
      "questionText": "GBP/JPY drops from 189.50 to 188.90. How many pips did it decline?",
      "options": [
        "60 Pips",
        "6 Pips",
        "600 Pips",
        "0.6 Pips"
      ],
      "correctAnswer": "60 Pips",
      "explanation": "189.50 - 188.90 = 0.60 = 60 pips down."
    },
    {
      "id": "blitz_jpy_03",
      "category": "JPY",
      "difficulty": "intermediate",
      "instrument": "EUR/JPY",
      "startPrice": 162.1,
      "endPrice": 162.95,
      "questionText": "EUR/JPY advances from 162.10 to 162.95. What is the pip gain?",
      "options": [
        "85 Pips",
        "8.5 Pips",
        "850 Pips",
        "0.85 Pips"
      ],
      "correctAnswer": "85 Pips",
      "explanation": "162.95 - 162.10 = 0.85 = 85 pips."
    },
    {
      "id": "blitz_jpy_04",
      "category": "JPY",
      "difficulty": "advanced",
      "instrument": "CAD/JPY",
      "startPrice": 111.4,
      "endPrice": 110.65,
      "questionText": "CAD/JPY moves from 111.40 to 110.65. How many pips was the drop?",
      "options": [
        "75 Pips",
        "7.5 Pips",
        "750 Pips",
        "0.75 Pips"
      ],
      "correctAnswer": "75 Pips",
      "explanation": "111.40 - 110.65 = 0.75 = 75 pips."
    },
    {
      "id": "blitz_jpy_05",
      "category": "JPY",
      "difficulty": "advanced",
      "instrument": "USD/JPY",
      "startPrice": 154,
      "endPrice": 155.2,
      "questionText": "USD/JPY climbs from 154.00 to 155.20. What is the total pip travel?",
      "options": [
        "120 Pips",
        "12 Pips",
        "1,200 Pips",
        "1.2 Pips"
      ],
      "correctAnswer": "120 Pips",
      "explanation": "155.20 - 154.00 = 1.20 = 120 pips."
    },
    {
      "id": "blitz_frac_01",
      "category": "PIPETTE",
      "difficulty": "intermediate",
      "instrument": "EUR/USD",
      "startPrice": 1.1052,
      "endPrice": 1.10528,
      "questionText": "EUR/USD ticks from 1.10520 to 1.10528. In fractional pipettes / points, what is this change?",
      "options": [
        "0.8 Pips (8 Points)",
        "8 Pips",
        "80 Pips",
        "0.08 Pips"
      ],
      "correctAnswer": "0.8 Pips (8 Points)",
      "explanation": "1.10528 - 1.10520 = 0.00008 = 0.8 pips or 8 fractional points (pipettes)."
    },
    {
      "id": "blitz_frac_02",
      "category": "PIPETTE",
      "difficulty": "intermediate",
      "instrument": "GBP/USD",
      "startPrice": 1.2745,
      "endPrice": 1.27471,
      "questionText": "GBP/USD shifts from 1.27450 to 1.27471. How many pips / points is this?",
      "options": [
        "2.1 Pips (21 Points)",
        "21 Pips",
        "0.21 Pips",
        "210 Points"
      ],
      "correctAnswer": "2.1 Pips (21 Points)",
      "explanation": "1.27471 - 1.27450 = 0.00021 = 2.1 pips (21 points)."
    },
    {
      "id": "blitz_frac_03",
      "category": "PIPETTE",
      "difficulty": "advanced",
      "instrument": "USD/JPY",
      "startPrice": 151.25,
      "endPrice": 151.265,
      "questionText": "USD/JPY ticks from 151.250 to 151.265 (3rd decimal). What is the fractional pip distance?",
      "options": [
        "1.5 Pips (15 Points)",
        "15 Pips",
        "0.15 Pips",
        "150 Points"
      ],
      "correctAnswer": "1.5 Pips (15 Points)",
      "explanation": "On 3-decimal JPY quotes, the 3rd decimal is a pipette. 151.265 - 151.250 = 0.015 = 1.5 pips (15 points)."
    },
    {
      "id": "blitz_frac_04",
      "category": "PIPETTE",
      "difficulty": "advanced",
      "instrument": "AUD/USD",
      "startPrice": 0.658,
      "endPrice": 0.65837,
      "questionText": "AUD/USD moves from 0.65800 to 0.65837. What is the fractional distance?",
      "options": [
        "3.7 Pips (37 Points)",
        "37 Pips",
        "0.37 Pips",
        "370 Points"
      ],
      "correctAnswer": "3.7 Pips (37 Points)",
      "explanation": "0.65837 - 0.65800 = 0.00037 = 3.7 pips."
    },
    {
      "id": "blitz_speed_01",
      "category": "SPEED",
      "difficulty": "beginner",
      "instrument": "EUR/USD",
      "startPrice": 1.09,
      "endPrice": 1.091,
      "questionText": "Quick calculation: EUR/USD from 1.0900 to 1.0910 is how many pips?",
      "options": [
        "10 Pips",
        "1 Pip",
        "100 Pips",
        "0.1 Pips"
      ],
      "correctAnswer": "10 Pips",
      "explanation": "1.0910 - 1.0900 = 0.0010 = 10 pips."
    },
    {
      "id": "blitz_speed_02",
      "category": "SPEED",
      "difficulty": "beginner",
      "instrument": "GBP/USD",
      "startPrice": 1.28,
      "endPrice": 1.282,
      "questionText": "Quick calculation: GBP/USD from 1.2800 to 1.2820 is how many pips?",
      "options": [
        "20 Pips",
        "2 Pips",
        "200 Pips",
        "0.2 Pips"
      ],
      "correctAnswer": "20 Pips",
      "explanation": "1.2820 - 1.2800 = 0.0020 = 20 pips."
    },
    {
      "id": "blitz_speed_03",
      "category": "SPEED",
      "difficulty": "intermediate",
      "instrument": "USD/JPY",
      "startPrice": 149,
      "endPrice": 149.3,
      "questionText": "Quick calculation: USD/JPY from 149.00 to 149.30 is how many pips?",
      "options": [
        "30 Pips",
        "3 Pips",
        "300 Pips",
        "0.3 Pips"
      ],
      "correctAnswer": "30 Pips",
      "explanation": "149.30 - 149.00 = 0.30 = 30 pips."
    },
    {
      "id": "blitz_inst_01",
      "category": "INSTRUMENT",
      "difficulty": "intermediate",
      "instrument": "XAU/USD (Gold)",
      "startPrice": 2030,
      "endPrice": 2035,
      "questionText": "Spot Gold (XAU/USD) rises from $2,030.00 to $2,035.00. How many dollars and pips (where $0.10 = 1 pip) is this?",
      "options": [
        "$5.00 (50 Pips)",
        "$5.00 (5 Pips)",
        "$50.00 (500 Pips)",
        "$0.50 (5 Pips)"
      ],
      "correctAnswer": "$5.00 (50 Pips)",
      "explanation": "$2035 - $2030 = $5.00 move. In standard FX broker convention ($0.10 = 1 pip), $5.00 = 50 pips."
    },
    {
      "id": "blitz_inst_02",
      "category": "INSTRUMENT",
      "difficulty": "advanced",
      "instrument": "US30 (Dow Jones)",
      "startPrice": 38900,
      "endPrice": 38950,
      "questionText": "US30 index moves from 38,900 to 38,950. How many index points did it advance?",
      "options": [
        "50 Points",
        "5 Points",
        "500 Points",
        "0.5 Points"
      ],
      "correctAnswer": "50 Points",
      "explanation": "Stock index CFDs are measured directly in whole index points (38950 - 38900 = 50 points)."
    },
    {
      "id": "blitz_inst_03",
      "category": "INSTRUMENT",
      "difficulty": "advanced",
      "instrument": "NAS100 (Nasdaq)",
      "startPrice": 17900,
      "endPrice": 17925,
      "questionText": "NAS100 rises from 17,900 to 17,925. What is the point movement?",
      "options": [
        "25 Points",
        "2.5 Points",
        "250 Points",
        "0.25 Points"
      ],
      "correctAnswer": "25 Points",
      "explanation": "17925 - 17900 = 25 points."
    },
    {
      "id": "blitz_risk_01",
      "category": "RISK_POSITION",
      "difficulty": "intermediate",
      "instrument": "Account Risk Limit",
      "questionText": "On a $10,000 account, what is the maximum dollar risk permitted under strict 2% risk management?",
      "options": [
        "$200",
        "$100",
        "$500",
        "$20"
      ],
      "correctAnswer": "$200",
      "explanation": "$10,000 * 0.02 = $200 maximum risk on a single trade."
    },
    {
      "id": "blitz_risk_02",
      "category": "RISK_POSITION",
      "difficulty": "intermediate",
      "instrument": "Account Risk Limit",
      "questionText": "On a $5,000 account, what is the max dollar loss under a conservative 1% risk limit?",
      "options": [
        "$50",
        "$100",
        "$25",
        "$500"
      ],
      "correctAnswer": "$50",
      "explanation": "$5,000 * 0.01 = $50."
    },
    {
      "id": "blitz_risk_03",
      "category": "RISK_POSITION",
      "difficulty": "advanced",
      "instrument": "Lot Sizing",
      "questionText": "You want to risk $200 with a 20-pip stop loss on EUR/USD ($10/pip per standard lot). What is the recommended lot size?",
      "options": [
        "1.00 Lot (Standard)",
        "0.10 Lot (Mini)",
        "2.00 Lots",
        "0.50 Lot"
      ],
      "correctAnswer": "1.00 Lot (Standard)",
      "explanation": "Lot size = Max Risk ($200) / (Stop Pips (20) * $10) = $200 / $200 = 1.00 standard lot."
    },
    {
      "id": "blitz_risk_04",
      "category": "RISK_POSITION",
      "difficulty": "advanced",
      "instrument": "Lot Sizing",
      "questionText": "You want to risk $100 with a 25-pip stop loss on GBP/USD ($10/pip per lot). What is the lot size?",
      "options": [
        "0.40 Lots",
        "0.25 Lots",
        "0.10 Lots",
        "1.00 Lot"
      ],
      "correctAnswer": "0.40 Lots",
      "explanation": "$100 / (25 pips * $10) = $100 / $250 = 0.40 lots."
    },
    {
      "id": "blitz_risk_05",
      "category": "RISK_POSITION",
      "difficulty": "expert",
      "instrument": "Leverage & Margin",
      "questionText": "Opening 1.0 standard lot ($100,000 notional) of EUR/USD at 1:50 leverage requires what minimum margin deposit?",
      "options": [
        "$2,000",
        "$1,000",
        "$5,000",
        "$10,000"
      ],
      "correctAnswer": "$2,000",
      "explanation": "Required Margin = $100,000 / 50 = $2,000."
    },
    {
      "id": "blitz_risk_06",
      "category": "RISK_POSITION",
      "difficulty": "expert",
      "instrument": "Leverage & Margin",
      "questionText": "Opening 1.0 standard lot ($100,000 notional) at 1:100 leverage requires how much margin?",
      "options": [
        "$1,000",
        "$2,000",
        "$500",
        "$100"
      ],
      "correctAnswer": "$1,000",
      "explanation": "$100,000 / 100 = $1,000."
    },
    {
      "id": "blitz_match_01",
      "category": "MATCH",
      "difficulty": "beginner",
      "questionText": "Which of the following represents the largest pip movement?",
      "options": [
        "EUR/USD moving 40 pips",
        "EUR/USD moving 0.0030",
        "USD/JPY moving 25 pips",
        "GBP/USD moving 150 pipettes (15 pips)"
      ],
      "correctAnswer": "EUR/USD moving 40 pips",
      "explanation": "40 pips > 30 pips (0.0030) > 25 pips > 15 pips (150 pipettes)."
    },
    {
      "id": "blitz_match_02",
      "category": "MATCH",
      "difficulty": "intermediate",
      "questionText": "What is 150 pipettes equal to in standard pips?",
      "options": [
        "15 Pips",
        "1.5 Pips",
        "150 Pips",
        "0.15 Pips"
      ],
      "correctAnswer": "15 Pips",
      "explanation": "10 pipettes (points) = 1 standard pip. 150 / 10 = 15 pips."
    },
    {
      "id": "blitz_mix_01",
      "category": "MIXED",
      "difficulty": "intermediate",
      "instrument": "EUR/USD",
      "startPrice": 1.085,
      "endPrice": 1.0815,
      "questionText": "EUR/USD falls from 1.0850 to 1.0815. What is the pip decline and vector?",
      "options": [
        "35 Pips Bearish",
        "35 Pips Bullish",
        "3.5 Pips Bearish",
        "350 Pips Bearish"
      ],
      "correctAnswer": "35 Pips Bearish",
      "explanation": "1.0850 - 1.0815 = 0.0035 = 35 pips downward (bearish)."
    },
    {
      "id": "blitz_mix_02",
      "category": "MIXED",
      "difficulty": "advanced",
      "instrument": "USD/JPY",
      "startPrice": 150.8,
      "endPrice": 151.25,
      "questionText": "USD/JPY rises from 150.80 to 151.25. What is the pip gain and vector?",
      "options": [
        "45 Pips Bullish",
        "45 Pips Bearish",
        "4.5 Pips Bullish",
        "450 Pips Bullish"
      ],
      "correctAnswer": "45 Pips Bullish",
      "explanation": "151.25 - 150.80 = 0.45 = 45 pips upward (bullish)."
    },
    {
      "id": "blitz_mix_03",
      "category": "MIXED",
      "difficulty": "advanced",
      "instrument": "GBP/JPY",
      "startPrice": 190.2,
      "endPrice": 189.4,
      "questionText": "GBP/JPY plummets from 190.20 to 189.40. What is the pip decline and vector?",
      "options": [
        "80 Pips Bearish",
        "80 Pips Bullish",
        "8 Pips Bearish",
        "800 Pips Bearish"
      ],
      "correctAnswer": "80 Pips Bearish",
      "explanation": "190.20 - 189.40 = 0.80 = 80 pips downward."
    },
    {
      "id": "blitz_mix_04",
      "category": "MIXED",
      "difficulty": "expert",
      "instrument": "EUR/GBP",
      "startPrice": 0.855,
      "endPrice": 0.8585,
      "questionText": "EUR/GBP rises from 0.8550 to 0.8585. What is the pip expansion and vector?",
      "options": [
        "35 Pips Bullish",
        "35 Pips Bearish",
        "3.5 Pips Bullish",
        "350 Pips Bullish"
      ],
      "correctAnswer": "35 Pips Bullish",
      "explanation": "0.8585 - 0.8550 = 0.0035 = 35 pips bullish."
    },
    {
      "id": "blitz_meas_06",
      "category": "MEASURE",
      "difficulty": "intermediate",
      "instrument": "EUR/AUD",
      "startPrice": 1.642,
      "endPrice": 1.6495,
      "questionText": "EUR/AUD climbs from 1.6420 to 1.6495. What is the pip difference?",
      "options": [
        "75 Pips",
        "7.5 Pips",
        "750 Pips",
        "0.75 Pips"
      ],
      "correctAnswer": "75 Pips",
      "explanation": "1.6495 - 1.6420 = 0.0075 = 75 pips."
    },
    {
      "id": "blitz_meas_07",
      "category": "MEASURE",
      "difficulty": "intermediate",
      "instrument": "GBP/CAD",
      "startPrice": 1.71,
      "endPrice": 1.703,
      "questionText": "GBP/CAD falls from 1.7100 to 1.7030. What is the pip loss?",
      "options": [
        "70 Pips",
        "7 Pips",
        "700 Pips",
        "0.7 Pips"
      ],
      "correctAnswer": "70 Pips",
      "explanation": "1.7100 - 1.7030 = 0.0070 = 70 pips."
    },
    {
      "id": "blitz_jpy_06",
      "category": "JPY",
      "difficulty": "advanced",
      "instrument": "AUD/JPY",
      "startPrice": 98.4,
      "endPrice": 97.9,
      "questionText": "AUD/JPY falls from 98.40 to 97.90. How many pips is this drop?",
      "options": [
        "50 Pips",
        "5 Pips",
        "500 Pips",
        "0.5 Pips"
      ],
      "correctAnswer": "50 Pips",
      "explanation": "98.40 - 97.90 = 0.50 = 50 pips."
    },
    {
      "id": "blitz_jpy_07",
      "category": "JPY",
      "difficulty": "expert",
      "instrument": "CHF/JPY",
      "startPrice": 168.1,
      "endPrice": 169.25,
      "questionText": "CHF/JPY advances from 168.10 to 169.25. What is the pip increase?",
      "options": [
        "115 Pips",
        "11.5 Pips",
        "1,150 Pips",
        "1.15 Pips"
      ],
      "correctAnswer": "115 Pips",
      "explanation": "169.25 - 168.10 = 1.15 = 115 pips."
    },
    {
      "id": "blitz_frac_05",
      "category": "PIPETTE",
      "difficulty": "advanced",
      "instrument": "NZD/USD",
      "startPrice": 0.612,
      "endPrice": 0.61214,
      "questionText": "NZD/USD shifts from 0.61200 to 0.61214. How many fractional points/pipettes is this?",
      "options": [
        "1.4 Pips (14 Points)",
        "14 Pips",
        "0.14 Pips",
        "140 Points"
      ],
      "correctAnswer": "1.4 Pips (14 Points)",
      "explanation": "0.61214 - 0.61200 = 0.00014 = 1.4 pips (14 fractional points)."
    },
    {
      "id": "blitz_risk_07",
      "category": "RISK_POSITION",
      "difficulty": "advanced",
      "instrument": "Position Sizing",
      "questionText": "With a $25,000 account and a 1% risk limit ($250), what lot size should you use for a 50-pip stop loss on EUR/USD ($10/pip)?",
      "options": [
        "0.50 Lots",
        "1.00 Lot",
        "0.25 Lots",
        "2.50 Lots"
      ],
      "correctAnswer": "0.50 Lots",
      "explanation": "$250 / (50 pips * $10) = $250 / $500 = 0.50 lots."
    },
    {
      "id": "blitz_risk_08",
      "category": "RISK_POSITION",
      "difficulty": "expert",
      "instrument": "Account Margin",
      "questionText": "If your account equity is $5,000 and used margin is $1,500, what is your free margin and margin utilization?",
      "options": [
        "$3,500 (30% Utilization)",
        "$3,500 (70% Utilization)",
        "$6,500 (30% Utilization)",
        "$1,500 (50% Utilization)"
      ],
      "correctAnswer": "$3,500 (30% Utilization)",
      "explanation": "Free margin = $5,000 - $1,500 = $3,500. Margin utilization = $1,500 / $5,000 = 30%."
    },
    {
      "id": "blitz_speed_04",
      "category": "SPEED",
      "difficulty": "beginner",
      "instrument": "USD/CAD",
      "startPrice": 1.36,
      "endPrice": 1.364,
      "questionText": "Fast calculation: USD/CAD moves from 1.3600 to 1.3640. How many pips?",
      "options": [
        "40 Pips",
        "4 Pips",
        "400 Pips",
        "0.4 Pips"
      ],
      "correctAnswer": "40 Pips",
      "explanation": "1.3640 - 1.3600 = 0.0040 = 40 pips."
    },
    {
      "id": "blitz_meas_08",
      "category": "MEASURE",
      "difficulty": "beginner",
      "instrument": "EUR/USD",
      "startPrice": 1.078,
      "endPrice": 1.084,
      "questionText": "EUR/USD moves from 1.0780 to 1.0840. What is the pip distance?",
      "options": [
        "60 Pips",
        "6 Pips",
        "600 Pips",
        "0.6 Pips"
      ],
      "correctAnswer": "60 Pips",
      "explanation": "1.0840 - 1.0780 = 0.0060 = 60 pips."
    },
    {
      "id": "blitz_meas_09",
      "category": "MEASURE",
      "difficulty": "intermediate",
      "instrument": "GBP/USD",
      "startPrice": 1.252,
      "endPrice": 1.2635,
      "questionText": "GBP/USD climbs from 1.2520 to 1.2635. How many pips did it expand?",
      "options": [
        "115 Pips",
        "11.5 Pips",
        "1,150 Pips",
        "1.15 Pips"
      ],
      "correctAnswer": "115 Pips",
      "explanation": "1.2635 - 1.2520 = 0.0115 = 115 pips."
    },
    {
      "id": "blitz_dir_05",
      "category": "DIRECTION",
      "difficulty": "beginner",
      "instrument": "USD/JPY",
      "startPrice": 151.5,
      "endPrice": 150.8,
      "questionText": "USD/JPY drops from 151.50 to 150.80 (-70 pips). What market vector is this?",
      "options": [
        "BEARISH (DOWN)",
        "BULLISH (UP)",
        "NEUTRAL",
        "RANGE"
      ],
      "correctAnswer": "BEARISH (DOWN)",
      "explanation": "Price moved down 70 pips (bearish vector)."
    },
    {
      "id": "blitz_dir_06",
      "category": "DIRECTION",
      "difficulty": "beginner",
      "instrument": "AUD/USD",
      "startPrice": 0.645,
      "endPrice": 0.652,
      "questionText": "AUD/USD moves from 0.6450 to 0.6520 (+70 pips). What vector is this?",
      "options": [
        "BULLISH (UP)",
        "BEARISH (DOWN)",
        "CONSOLIDATION",
        "FALSE BREAK"
      ],
      "correctAnswer": "BULLISH (UP)",
      "explanation": "Price advanced 70 pips (bullish vector)."
    },
    {
      "id": "blitz_jpy_08",
      "category": "JPY",
      "difficulty": "intermediate",
      "instrument": "USD/JPY",
      "startPrice": 149.8,
      "endPrice": 150.6,
      "questionText": "USD/JPY rallies from 149.80 to 150.60. How many JPY pips is this?",
      "options": [
        "80 Pips",
        "8 Pips",
        "800 Pips",
        "0.8 Pips"
      ],
      "correctAnswer": "80 Pips",
      "explanation": "150.60 - 149.80 = 0.80 = 80 pips."
    },
    {
      "id": "blitz_jpy_09",
      "category": "JPY",
      "difficulty": "advanced",
      "instrument": "EUR/JPY",
      "startPrice": 163.5,
      "endPrice": 162.4,
      "questionText": "EUR/JPY plummets from 163.50 to 162.40. What is the pip drop?",
      "options": [
        "110 Pips",
        "11 Pips",
        "1,100 Pips",
        "1.1 Pips"
      ],
      "correctAnswer": "110 Pips",
      "explanation": "163.50 - 162.40 = 1.10 = 110 pips."
    },
    {
      "id": "blitz_frac_06",
      "category": "PIPETTE",
      "difficulty": "intermediate",
      "instrument": "EUR/USD",
      "startPrice": 1.082,
      "endPrice": 1.08225,
      "questionText": "EUR/USD shifts from 1.08200 to 1.08225. How many pipettes/points is this?",
      "options": [
        "2.5 Pips (25 Pipettes)",
        "25 Pips",
        "250 Pipettes",
        "0.25 Pips"
      ],
      "correctAnswer": "2.5 Pips (25 Pipettes)",
      "explanation": "0.00025 = 2.5 pips = 25 pipettes."
    },
    {
      "id": "blitz_risk_07",
      "category": "RISK_POSITION",
      "difficulty": "advanced",
      "instrument": "Lot Sizing",
      "questionText": "Account: $20,000 | 1% Risk ($200) | Stop: 25 Pips ($10/pip). What is the recommended lot size?",
      "options": [
        "0.80 Lots",
        "0.40 Lots",
        "1.60 Lots",
        "1.00 Lot"
      ],
      "correctAnswer": "0.80 Lots",
      "explanation": "$200 / (25 * $10) = $200 / $250 = 0.80 Lots."
    },
    {
      "id": "blitz_risk_08",
      "category": "RISK_POSITION",
      "difficulty": "advanced",
      "instrument": "Lot Sizing",
      "questionText": "Account: $50,000 | 1% Risk ($500) | Stop: 50 Pips ($10/pip). What is the lot size?",
      "options": [
        "1.00 Lot",
        "2.00 Lots",
        "0.50 Lots",
        "5.00 Lots"
      ],
      "correctAnswer": "1.00 Lot",
      "explanation": "$500 / (50 * $10) = $500 / $500 = 1.00 Lot."
    },
    {
      "id": "blitz_inst_04",
      "category": "INSTRUMENT",
      "difficulty": "intermediate",
      "instrument": "XAU/USD (Gold)",
      "startPrice": 2035,
      "endPrice": 2042.5,
      "questionText": "Gold (XAU/USD) advances from $2035.00 to $2042.50. What is the move in dollars and pips?",
      "options": [
        "$7.50 Move (75 Pips)",
        "$75.00 Move",
        "$0.75 Move",
        "$750 Move"
      ],
      "correctAnswer": "$7.50 Move (75 Pips)",
      "explanation": "$7.50 / $0.10 per pip = 75 pips."
    },
    {
      "id": "blitz_inst_05",
      "category": "INSTRUMENT",
      "difficulty": "intermediate",
      "instrument": "US30",
      "startPrice": 38800,
      "endPrice": 38920,
      "questionText": "US30 Index rallies from 38,800 to 38,920. How many index points did it gain?",
      "options": [
        "120 Points",
        "12 Points",
        "1,200 Points",
        "1.2 Points"
      ],
      "correctAnswer": "120 Points",
      "explanation": "38,920 - 38,800 = 120 index points."
    },
    {
      "id": "blitz_match_03",
      "category": "MATCH",
      "difficulty": "intermediate",
      "questionText": "Which statement is TRUE regarding position sizing and stop loss distance?",
      "options": [
        "Wider stop loss distances require smaller lot sizes to maintain fixed dollar risk",
        "Wider stop loss distances require larger lot sizes",
        "Stop loss distance has no effect on lot size",
        "Lot size is always fixed at 1.0 lot"
      ],
      "correctAnswer": "Wider stop loss distances require smaller lot sizes to maintain fixed dollar risk",
      "explanation": "Because Risk ($) = Lots * Stop * $10, increasing stop distance requires decreasing lot size."
    }
  ]
};
    const ACADEMY_CONFIG = {
  "version": "1.0.0",
  "questions": [
    {
      "id": "acad_q01",
      "category": "FUNDAMENTALS",
      "difficulty": "beginner",
      "pair": "EUR/USD",
      "startPrice": 1.082,
      "endPrice": 1.0855,
      "questionText": "EUR/USD moves from 1.0820 to 1.0855. What is the total price distance in pips?",
      "options": [
        "35 Pips",
        "3.5 Pips",
        "350 Pips",
        "0.35 Pips"
      ],
      "correctAnswer": "35 Pips",
      "explanation": "1.0855 - 1.0820 = 0.0035. On standard 4-decimal currency pairs, 0.0001 = 1 pip. Therefore, 0.0035 = 35 pips."
    },
    {
      "id": "acad_q02",
      "category": "FUNDAMENTALS",
      "difficulty": "beginner",
      "pair": "GBP/USD",
      "startPrice": 1.261,
      "endPrice": 1.268,
      "questionText": "GBP/USD climbs from 1.2610 to 1.2680. How many pips did price advance?",
      "options": [
        "70 Pips",
        "7 Pips",
        "700 Pips",
        "0.7 Pips"
      ],
      "correctAnswer": "70 Pips",
      "explanation": "1.2680 - 1.2610 = 0.0070 = 70 pips of bullish expansion."
    },
    {
      "id": "acad_q03",
      "category": "DIRECTION",
      "difficulty": "beginner",
      "pair": "AUD/USD",
      "startPrice": 0.654,
      "endPrice": 0.6515,
      "questionText": "AUD/USD drops from 0.6540 to 0.6515. What is the pip change and market direction?",
      "options": [
        "25 Pips Bearish",
        "25 Pips Bullish",
        "2.5 Pips Bearish",
        "250 Pips Bearish"
      ],
      "correctAnswer": "25 Pips Bearish",
      "explanation": "0.6540 - 0.6515 = 0.0025 = 25 pips downward (bearish) movement."
    },
    {
      "id": "acad_q04",
      "category": "ROUND_NUMBERS",
      "difficulty": "intermediate",
      "pair": "EUR/USD",
      "startPrice": 1.099,
      "endPrice": 1.1015,
      "questionText": "EUR/USD crosses the 1.1000 major psychological level from 1.0990 to 1.1015. What is the pip distance?",
      "options": [
        "25 Pips",
        "15 Pips",
        "125 Pips",
        "2.5 Pips"
      ],
      "correctAnswer": "25 Pips",
      "explanation": "From 1.0990 to 1.1000 is 10 pips; from 1.1000 to 1.1015 is 15 pips. Total = 25 pips (1.1015 - 1.0990 = 0.0025)."
    },
    {
      "id": "acad_q05",
      "category": "MEASURE",
      "difficulty": "beginner",
      "pair": "USD/CAD",
      "startPrice": 1.352,
      "endPrice": 1.3565,
      "questionText": "USD/CAD advances from 1.3520 to 1.3565. How many pips did it gain?",
      "options": [
        "45 Pips",
        "4.5 Pips",
        "450 Pips",
        "0.45 Pips"
      ],
      "correctAnswer": "45 Pips",
      "explanation": "1.3565 - 1.3520 = 0.0045 = 45 pips."
    },
    {
      "id": "acad_q06",
      "category": "MEASURE",
      "difficulty": "intermediate",
      "pair": "NZD/USD",
      "startPrice": 0.608,
      "endPrice": 0.614,
      "questionText": "NZD/USD rallies from 0.6080 to 0.6140. What is the pip expansion?",
      "options": [
        "60 Pips",
        "6 Pips",
        "600 Pips",
        "0.6 Pips"
      ],
      "correctAnswer": "60 Pips",
      "explanation": "0.6140 - 0.6080 = 0.0060 = 60 pips."
    },
    {
      "id": "acad_q07",
      "category": "THEORY",
      "difficulty": "beginner",
      "questionText": "What does the 4th decimal place (0.0001) represent in standard forex notation (e.g., EUR/USD)?",
      "options": [
        "1 Standard Pip",
        "1 Pipette (Tenth of a Pip)",
        "10 Pips",
        "0.1 Pip"
      ],
      "correctAnswer": "1 Standard Pip",
      "explanation": "On all standard 4-decimal currency pairs, the 4th decimal place represents 1 standard pip (Price Interest Point)."
    },
    {
      "id": "acad_q08",
      "category": "TRADE_MATH",
      "difficulty": "beginner",
      "pair": "EUR/USD",
      "questionText": "A trader opens a BUY order on EUR/USD at 1.0840 and closes at 1.0895. What is the profit in pips?",
      "options": [
        "+55 Pips",
        "+5.5 Pips",
        "+550 Pips",
        "-55 Pips"
      ],
      "correctAnswer": "+55 Pips",
      "explanation": "Exit Price (1.0895) - Entry Price (1.0840) = +0.0055 = +55 pips."
    },
    {
      "id": "acad_q09",
      "category": "TRADE_MATH",
      "difficulty": "beginner",
      "pair": "GBP/USD",
      "questionText": "A trader opens a SHORT (Sell) order on GBP/USD at 1.2720 and covers at 1.2660. What is the pip gain?",
      "options": [
        "+60 Pips",
        "-60 Pips",
        "+6.0 Pips",
        "+600 Pips"
      ],
      "correctAnswer": "+60 Pips",
      "explanation": "For short positions: Entry (1.2720) - Exit (1.2660) = +0.0060 = +60 pips in profit."
    },
    {
      "id": "acad_q10",
      "category": "COMPARISON",
      "difficulty": "intermediate",
      "questionText": "Which price fluctuation represents the larger pip movement?\nMove A: EUR/USD from 1.0800 to 1.0845\nMove B: GBP/USD from 1.2500 to 1.2535",
      "options": [
        "Move A (45 Pips vs 35 Pips)",
        "Move B (35 Pips vs 45 Pips)",
        "Both are identical",
        "Move B is twice as large"
      ],
      "correctAnswer": "Move A (45 Pips vs 35 Pips)",
      "explanation": "Move A is 1.0845 - 1.0800 = 45 pips. Move B is 1.2535 - 1.2500 = 35 pips. Move A is 10 pips larger."
    },
    {
      "id": "acad_q11",
      "category": "SPREAD",
      "difficulty": "intermediate",
      "pair": "EUR/USD",
      "questionText": "EUR/USD is quoted as Bid = 1.08500 and Ask = 1.08515. What is the broker spread in pips?",
      "options": [
        "1.5 Pips (15 Pipettes)",
        "15 Pips",
        "0.15 Pips",
        "150 Pips"
      ],
      "correctAnswer": "1.5 Pips (15 Pipettes)",
      "explanation": "Spread = Ask (1.08515) - Bid (1.08500) = 0.00015 = 1.5 pips (15 fractional pipettes)."
    },
    {
      "id": "acad_q12",
      "category": "DIRECTION",
      "difficulty": "beginner",
      "pair": "GBP/USD",
      "startPrice": 1.28,
      "endPrice": 1.271,
      "questionText": "GBP/USD drops from 1.2800 to 1.2710. What is the directional change?",
      "options": [
        "90 Pips Bearish (-90 Pips)",
        "90 Pips Bullish (+90 Pips)",
        "9 Pips Bearish",
        "900 Pips Bearish"
      ],
      "correctAnswer": "90 Pips Bearish (-90 Pips)",
      "explanation": "1.2800 - 1.2710 = 0.0090 = 90 pips downward movement."
    },
    {
      "id": "acad_q13",
      "category": "THEORY",
      "difficulty": "beginner",
      "questionText": "What does the acronym 'PIP' stand for in financial markets?",
      "options": [
        "Price Interest Point (or Percentage in Point)",
        "Profit In Price",
        "Point Index Position",
        "Portfolio Interest Percentage"
      ],
      "correctAnswer": "Price Interest Point (or Percentage in Point)",
      "explanation": "Pip stands for Price Interest Point (or Percentage in Point), the standardized unit of measurement for forex price changes."
    },
    {
      "id": "acad_q14",
      "category": "MEASURE",
      "difficulty": "beginner",
      "pair": "EUR/USD",
      "startPrice": 1.075,
      "endPrice": 1.083,
      "questionText": "EUR/USD advances from 1.0750 to 1.0830. What is the pip increase?",
      "options": [
        "80 Pips",
        "8 Pips",
        "800 Pips",
        "0.8 Pips"
      ],
      "correctAnswer": "80 Pips",
      "explanation": "1.0830 - 1.0750 = 0.0080 = 80 pips."
    },
    {
      "id": "acad_q15",
      "category": "MEASURE",
      "difficulty": "beginner",
      "pair": "USD/CHF",
      "startPrice": 0.885,
      "endPrice": 0.879,
      "questionText": "USD/CHF falls from 0.8850 to 0.8790. What is the pip decline?",
      "options": [
        "60 Pips",
        "6 Pips",
        "600 Pips",
        "0.6 Pips"
      ],
      "correctAnswer": "60 Pips",
      "explanation": "0.8850 - 0.8790 = 0.0060 = 60 pips."
    },
    {
      "id": "acad_q16",
      "category": "MEASURE",
      "difficulty": "intermediate",
      "pair": "AUD/USD",
      "startPrice": 0.648,
      "endPrice": 0.6555,
      "questionText": "AUD/USD rallies from 0.6480 to 0.6555. How many pips did it expand?",
      "options": [
        "75 Pips",
        "7.5 Pips",
        "750 Pips",
        "0.75 Pips"
      ],
      "correctAnswer": "75 Pips",
      "explanation": "0.6555 - 0.6480 = 0.0075 = 75 pips."
    },
    {
      "id": "acad_q17",
      "category": "DECIMAL_MATH",
      "difficulty": "beginner",
      "questionText": "If EUR/USD price moves from 1.1200 to 1.1201, exactly how many pips is this?",
      "options": [
        "1.0 Pip",
        "0.1 Pip",
        "10 Pips",
        "0.01 Pip"
      ],
      "correctAnswer": "1.0 Pip",
      "explanation": "A change of 0.0001 in the 4th decimal place equals exactly 1.0 pip."
    },
    {
      "id": "acad_q18",
      "category": "DECIMAL_MATH",
      "difficulty": "beginner",
      "questionText": "If EUR/USD price moves from 1.1200 to 1.1210, exactly how many pips is this?",
      "options": [
        "10.0 Pips",
        "1.0 Pip",
        "100 Pips",
        "0.1 Pip"
      ],
      "correctAnswer": "10.0 Pips",
      "explanation": "0.0010 = 10 pips."
    },
    {
      "id": "acad_q19",
      "category": "DECIMAL_MATH",
      "difficulty": "beginner",
      "questionText": "If EUR/USD price moves from 1.1200 to 1.1300, exactly how many pips is this?",
      "options": [
        "100.0 Pips",
        "10.0 Pips",
        "1,000 Pips",
        "1.0 Pip"
      ],
      "correctAnswer": "100.0 Pips",
      "explanation": "0.0100 in 4-decimal currency pairs equals exactly 100.0 pips."
    },
    {
      "id": "acad_q20",
      "category": "MEASURE",
      "difficulty": "intermediate",
      "pair": "EUR/GBP",
      "startPrice": 0.852,
      "endPrice": 0.8565,
      "questionText": "EUR/GBP climbs from 0.8520 to 0.8565. What is the pip gain?",
      "options": [
        "45 Pips",
        "4.5 Pips",
        "450 Pips",
        "0.45 Pips"
      ],
      "correctAnswer": "45 Pips",
      "explanation": "0.8565 - 0.8520 = 0.0045 = 45 pips."
    },
    {
      "id": "acad_q21",
      "category": "THEORY",
      "difficulty": "beginner",
      "questionText": "Which of the following currency pairs does NOT use the 4th decimal place as 1 standard pip?",
      "options": [
        "USD/JPY (2nd Decimal Place)",
        "EUR/USD",
        "GBP/USD",
        "AUD/USD"
      ],
      "correctAnswer": "USD/JPY (2nd Decimal Place)",
      "explanation": "Japanese Yen (JPY) pairs quote to 2 decimal places, where 0.01 = 1 standard pip."
    },
    {
      "id": "acad_q22",
      "category": "TARGET_CALC",
      "difficulty": "beginner",
      "pair": "EUR/USD",
      "questionText": "You enter a BUY on EUR/USD at 1.0850 with a 30-pip Take Profit target. What is your exit price?",
      "options": [
        "1.0880",
        "1.0820",
        "1.0853",
        "1.0950"
      ],
      "correctAnswer": "1.0880",
      "explanation": "1.0850 + 0.0030 (+30 pips) = 1.0880."
    },
    {
      "id": "acad_q23",
      "category": "STOP_CALC",
      "difficulty": "beginner",
      "pair": "GBP/USD",
      "questionText": "You enter a SELL (Short) on GBP/USD at 1.2650 with a 25-pip Stop Loss. What is your stop price?",
      "options": [
        "1.2675",
        "1.2625",
        "1.2652",
        "1.2700"
      ],
      "correctAnswer": "1.2675",
      "explanation": "For short positions, stop loss is set above entry: 1.2650 + 0.0025 (+25 pips) = 1.2675."
    },
    {
      "id": "acad_q24",
      "category": "MEASURE",
      "difficulty": "beginner",
      "pair": "EUR/USD",
      "startPrice": 1.05,
      "endPrice": 1.07,
      "questionText": "A major multi-week rally lifts EUR/USD from 1.0500 to 1.0700. How many pips is this trend?",
      "options": [
        "200 Pips",
        "20 Pips",
        "2,000 Pips",
        "2 Pips"
      ],
      "correctAnswer": "200 Pips",
      "explanation": "1.0700 - 1.0500 = 0.0200 = 200 standard pips."
    },
    {
      "id": "acad_q25",
      "category": "MEASURE",
      "difficulty": "beginner",
      "pair": "GBP/USD",
      "startPrice": 1.3,
      "endPrice": 1.294,
      "questionText": "GBP/USD drops from 1.3000 to 1.2940. What is the total pip drop?",
      "options": [
        "60 Pips",
        "6 Pips",
        "600 Pips",
        "0.6 Pips"
      ],
      "correctAnswer": "60 Pips",
      "explanation": "1.3000 - 1.2940 = 0.0060 = 60 pips."
    },
    {
      "id": "acad_q26",
      "category": "COMPARISON",
      "difficulty": "intermediate",
      "questionText": "If EUR/USD moves from 1.0800 to 1.0890 and USD/CAD moves from 1.3500 to 1.3570, which pair had greater pip distance?",
      "options": [
        "EUR/USD (90 Pips vs 70 Pips)",
        "USD/CAD (70 Pips vs 90 Pips)",
        "They are equal",
        "USD/CAD is 2x larger"
      ],
      "correctAnswer": "EUR/USD (90 Pips vs 70 Pips)",
      "explanation": "EUR/USD moved 90 pips (1.0890 - 1.0800); USD/CAD moved 70 pips (1.3570 - 1.3500)."
    }
  ]
};
    const PRECISION_CONFIG = {
  "version": "1.0.0",
  "questions": [
    {
      "id": "prec_jpy_01",
      "category": "JPY",
      "difficulty": "intermediate",
      "pair": "USD/JPY",
      "startPrice": 150.2,
      "endPrice": 150.75,
      "questionText": "USD/JPY moves from 150.20 to 150.75. On Japanese Yen pairs, how many pips is this?",
      "options": [
        "55 Pips",
        "5.5 Pips",
        "550 Pips",
        "0.55 Pips"
      ],
      "correctAnswer": "55 Pips",
      "explanation": "On JPY pairs, 1 pip is the 2nd decimal place (0.01). 150.75 - 150.20 = 0.55 = 55 pips."
    },
    {
      "id": "prec_jpy_02",
      "category": "JPY",
      "difficulty": "intermediate",
      "pair": "GBP/JPY",
      "startPrice": 189.5,
      "endPrice": 188.9,
      "questionText": "GBP/JPY drops from 189.50 to 188.90. What is the pip decline?",
      "options": [
        "60 Pips",
        "6 Pips",
        "600 Pips",
        "0.6 Pips"
      ],
      "correctAnswer": "60 Pips",
      "explanation": "189.50 - 188.90 = 0.60 = 60 pips down on JPY quotation."
    },
    {
      "id": "prec_jpy_03",
      "category": "JPY",
      "difficulty": "intermediate",
      "pair": "EUR/JPY",
      "startPrice": 162.1,
      "endPrice": 162.95,
      "questionText": "EUR/JPY advances from 162.10 to 162.95. What is the pip gain?",
      "options": [
        "85 Pips",
        "8.5 Pips",
        "850 Pips",
        "0.85 Pips"
      ],
      "correctAnswer": "85 Pips",
      "explanation": "162.95 - 162.10 = 0.85 = 85 pips."
    },
    {
      "id": "prec_jpy_04",
      "category": "JPY",
      "difficulty": "intermediate",
      "pair": "CAD/JPY",
      "startPrice": 111.4,
      "endPrice": 110.65,
      "questionText": "CAD/JPY moves from 111.40 to 110.65. How many pips was the drop?",
      "options": [
        "75 Pips",
        "7.5 Pips",
        "750 Pips",
        "0.75 Pips"
      ],
      "correctAnswer": "75 Pips",
      "explanation": "111.40 - 110.65 = 0.75 = 75 pips."
    },
    {
      "id": "prec_jpy_05",
      "category": "JPY",
      "difficulty": "intermediate",
      "pair": "AUD/JPY",
      "startPrice": 98.2,
      "endPrice": 98.9,
      "questionText": "AUD/JPY advances from 98.20 to 98.90. How many pips did it gain?",
      "options": [
        "70 Pips",
        "7 Pips",
        "700 Pips",
        "0.7 Pips"
      ],
      "correctAnswer": "70 Pips",
      "explanation": "98.90 - 98.20 = 0.70 = 70 pips."
    },
    {
      "id": "prec_jpy_06",
      "category": "JPY",
      "difficulty": "advanced",
      "pair": "CHF/JPY",
      "startPrice": 168.1,
      "endPrice": 169.3,
      "questionText": "CHF/JPY surges from 168.10 to 169.30. What is the total pip gain?",
      "options": [
        "120 Pips",
        "12 Pips",
        "1,200 Pips",
        "1.2 Pips"
      ],
      "correctAnswer": "120 Pips",
      "explanation": "169.30 - 168.10 = 1.20 = 120 pips."
    },
    {
      "id": "prec_jpy_07",
      "category": "JPY_THEORY",
      "difficulty": "beginner",
      "questionText": "Why do Japanese Yen (JPY) currency pairs use the 2nd decimal place for 1 pip instead of the 4th?",
      "options": [
        "Because 1 Yen has roughly equivalent purchasing power to 1 Cent of USD/EUR",
        "Because Japanese exchanges use base-12 math",
        "Because Yen has no decimal coinage",
        "Because of international regulatory caps"
      ],
      "correctAnswer": "Because 1 Yen has roughly equivalent purchasing power to 1 Cent of USD/EUR",
      "explanation": "Since 1 USD is ~150 JPY, 1 Yen is roughly 1 cent. The 2nd decimal place (0.01 JPY) represents 1 pip."
    },
    {
      "id": "prec_jpy_08",
      "category": "JPY",
      "difficulty": "beginner",
      "pair": "USD/JPY",
      "questionText": "If USD/JPY moves from 151.00 to 151.01, exactly how many pips is this?",
      "options": [
        "1.0 Pip",
        "0.1 Pip",
        "10 Pips",
        "0.01 Pip"
      ],
      "correctAnswer": "1.0 Pip",
      "explanation": "On JPY pairs, 0.01 = 1.0 pip."
    },
    {
      "id": "prec_jpy_09",
      "category": "JPY",
      "difficulty": "beginner",
      "pair": "USD/JPY",
      "questionText": "If USD/JPY moves from 150.50 to 151.50, exactly how many pips is this?",
      "options": [
        "100 Pips",
        "10 Pips",
        "1,000 Pips",
        "1.0 Pip"
      ],
      "correctAnswer": "100 Pips",
      "explanation": "151.50 - 150.50 = 1.00 = 100 pips."
    },
    {
      "id": "prec_jpy_10",
      "category": "JPY",
      "difficulty": "intermediate",
      "pair": "GBP/JPY",
      "questionText": "GBP/JPY falls from 191.00 to 189.80. What is the pip decline?",
      "options": [
        "120 Pips",
        "12 Pips",
        "1,200 Pips",
        "1.2 Pips"
      ],
      "correctAnswer": "120 Pips",
      "explanation": "191.00 - 189.80 = 1.20 = 120 pips."
    },
    {
      "id": "prec_pip_01",
      "category": "PIPETTE",
      "difficulty": "intermediate",
      "pair": "EUR/USD",
      "startPrice": 1.085,
      "endPrice": 1.08508,
      "questionText": "EUR/USD shifts from 1.08500 to 1.08508. How many fractional points/pipettes is this?",
      "options": [
        "0.8 Pips (8 Pipettes/Points)",
        "8 Pips",
        "80 Pips",
        "0.08 Pips"
      ],
      "correctAnswer": "0.8 Pips (8 Pipettes/Points)",
      "explanation": "The 5th decimal place (0.00008) equals 8 fractional pipettes or 0.8 standard pips (10 pipettes = 1 pip)."
    },
    {
      "id": "prec_pip_02",
      "category": "PIPETTE",
      "difficulty": "intermediate",
      "pair": "GBP/USD",
      "startPrice": 1.263,
      "endPrice": 1.26315,
      "questionText": "GBP/USD moves from 1.26300 to 1.26315. What is the fractional distance?",
      "options": [
        "1.5 Pips (15 Pipettes)",
        "15 Pips",
        "150 Pips",
        "0.15 Pips"
      ],
      "correctAnswer": "1.5 Pips (15 Pipettes)",
      "explanation": "1.26315 - 1.26300 = 0.00015 = 1.5 pips = 15 pipettes."
    },
    {
      "id": "prec_pip_03",
      "category": "PIPETTE",
      "difficulty": "intermediate",
      "pair": "USD/JPY",
      "startPrice": 150.25,
      "endPrice": 150.274,
      "questionText": "USD/JPY quotes to 3 decimal places from 150.250 to 150.274. How many pips is this?",
      "options": [
        "2.4 Pips (24 Pipettes)",
        "24 Pips",
        "240 Pips",
        "0.24 Pips"
      ],
      "correctAnswer": "2.4 Pips (24 Pipettes)",
      "explanation": "150.274 - 150.250 = 0.024 = 2.4 pips (24 JPY pipettes)."
    },
    {
      "id": "prec_pip_04",
      "category": "PIPETTE_THEORY",
      "difficulty": "beginner",
      "questionText": "What is a 'Pipette' (or fractional point)?",
      "options": [
        "One-tenth of a standard pip (0.1 Pip / 5th decimal place)",
        "Ten standard pips",
        "One hundredth of a pip",
        "A trading fee charged by brokers"
      ],
      "correctAnswer": "One-tenth of a standard pip (0.1 Pip / 5th decimal place)",
      "explanation": "A pipette is one-tenth (1/10) of a pip, allowing brokers to quote narrower spreads."
    },
    {
      "id": "prec_pip_05",
      "category": "PIPETTE_CONVERSION",
      "difficulty": "beginner",
      "questionText": "How many standard pips is 75 fractional pipettes?",
      "options": [
        "7.5 Pips",
        "75 Pips",
        "0.75 Pips",
        "750 Pips"
      ],
      "correctAnswer": "7.5 Pips",
      "explanation": "75 pipettes / 10 = 7.5 standard pips."
    },
    {
      "id": "prec_pip_06",
      "category": "PIPETTE_READING",
      "difficulty": "beginner",
      "questionText": "EUR/USD price is displayed as 1.08453. What is the digit '3' at the end?",
      "options": [
        "The fractional pipette (0.3 pips)",
        "The whole pip digit",
        "The lot volume",
        "The spread multiplier"
      ],
      "correctAnswer": "The fractional pipette (0.3 pips)",
      "explanation": "In 5-decimal pricing, the 4th digit (5) is whole pips and the 5th digit (3) is fractional pipettes (0.3 pips)."
    },
    {
      "id": "prec_pip_07",
      "category": "PIPETTE_CONVERSION",
      "difficulty": "beginner",
      "questionText": "AUD/USD moves 45 broker points (pipettes). How many standard pips is this?",
      "options": [
        "4.5 Pips",
        "45 Pips",
        "0.45 Pips",
        "450 Pips"
      ],
      "correctAnswer": "4.5 Pips",
      "explanation": "45 / 10 = 4.5 pips."
    },
    {
      "id": "prec_pip_08",
      "category": "PIPETTE",
      "difficulty": "intermediate",
      "pair": "USD/CAD",
      "startPrice": 1.35,
      "endPrice": 1.35062,
      "questionText": "USD/CAD advances from 1.35000 to 1.35062. What is the pip distance?",
      "options": [
        "6.2 Pips (62 Pipettes)",
        "62 Pips",
        "0.62 Pips",
        "620 Pips"
      ],
      "correctAnswer": "6.2 Pips (62 Pipettes)",
      "explanation": "1.35062 - 1.35000 = 0.00062 = 6.2 pips."
    },
    {
      "id": "prec_lad_01",
      "category": "PRICE_LADDER",
      "difficulty": "beginner",
      "pair": "EUR/USD",
      "questionText": "On the Price Ladder, Rung A is 1.0850 and Rung B is 1.0880. What is the distance between rungs?",
      "options": [
        "30 Pips",
        "3 Pips",
        "300 Pips",
        "0.3 Pips"
      ],
      "correctAnswer": "30 Pips",
      "explanation": "1.0880 - 1.0850 = 0.0030 = 30 pips."
    },
    {
      "id": "prec_lad_02",
      "category": "PRICE_LADDER",
      "difficulty": "beginner",
      "pair": "GBP/USD",
      "questionText": "On the Price Ladder, Rung A is 1.2600 and Rung B is 1.2540. What is the downward distance?",
      "options": [
        "60 Pips Down",
        "6 Pips Down",
        "600 Pips Down",
        "0.6 Pips Down"
      ],
      "correctAnswer": "60 Pips Down",
      "explanation": "1.2600 - 1.2540 = 0.0060 = 60 pips downward."
    },
    {
      "id": "prec_lad_03",
      "category": "PRICE_LADDER",
      "difficulty": "intermediate",
      "pair": "USD/JPY",
      "questionText": "On the Price Ladder, USD/JPY Rung A is 150.00 and Rung B is 150.50. What is the rung distance?",
      "options": [
        "50 JPY Pips",
        "5 Pips",
        "500 Pips",
        "0.5 Pips"
      ],
      "correctAnswer": "50 JPY Pips",
      "explanation": "150.50 - 150.00 = 0.50 = 50 pips."
    },
    {
      "id": "prec_lad_04",
      "category": "INSTRUMENT_GOLD",
      "difficulty": "intermediate",
      "pair": "XAU/USD (Gold)",
      "startPrice": 2040,
      "endPrice": 2045,
      "questionText": "Gold (XAU/USD) advances from $2040.00 to $2045.00. What is the dollar move and point equivalent?",
      "options": [
        "$5.00 Move (50 Pips / 500 Cents)",
        "$50.00 Move",
        "$0.50 Move",
        "$500.00 Move"
      ],
      "correctAnswer": "$5.00 Move (50 Pips / 500 Cents)",
      "explanation": "On Gold, $1.00 move = 10 pips ($0.10/pip). A $5.00 rise represents 50 pips (500 cents)."
    },
    {
      "id": "prec_lad_05",
      "category": "INSTRUMENT_GOLD",
      "difficulty": "intermediate",
      "pair": "XAU/USD (Gold)",
      "questionText": "On standard broker Gold (XAU/USD) contracts, 1 pip typically represents:",
      "options": [
        "$0.10 (10 Cents)",
        "$1.00",
        "$0.01 (1 Cent)",
        "$10.00"
      ],
      "correctAnswer": "$0.10 (10 Cents)",
      "explanation": "In standard Gold CFD pricing, 1 pip is $0.10 (10 cents), and 10 pips is $1.00."
    },
    {
      "id": "prec_lad_06",
      "category": "INSTRUMENT_INDEX",
      "difficulty": "intermediate",
      "pair": "US30 (Dow Jones)",
      "startPrice": 38900,
      "endPrice": 38950,
      "questionText": "US30 Index climbs from 38,900 to 38,950. How many index points did it gain?",
      "options": [
        "50 Points",
        "5 Points",
        "500 Points",
        "0.5 Points"
      ],
      "correctAnswer": "50 Points",
      "explanation": "Indices trade in integer points. 38,950 - 38,900 = 50 index points."
    },
    {
      "id": "prec_lad_07",
      "category": "INSTRUMENT_INDEX",
      "difficulty": "intermediate",
      "pair": "NAS100 (Nasdaq)",
      "startPrice": 17900,
      "endPrice": 17925,
      "questionText": "NAS100 Index rallies from 17,900 to 17,925. How many index points did it travel?",
      "options": [
        "25 Points",
        "2.5 Points",
        "250 Points",
        "0.25 Points"
      ],
      "correctAnswer": "25 Points",
      "explanation": "17,925 - 17,900 = 25 index points."
    },
    {
      "id": "prec_lad_08",
      "category": "INSTRUMENT_INDEX",
      "difficulty": "intermediate",
      "pair": "SPX500 (S&P 500)",
      "startPrice": 5000,
      "endPrice": 5015.5,
      "questionText": "SPX500 moves from 5000.0 to 5015.5. What is the point expansion?",
      "options": [
        "15.5 Points",
        "155 Points",
        "1.55 Points",
        "1,550 Points"
      ],
      "correctAnswer": "15.5 Points",
      "explanation": "5015.5 - 5000.0 = 15.5 index points."
    },
    {
      "id": "prec_lad_09",
      "category": "INSTRUMENT_OIL",
      "difficulty": "intermediate",
      "pair": "WTI Crude Oil",
      "startPrice": 78,
      "endPrice": 78.5,
      "questionText": "Crude Oil (WTI) moves from $78.00 to $78.50. What is the move in cents and ticks?",
      "options": [
        "$0.50 (50 Cents / 50 Ticks)",
        "$5.00",
        "$0.05",
        "$50.00"
      ],
      "correctAnswer": "$0.50 (50 Cents / 50 Ticks)",
      "explanation": "$78.50 - $78.00 = $0.50 = 50 cents (50 ticks at $0.01/tick)."
    },
    {
      "id": "prec_lad_10",
      "category": "SPREAD_CALC",
      "difficulty": "beginner",
      "pair": "EUR/USD",
      "questionText": "If EUR/USD broker spread is quoted as 0.8 pips, how many fractional pipettes is this?",
      "options": [
        "8 Pipettes",
        "80 Pipettes",
        "0.08 Pipettes",
        "800 Pipettes"
      ],
      "correctAnswer": "8 Pipettes",
      "explanation": "0.8 pips * 10 = 8 pipettes."
    },
    {
      "id": "prec_lad_11",
      "category": "SPREAD_CALC",
      "difficulty": "intermediate",
      "pair": "USD/JPY",
      "questionText": "USD/JPY Bid is 150.300 and Ask is 150.312. What is the exact spread?",
      "options": [
        "1.2 Pips (12 Pipettes)",
        "12 Pips",
        "0.12 Pips",
        "120 Pips"
      ],
      "correctAnswer": "1.2 Pips (12 Pipettes)",
      "explanation": "150.312 - 150.300 = 0.012 = 1.2 pips = 12 JPY pipettes."
    },
    {
      "id": "prec_lad_12",
      "category": "COMPARISON",
      "difficulty": "intermediate",
      "questionText": "Which statement accurately describes 25 pips on EUR/USD versus 25 pips on USD/JPY?",
      "options": [
        "Both represent 25 standard units of distance for their respective market pricing conventions",
        "EUR/USD 25 pips is 100 times larger than USD/JPY",
        "USD/JPY 25 pips cannot be calculated",
        "EUR/USD 25 pips equals 250 JPY pips"
      ],
      "correctAnswer": "Both represent 25 standard units of distance for their respective market pricing conventions",
      "explanation": "1 pip is normalized to 0.0001 for EUR/USD and 0.01 for USD/JPY, making 25 pips a standardized 25-unit measurement on both."
    },
    {
      "id": "prec_lad_13",
      "category": "INSTRUMENT_GOLD",
      "difficulty": "intermediate",
      "pair": "XAU/USD (Gold)",
      "startPrice": 2050,
      "endPrice": 2050.8,
      "questionText": "Gold (XAU/USD) fluctuates from $2050.00 to $2050.80. What is the move in pips?",
      "options": [
        "8 Pips ($0.80 / 80 Cents)",
        "80 Pips",
        "0.8 Pips",
        "800 Pips"
      ],
      "correctAnswer": "8 Pips ($0.80 / 80 Cents)",
      "explanation": "$0.80 / $0.10 per pip = 8 pips."
    },
    {
      "id": "prec_lad_14",
      "category": "THEORY",
      "difficulty": "beginner",
      "questionText": "What is the 5th decimal place in GBP/USD quotation called?",
      "options": [
        "Pipette / Fractional Point",
        "Standard Pip",
        "Cent",
        "Lot Unit"
      ],
      "correctAnswer": "Pipette / Fractional Point",
      "explanation": "The 5th decimal place is the fractional pipette (0.1 pip)."
    },
    {
      "id": "prec_lad_15",
      "category": "THEORY",
      "difficulty": "beginner",
      "questionText": "What is the 3rd decimal place in USD/JPY quotation called?",
      "options": [
        "JPY Pipette / Fractional Point",
        "Standard JPY Pip",
        "Yen Integer",
        "Cent"
      ],
      "correctAnswer": "JPY Pipette / Fractional Point",
      "explanation": "The 3rd decimal place on JPY pairs is the fractional pipette (0.1 pip)."
    },
    {
      "id": "prec_lad_16",
      "category": "PRICE_LADDER",
      "difficulty": "beginner",
      "pair": "AUD/USD",
      "questionText": "On the Price Ladder, AUD/USD moves from 0.6500 to 0.6535. What is the distance?",
      "options": [
        "35 Pips",
        "3.5 Pips",
        "350 Pips",
        "0.35 Pips"
      ],
      "correctAnswer": "35 Pips",
      "explanation": "0.6535 - 0.6500 = 0.0035 = 35 pips."
    }
  ]
};
    const RISK_FORGE_CONFIG = {
  "version": "1.0.0",
  "scenarios": [
    {
      "id": "risk_scen_01",
      "accountBalance": 10000,
      "riskPercent": 1,
      "stopLossPips": 25,
      "pair": "EUR/USD",
      "dollarPerPipPerLot": 10,
      "questionText": "Account: $10,000 | Max Risk: 1.0% ($100) | Stop Loss: 25 Pips on EUR/USD ($10/pip/lot). What is the exact recommended position size?",
      "options": [
        "0.40 Lots",
        "1.00 Lot",
        "0.25 Lots",
        "0.50 Lots"
      ],
      "correctAnswer": "0.40 Lots",
      "maxDollarRisk": 100,
      "recommendedLots": 0.4,
      "explanation": "Position Size = Max Risk ($100) / (Stop Pips (25) * $10) = $100 / $250 = 0.40 Lots."
    },
    {
      "id": "risk_scen_02",
      "accountBalance": 10000,
      "riskPercent": 2,
      "stopLossPips": 20,
      "pair": "GBP/USD",
      "dollarPerPipPerLot": 10,
      "questionText": "Account: $10,000 | Max Risk: 2.0% ($200) | Stop Loss: 20 Pips on GBP/USD. What is the recommended lot size?",
      "options": [
        "1.00 Lot",
        "0.50 Lots",
        "2.00 Lots",
        "0.20 Lots"
      ],
      "correctAnswer": "1.00 Lot",
      "maxDollarRisk": 200,
      "recommendedLots": 1,
      "explanation": "Position Size = $200 / (20 pips * $10) = $200 / $200 = 1.00 Standard Lot."
    },
    {
      "id": "risk_scen_03",
      "accountBalance": 5000,
      "riskPercent": 1,
      "stopLossPips": 25,
      "pair": "EUR/USD",
      "dollarPerPipPerLot": 10,
      "questionText": "Account: $5,000 | Max Risk: 1.0% ($50) | Stop Loss: 25 Pips. What is the recommended lot size?",
      "options": [
        "0.20 Lots",
        "0.50 Lots",
        "0.10 Lots",
        "0.05 Lots"
      ],
      "correctAnswer": "0.20 Lots",
      "maxDollarRisk": 50,
      "recommendedLots": 0.2,
      "explanation": "$50 / (25 * $10) = $50 / $250 = 0.20 Lots (2 Mini Lots)."
    },
    {
      "id": "risk_scen_04",
      "accountBalance": 5000,
      "riskPercent": 2,
      "stopLossPips": 50,
      "pair": "GBP/USD",
      "dollarPerPipPerLot": 10,
      "questionText": "Account: $5,000 | Max Risk: 2.0% ($100) | Wide Swing Stop Loss: 50 Pips. What is the lot size?",
      "options": [
        "0.20 Lots",
        "0.40 Lots",
        "1.00 Lot",
        "0.10 Lots"
      ],
      "correctAnswer": "0.20 Lots",
      "maxDollarRisk": 100,
      "recommendedLots": 0.2,
      "explanation": "$100 / (50 * $10) = $100 / $500 = 0.20 Lots."
    },
    {
      "id": "risk_scen_05",
      "accountBalance": 25000,
      "riskPercent": 1,
      "stopLossPips": 25,
      "pair": "EUR/USD",
      "dollarPerPipPerLot": 10,
      "questionText": "Account: $25,000 | Max Risk: 1.0% ($250) | Stop Loss: 25 Pips. What is the lot size?",
      "options": [
        "1.00 Lot",
        "2.50 Lots",
        "0.50 Lots",
        "0.25 Lots"
      ],
      "correctAnswer": "1.00 Lot",
      "maxDollarRisk": 250,
      "recommendedLots": 1,
      "explanation": "$250 / (25 * $10) = $250 / $250 = 1.00 Standard Lot."
    },
    {
      "id": "risk_scen_06",
      "accountBalance": 50000,
      "riskPercent": 1,
      "stopLossPips": 20,
      "pair": "AUD/USD",
      "dollarPerPipPerLot": 10,
      "questionText": "Account: $50,000 | Max Risk: 1.0% ($500) | Stop Loss: 20 Pips. What is the recommended lot size?",
      "options": [
        "2.50 Lots",
        "5.00 Lots",
        "1.00 Lot",
        "0.25 Lots"
      ],
      "correctAnswer": "2.50 Lots",
      "maxDollarRisk": 500,
      "recommendedLots": 2.5,
      "explanation": "$500 / (20 * $10) = $500 / $200 = 2.50 Lots."
    },
    {
      "id": "risk_scen_07",
      "accountBalance": 100000,
      "riskPercent": 1,
      "stopLossPips": 25,
      "pair": "EUR/USD",
      "dollarPerPipPerLot": 10,
      "questionText": "Account: $100,000 | Max Risk: 1.0% ($1,000) | Stop Loss: 25 Pips. What is the lot size?",
      "options": [
        "4.00 Lots",
        "1.00 Lot",
        "10.00 Lots",
        "2.50 Lots"
      ],
      "correctAnswer": "4.00 Lots",
      "maxDollarRisk": 1000,
      "recommendedLots": 4,
      "explanation": "$1,000 / (25 * $10) = $1,000 / $250 = 4.00 Lots."
    },
    {
      "id": "risk_scen_08",
      "accountBalance": 100000,
      "riskPercent": 0.5,
      "stopLossPips": 50,
      "pair": "GBP/USD",
      "dollarPerPipPerLot": 10,
      "questionText": "Account: $100,000 | Conservative Risk: 0.5% ($500) | Stop Loss: 50 Pips. What is the lot size?",
      "options": [
        "1.00 Lot",
        "2.00 Lots",
        "0.50 Lots",
        "5.00 Lots"
      ],
      "correctAnswer": "1.00 Lot",
      "maxDollarRisk": 500,
      "recommendedLots": 1,
      "explanation": "$500 / (50 * $10) = $500 / $500 = 1.00 Lot."
    },
    {
      "id": "risk_scen_09",
      "accountBalance": 2000,
      "riskPercent": 1,
      "stopLossPips": 20,
      "pair": "EUR/USD",
      "dollarPerPipPerLot": 10,
      "questionText": "Account: $2,000 | Max Risk: 1.0% ($20) | Stop Loss: 20 Pips. What is the recommended lot size?",
      "options": [
        "0.10 Lots (1 Mini Lot)",
        "1.00 Lot",
        "0.01 Lots",
        "0.20 Lots"
      ],
      "correctAnswer": "0.10 Lots (1 Mini Lot)",
      "maxDollarRisk": 20,
      "recommendedLots": 0.1,
      "explanation": "$20 / (20 * $10) = $20 / $200 = 0.10 Lots (1 Mini Lot)."
    },
    {
      "id": "risk_scen_10",
      "accountBalance": 2000,
      "riskPercent": 2,
      "stopLossPips": 40,
      "pair": "USD/CAD",
      "dollarPerPipPerLot": 10,
      "questionText": "Account: $2,000 | Max Risk: 2.0% ($40) | Stop Loss: 40 Pips. What is the lot size?",
      "options": [
        "0.10 Lots",
        "0.20 Lots",
        "0.05 Lots",
        "0.40 Lots"
      ],
      "correctAnswer": "0.10 Lots",
      "maxDollarRisk": 40,
      "recommendedLots": 0.1,
      "explanation": "$40 / (40 * $10) = $40 / $400 = 0.10 Lots."
    },
    {
      "id": "risk_scen_11",
      "accountBalance": 10000,
      "riskPercent": 1,
      "stopLossPips": 10,
      "pair": "EUR/USD",
      "dollarPerPipPerLot": 10,
      "questionText": "Account: $10,000 | Max Risk: 1.0% ($100) | Tight Scalp Stop: 10 Pips. What is the lot size?",
      "options": [
        "1.00 Lot",
        "0.10 Lots",
        "2.00 Lots",
        "0.50 Lots"
      ],
      "correctAnswer": "1.00 Lot",
      "maxDollarRisk": 100,
      "recommendedLots": 1,
      "explanation": "$100 / (10 * $10) = $100 / $100 = 1.00 Lot."
    },
    {
      "id": "risk_scen_12",
      "accountBalance": 10000,
      "riskPercent": 1,
      "stopLossPips": 100,
      "pair": "GBP/USD",
      "dollarPerPipPerLot": 10,
      "questionText": "Account: $10,000 | Max Risk: 1.0% ($100) | Wide Macro Stop: 100 Pips. What is the lot size?",
      "options": [
        "0.10 Lots",
        "1.00 Lot",
        "0.01 Lots",
        "0.50 Lots"
      ],
      "correctAnswer": "0.10 Lots",
      "maxDollarRisk": 100,
      "recommendedLots": 0.1,
      "explanation": "$100 / (100 * $10) = $100 / $1,000 = 0.10 Lots."
    },
    {
      "id": "risk_scen_13",
      "accountBalance": 50000,
      "riskPercent": 2,
      "stopLossPips": 40,
      "pair": "EUR/USD",
      "dollarPerPipPerLot": 10,
      "questionText": "Account: $50,000 | Max Risk: 2.0% ($1,000) | Stop Loss: 40 Pips. What is the lot size?",
      "options": [
        "2.50 Lots",
        "1.25 Lots",
        "5.00 Lots",
        "2.00 Lots"
      ],
      "correctAnswer": "2.50 Lots",
      "maxDollarRisk": 1000,
      "recommendedLots": 2.5,
      "explanation": "$1,000 / (40 * $10) = $1,000 / $400 = 2.50 Lots."
    },
    {
      "id": "risk_scen_14",
      "category": "PRINCIPLE",
      "questionText": "If market volatility forces you to DOUBLE your stop loss distance from 20 pips to 40 pips, how must your position size adjust to keep total dollar risk unchanged?",
      "options": [
        "Cut position size in half (50% reduction)",
        "Double position size (2x increase)",
        "Keep position size identical",
        "Increase leverage by 2x"
      ],
      "correctAnswer": "Cut position size in half (50% reduction)",
      "explanation": "Because Risk ($) = Lots * Stop Pips * $10, doubling stop pips requires halving lot size to maintain constant dollar risk."
    },
    {
      "id": "risk_scen_15",
      "category": "PRINCIPLE",
      "questionText": "If technical structure allows a tight 15-pip stop loss instead of a standard 30-pip stop, your allowable position size for the same dollar risk is:",
      "options": [
        "Twice as large (2x)",
        "Half as large (0.5x)",
        "Identical",
        "Four times larger (4x)"
      ],
      "correctAnswer": "Twice as large (2x)",
      "explanation": "Halving stop loss distance doubles the allowed lot volume while keeping exact dollar risk capped."
    },
    {
      "id": "risk_scen_16",
      "accountBalance": 15000,
      "riskPercent": 1,
      "questionText": "On a $15,000 trading account with a strict 1.0% maximum risk policy, what is the maximum allowable dollar loss on any single trade?",
      "options": [
        "$150",
        "$15",
        "$1,500",
        "$300"
      ],
      "correctAnswer": "$150",
      "explanation": "1.0% of $15,000 = $150."
    },
    {
      "id": "risk_scen_17",
      "accountBalance": 80000,
      "riskPercent": 2,
      "questionText": "On an $80,000 account adhering to a strict 2.0% risk cap, what is the max dollar risk?",
      "options": [
        "$1,600",
        "$160",
        "$800",
        "$3,200"
      ],
      "correctAnswer": "$1,600",
      "explanation": "2.0% of $80,000 = $1,600."
    },
    {
      "id": "risk_scen_18",
      "category": "ANTI_RUIN",
      "questionText": "A reckless trader risks 10% per trade on a $10,000 balance. After 3 consecutive losses, what is the remaining account equity?",
      "options": [
        "$7,290 (-27.1% Drawdown)",
        "$7,000 (-30.0%)",
        "$8,100 (-19.0%)",
        "$9,000 (-10.0%)"
      ],
      "correctAnswer": "$7,290 (-27.1% Drawdown)",
      "explanation": "$10,000 * 0.9 * 0.9 * 0.9 = $7,290. Over 27% of capital was lost in just 3 trades."
    },
    {
      "id": "risk_scen_19",
      "category": "ANTI_RUIN",
      "questionText": "A disciplined trader risks 1% per trade on a $10,000 balance. After 3 consecutive losses, what is the remaining equity?",
      "options": [
        "$9,703 (-2.97% Drawdown)",
        "$9,000 (-10.0%)",
        "$9,500 (-5.0%)",
        "$9,900 (-1.0%)"
      ],
      "correctAnswer": "$9,703 (-2.97% Drawdown)",
      "explanation": "$10,000 * 0.99 * 0.99 * 0.99 = $9,702.99. Less than 3% total drawdown occurs across 3 losses."
    },
    {
      "id": "risk_scen_20",
      "category": "PRINCIPLE",
      "questionText": "Why must position size be calculated FROM the stop loss distance, rather than arbitrarily picking lot size first?",
      "options": [
        "To ensure maximum dollar loss is strictly capped regardless of market volatility",
        "Because brokers require fixed lot sizes",
        "To maximize leverage utilization",
        "To eliminate spread costs"
      ],
      "correctAnswer": "To ensure maximum dollar loss is strictly capped regardless of market volatility",
      "explanation": "Calculating lot size from stop loss distance guarantees you never lose more than your pre-determined dollar risk limit."
    },
    {
      "id": "risk_scen_21",
      "accountBalance": 20000,
      "riskPercent": 1,
      "stopLossPips": 40,
      "pair": "EUR/USD",
      "questionText": "Account: $20,000 | 1% Risk ($200) | Stop Loss: 40 Pips on EUR/USD. What is the recommended lot size?",
      "options": [
        "0.50 Lots",
        "1.00 Lot",
        "0.25 Lots",
        "2.00 Lots"
      ],
      "correctAnswer": "0.50 Lots",
      "explanation": "$200 / (40 * $10) = $200 / $400 = 0.50 Lots."
    },
    {
      "id": "risk_scen_22",
      "accountBalance": 30000,
      "riskPercent": 1,
      "stopLossPips": 30,
      "pair": "GBP/USD",
      "questionText": "Account: $30,000 | 1% Risk ($300) | Stop Loss: 30 Pips. What is the lot size?",
      "options": [
        "1.00 Lot",
        "0.50 Lots",
        "1.50 Lots",
        "3.00 Lots"
      ],
      "correctAnswer": "1.00 Lot",
      "explanation": "$300 / (30 * $10) = $300 / $300 = 1.00 Lot."
    },
    {
      "id": "risk_scen_23",
      "accountBalance": 12000,
      "riskPercent": 1.5,
      "stopLossPips": 30,
      "pair": "EUR/USD",
      "questionText": "Account: $12,000 | 1.5% Risk ($180) | Stop Loss: 30 Pips. What is the lot size?",
      "options": [
        "0.60 Lots",
        "0.40 Lots",
        "0.80 Lots",
        "1.00 Lot"
      ],
      "correctAnswer": "0.60 Lots",
      "explanation": "$180 / (30 * $10) = $180 / $300 = 0.60 Lots."
    },
    {
      "id": "risk_scen_24",
      "accountBalance": 8000,
      "riskPercent": 2,
      "stopLossPips": 20,
      "pair": "AUD/USD",
      "questionText": "Account: $8,000 | 2.0% Risk ($160) | Stop Loss: 20 Pips. What is the lot size?",
      "options": [
        "0.80 Lots",
        "0.40 Lots",
        "1.60 Lots",
        "0.20 Lots"
      ],
      "correctAnswer": "0.80 Lots",
      "explanation": "$160 / (20 * $10) = $160 / $200 = 0.80 Lots."
    },
    {
      "id": "risk_scen_25",
      "accountBalance": 40000,
      "riskPercent": 0.5,
      "stopLossPips": 25,
      "pair": "EUR/USD",
      "questionText": "Account: $40,000 | 0.5% Risk ($200) | Stop Loss: 25 Pips. What is the lot size?",
      "options": [
        "0.80 Lots",
        "0.40 Lots",
        "1.00 Lot",
        "1.60 Lots"
      ],
      "correctAnswer": "0.80 Lots",
      "explanation": "$200 / (25 * $10) = $200 / $250 = 0.80 Lots."
    },
    {
      "id": "risk_scen_26",
      "category": "MULTI_TRADE",
      "questionText": "If you have 3 open trades simultaneously, each risking 1.0% of your account, what is your total open portfolio risk?",
      "options": [
        "3.0% Maximum Account Risk",
        "1.0% Risk",
        "9.0% Risk",
        "0.33% Risk"
      ],
      "correctAnswer": "3.0% Maximum Account Risk",
      "explanation": "3 trades * 1.0% risk each = 3.0% total correlated/simultaneous risk."
    },
    {
      "id": "risk_scen_27",
      "category": "CORRELATION",
      "questionText": "Opening long EUR/USD and long GBP/USD at the same time represents correlated USD risk. How should a risk engineer handle this?",
      "options": [
        "Split standard risk allowance across both pairs (e.g. 0.5% each)",
        "Double risk on both to maximize profit",
        "Ignore correlation because pairs have different names",
        "Open max leverage on both"
      ],
      "correctAnswer": "Split standard risk allowance across both pairs (e.g. 0.5% each)",
      "explanation": "Splitting risk across highly correlated pairs prevents doubling your directional dollar exposure to USD moves."
    },
    {
      "id": "risk_scen_28",
      "accountBalance": 60000,
      "riskPercent": 1,
      "stopLossPips": 15,
      "pair": "EUR/USD",
      "questionText": "Account: $60,000 | 1% Risk ($600) | Tight Stop: 15 Pips. What is the recommended lot size?",
      "options": [
        "4.00 Lots",
        "2.00 Lots",
        "6.00 Lots",
        "1.50 Lots"
      ],
      "correctAnswer": "4.00 Lots",
      "explanation": "$600 / (15 * $10) = $600 / $150 = 4.00 Lots."
    },
    {
      "id": "risk_scen_29",
      "accountBalance": 16000,
      "riskPercent": 1,
      "stopLossPips": 32,
      "pair": "GBP/USD",
      "questionText": "Account: $16,000 | 1% Risk ($160) | Stop Loss: 32 Pips. What is the lot size?",
      "options": [
        "0.50 Lots",
        "1.00 Lot",
        "0.25 Lots",
        "0.80 Lots"
      ],
      "correctAnswer": "0.50 Lots",
      "explanation": "$160 / (32 * $10) = $160 / $320 = 0.50 Lots."
    },
    {
      "id": "risk_scen_30",
      "accountBalance": 100000,
      "riskPercent": 1,
      "stopLossPips": 20,
      "pair": "EUR/USD",
      "questionText": "Account: $100,000 | 1% Risk ($1,000) | Stop Loss: 20 Pips. What is the recommended lot size?",
      "options": [
        "5.00 Lots",
        "2.50 Lots",
        "10.00 Lots",
        "1.00 Lot"
      ],
      "correctAnswer": "5.00 Lots",
      "explanation": "$1,000 / (20 * $10) = $1,000 / $200 = 5.00 Lots."
    }
  ]
};
    const LEVERAGE_CONFIG = {
  "version": "1.0.0",
  "scenarios": [
    {
      "id": "lev_scen_01",
      "lots": 1,
      "notional": 100000,
      "leverage": 50,
      "pair": "EUR/USD",
      "questionText": "Opening 1.0 standard lot ($100,000 notional) of EUR/USD at 1:50 leverage requires what minimum margin deposit?",
      "options": [
        "$2,000",
        "$1,000",
        "$5,000",
        "$10,000"
      ],
      "correctAnswer": "$2,000",
      "explanation": "Required Margin = Notional ($100,000) / Leverage (50) = $2,000 (2.0% of position value)."
    },
    {
      "id": "lev_scen_02",
      "lots": 1,
      "notional": 100000,
      "leverage": 100,
      "pair": "EUR/USD",
      "questionText": "Opening 1.0 standard lot ($100,000 notional) at 1:100 leverage requires how much margin?",
      "options": [
        "$1,000",
        "$2,000",
        "$500",
        "$100"
      ],
      "correctAnswer": "$1,000",
      "explanation": "$100,000 / 100 = $1,000 (1.0% margin)."
    },
    {
      "id": "lev_scen_03",
      "lots": 1,
      "notional": 100000,
      "leverage": 200,
      "pair": "EUR/USD",
      "questionText": "Opening 1.0 standard lot ($100,000 notional) at 1:200 leverage requires what margin?",
      "options": [
        "$500",
        "$1,000",
        "$250",
        "$2,000"
      ],
      "correctAnswer": "$500",
      "explanation": "$100,000 / 200 = $500 (0.5% margin)."
    },
    {
      "id": "lev_scen_04",
      "lots": 1,
      "notional": 100000,
      "leverage": 30,
      "pair": "EUR/USD",
      "questionText": "Under strict regulatory 1:30 retail leverage, what margin is required for 1.0 standard lot ($100,000)?",
      "options": [
        "$3,333.33",
        "$3,000.00",
        "$1,500.00",
        "$5,000.00"
      ],
      "correctAnswer": "$3,333.33",
      "explanation": "$100,000 / 30 = $3,333.33 (3.33% margin requirement)."
    },
    {
      "id": "lev_scen_05",
      "lots": 1,
      "notional": 100000,
      "leverage": 10,
      "pair": "EUR/USD",
      "questionText": "At conservative 1:10 institutional leverage, what is required margin for 1.0 lot ($100,000)?",
      "options": [
        "$10,000",
        "$1,000",
        "$5,000",
        "$20,000"
      ],
      "correctAnswer": "$10,000",
      "explanation": "$100,000 / 10 = $10,000 (10.0% margin)."
    },
    {
      "id": "lev_scen_06",
      "lots": 0.1,
      "notional": 10000,
      "leverage": 50,
      "pair": "EUR/USD",
      "questionText": "Opening 0.10 mini lot ($10,000 notional) at 1:50 leverage requires what margin?",
      "options": [
        "$200",
        "$100",
        "$500",
        "$50"
      ],
      "correctAnswer": "$200",
      "explanation": "$10,000 / 50 = $200."
    },
    {
      "id": "lev_scen_07",
      "lots": 0.5,
      "notional": 50000,
      "leverage": 100,
      "pair": "GBP/USD",
      "questionText": "Opening 0.50 lots ($50,000 notional) at 1:100 leverage requires how much margin?",
      "options": [
        "$500",
        "$250",
        "$1,000",
        "$50"
      ],
      "correctAnswer": "$500",
      "explanation": "$50,000 / 100 = $500."
    },
    {
      "id": "lev_scen_08",
      "lots": 2,
      "notional": 200000,
      "leverage": 50,
      "pair": "EUR/USD",
      "questionText": "Opening 2.0 standard lots ($200,000 notional) at 1:50 leverage requires what margin deposit?",
      "options": [
        "$4,000",
        "$2,000",
        "$10,000",
        "$1,000"
      ],
      "correctAnswer": "$4,000",
      "explanation": "$200,000 / 50 = $4,000."
    },
    {
      "id": "lev_scen_09",
      "category": "FREE_MARGIN",
      "questionText": "Account Equity is $10,000 and Used Margin for open positions is $2,000. What is your Free Margin?",
      "options": [
        "$8,000",
        "$12,000",
        "$2,000",
        "$5,000"
      ],
      "correctAnswer": "$8,000",
      "explanation": "Free Margin = Equity ($10,000) - Used Margin ($2,000) = $8,000 available for new positions or drawdown buffer."
    },
    {
      "id": "lev_scen_10",
      "category": "UTILIZATION",
      "questionText": "Account Equity is $5,000 and Used Margin is $2,500. What is your Margin Utilization percentage?",
      "options": [
        "50%",
        "25%",
        "100%",
        "20%"
      ],
      "correctAnswer": "50%",
      "explanation": "Margin Utilization = (Used Margin / Equity) * 100 = ($2,500 / $5,000) * 100 = 50%."
    },
    {
      "id": "lev_scen_11",
      "category": "UTILIZATION",
      "questionText": "Account Equity is $20,000 and Used Margin is $2,000. What is your Margin Utilization percentage?",
      "options": [
        "10%",
        "20%",
        "5%",
        "50%"
      ],
      "correctAnswer": "10%",
      "explanation": "($2,000 / $20,000) * 100 = 10% (Healthy, conservative buffer)."
    },
    {
      "id": "lev_scen_12",
      "category": "NOTIONAL",
      "questionText": "What is the total Notional Value controlled when buying 2.0 standard lots of EUR/USD at 1.0850?",
      "options": [
        "€200,000 ($217,000 USD)",
        "$20,000",
        "$2,000",
        "€20,000"
      ],
      "correctAnswer": "€200,000 ($217,000 USD)",
      "explanation": "2.0 standard lots = 200,000 base currency units (€200,000). At 1.0850, notional is $217,000 USD."
    },
    {
      "id": "lev_scen_13",
      "category": "MECHANICS",
      "questionText": "Does using 1:500 high leverage cause market prices to move faster or increase your statistical win rate?",
      "options": [
        "No. Leverage only reduces collateral required; pip price movement and probability remain identical",
        "Yes, 1:500 makes price move 10x faster",
        "Yes, it increases your win rate",
        "Yes, it lowers spread fees"
      ],
      "correctAnswer": "No. Leverage only reduces collateral required; pip price movement and probability remain identical",
      "explanation": "Leverage does not change price action. It only reduces collateral requirements and amplifies speed of equity gain or loss."
    },
    {
      "id": "lev_scen_14",
      "category": "LIQUIDATION",
      "questionText": "A trader has $1,000 equity, uses $900 in margin, and the market moves 15 pips against a 1.0 lot position (-$150). What happens?",
      "options": [
        "Equity drops to $850, triggering Margin Call / Automated Liquidation (Stop-Out)",
        "The position doubles in size automatically",
        "The broker loans more margin with zero consequences",
        "Price automatically bounces"
      ],
      "correctAnswer": "Equity drops to $850, triggering Margin Call / Automated Liquidation (Stop-Out)",
      "explanation": "Because equity drops below required margin ($850 < $900), Margin Level breaches the stop-out threshold and the broker liquidates the trade."
    },
    {
      "id": "lev_scen_15",
      "category": "THEORY",
      "questionText": "What is a 'Margin Call' in financial brokerage accounts?",
      "options": [
        "A warning that account equity has fallen close to the minimum required margin threshold",
        "A bonus payout from high leverage",
        "A call to withdraw profits",
        "An automated profit-taking order"
      ],
      "correctAnswer": "A warning that account equity has fallen close to the minimum required margin threshold",
      "explanation": "A Margin Call alerts the trader that equity is insufficient to support open positions."
    },
    {
      "id": "lev_scen_16",
      "category": "THEORY",
      "questionText": "What is a 'Stop-Out Level' (Automated Liquidation)?",
      "options": [
        "The exact margin level percentage at which the broker forcibly closes open positions at market prices",
        "The level where you take profit",
        "A discount on trading commissions",
        "A limit order type"
      ],
      "correctAnswer": "The exact margin level percentage at which the broker forcibly closes open positions at market prices",
      "explanation": "When Margin Level falls below stop-out (e.g. 50%), the broker liquidates trades to protect against negative balances."
    },
    {
      "id": "lev_scen_17",
      "lots": 3,
      "notional": 300000,
      "leverage": 100,
      "questionText": "Opening 3.0 standard lots ($300,000 notional) at 1:100 leverage requires what margin?",
      "options": [
        "$3,000",
        "$1,500",
        "$6,000",
        "$300"
      ],
      "correctAnswer": "$3,000",
      "explanation": "$300,000 / 100 = $3,000."
    },
    {
      "id": "lev_scen_18",
      "lots": 0.2,
      "notional": 20000,
      "leverage": 50,
      "questionText": "Opening 0.20 lots ($20,000 notional) at 1:50 leverage requires what margin?",
      "options": [
        "$400",
        "$200",
        "$1,000",
        "$100"
      ],
      "correctAnswer": "$400",
      "explanation": "$20,000 / 50 = $400."
    },
    {
      "id": "lev_scen_19",
      "category": "FREE_MARGIN",
      "questionText": "Account Equity is $15,000 and Used Margin is $3,000. What is your Free Margin?",
      "options": [
        "$12,000",
        "$18,000",
        "$3,000",
        "$6,000"
      ],
      "correctAnswer": "$12,000",
      "explanation": "$15,000 - $3,000 = $12,000."
    },
    {
      "id": "lev_scen_20",
      "category": "UTILIZATION",
      "questionText": "Account Equity is $10,000 and Used Margin is $1,500. What is your Margin Utilization?",
      "options": [
        "15%",
        "30%",
        "7.5%",
        "50%"
      ],
      "correctAnswer": "15%",
      "explanation": "($1,500 / $10,000) * 100 = 15%."
    },
    {
      "id": "lev_scen_21",
      "lots": 0.5,
      "notional": 50000,
      "leverage": 50,
      "pair": "EUR/USD",
      "questionText": "Opening 0.50 lots ($50,000 notional) at 1:50 leverage requires what margin?",
      "options": [
        "$1,000",
        "$500",
        "$2,000",
        "$250"
      ],
      "correctAnswer": "$1,000",
      "explanation": "$50,000 / 50 = $1,000."
    },
    {
      "id": "lev_scen_22",
      "lots": 1.5,
      "notional": 150000,
      "leverage": 100,
      "pair": "GBP/USD",
      "questionText": "Opening 1.50 lots ($150,000 notional) at 1:100 leverage requires how much margin?",
      "options": [
        "$1,500",
        "$3,000",
        "$750",
        "$150"
      ],
      "correctAnswer": "$1,500",
      "explanation": "$150,000 / 100 = $1,500."
    },
    {
      "id": "lev_scen_23",
      "category": "FREE_MARGIN",
      "questionText": "Account Equity is $8,000 and Used Margin is $1,200. What is your Free Margin?",
      "options": [
        "$6,800",
        "$9,200",
        "$1,200",
        "$4,000"
      ],
      "correctAnswer": "$6,800",
      "explanation": "$8,000 - $1,200 = $6,800."
    },
    {
      "id": "lev_scen_24",
      "category": "MARGIN_LEVEL",
      "questionText": "If Equity is $2,000 and Used Margin is $1,000, what is your Margin Level percentage?",
      "options": [
        "200%",
        "50%",
        "100%",
        "500%"
      ],
      "correctAnswer": "200%",
      "explanation": "Margin Level % = (Equity / Used Margin) * 100 = ($2,000 / $1,000) * 100 = 200%."
    },
    {
      "id": "lev_scen_25",
      "category": "MARGIN_LEVEL",
      "questionText": "If Equity drops to $500 while Used Margin is $1,000, what is the Margin Level?",
      "options": [
        "50% (Liquidation / Stop-Out Warning)",
        "100%",
        "200%",
        "25%"
      ],
      "correctAnswer": "50% (Liquidation / Stop-Out Warning)",
      "explanation": "($500 / $1,000) * 100 = 50%, which triggers broker automated stop-out."
    },
    {
      "id": "lev_scen_26",
      "category": "NOTIONAL",
      "questionText": "What is the notional value of 0.25 standard lots of EUR/USD?",
      "options": [
        "€25,000 ($27,125 USD at 1.0850)",
        "€2,500",
        "€250,000",
        "$250"
      ],
      "correctAnswer": "€25,000 ($27,125 USD at 1.0850)",
      "explanation": "0.25 * 100,000 = 25,000 base currency units (€25,000)."
    },
    {
      "id": "lev_scen_27",
      "category": "THEORY",
      "questionText": "Why is high leverage considered a 'double-edged sword' by market regulators?",
      "options": [
        "It magnifies percentage losses at the exact same rate it magnifies percentage gains",
        "It charges double spread fees",
        "It slows execution speed",
        "It requires dual broker accounts"
      ],
      "correctAnswer": "It magnifies percentage losses at the exact same rate it magnifies percentage gains",
      "explanation": "High leverage allows large positions on small capital; small adverse price moves can rapidly wipe out account equity."
    },
    {
      "id": "lev_scen_28",
      "lots": 5,
      "notional": 500000,
      "leverage": 100,
      "questionText": "Opening 5.0 standard lots ($500,000 notional) at 1:100 leverage requires what margin?",
      "options": [
        "$5,000",
        "$10,000",
        "$2,500",
        "$500"
      ],
      "correctAnswer": "$5,000",
      "explanation": "$500,000 / 100 = $5,000."
    }
  ]
};
    const RISK_ARENA_CONFIG = {
  "version": "1.0.0",
  "scenarios": [
    {
      "id": "arena_def_01",
      "category": "DRAWDOWN_RECOVERY",
      "questionText": "If an account suffers a 20% drawdown, what percentage gain is required on remaining capital to break even?",
      "options": [
        "+25.0% Gain",
        "+20.0% Gain",
        "+30.0% Gain",
        "+50.0% Gain"
      ],
      "correctAnswer": "+25.0% Gain",
      "explanation": "If $10,000 drops 20% to $8,000, recovering to $10,000 requires $2,000 / $8,000 = +25.0% gain."
    },
    {
      "id": "arena_def_02",
      "category": "DRAWDOWN_RECOVERY",
      "questionText": "If an account suffers a severe 50% drawdown, what percentage gain is required to reach initial break-even capital?",
      "options": [
        "+100.0% Gain (Doubling Account)",
        "+50.0% Gain",
        "+75.0% Gain",
        "+150.0% Gain"
      ],
      "correctAnswer": "+100.0% Gain (Doubling Account)",
      "explanation": "If $10,000 drops 50% to $5,000, you must gain $5,000 on a $5,000 base, requiring an exact +100% gain."
    },
    {
      "id": "arena_def_03",
      "category": "DRAWDOWN_RECOVERY",
      "questionText": "If an overleveraged account loses 75% of its balance, what return is required just to return to zero profit/loss?",
      "options": [
        "+300.0% Gain",
        "+75.0% Gain",
        "+150.0% Gain",
        "+500.0% Gain"
      ],
      "correctAnswer": "+300.0% Gain",
      "explanation": "If $10,000 drops to $2,500, gaining back $7,500 requires $7,500 / $2,500 = +300% return."
    },
    {
      "id": "arena_def_04",
      "category": "DRAWDOWN_RECOVERY",
      "questionText": "If a catastrophic 90% drawdown occurs, what return is required to recover the initial deposit?",
      "options": [
        "+900.0% Gain (10x Return)",
        "+90.0% Gain",
        "+180.0% Gain",
        "+500.0% Gain"
      ],
      "correctAnswer": "+900.0% Gain (10x Return)",
      "explanation": "If $10,000 drops to $1,000, gaining $9,000 requires a +900% gain. Severe drawdowns cause near-irreversible mathematical ruin."
    },
    {
      "id": "arena_def_05",
      "category": "CONSECUTIVE_LOSSES",
      "questionText": "A disciplined trader risks 2% per trade. After 5 consecutive losses on $10,000, what is the total drawdown?",
      "options": [
        "9.6% Total Drawdown ($9,039 remaining)",
        "10.0% Drawdown",
        "20.0% Drawdown",
        "4.8% Drawdown"
      ],
      "correctAnswer": "9.6% Total Drawdown ($9,039 remaining)",
      "explanation": "$10,000 * (0.98)^5 = $9,039.21 (Total Drawdown = 9.61%)."
    },
    {
      "id": "arena_def_06",
      "category": "CONSECUTIVE_LOSSES",
      "questionText": "An undisciplined trader risks 10% per trade. After 5 consecutive losses on $10,000, what is the total drawdown?",
      "options": [
        "41.0% Total Drawdown ($5,904 remaining)",
        "50.0% Drawdown",
        "25.0% Drawdown",
        "30.0% Drawdown"
      ],
      "correctAnswer": "41.0% Total Drawdown ($5,904 remaining)",
      "explanation": "$10,000 * (0.90)^5 = $5,904.90 (Total Drawdown = 40.95%)."
    },
    {
      "id": "arena_def_07",
      "category": "RISK_ASYMMETRY",
      "questionText": "Why is the relationship between account loss and required recovery percentage asymmetric?",
      "options": [
        "Because each loss shrinks the equity base used to generate future percentage returns",
        "Because brokers charge higher spreads during losses",
        "Because volatility declines after losses",
        "Because interest rates adjust"
      ],
      "correctAnswer": "Because each loss shrinks the equity base used to generate future percentage returns",
      "explanation": "Losses are calculated on a larger base; recovery gains must be made on a smaller remaining base, creating exponential recovery difficulty."
    },
    {
      "id": "arena_def_08",
      "category": "DEFENSE_RULES",
      "questionText": "During a market volatility spike (e.g. interest rate decision), what is the safest risk defense action?",
      "options": [
        "Reduce position size or wait for volatility to normalize",
        "Remove stop losses to give trade more room",
        "Increase leverage to 1:500 to catch big swings",
        "Add to losing positions"
      ],
      "correctAnswer": "Reduce position size or wait for volatility to normalize",
      "explanation": "Reducing position size or remaining flat during extreme news prevents slippage and sudden catastrophic liquidation."
    },
    {
      "id": "arena_def_09",
      "category": "DEFENSE_RULES",
      "questionText": "What is the primary danger of 'revenge trading' (increasing lot size immediately after a loss)?",
      "options": [
        "It accelerates account drawdown exponentially, often triggering complete ruin",
        "It confuses broker algorithms",
        "It lowers tax liabilities",
        "It guarantees a win"
      ],
      "correctAnswer": "It accelerates account drawdown exponentially, often triggering complete ruin",
      "explanation": "Increasing position sizes after losses accelerates losses on smaller remaining capital, rapidly compounding into fatal drawdowns."
    },
    {
      "id": "arena_def_10",
      "category": "DEFENSE_RULES",
      "questionText": "What is the primary objective of a professional risk proctor in market combat?",
      "options": [
        "Capital preservation: Living to trade another day",
        "Achieving 100% daily returns",
        "Winning every single trade",
        "Maximizing margin utilization"
      ],
      "correctAnswer": "Capital preservation: Living to trade another day",
      "explanation": "Capital preservation is the absolute priority. If you preserve capital, compound growth takes care of long-term profitability."
    },
    {
      "id": "arena_def_11",
      "category": "CAPITAL_PRESERVATION",
      "questionText": "If a trader loses 30% of their capital, what percentage return is needed to recover to even?",
      "options": [
        "+42.9% Gain",
        "+30.0% Gain",
        "+35.0% Gain",
        "+60.0% Gain"
      ],
      "correctAnswer": "+42.9% Gain",
      "explanation": "$3,000 loss on $10,000 leaves $7,000. $3,000 / $7,000 = +42.86% required gain."
    },
    {
      "id": "arena_def_12",
      "category": "CAPITAL_PRESERVATION",
      "questionText": "If a trader loses 40% of their capital, what percentage return is needed to recover to even?",
      "options": [
        "+66.7% Gain",
        "+40.0% Gain",
        "+50.0% Gain",
        "+80.0% Gain"
      ],
      "correctAnswer": "+66.7% Gain",
      "explanation": "$4,000 / $6,000 = +66.67% required return."
    },
    {
      "id": "arena_def_13",
      "category": "DRAWDOWN_DEFENSE",
      "questionText": "A trader experiences 4 consecutive losses risking 1.5% per trade on $20,000. What is remaining equity?",
      "options": [
        "$18,827 (-5.86% Drawdown)",
        "$17,000 (-15.0%)",
        "$19,400 (-3.0%)",
        "$16,000 (-20.0%)"
      ],
      "correctAnswer": "$18,827 (-5.86% Drawdown)",
      "explanation": "$20,000 * (0.985)^4 = $18,827.42 (Total Drawdown = 5.86%)."
    },
    {
      "id": "arena_def_14",
      "category": "DRAWDOWN_DEFENSE",
      "questionText": "A trader experiences 4 consecutive losses risking 8.0% per trade on $20,000. What is remaining equity?",
      "options": [
        "$14,328 (-28.36% Drawdown)",
        "$18,400 (-8.0%)",
        "$12,000 (-40.0%)",
        "$10,000 (-50.0%)"
      ],
      "correctAnswer": "$14,328 (-28.36% Drawdown)",
      "explanation": "$20,000 * (0.92)^4 = $14,327.86 (Over 28% capital destroyed in 4 trades)."
    },
    {
      "id": "arena_def_15",
      "category": "RISK_REWARD",
      "questionText": "With a 1:2 Risk-to-Reward ratio (risking $100 to make $200), what win rate is required to break even?",
      "options": [
        "33.3% Win Rate",
        "50.0% Win Rate",
        "66.7% Win Rate",
        "25.0% Win Rate"
      ],
      "correctAnswer": "33.3% Win Rate",
      "explanation": "Win Rate = Risk / (Risk + Reward) = 1 / (1 + 2) = 33.33%. You can lose 66% of trades and still not lose money."
    },
    {
      "id": "arena_def_16",
      "category": "RISK_REWARD",
      "questionText": "With a 1:3 Risk-to-Reward ratio (risking $100 to make $300), what win rate is required to break even?",
      "options": [
        "25.0% Win Rate",
        "33.3% Win Rate",
        "50.0% Win Rate",
        "20.0% Win Rate"
      ],
      "correctAnswer": "25.0% Win Rate",
      "explanation": "Win Rate = 1 / (1 + 3) = 25.0%. Even winning only 1 out of 4 trades breaks even."
    },
    {
      "id": "arena_def_17",
      "category": "SURVIVAL_PSYCHOLOGY",
      "questionText": "What is the primary psychological defense against emotional tilting after a losing trade?",
      "options": [
        "Accepting that individual trade outcomes are probabilistic, while following strict fixed risk limits",
        "Doubling lot size on the next candle",
        "Closing the trading platform for a month",
        "Switching strategies after every loss"
      ],
      "correctAnswer": "Accepting that individual trade outcomes are probabilistic, while following strict fixed risk limits",
      "explanation": "Professional risk proctors accept losses as business expenses, maintaining disciplined execution."
    },
    {
      "id": "arena_def_18",
      "category": "PORTFOLIO_HEAT",
      "questionText": "What does 'Portfolio Heat' measure in capital defense?",
      "options": [
        "The total aggregate percentage of account equity at risk across all currently open positions",
        "The temperature of exchange servers",
        "The volatility index reading",
        "The broker commission rate"
      ],
      "correctAnswer": "The total aggregate percentage of account equity at risk across all currently open positions",
      "explanation": "Portfolio heat measures combined open risk across all positions. Keeping heat under 5% prevents catastrophic correlations."
    },
    {
      "id": "arena_def_19",
      "category": "PORTFOLIO_HEAT",
      "questionText": "If your maximum allowable Portfolio Heat is 4.0%, how many concurrent trades risking 1.0% each can you open?",
      "options": [
        "4 Trades",
        "8 Trades",
        "2 Trades",
        "10 Trades"
      ],
      "correctAnswer": "4 Trades",
      "explanation": "4 trades * 1.0% = 4.0% maximum portfolio heat."
    },
    {
      "id": "arena_def_20",
      "category": "STOP_OUT_DEFENSE",
      "questionText": "How does placing a hard stop loss order on every trade protect against broker liquidation?",
      "options": [
        "It terminates the loss before account equity can drop anywhere near the margin stop-out threshold",
        "It prevents spread widening",
        "It increases broker margin loans",
        "It guarantees positive slippage"
      ],
      "correctAnswer": "It terminates the loss before account equity can drop anywhere near the margin stop-out threshold",
      "explanation": "A hard stop loss controls risk at 1%–2%, keeping equity far above the margin stop-out level."
    },
    {
      "id": "arena_def_21",
      "category": "SLIPPAGE_DEFENSE",
      "questionText": "Why must risk managers account for potential slippage during extreme market gap events?",
      "options": [
        "Price can gap past a stop order during major news, making conservative position sizing essential",
        "Brokers refuse to execute trades",
        "Slippage always improves entry price",
        "Slippage only affects winning trades"
      ],
      "correctAnswer": "Price can gap past a stop order during major news, making conservative position sizing essential",
      "explanation": "Slippage can cause fills beyond your stop price; keeping small position sizes ensures unexpected gaps remain survivable."
    },
    {
      "id": "arena_def_22",
      "category": "CAPITAL_PRESERVATION",
      "questionText": "What is the single most important rule in professional financial risk management?",
      "options": [
        "Rule 1: Never risk ruin. Rule 2: Never forget Rule 1.",
        "Always trade with maximum leverage",
        "Never take a stop loss",
        "Trade every market session"
      ],
      "correctAnswer": "Rule 1: Never risk ruin. Rule 2: Never forget Rule 1.",
      "explanation": "Survival is the prerequisite for all long-term wealth accumulation in financial markets."
    },
    {
      "id": "arena_def_23",
      "category": "DRAWDOWN_RECOVERY",
      "questionText": "If capital drops from $50,000 to $35,000 (30% loss), how much profit is needed to reach $50,000 again?",
      "options": [
        "$15,000 (+42.9% return on $35,000)",
        "$15,000 (+30.0%)",
        "$10,000 (+28.5%)",
        "$20,000 (+57.1%)"
      ],
      "correctAnswer": "$15,000 (+42.9% return on $35,000)",
      "explanation": "$15,000 / $35,000 = +42.86% return."
    },
    {
      "id": "arena_def_24",
      "category": "DRAWDOWN_RECOVERY",
      "questionText": "If capital drops from $100,000 to $50,000 (50% loss), how much profit is needed to recover?",
      "options": [
        "$50,000 (+100.0% return on $50,000)",
        "$50,000 (+50.0%)",
        "$25,000 (+50.0%)",
        "$100,000 (+200.0%)"
      ],
      "correctAnswer": "$50,000 (+100.0% return on $50,000)",
      "explanation": "$50,000 / $50,000 = +100.0% return."
    }
  ]
};

    // ======================================================================
    // UNBIASED FISHER-YATES ARRAY SHUFFLE
    // ======================================================================
    function shuffleArray(arr) {
        if (!Array.isArray(arr)) return [];
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = copy[i];
            copy[i] = copy[j];
            copy[j] = temp;
        }
        return copy;
    }

    // ======================================================================
    // QUESTION & SCENARIO ENGINE (QUESTION VARIETY & RECENT HISTORY & SHUFFLE)
    // ======================================================================
    const QuestionEngine = {
        pools: {
            pip_academy: ACADEMY_CONFIG.questions || [],
            precision_lab: PRECISION_CONFIG.questions || [],
            risk_forge: RISK_FORGE_CONFIG.scenarios || [],
            leverage_tower: LEVERAGE_CONFIG.scenarios || [],
            risk_arena: RISK_ARENA_CONFIG.scenarios || [],
            pip_blitz: BLITZ_CONFIG.scenarios || []
        },
        recentHistory: {
            pip_academy: [],
            precision_lab: [],
            risk_forge: [],
            leverage_tower: [],
            risk_arena: [],
            pip_blitz: []
        },

        getQuestion(facilityId, category = null, difficulty = null) {
            const pool = this.pools[facilityId] || [];
            if (pool.length === 0) return null;

            let filtered = pool;
            if (category) {
                const catFiltered = pool.filter(q => q.category && q.category.toLowerCase() === category.toLowerCase());
                if (catFiltered.length > 0) filtered = catFiltered;
            }
            if (difficulty) {
                const diffFiltered = filtered.filter(q => q.difficulty && q.difficulty.toLowerCase() === difficulty.toLowerCase());
                if (diffFiltered.length > 0) filtered = diffFiltered;
            }

            const recent = this.recentHistory[facilityId] || [];
            const maxRecent = Math.min(8, Math.max(1, Math.floor(filtered.length * 0.45)));
            let available = filtered.filter(q => !recent.includes(q.id));

            if (available.length === 0) {
                available = filtered;
                this.recentHistory[facilityId] = [];
            }

            const selected = available[Math.floor(Math.random() * available.length)];
            if (selected) {
                this.recentHistory[facilityId].push(selected.id);
                if (this.recentHistory[facilityId].length > maxRecent) {
                    this.recentHistory[facilityId].shift();
                }
            }

            const qCopy = JSON.parse(JSON.stringify(selected));

            // Format and shuffle answer choices using Fisher-Yates without mutating canonical dataset
            if (Array.isArray(qCopy.options)) {
                const formatted = qCopy.options.map((opt, idx) => {
                    const optText = typeof opt === "string" ? opt : (opt.text || opt.label || "");
                    const isCorrect = optText === qCopy.correctAnswer || (opt && opt.isCorrect);
                    return {
                        id: (opt && opt.id) ? opt.id : ("opt_" + idx),
                        text: optText,
                        label: optText,
                        value: optText,
                        isCorrect: !!isCorrect,
                        toString: () => optText
                    };
                });
                qCopy.options = shuffleArray(formatted);
            }

            return qCopy;
        },

        resetHistory(facilityId = null) {
            if (facilityId && this.recentHistory[facilityId]) {
                this.recentHistory[facilityId] = [];
            } else {
                Object.keys(this.recentHistory).forEach(k => this.recentHistory[k] = []);
            }
        },

        shuffleArray
    };

    class PipDistrictWorld {
        constructor(config = {}) {
            this.id = config.id || "pip-district";
            this.name = config.name || "Pip District";
            this.width = MAP_CONFIG.bounds.width || 3200;
            this.height = MAP_CONFIG.bounds.height || 2400;
            this.spawnPoint = MAP_CONFIG.spawn || { x: 1600, y: 2250, direction: "up" };
            this.themeColor = MAP_CONFIG.theme.primary || "#00F0FF";
            this.accentColor = MAP_CONFIG.theme.accent || "#A855F7";

            this.obstacles = [];
            this.interactiveObjects = [];
            this.buildingFootprints = [];
            this.streetProps = [];
            this.bounds = new Rectangle(0, 0, this.width, this.height, "world_boundary", "boundary");

            // Scene State: "exterior" or "interior"
            this.activeScene = "exterior";
            this.currentInterior = null;
            this.activeInteriorData = null;
            this.outsidePlayerPos = { x: 1600, y: 2250, direction: "up" };
            this.core = null;

            // Animation timers
            this.ambientTimer = 0;
            this.pulseTimer = 0;
            this.tickerScroll = 0;
            this.marketTickTimer = 0;

            // Exploration Beacons & Challenge Stations
            this.explorationPoints = MAP_CONFIG.explorationPoints || [];
            this.challengeStations = MAP_CONFIG.challengeStations || [];

            // Simulated Market Boards
            this.marketBoards = JSON.parse(JSON.stringify(MAP_CONFIG.marketBoards || []));

            // Ambient Waypoint Patrolling NPCs
            this.ambientNpcs = JSON.parse(JSON.stringify(MAP_CONFIG.ambientNpcs || [])).map(npc => ({
                ...npc,
                currentWaypointIdx: 0,
                facing: "down",
                bobTimer: Math.random() * Math.PI * 2
            }));

            // NPC Manager
            this.npcManager = window.StrativoRPG.NPCManager ? new window.StrativoRPG.NPCManager() : null;
        }

        addObstacle(rect, metadata = {}, collisionSystem = null) {
            this.obstacles.push({ rect, ...metadata });
            if (collisionSystem && typeof collisionSystem.addCollider === "function") {
                collisionSystem.addCollider(rect);
            }
        }

        addInteractiveObject(config, collisionSystem = null) {
            const rect = config.rect || new Rectangle(
                config.x || 0,
                config.y || 0,
                config.width || 60,
                config.height || 60,
                config.id,
                "trigger"
            );
            const obj = {
                id: config.id,
                rect: rect,
                name: config.name || "Terminal",
                category: config.category || "INTERACTIVE",
                icon: config.icon || "fa-terminal",
                promptText: config.promptText || "Interact [E]",
                interactRadius: config.interactRadius || 90,
                districtId: config.districtId || null,
                onInteract: config.onInteract || null
            };
            this.interactiveObjects.push(obj);
            if (collisionSystem && typeof collisionSystem.addTrigger === "function") {
                collisionSystem.addTrigger(rect);
            }
        }

        addBuilding(buildingConfig, collisionSystem) {
            this.buildingFootprints.push(buildingConfig);
            if (buildingConfig.rect) {
                // Physical solid obstacle for building structure
                this.addObstacle(buildingConfig.rect, {
                    label: buildingConfig.name,
                    color: buildingConfig.themeColor || "#0B1936"
                }, collisionSystem);
            }
            if (buildingConfig.interactPoint) {
                // Separate interaction trigger placed in front of entrance door
                const triggerRect = new Rectangle(
                    buildingConfig.interactPoint.x - 30,
                    buildingConfig.interactPoint.y - 30,
                    60,
                    60,
                    "trigger_" + buildingConfig.id,
                    "trigger"
                );
                this.addInteractiveObject({
                    id: "trigger_" + buildingConfig.id,
                    rect: triggerRect,
                    name: buildingConfig.name,
                    category: "BUILDING_ENTRANCE",
                    icon: buildingConfig.icon || "fa-building",
                    promptText: buildingConfig.promptText || ("Enter " + buildingConfig.name),
                    interactRadius: buildingConfig.interactRadius || 90,
                    buildingRef: buildingConfig,
                    onInteract: buildingConfig.onInteract
                }, collisionSystem);
            }
        }

        buildScene(collisionSystem) {
            if (collisionSystem && typeof collisionSystem.clear === "function") {
                collisionSystem.clear();
            }
            this.obstacles = [];
            this.interactiveObjects = [];
            this.buildingFootprints = [];
            this.streetProps = [];

            if (this.activeScene === "interior" && this.currentInterior && MAP_CONFIG.interiors[this.currentInterior]) {
                this.buildInteriorScene(this.currentInterior, collisionSystem);
                return;
            }

            const wallThickness = 36;
            const w = this.width;
            const h = this.height;

            // 1. Perimeter Fortifications (2400x1800)
            const topWall = new Rectangle(0, 0, w, wallThickness, "pd_wall_top", "solid");
            const bottomWall = new Rectangle(0, h - wallThickness, w, wallThickness, "pd_wall_bottom", "solid");
            const leftWall = new Rectangle(0, 0, wallThickness, h, "pd_wall_left", "solid");
            const rightWall = new Rectangle(w - wallThickness, 0, wallThickness, h, "pd_wall_right", "solid");

            this.addObstacle(topWall, { label: "Perimeter Shield North", color: "#071229" }, collisionSystem);
            this.addObstacle(bottomWall, { label: "Perimeter Shield South", color: "#071229" }, collisionSystem);
            this.addObstacle(leftWall, { label: "Perimeter Shield West", color: "#071229" }, collisionSystem);
            this.addObstacle(rightWall, { label: "Perimeter Shield East", color: "#071229" }, collisionSystem);

            // 2. Primary Exterior NPCs with SEPARATE collision (small feet box) and interaction radius (90px)
            if (this.npcManager) {
                this.npcManager.clear();
                (MAP_CONFIG.npcs || []).forEach(npcConfig => {
                    const npc = this.npcManager.addNPC(npcConfig);

                    // Solid obstacle: small 30x20px base to prevent player overlapping NPC pixels
                    const solidNpc = new Rectangle(npc.x - 15, npc.y - 10, 30, 20, "solid_npc_" + npc.id, "solid");
                    this.addObstacle(solidNpc, { label: npc.name }, collisionSystem);

                    // Interaction Trigger: 90px interaction range
                    this.addInteractiveObject({
                        id: "trigger_npc_" + npc.id,
                        rect: new Rectangle(npc.x - 20, npc.y - 20, 40, 40, "trigger_npc_" + npc.id, "trigger"),
                        name: npc.name.toUpperCase(),
                        category: "NPC_TALK",
                        icon: npc.avatarIcon || "fa-user-astronaut",
                        promptText: "Talk to " + npc.name,
                        interactRadius: 90,
                        npcRef: npc,
                        onInteract: () => {
                            npc.interact();
                            return null;
                        }
                    }, collisionSystem);
                });
            }

            // 3. Physical Buildings & Explorable Entrances
            (MAP_CONFIG.buildings || []).forEach(bldg => {
                const bldgRect = new Rectangle(bldg.x, bldg.y, bldg.w, bldg.h, "bldg_" + bldg.id, "solid");
                this.addBuilding({
                    id: bldg.id,
                    rect: bldgRect,
                    name: bldg.name,
                    category: "BUILDING",
                    icon: bldg.icon || "fa-building",
                    themeColor: bldg.themeColor || "#00F0FF",
                    interactPoint: bldg.entrance || { x: bldg.x + bldg.w / 2, y: bldg.y + bldg.h + 20 },
                    promptText: bldg.promptText || ("Enter " + bldg.name),
                    interactRadius: 90,
                    onInteract: () => {
                        if (bldg.id === "gate_return_hub") {
                            window.location.href = "../hub.html";
                        } else if (MAP_CONFIG.interiors[bldg.id]) {
                            this.enterInterior(bldg.id);
                        }
                        return null;
                    }
                }, collisionSystem);
            });

            // 4. Exploration Discovery Beacons (interactRadius 80px)
            this.explorationPoints.forEach(exp => {
                this.addInteractiveObject({
                    id: "trigger_" + exp.id,
                    rect: new Rectangle(exp.x - 25, exp.y - 25, 50, 50, "trigger_" + exp.id, "trigger"),
                    name: exp.name.toUpperCase(),
                    category: "EXPLORATION",
                    icon: "fa-star",
                    promptText: exp.prompt || "Inspect Discovery",
                    interactRadius: 80,
                    onInteract: () => {
                        this.triggerExploration(exp);
                        return null;
                    }
                }, collisionSystem);
            });

            // 5. Challenge Stations (interactRadius 85px)
            this.challengeStations.forEach(st => {
                this.addInteractiveObject({
                    id: "trigger_" + st.id,
                    rect: new Rectangle(st.x - 25, st.y - 25, 50, 50, "trigger_" + st.id, "trigger"),
                    name: st.name.toUpperCase(),
                    category: "CHALLENGE_STATION",
                    icon: "fa-calculator",
                    promptText: st.prompt || "Take Quick Pip Test",
                    interactRadius: 85,
                    onInteract: () => {
                        this.openQuickChallenge(st);
                        return null;
                    }
                }, collisionSystem);
            });
        }

        buildInteriorScene(interiorId, collisionSystem) {
            const interior = MAP_CONFIG.interiors[interiorId];
            if (!interior) return;

            this.activeInteriorData = interior;
            const w = interior.width || 1200;
            const h = interior.height || 800;
            const wallThick = 36;

            // Interior Room Solid Perimeter Walls
            const topWall = new Rectangle(0, 0, w, wallThick, "int_wall_top", "solid");
            const bottomWallLeft = new Rectangle(0, h - wallThick, (w - 140) / 2, wallThick, "int_wall_bot_l", "solid");
            const bottomWallRight = new Rectangle((w + 140) / 2, h - wallThick, (w - 140) / 2, wallThick, "int_wall_bot_r", "solid");
            const leftWall = new Rectangle(0, 0, wallThick, h, "int_wall_left", "solid");
            const rightWall = new Rectangle(w - wallThick, 0, wallThick, h, "int_wall_right", "solid");

            this.addObstacle(topWall, { label: "Interior Wall North" }, collisionSystem);
            this.addObstacle(bottomWallLeft, { label: "Interior Wall South L" }, collisionSystem);
            this.addObstacle(bottomWallRight, { label: "Interior Wall South R" }, collisionSystem);
            this.addObstacle(leftWall, { label: "Interior Wall West" }, collisionSystem);
            this.addObstacle(rightWall, { label: "Interior Wall East" }, collisionSystem);

            // Doorway Exit Trigger (85px interactRadius)
            const exitTrigger = new Rectangle(w / 2 - 60, h - 50, 120, 50, "int_exit_trigger", "trigger");
            this.addInteractiveObject({
                id: "trigger_interior_exit",
                rect: exitTrigger,
                name: "EXIT DOORWAY",
                category: "EXIT",
                icon: "fa-door-open",
                promptText: "Exit to Pip District [E]",
                interactRadius: 85,
                onInteract: () => {
                    this.exitInterior();
                    return null;
                }
            }, collisionSystem);

            // Interior Stations: Compact Solid Collider (80x40) + Wide Interaction Trigger (95px)
            (interior.stations || []).forEach(st => {
                const stSolidRect = new Rectangle(st.x - 40, st.y - 20, 80, 40, "st_solid_" + st.id, "solid");
                this.addObstacle(stSolidRect, { label: st.name, color: interior.themeColor }, collisionSystem);

                this.addInteractiveObject({
                    id: "trigger_" + st.id,
                    rect: new Rectangle(st.x - 40, st.y - 20, 80, 40, "trigger_" + st.id, "trigger"),
                    name: st.name.toUpperCase(),
                    category: "STATION",
                    icon: "fa-terminal",
                    promptText: st.label || ("Use " + st.name),
                    interactRadius: 95,
                    onInteract: () => {
                        if (st.action && typeof window.StrativoRPG[st.action] === "function") {
                            window.StrativoRPG[st.action](st.tab);
                        } else if (typeof window.StrativoRPG.openAcademyModal === "function") {
                            window.StrativoRPG.openAcademyModal();
                        }
                        return null;
                    }
                }, collisionSystem);
            });

            // Interior Specialist NPC: Small Solid Collider (30x20) + Wide Interaction Radius (90px)
            if (interior.npc) {
                const npc = interior.npc;
                const solidNpc = new Rectangle(npc.x - 15, npc.y - 10, 30, 20, "solid_int_npc_" + npc.id, "solid");
                this.addObstacle(solidNpc, { label: npc.name }, collisionSystem);

                this.addInteractiveObject({
                    id: "trigger_npc_" + npc.id,
                    rect: new Rectangle(npc.x - 20, npc.y - 20, 40, 40, "trigger_npc_" + npc.id, "trigger"),
                    name: npc.name.toUpperCase(),
                    category: "NPC_TALK",
                    icon: npc.avatarIcon || "fa-user-astronaut",
                    promptText: "Talk to " + npc.name,
                    interactRadius: 90,
                    onInteract: () => {
                        if (window.StrativoRPG.DialogueManager) {
                            window.StrativoRPG.DialogueManager.startDialogue({
                                speaker: npc.name,
                                role: npc.role,
                                icon: npc.avatarIcon,
                                text: npc.dialogue
                            });
                        }
                        return null;
                    }
                }, collisionSystem);
            }
        }

        enterInterior(interiorId) {
            const interior = MAP_CONFIG.interiors[interiorId];
            if (!interior) return;

            const activeCore = this.core || (window.StrativoRPG && window.StrativoRPG.gameCore);
            if (activeCore && activeCore.player) {
                this.outsidePlayerPos = { x: activeCore.player.x, y: activeCore.player.y + 40, direction: "down" };
            }

            this.activeScene = "interior";
            this.currentInterior = interiorId;
            this.activeInteriorData = interior;
            this.width = interior.width || 1200;
            this.height = interior.height || 800;
            this.bounds = new Rectangle(0, 0, this.width, this.height, "interior_bounds", "boundary");

            if (activeCore) {
                activeCore.nearbyInteractable = null;
                if (activeCore.onInteractionPrompt) {
                    activeCore.onInteractionPrompt({ active: false });
                }
                if (activeCore.input && typeof activeCore.input.reset === "function") {
                    activeCore.input.reset();
                }
                if (activeCore.collision) {
                    this.buildScene(activeCore.collision);
                }
                if (activeCore.player) {
                    activeCore.player.x = interior.spawn.x;
                    activeCore.player.y = interior.spawn.y;
                    activeCore.player.facing = interior.spawn.direction || "up";
                }
                if (activeCore.camera) {
                    activeCore.camera.setWorldBounds(this.bounds);
                    activeCore.camera.snapToTarget();
                }
            }

            window.StrativoRPG.emitGameEvent("buildingEntry", { interior: interiorId });
            this.showToast("Entered " + interior.name, "fa-door-open");
        }

        exitInterior() {
            if (this.activeScene !== "interior" && !this.currentInterior) return;
            const interior = MAP_CONFIG.interiors[this.currentInterior];
            const retPos = interior && interior.returnPos ? interior.returnPos : this.outsidePlayerPos;

            this.activeScene = "exterior";
            this.currentInterior = null;
            this.activeInteriorData = null;
            this.width = MAP_CONFIG.bounds.width || 2400;
            this.height = MAP_CONFIG.bounds.height || 1800;
            this.bounds = new Rectangle(0, 0, this.width, this.height, "world_bounds", "boundary");

            const activeCore = this.core || (window.StrativoRPG && window.StrativoRPG.gameCore);

            if (activeCore) {
                activeCore.nearbyInteractable = null;
                if (activeCore.onInteractionPrompt) {
                    activeCore.onInteractionPrompt({ active: false });
                }
                if (activeCore.input && typeof activeCore.input.reset === "function") {
                    activeCore.input.reset();
                }
                if (activeCore.collision) {
                    this.buildScene(activeCore.collision);
                }
                if (activeCore.player) {
                    activeCore.player.x = retPos.x;
                    activeCore.player.y = retPos.y;
                    activeCore.player.facing = "down";
                }
                if (activeCore.camera) {
                    activeCore.camera.setWorldBounds(this.bounds);
                    activeCore.camera.snapToTarget();
                }
            }

            window.StrativoRPG.emitGameEvent("buildingExit");
            this.showToast("Exited to Pip District", "fa-city");
        }

        triggerExploration(exp) {
            if (!exp) return;
            const state = (window.StrativoWorldState && typeof window.StrativoWorldState.get === "function")
                ? window.StrativoWorldState.get()
                : (window.StrativoWorldState && typeof window.StrativoWorldState.getState === "function" ? window.StrativoWorldState.getState() : {});
            const uniqueLocations = (state && Array.isArray(state.uniqueLocations)) ? [...state.uniqueLocations] : [];
            const isNew = !uniqueLocations.includes(exp.id);
            const xpReward = Number(exp.rewardXP || exp.xpReward || 15);

            if (isNew) {
                uniqueLocations.push(exp.id);
                if (window.StrativoWorldState && typeof window.StrativoWorldState.patch === "function") {
                    window.StrativoWorldState.patch({ uniqueLocations });
                }
                if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.addWorldXP === "function") {
                    window.StrativoWorldXPEngine.addWorldXP(xpReward, "Exploration: " + exp.name, "exp_" + exp.id);
                }
                window.StrativoRPG.emitGameEvent("discoveryUnlocked", { id: exp.id });
            }

            if (typeof document !== "undefined") {
                const modal = document.getElementById("pd-discovery-modal");
                if (modal) {
                    const tEl = document.getElementById("pd-discovery-title");
                    const hEl = document.getElementById("pd-discovery-heading");
                    const lEl = document.getElementById("pd-discovery-lore");
                    const xEl = document.getElementById("pd-discovery-xp");
                    if (tEl) tEl.textContent = exp.name;
                    if (hEl) hEl.textContent = exp.name;
                    if (lEl) lEl.textContent = exp.text || exp.lore || "Tactical telemetry archive recorded in district log.";
                    if (xEl) xEl.textContent = isNew ? ("+" + xpReward + " XP (Claimed!)") : ("Completed (" + xpReward + " XP Logged)");
                    modal.classList.add("active");
                    modal.setAttribute("aria-hidden", "false");
                }
            }
        }

        openQuickChallenge(station) {
            const modal = document.getElementById("pd-quick-test-modal");
            if (!modal) return;

            if (this._quickChallengeTimer) {
                clearTimeout(this._quickChallengeTimer);
                this._quickChallengeTimer = null;
            }

            const scen = QuestionEngine.getQuestion("pip_blitz");
            if (!scen) return;

            const titleEl = document.getElementById("pd-quick-title");
            const qEl = document.getElementById("pd-quick-question");
            const grid = document.getElementById("pd-quick-options-grid");
            const fbEl = document.getElementById("pd-quick-feedback");
            const skipBtn = document.getElementById("quick-skip-btn");

            if (titleEl) titleEl.innerHTML = '<i class="fas fa-calculator" style="color: var(--pd-neon-cyan);"></i> ' + (station.name || "Quick Pip Challenge");
            if (qEl) qEl.textContent = scen.questionText;
            if (fbEl) {
                fbEl.style.display = "none";
                fbEl.innerHTML = "";
            }
            if (skipBtn) {
                skipBtn.innerHTML = '<i class="fas fa-sync"></i> New Question';
                skipBtn.onclick = () => {
                    if (this._quickChallengeTimer) clearTimeout(this._quickChallengeTimer);
                    this.openQuickChallenge(station);
                };
            }
            if (grid) grid.innerHTML = "";

            let answered = false;

            scen.options.forEach((opt) => {
                const optText = typeof opt === "string" ? opt : (opt.text || opt.label || "");
                const btn = document.createElement("button");
                btn.className = "pd-btn";
                btn.style.padding = "0.75rem";
                btn.style.textAlign = "left";
                btn.textContent = optText;
                btn.onclick = () => {
                    if (answered) return;
                    answered = true;
                    Array.from(grid.children).forEach(c => c.disabled = true);

                    const isCorrect = optText === scen.correctAnswer || (opt && opt.isCorrect);
                    if (isCorrect) {
                        window.StrativoRPG.emitGameEvent("correctHit");
                        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.addWorldXP === "function") {
                            window.StrativoWorldXPEngine.addWorldXP(10, "Quick Pip Challenge", "quick_" + station.id + "_" + Date.now());
                        }
                        btn.className = "pd-btn pd-btn-emerald";
                        fbEl.style.color = "#A7F3D0";
                        fbEl.innerHTML = '<div><i class="fas fa-check-circle" style="color: #10B981; margin-right: 0.4rem;"></i> <strong>CORRECT!</strong> ' + scen.explanation + '</div>';
                    } else {
                        window.StrativoRPG.emitGameEvent("wrongHit");
                        btn.className = "pd-btn pd-btn-rose";
                        fbEl.style.color = "#FECDD3";
                        fbEl.innerHTML = '<div><i class="fas fa-times-circle" style="color: #F43F5E; margin-right: 0.4rem;"></i> <strong>INCORRECT.</strong> Correct: <em>' + scen.correctAnswer + '</em>. ' + scen.explanation + '</div>';
                    }

                    if (skipBtn) {
                        skipBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Next Question';
                    }

                    const nextBtn = document.createElement("button");
                    nextBtn.type = "button";
                    nextBtn.className = "pd-btn pd-btn-cyan";
                    nextBtn.style.marginTop = "0.75rem";
                    nextBtn.style.width = "100%";
                    nextBtn.innerHTML = '<i class="fas fa-forward"></i> Next Question';
                    nextBtn.onclick = () => {
                        if (this._quickChallengeTimer) clearTimeout(this._quickChallengeTimer);
                        this.openQuickChallenge(station);
                    };
                    fbEl.appendChild(nextBtn);
                    fbEl.style.display = "block";

                    this._quickChallengeTimer = setTimeout(() => {
                        if (modal && modal.classList.contains("active")) {
                            this.openQuickChallenge(station);
                        }
                    }, 3200);
                };
                grid.appendChild(btn);
            });

            modal.classList.add("active");
            modal.setAttribute("aria-hidden", "false");
        }

        showToast(msg, icon = "fa-info-circle") {
            if (typeof document === "undefined") return;
            let toast = document.getElementById("pd-toast-msg");
            if (!toast) {
                toast = document.createElement("div");
                toast.id = "pd-toast-msg";
                toast.style.position = "fixed";
                toast.style.bottom = "80px";
                toast.style.left = "50%";
                toast.style.transform = "translateX(-50%)";
                toast.style.background = "rgba(11, 25, 54, 0.95)";
                toast.style.border = "1px solid #00F0FF";
                toast.style.color = "#FFF";
                toast.style.padding = "0.6rem 1.2rem";
                toast.style.borderRadius = "8px";
                toast.style.fontSize = "0.85rem";
                toast.style.fontWeight = "700";
                toast.style.zIndex = "9999";
                toast.style.boxShadow = "0 0 15px rgba(0, 240, 255, 0.3)";
                toast.style.transition = "opacity 0.3s ease";
                document.body.appendChild(toast);
            }
            toast.innerHTML = '<i class="fas ' + icon + '" style="color: #00F0FF; margin-right: 0.5rem;"></i> ' + msg;
            toast.style.opacity = "1";
            toast.style.display = "block";
            clearTimeout(this._toastTimeout);
            this._toastTimeout = setTimeout(() => {
                toast.style.opacity = "0";
                setTimeout(() => toast.style.display = "none", 300);
            }, 2500);
        }

        update(deltaTime) {
            this.pulseTimer += deltaTime * 2;
            this.tickerScroll += deltaTime * 40;
            this.marketTickTimer += deltaTime;

            // Live local simulation price ticks every 2.5 seconds
            if (this.marketTickTimer >= 2.5) {
                this.marketTickTimer = 0;
                this.marketBoards.forEach(board => {
                    const delta = (Math.random() - 0.49) * 0.0006;
                    const decimals = board.pipDecimals || 4;
                    board.currentPrice = +(board.currentPrice + delta).toFixed(decimals);
                    board.pipsChange = +((board.currentPrice - board.basePrice) * Math.pow(10, decimals === 2 ? 2 : 4)).toFixed(1);
                });
            }

            // Update ambient NPCs patrol movement when outside
            if (this.activeScene === "exterior") {
                this.ambientNpcs.forEach(npc => {
                    if (!npc.waypoints || npc.waypoints.length === 0) return;
                    const target = npc.waypoints[npc.currentWaypointIdx];
                    const dx = target.x - npc.x;
                    const dy = target.y - npc.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < 5) {
                        npc.currentWaypointIdx = (npc.currentWaypointIdx + 1) % npc.waypoints.length;
                    } else {
                        const step = (npc.speed || 0.7) * (deltaTime * 60);
                        npc.x += (dx / dist) * step;
                        npc.y += (dy / dist) * step;
                        npc.facing = dx > 0 ? "right" : "left";
                    }
                });
            }

            const activeCore = this.core || (window.StrativoRPG && window.StrativoRPG.gameCore);
            const playerPos = activeCore && activeCore.player ? { x: activeCore.player.x, y: activeCore.player.y } : null;

            if (this.npcManager && this.activeScene === "exterior") {
                if (typeof this.npcManager.updateAll === "function") {
                    this.npcManager.updateAll(deltaTime, playerPos);
                } else if (typeof this.npcManager.update === "function") {
                    this.npcManager.update(deltaTime);
                }
            }
        }

        render(ctx, camera) {
            if (this.activeScene === "interior" && this.currentInterior && this.activeInteriorData) {
                this.renderInterior(ctx, camera);
            } else {
                this.renderCity(ctx, camera);
            }
        }

        renderInterior(ctx, camera) {
            const interior = this.activeInteriorData;
            if (!interior) return;

            const w = interior.width || 1200;
            const h = interior.height || 800;
            const themeCol = interior.themeColor || "#00F0FF";
            const accentCol = interior.accentColor || "#38BDF8";
            const style = interior.floorStyle || "classroom";

            // 1. Ambient Containment Hull Backing
            ctx.fillStyle = "#020617";
            ctx.fillRect(-2000, -2000, w + 4000, h + 4000);

            // 2. Structural Room Drop Shadow & Exterior Glow
            ctx.save();
            ctx.shadowColor = themeCol;
            ctx.shadowBlur = 24;
            ctx.fillStyle = "#060D1E";
            ctx.fillRect(0, 0, w, h);
            ctx.restore();

            // 3. Facility-Specific Tactical Floor Visuals
            ctx.save();
            if (style === "classroom") {
                ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
                ctx.lineWidth = 1;
                for (let x = 0; x < w; x += 60) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, h);
                    ctx.stroke();
                }
                for (let y = 0; y < h; y += 60) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                    ctx.stroke();
                }
                ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
                ctx.lineWidth = 2;
                ctx.strokeRect(400, 200, 400, 120);
            } else if (style === "microscope") {
                ctx.strokeStyle = "rgba(16, 185, 129, 0.1)";
                ctx.lineWidth = 1;
                for (let x = 0; x < w; x += 40) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, h);
                    ctx.stroke();
                }
                for (let y = 0; y < h; y += 40) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                    ctx.stroke();
                }
                ctx.strokeStyle = "rgba(16, 185, 129, 0.25)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(w / 2, h / 2, 140, 0, Math.PI * 2);
                ctx.arc(w / 2, h / 2, 220, 0, Math.PI * 2);
                ctx.stroke();
            } else if (style === "industrial") {
                ctx.strokeStyle = "rgba(245, 158, 11, 0.12)";
                ctx.lineWidth = 2;
                for (let x = 0; x < w; x += 100) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, h);
                    ctx.stroke();
                }
                for (let y = 0; y < h; y += 100) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                    ctx.stroke();
                }
                ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
                ctx.lineWidth = 3;
                ctx.strokeRect(350, 200, 500, 320);
            } else if (style === "vault") {
                ctx.strokeStyle = "rgba(168, 85, 247, 0.12)";
                ctx.lineWidth = 2;
                for (let x = 100; x < w; x += 120) {
                    ctx.beginPath();
                    ctx.moveTo(x, 40);
                    ctx.lineTo(x, h - 40);
                    ctx.stroke();
                }
                ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(w / 2, 380, 180, 0, Math.PI * 2);
                ctx.stroke();
            } else if (style === "defense") {
                ctx.strokeStyle = "rgba(244, 63, 94, 0.15)";
                ctx.lineWidth = 2;
                for (let x = 0; x < w; x += 80) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, h);
                    ctx.stroke();
                }
                for (let y = 0; y < h; y += 80) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                    ctx.stroke();
                }
                ctx.strokeStyle = "rgba(244, 63, 94, 0.4)";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(w / 2, 450, 200, 0, Math.PI * 2);
                ctx.stroke();
            } else if (style === "speed_track") {
                ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
                ctx.lineWidth = 2;
                for (let y = 140; y < h - 100; y += 60) {
                    ctx.beginPath();
                    ctx.moveTo(80, y);
                    ctx.lineTo(w - 80, y);
                    ctx.stroke();
                }
                ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
                ctx.lineWidth = 3;
                ctx.strokeRect(480, 360, 240, 180);
            } else if (style === "command_radar") {
                ctx.strokeStyle = "rgba(252, 211, 77, 0.1)";
                ctx.lineWidth = 1;
                for (let x = 0; x < w; x += 60) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, h);
                    ctx.stroke();
                }
                for (let y = 0; y < h; y += 60) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                    ctx.stroke();
                }
                ctx.strokeStyle = "rgba(252, 211, 77, 0.3)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(w / 2, 440, 120, 0, Math.PI * 2);
                ctx.arc(w / 2, 440, 240, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();

            // 4. Perimeter Walls & Outer Double Hull
            ctx.fillStyle = "#091326";
            ctx.fillRect(0, 0, w, 36); // North Wall
            ctx.fillRect(0, h - 36, (w - 140) / 2, 36); // South Wall Left
            ctx.fillRect((w + 140) / 2, h - 36, (w - 140) / 2, 36); // South Wall Right
            ctx.fillRect(0, 0, 36, h); // West Wall
            ctx.fillRect(w - 36, 0, 36, h); // East Wall

            // Wall Neon Trims
            ctx.strokeStyle = themeCol;
            ctx.lineWidth = 2;
            ctx.strokeRect(36, 36, w - 72, h - 72);

            // 5. North Facility Signboard Banner & Header Monolith
            ctx.save();
            ctx.fillStyle = "rgba(11, 25, 54, 0.9)";
            ctx.beginPath();
            ctx.roundRect(w / 2 - 340, 48, 680, 70, 8);
            ctx.fill();
            ctx.strokeStyle = themeCol;
            ctx.lineWidth = 2;
            ctx.shadowColor = themeCol;
            ctx.shadowBlur = 12;
            ctx.stroke();

            // Facility Title & Subtitle Text
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "900 16px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(interior.name.toUpperCase(), w / 2, 78);

            ctx.fillStyle = accentCol;
            ctx.font = "700 11px 'JetBrains Mono', monospace";
            ctx.fillText(interior.subtitle || "Strativo Financial Precision Sector", w / 2, 98);
            ctx.restore();

            // 6. Exit Doorway Mat & Illumination
            ctx.save();
            ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
            ctx.fillRect(w / 2 - 60, h - 50, 120, 36);
            ctx.strokeStyle = "#10B981";
            ctx.lineWidth = 2;
            ctx.shadowColor = "#10B981";
            ctx.shadowBlur = 10;
            ctx.strokeRect(w / 2 - 60, h - 50, 120, 36);

            ctx.fillStyle = "#10B981";
            ctx.font = "bold 11px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("EXIT TO PIP DISTRICT [E]", w / 2, h - 28);
            ctx.restore();

            // 7. Interior Stations with Customized Consoles
            (interior.stations || []).forEach(st => {
                ctx.save();
                ctx.fillStyle = "#0B1A3A";
                ctx.beginPath();
                ctx.roundRect(st.x - st.w / 2, st.y - st.h / 2, st.w, st.h, 8);
                ctx.fill();

                ctx.strokeStyle = themeCol;
                ctx.lineWidth = 2;
                ctx.shadowColor = themeCol;
                ctx.shadowBlur = 8;
                ctx.stroke();

                // Hologram Screen Indicator
                ctx.fillStyle = themeCol + "20";
                ctx.fillRect(st.x - st.w / 2 + 6, st.y - st.h / 2 + 6, st.w - 12, 16);

                // Station Name
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 11px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(st.name, st.x, st.y - st.h / 2 - 8);

                ctx.fillStyle = themeCol;
                ctx.font = "bold 10px 'JetBrains Mono', monospace";
                ctx.fillText("[E] USE", st.x, st.y + 6);
                ctx.restore();
            });

            // 8. Interior Specialist NPC
            if (interior.npc) {
                const npc = interior.npc;
                ctx.save();

                ctx.beginPath();
                ctx.arc(npc.x, npc.y + 12, 28, 0, Math.PI * 2);
                ctx.fillStyle = themeCol + "15";
                ctx.fill();
                ctx.strokeStyle = themeCol;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.fillStyle = npc.themeColor || themeCol;
                ctx.beginPath();
                ctx.arc(npc.x, npc.y, 18, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 12px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(npc.name, npc.x, npc.y - 26);

                ctx.fillStyle = "#FCD34D";
                ctx.font = "bold 10px 'JetBrains Mono', monospace";
                ctx.fillText(npc.role, npc.x, npc.y + 36);

                ctx.restore();
            }
        }

        renderCity(ctx, camera) {
            const w = this.width;
            const h = this.height;

            // 1. Dark Cyberpunk Ground Base
            ctx.fillStyle = MAP_CONFIG.theme.darkBg || "#020617";
            ctx.fillRect(0, 0, w, h);

            // Subtle City Grid Lines
            ctx.strokeStyle = "rgba(0, 240, 255, 0.04)";
            ctx.lineWidth = 1;
            for (let x = 0; x < w; x += 80) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y < h; y += 80) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            // 2. Quarter Sector Borders & Background Tints
            (MAP_CONFIG.quarters || []).forEach(q => {
                ctx.fillStyle = q.color + "08";
                ctx.fillRect(q.bounds.x, q.bounds.y, q.bounds.w, q.bounds.h);

                ctx.strokeStyle = q.color + "25";
                ctx.lineWidth = 1.5;
                ctx.setLineDash([8, 8]);
                ctx.strokeRect(q.bounds.x, q.bounds.y, q.bounds.w, q.bounds.h);
                ctx.setLineDash([]);

                ctx.fillStyle = q.color + "60";
                ctx.font = "900 14px Inter, sans-serif";
                ctx.fillText(q.name, q.bounds.x + 20, q.bounds.y + 28);
            });

            // 3. Roads Network
            (MAP_CONFIG.roads || []).forEach(road => {
                ctx.fillStyle = MAP_CONFIG.theme.roadBg || "#0A1128";
                ctx.fillRect(road.x, road.y, road.w, road.h);

                ctx.strokeStyle = "rgba(0, 240, 255, 0.3)";
                ctx.lineWidth = 2;
                ctx.strokeRect(road.x, road.y, road.w, road.h);

                ctx.strokeStyle = "rgba(252, 211, 77, 0.4)";
                ctx.lineWidth = 2;
                ctx.setLineDash([16, 16]);

                if (road.w > road.h) {
                    ctx.beginPath();
                    ctx.moveTo(road.x, road.y + road.h / 2);
                    ctx.lineTo(road.x + road.w, road.y + road.h / 2);
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.moveTo(road.x + road.w / 2, road.y);
                    ctx.lineTo(road.x + road.w / 2, road.y + road.h);
                    ctx.stroke();
                }
                ctx.setLineDash([]);
            });

            // 4. Sidewalks & Crosswalks
            (MAP_CONFIG.sidewalks || []).forEach(sw => {
                ctx.fillStyle = MAP_CONFIG.theme.sidewalkBg || "#0F1E3D";
                ctx.fillRect(sw.x, sw.y, sw.w, sw.h);
            });

            (MAP_CONFIG.crosswalks || []).forEach(cw => {
                ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
                for (let i = 0; i < cw.bars; i++) {
                    if (cw.w > cw.h) {
                        ctx.fillRect(cw.x + i * 18, cw.y, 10, cw.h);
                    } else {
                        ctx.fillRect(cw.x, cw.y + i * 18, cw.w, 10);
                    }
                }
            });

            // 5. Wayfinding Directional Signage Boards
            const signposts = [
                { x: 1600, y: 460, text: "← PIP ACADEMY | LEVERAGE TOWER ↑ | PRECISION LAB →" },
                { x: 1600, y: 1100, text: "← EDUCATION / RISK | PIP PLAZA SPIRE | RESIDENTIAL / MARKET →" },
                { x: 1600, y: 1840, text: "← RISK FORGE / ARENA | SOUTH GATE ↓ | PIP BLITZ / HQ →" },
                { x: 2320, y: 1100, text: "↑ PRECISION LAB | RESIDENTIAL AREA → | MARKET STREET ↓" },
                { x: 800, y: 1100, text: "↑ PIP ACADEMY | PIP PLAZA → | RISK FORGE ↓" }
            ];

            signposts.forEach(sp => {
                ctx.save();
                ctx.fillStyle = "rgba(11, 25, 54, 0.9)";
                ctx.beginPath();
                ctx.roundRect(sp.x - 170, sp.y - 14, 340, 28, 6);
                ctx.fill();
                ctx.strokeStyle = "rgba(0, 240, 255, 0.6)";
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.fillStyle = "#00F0FF";
                ctx.font = "bold 10px 'JetBrains Mono', monospace";
                ctx.textAlign = "center";
                ctx.fillText(sp.text, sp.x, sp.y + 4);
                ctx.restore();
            });

            // 6. Buildings & Residential Blocks
            (MAP_CONFIG.buildings || []).forEach(bldg => {
                ctx.fillStyle = MAP_CONFIG.theme.buildingRoof || "#071229";
                ctx.fillRect(bldg.x, bldg.y, bldg.w, bldg.h);

                ctx.strokeStyle = bldg.themeColor || "#00F0FF";
                ctx.lineWidth = 3;
                ctx.strokeRect(bldg.x, bldg.y, bldg.w, bldg.h);

                ctx.fillStyle = bldg.themeColor || "#00F0FF";
                ctx.font = "900 13px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(bldg.name, bldg.x + bldg.w / 2, bldg.y + 24);

                ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
                ctx.font = "10px 'JetBrains Mono', monospace";
                ctx.fillText(bldg.subtitle || "", bldg.x + bldg.w / 2, bldg.y + 42);

                if (bldg.entrance) {
                    ctx.fillStyle = "rgba(0, 240, 255, 0.25)";
                    ctx.fillRect(bldg.entrance.x - 36, bldg.entrance.y - 14, 72, 28);
                    ctx.strokeStyle = bldg.themeColor || "#00F0FF";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(bldg.entrance.x - 36, bldg.entrance.y - 14, 72, 28);

                    ctx.fillStyle = "#FFFFFF";
                    ctx.font = "bold 10px Inter, sans-serif";
                    ctx.fillText("[E] ENTER", bldg.entrance.x, bldg.entrance.y + 4);
                }
            });

            // 7. Custom Visual Landmarks
            (MAP_CONFIG.landmarks || []).forEach(lm => {
                ctx.save();
                const radius = lm.radius || 35;
                const themeCol = lm.themeColor || "#00F0FF";

                // Ground illumination circle
                ctx.beginPath();
                ctx.arc(lm.x, lm.y, radius + 15, 0, Math.PI * 2);
                ctx.fillStyle = themeCol + "15";
                ctx.fill();
                ctx.strokeStyle = themeCol + "40";
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Core Landmark Body
                ctx.beginPath();
                ctx.arc(lm.x, lm.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = themeCol + "30";
                ctx.fill();
                ctx.strokeStyle = themeCol;
                ctx.lineWidth = 3;
                ctx.shadowColor = themeCol;
                ctx.shadowBlur = 15;
                ctx.stroke();

                // Center Icon / Pillar
                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.arc(lm.x, lm.y, 8, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "900 11px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(lm.name, lm.x, lm.y - radius - 10);
                ctx.restore();
            });

            // 8. Simulated Live Market Boards
            this.marketBoards.forEach(board => {
                ctx.save();
                ctx.fillStyle = "#071124";
                ctx.beginPath();
                ctx.roundRect(board.x, board.y, board.w, board.h, 6);
                ctx.fill();

                const isUp = board.pipsChange >= 0;
                const borderCol = isUp ? "#10B981" : "#F43F5E";
                ctx.strokeStyle = borderCol;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Header with SIMULATION badge
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 11px 'JetBrains Mono', monospace";
                ctx.textAlign = "left";
                ctx.fillText(board.pair, board.x + 8, board.y + 16);

                ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
                ctx.font = "bold 8px 'JetBrains Mono', monospace";
                ctx.textAlign = "right";
                ctx.fillText("SIM", board.x + board.w - 8, board.y + 14);

                // Price display
                const priceStr = board.currentPrice.toFixed(board.pipDecimals || 4);
                ctx.fillStyle = "#00F0FF";
                ctx.font = "900 13px 'JetBrains Mono', monospace";
                ctx.textAlign = "left";
                ctx.fillText(priceStr, board.x + 8, board.y + 35);

                // Pips change
                const sign = isUp ? "+" : "";
                ctx.fillStyle = borderCol;
                ctx.font = "bold 10px 'JetBrains Mono', monospace";
                ctx.fillText(sign + board.pipsChange + " pips", board.x + 8, board.y + 50);
                ctx.restore();
            });

            // 9. Exploration Discovery Beacons
            this.explorationPoints.forEach(exp => {
                ctx.save();
                const pulse = Math.sin(this.pulseTimer * 3) * 3;
                ctx.fillStyle = "#FCD34D";
                ctx.beginPath();
                ctx.arc(exp.x, exp.y, 14 + pulse, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 2;
                ctx.shadowColor = "#FCD34D";
                ctx.shadowBlur = 10;
                ctx.stroke();

                ctx.fillStyle = "#FCD34D";
                ctx.font = "bold 10px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(exp.name, exp.x, exp.y - 20);
                ctx.restore();
            });

            // 10. Challenge Stations
            this.challengeStations.forEach(st => {
                ctx.save();
                ctx.fillStyle = "#1E293B";
                ctx.beginPath();
                ctx.roundRect(st.x - 20, st.y - 20, 40, 40, 6);
                ctx.fill();
                ctx.strokeStyle = "#00F0FF";
                ctx.lineWidth = 2;
                ctx.shadowColor = "#00F0FF";
                ctx.shadowBlur = 8;
                ctx.stroke();

                ctx.fillStyle = "#00F0FF";
                ctx.font = "bold 9px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("DRILL", st.x, st.y + 4);
                ctx.restore();
            });

            // 11. Ambient Patrolling NPCs (Non-solid, friendly citizens)
            this.ambientNpcs.forEach(npc => {
                ctx.save();
                ctx.fillStyle = npc.themeColor || "#00F0FF";
                ctx.beginPath();
                ctx.arc(npc.x, npc.y, 12, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 9px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(npc.name, npc.x, npc.y - 16);
                ctx.restore();
            });

            // 12. Primary NPCs
            if (this.npcManager) {
                if (typeof this.npcManager.renderAll === "function") {
                    this.npcManager.renderAll(ctx, camera);
                } else if (typeof this.npcManager.render === "function") {
                    this.npcManager.render(ctx, camera);
                }
            }
        }

        validateWorld() {
            const results = { valid: true, errors: [], stats: {} };
            const bounds = MAP_CONFIG.bounds || { width: 3200, height: 2400 };

            results.stats.bounds = bounds;
            results.stats.quarters = (MAP_CONFIG.quarters || []).length;
            results.stats.buildings = (MAP_CONFIG.buildings || []).length;
            results.stats.landmarks = (MAP_CONFIG.landmarks || []).length;
            results.stats.explorationPoints = (MAP_CONFIG.explorationPoints || []).length;
            results.stats.ambientNpcs = (MAP_CONFIG.ambientNpcs || []).length;
            results.stats.challengeStations = (MAP_CONFIG.challengeStations || []).length;
            results.stats.marketBoards = (MAP_CONFIG.marketBoards || []).length;

            if (bounds.width < 3200 || bounds.height < 2400) {
                results.valid = false;
                results.errors.push("World bounds (" + bounds.width + "x" + bounds.height + ") smaller than 3200x2400");
            }

            const ids = new Set();
            (MAP_CONFIG.buildings || []).forEach(b => {
                if (ids.has(b.id)) { results.valid = false; results.errors.push("Duplicate building ID: " + b.id); }
                ids.add(b.id);
            });
            (MAP_CONFIG.landmarks || []).forEach(l => {
                if (ids.has(l.id)) { results.valid = false; results.errors.push("Duplicate landmark ID: " + l.id); }
                ids.add(l.id);
            });
            (MAP_CONFIG.explorationPoints || []).forEach(e => {
                if (ids.has(e.id)) { results.valid = false; results.errors.push("Duplicate exploration ID: " + e.id); }
                ids.add(e.id);
            });

            return results;
        }
    }

    window.StrativoRPG.validatePipDistrictWorld = function() {
        if (window.StrativoRPG.gameCore && window.StrativoRPG.gameCore.world && typeof window.StrativoRPG.gameCore.world.validateWorld === "function") {
            return window.StrativoRPG.gameCore.world.validateWorld();
        }
        const tempWorld = new PipDistrictWorld();
        return tempWorld.validateWorld();
    };

    // ======================================================================
    // PRECISION SCORE ENGINE
    // ======================================================================
    const PrecisionScoreEngine = {
        calculate() {
            const state = window.StrativoWorldState ? window.StrativoWorldState.getState() : null;
            if (!state) return 0;

            const mastery = (state.mastery && state.mastery.pipPosition) || 0;
            const blitz = state.blitzStats || {};
            const accuracy = blitz.totalAttempts > 0 ? (blitz.totalCorrect / blitz.totalAttempts) * 100 : 0;
            const bestScore = blitz.bestScore ? Math.min(100, blitz.bestScore / 10) : 0;
            const missionsCompleted = state.missions ? Object.values(state.missions).filter(m => m && m.status === "completed").length * 10 : 0;

            const score = Math.round(0.40 * accuracy + 0.30 * mastery + 0.15 * bestScore + 0.15 * Math.min(100, missionsCompleted));
            return Math.min(100, Math.max(0, score));
        }
    };

    // ======================================================================
    // PIP BLITZ REPLAYABLE SCENARIO ENGINE (56 SCENARIOS)
    // ======================================================================
    const PipBlitzEngine = {
        scenarioPool: BLITZ_CONFIG.scenarios || [],
        usedScenarioIds: new Set(),
        activeScenario: null,
        score: 0,
        combo: 0,
        bestCombo: 0,
        active: false,

        resetMatch() {
            this.usedScenarioIds.clear();
            this.activeScenario = null;
            this.score = 0;
            this.combo = 0;
            this.bestCombo = 0;
            this.active = true;
        },

        generateScenario(roundNumber) {
            const available = this.scenarioPool.filter(s => !this.usedScenarioIds.has(s.id));
            const pool = available.length > 0 ? available : this.scenarioPool;

            const selected = pool[Math.floor(Math.random() * pool.length)];
            this.usedScenarioIds.add(selected.id);
            this.activeScenario = selected;

            const formattedOptions = selected.options.map((opt, idx) => {
                const optText = typeof opt === "string" ? opt : (opt.text || "");
                const isCorrect = optText === selected.correctAnswer;
                return {
                    id: "opt_" + idx,
                    text: optText,
                    isCorrect: isCorrect,
                    toString: () => optText
                };
            });

            return {
                round: roundNumber,
                category: selected.category,
                instrument: selected.instrument || "EUR/USD",
                questionText: selected.questionText,
                options: shuffleArray(formattedOptions),
                correctAnswer: selected.correctAnswer,
                explanation: selected.explanation
            };
        },

        submitAnswer(selectedOption) {
            if (!this.activeScenario) return { isCorrect: false };
            const selectedText = typeof selectedOption === "string" ? selectedOption : (selectedOption.text || "");
            const isCorrect = this.activeScenario.correctAnswer === selectedText;

            if (isCorrect) {
                this.combo++;
                if (this.combo > this.bestCombo) this.bestCombo = this.combo;
                const points = 100 * (1 + (this.combo - 1) * 0.2);
                this.score += Math.round(points);
                window.StrativoRPG.emitGameEvent("correctHit");
            } else {
                this.combo = 0;
                window.StrativoRPG.emitGameEvent("wrongHit");
            }

            return {
                isCorrect,
                score: this.score,
                combo: this.combo,
                correctAnswer: this.activeScenario.correctAnswer,
                explanation: this.activeScenario.explanation
            };
        }
    };

    window.StrativoRPG.PipDistrictWorld = PipDistrictWorld;
    window.StrativoRPG.QuestionEngine = QuestionEngine;
    window.StrativoRPG.PrecisionScoreEngine = PrecisionScoreEngine;
    window.StrativoRPG.PipBlitzEngine = PipBlitzEngine;

    if (typeof module !== "undefined" && module.exports) {
        module.exports = {
            PipDistrictWorld,
            QuestionEngine,
            PrecisionScoreEngine,
            PipBlitzEngine
        };
    }
})();
